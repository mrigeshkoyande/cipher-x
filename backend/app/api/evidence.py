from fastapi import APIRouter, HTTPException, Depends
from app.core.security import get_current_user, UserContext
from app.database import db_store
from app.compliance_engine.loader import compliance_loader

router = APIRouter(prefix="/evidence", tags=["Evidence Explorer"])


@router.get("/device/{device_id}/control/{control_id}")
async def get_evidence_provenance(device_id: str, control_id: str, user: UserContext = Depends(get_current_user)):
    dev = db_store.devices.get(device_id)
    if not dev:
        raise HTTPException(status_code=404, detail=f"Device '{device_id}' not found.")

    dev_eval = db_store.evaluations.get(device_id)
    if not dev_eval:
        raise HTTPException(status_code=404, detail="No evaluation found for this device.")

    ctrl_res = next((r for r in dev_eval.get("all_results", []) if r["control_id"] == control_id), None)
    if not ctrl_res:
        raise HTTPException(status_code=404, detail=f"Control '{control_id}' was not evaluated on this device.")

    configs = [c for c in db_store.configurations.values() if c["device_id"] == device_id]
    latest_cfg = sorted(configs, key=lambda x: x["created_at"], reverse=True)[0] if configs else None
    raw_lines = latest_cfg["raw_config"].splitlines() if latest_cfg else []

    # Format line context with +/- 3 lines around the matched line
    evidence_contexts = []
    for ev in ctrl_res.get("evidence", []):
        line_no = ev.get("line_number")
        context_snippet = []
        if line_no is not None and 1 <= line_no <= len(raw_lines):
            start_idx = max(0, line_no - 4)
            end_idx = min(len(raw_lines), line_no + 3)
            for idx in range(start_idx, end_idx):
                context_snippet.append({
                    "line_number": idx + 1,
                    "content": raw_lines[idx],
                    "is_evidence": (idx + 1 == line_no)
                })

        evidence_contexts.append({
            "line_number": line_no,
            "raw_text": ev.get("raw_text"),
            "fact_key": ev.get("fact_key"),
            "extracted_value": ev.get("extracted_value"),
            "confidence": ev.get("confidence", 1.0),
            "context_window": context_snippet
        })

    return {
        "device_id": device_id,
        "device_name": dev["name"],
        "vendor": dev["vendor"],
        "control_id": control_id,
        "control_title": ctrl_res["title"],
        "severity": ctrl_res["severity"],
        "category": ctrl_res["category"],
        "status": ctrl_res["status"],
        "explanation": ctrl_res["explanation"],
        "normalized_fact": ctrl_res["normalized_fact"],
        "remediation": ctrl_res.get("remediation"),
        "evidence_provenance": evidence_contexts,
        "raw_config_lines_count": len(raw_lines)
    }
