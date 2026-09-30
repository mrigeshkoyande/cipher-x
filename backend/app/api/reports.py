from fastapi import APIRouter, HTTPException, Depends, Response
from app.schemas.all_schemas import ReportCreateRequest
from app.core.security import get_current_user, UserContext
from app.database import db_store
from app.services.report_generator import report_generator
from app.services.drift_intelligence import drift_intelligence
from app.services.notification_service import notification_service
from app.compliance_engine.evaluator import compliance_evaluator

router = APIRouter(prefix="/reports", tags=["Reports"])


@router.get("")
async def list_reports(user: UserContext = Depends(get_current_user)):
    return report_generator.list_reports()


@router.get("/{report_id}")
async def get_report_detail(report_id: str, user: UserContext = Depends(get_current_user)):
    rep = report_generator.get_report(report_id)
    if not rep:
        raise HTTPException(status_code=404, detail=f"Report '{report_id}' not found.")
    return rep


@router.get("/{report_id}/export/csv")
async def export_report_csv(report_id: str, user: UserContext = Depends(get_current_user)):
    csv_data = report_generator.export_csv(report_id)
    if not csv_data:
        raise HTTPException(status_code=404, detail=f"Report '{report_id}' not found.")
    return Response(
        content=csv_data,
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=cipherx_report_{report_id}.csv"}
    )


@router.post("/generate", status_code=201)
async def generate_compliance_report(req: ReportCreateRequest, user: UserContext = Depends(get_current_user)):
    eval_data = {}
    drift_data = None
    target = req.target_name or "Enterprise Fleet"

    if req.device_id:
        dev = db_store.devices.get(req.device_id)
        if not dev:
            raise HTTPException(status_code=404, detail=f"Device '{req.device_id}' not found.")
        eval_data = db_store.evaluations.get(req.device_id, {})
        target = dev["name"]

        # Check drift
        configs = [c for c in db_store.configurations.values() if c["device_id"] == req.device_id]
        if len(configs) >= 2:
            sorted_c = sorted(configs, key=lambda x: x["created_at"])
            drift_data = drift_intelligence.analyze_drift(sorted_c[0]["raw_config"], sorted_c[-1]["raw_config"], dev["vendor"])
    else:
        # Organization aggregate evaluation
        all_evals = list(db_store.evaluations.values())
        if all_evals:
            all_findings = []
            all_passed = []
            for e in all_evals:
                all_findings.extend(e.get("findings", []))
                all_passed.extend(e.get("passed_controls", []))
            
            avg_score = round(sum(e.get("compliance_score", 0.0) for e in all_evals) / len(all_evals), 1)
            eval_data = {
                "compliance_score": avg_score,
                "grade": "B" if avg_score >= 80 else ("C" if avg_score >= 70 else "F"),
                "device_risk_score": round(sum(e.get("device_risk_score", 0.0) for e in all_evals) / len(all_evals), 1),
                "device_risk_level": "MEDIUM",
                "findings": all_findings,
                "passed_controls": all_passed,
                "score_explanation": f"Aggregated organization assessment across {len(all_evals)} inspected network assets.",
                "counts": {
                    "PASS": len(all_passed),
                    "FAIL": len([f for f in all_findings if f["status"] == "FAIL"]),
                    "WARNING": len([f for f in all_findings if f["status"] == "WARNING"]),
                    "UNKNOWN": len([f for f in all_findings if f["status"] == "UNKNOWN"])
                }
            }
        else:
            eval_data = {
                "compliance_score": 0.0,
                "grade": "N/A",
                "device_risk_score": 0.0,
                "findings": [],
                "passed_controls": []
            }

    report = report_generator.generate_report(
        report_type=req.report_type,
        title=req.title,
        target_name=target,
        evaluation_data=eval_data,
        drift_data=drift_data,
        author=user.email
    )

    notification_service.emit_notification(
        event_type="report_generated",
        title=f"New Security Report Generated: {req.title}",
        message=f"Report ID {report['report_id']} generated for {target}. Cryptographic SHA-256 hash verified and anchored.",
        severity="INFO",
        resource_id=report["report_id"],
        resource_type="report"
    )

    return report
