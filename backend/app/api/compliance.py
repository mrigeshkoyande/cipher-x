from typing import List, Optional
from fastapi import APIRouter, HTTPException, Depends
from app.schemas.all_schemas import EvaluationRequest
from app.core.security import get_current_user, UserContext
from app.compliance_engine.evaluator import compliance_evaluator
from app.compliance_engine.loader import compliance_loader
from app.database import db_store

router = APIRouter(prefix="/compliance", tags=["Compliance"])


@router.get("/frameworks")
async def list_frameworks(user: UserContext = Depends(get_current_user)):
    return list(compliance_loader.frameworks.values())


@router.get("/frameworks/{framework_id}")
async def get_framework_detail(framework_id: str, user: UserContext = Depends(get_current_user)):
    fw = compliance_loader.get_framework(framework_id)
    if not fw:
        raise HTTPException(status_code=404, detail=f"Framework '{framework_id}' not found.")
    
    # Enrich with control details
    enriched_mappings = {}
    for fw_ref, ctrl_id in fw.get("control_mappings", {}).items():
        ctrl_info = compliance_loader.get_control(ctrl_id)
        enriched_mappings[fw_ref] = {
            "control_id": ctrl_id,
            "title": ctrl_info.get("title", ctrl_id) if ctrl_info else ctrl_id,
            "severity": ctrl_info.get("severity", "MEDIUM") if ctrl_info else "MEDIUM",
            "category": ctrl_info.get("category", "General") if ctrl_info else "General"
        }
    return {**fw, "enriched_mappings": enriched_mappings}


@router.get("/controls")
async def list_controls(user: UserContext = Depends(get_current_user)):
    return list(compliance_loader.controls.values())


@router.get("/controls/{control_id}")
async def get_control_detail(control_id: str, user: UserContext = Depends(get_current_user)):
    ctrl = compliance_loader.get_control(control_id)
    if not ctrl:
        raise HTTPException(status_code=404, detail=f"Control '{control_id}' not found.")
    return ctrl


@router.post("/evaluate")
async def evaluate_custom_config(req: EvaluationRequest, user: UserContext = Depends(get_current_user)):
    config_text = req.config_text
    vendor = req.vendor

    if req.device_id and not config_text:
        dev = db_store.devices.get(req.device_id)
        if not dev:
            raise HTTPException(status_code=404, detail=f"Device '{req.device_id}' not found.")
        configs = [c for c in db_store.configurations.values() if c["device_id"] == req.device_id]
        if not configs:
            raise HTTPException(status_code=400, detail="Device has no uploaded configurations to evaluate.")
        latest_cfg = sorted(configs, key=lambda x: x["created_at"], reverse=True)[0]
        config_text = latest_cfg["raw_config"]
        vendor = dev.get("vendor")

    if not config_text:
        raise HTTPException(status_code=400, detail="Must provide either config_text or device_id.")

    result = compliance_evaluator.evaluate_configuration(
        config_text=config_text,
        vendor=vendor,
        framework_ids=req.framework_ids
    )
    return result
