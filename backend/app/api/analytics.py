from collections import Counter
from fastapi import APIRouter, Depends
from app.core.security import get_current_user, UserContext
from app.database import db_store
from app.compliance_engine.loader import compliance_loader

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get("/organization-risk")
async def get_organization_risk(user: UserContext = Depends(get_current_user)):
    devices = list(db_store.devices.values())
    total_devices = len(devices)

    all_findings = []
    failed_controls_counter = Counter()
    affected_vendors_counter = Counter()
    device_risk_list = []
    framework_totals = {}

    severity_counts = {"CRITICAL": 0, "HIGH": 0, "MEDIUM": 0, "LOW": 0, "UNKNOWN": 0}
    total_score_sum = 0.0
    evaluated_devices_count = 0

    for dev in devices:
        dev_id = dev["id"]
        dev_eval = db_store.evaluations.get(dev_id)
        if not dev_eval:
            continue

        evaluated_devices_count += 1
        score = dev_eval.get("compliance_score", 0.0)
        risk = dev_eval.get("device_risk_score", 0.0)
        total_score_sum += score

        dev_findings = dev_eval.get("findings", [])
        all_findings.extend(dev_findings)

        if dev_findings:
            affected_vendors_counter[dev["vendor"]] += len(dev_findings)

        for f in dev_findings:
            sev = f.get("severity", "MEDIUM")
            if f.get("status") == "UNKNOWN":
                severity_counts["UNKNOWN"] += 1
            else:
                severity_counts[sev] = severity_counts.get(sev, 0) + 1
            failed_controls_counter[f["control_id"]] += 1

        device_risk_list.append({
            "device_id": dev_id,
            "device_name": dev["name"],
            "vendor": dev["vendor"],
            "compliance_score": score,
            "grade": dev_eval.get("grade", "N/A"),
            "risk_score": risk,
            "risk_level": dev_eval.get("device_risk_level", "LOW"),
            "critical_count": dev_eval.get("severity_counts", {}).get("CRITICAL", 0),
            "high_count": dev_eval.get("severity_counts", {}).get("HIGH", 0),
            "total_findings": len(dev_findings)
        })

        # Framework scores accumulation
        fw_scores = dev_eval.get("framework_scores", {})
        for fw_id, fw_data in fw_scores.items():
            if fw_id not in framework_totals:
                framework_totals[fw_id] = {"name": fw_data["name"], "score_sum": 0.0, "count": 0}
            framework_totals[fw_id]["score_sum"] += fw_data["score"]
            framework_totals[fw_id]["count"] += 1

    # Top Failed Controls
    top_failed_controls = []
    for ctrl_id, count in failed_controls_counter.most_common(8):
        ctrl = compliance_loader.get_control(ctrl_id)
        top_failed_controls.append({
            "control_id": ctrl_id,
            "title": ctrl.get("title", ctrl_id) if ctrl else ctrl_id,
            "severity": ctrl.get("severity", "MEDIUM") if ctrl else "MEDIUM",
            "failed_count": count
        })

    # Framework Coverage Matrix
    framework_coverage = []
    for fw_id, fw_agg in framework_totals.items():
        avg_score = round(fw_agg["score_sum"] / fw_agg["count"], 1) if fw_agg["count"] > 0 else 0.0
        framework_coverage.append({
            "framework_id": fw_id,
            "name": fw_agg["name"],
            "average_score": avg_score
        })

    # Top Affected Devices (Hot spots)
    top_affected_devices = sorted(device_risk_list, key=lambda x: x["risk_score"], reverse=True)[:5]

    # Average Org Compliance Score
    avg_org_compliance = round(total_score_sum / evaluated_devices_count, 1) if evaluated_devices_count > 0 else 0.0

    return {
        "total_devices": total_devices,
        "evaluated_devices": evaluated_devices_count,
        "average_compliance_score": avg_org_compliance,
        "total_findings": len(all_findings),
        "severity_distribution": severity_counts,
        "top_failed_controls": top_failed_controls,
        "top_affected_devices": top_affected_devices,
        "affected_vendors": dict(affected_vendors_counter),
        "framework_coverage_matrix": framework_coverage,
        "device_risk_fleet": sorted(device_risk_list, key=lambda x: x["risk_score"], reverse=True)
    }
