import uuid
import time
from typing import List, Optional
from fastapi import APIRouter, HTTPException, Depends
from app.schemas.all_schemas import DeviceCreate
from app.core.security import get_current_user, UserContext
from app.database import db_store
from app.compliance_engine.evaluator import compliance_evaluator
from app.services.audit_integrity import audit_integrity_service

router = APIRouter(prefix="/devices", tags=["Devices"])


@router.get("")
async def list_devices(user: UserContext = Depends(get_current_user)):
    # Enrich with latest evaluation and risk metrics
    results = []
    for d in db_store.devices.values():
        dev_id = d["id"]
        latest_eval = db_store.evaluations.get(dev_id, {})
        configs = [c for c in db_store.configurations.values() if c["device_id"] == dev_id]
        results.append({
            **d,
            "compliance_score": latest_eval.get("compliance_score", 0.0),
            "grade": latest_eval.get("grade", "N/A"),
            "device_risk_score": latest_eval.get("device_risk_score", 0.0),
            "device_risk_level": latest_eval.get("device_risk_level", "LOW"),
            "critical_findings": latest_eval.get("severity_counts", {}).get("CRITICAL", 0),
            "high_findings": latest_eval.get("severity_counts", {}).get("HIGH", 0),
            "unknown_findings": latest_eval.get("counts", {}).get("UNKNOWN", 0),
            "failed_controls_count": latest_eval.get("counts", {}).get("FAIL", 0),
            "passed_controls_count": latest_eval.get("counts", {}).get("PASS", 0),
            "configuration_count": len(configs),
            "last_evaluated_at": latest_eval.get("evaluated_at", d.get("updated_at"))
        })
    return results


@router.get("/{device_id}")
async def get_device(device_id: str, user: UserContext = Depends(get_current_user)):
    device = db_store.devices.get(device_id)
    if not device:
        raise HTTPException(status_code=404, detail=f"Device '{device_id}' not found.")
    latest_eval = db_store.evaluations.get(device_id, {})
    configs = [c for c in db_store.configurations.values() if c["device_id"] == device_id]
    return {
        **device,
        "latest_evaluation": latest_eval,
        "configurations": sorted(configs, key=lambda x: x["created_at"], reverse=True)
    }


@router.post("", status_code=201)
async def create_device(req: DeviceCreate, user: UserContext = Depends(get_current_user)):
    dev_id = f"dev-{uuid.uuid4().hex[:8]}"
    now = time.time()
    device = {
        "id": dev_id,
        "name": req.name,
        "vendor": req.vendor.lower(),
        "model": req.model,
        "ip_address": req.ip_address,
        "location": req.location,
        "environment": req.environment,
        "tags": req.tags or [],
        "tenant_id": user.tenant_id,
        "created_at": now,
        "updated_at": now
    }
    db_store.devices[dev_id] = device

    audit_integrity_service.record_event(
        event_type="DEVICE_CREATED",
        actor=user.email,
        resource_id=dev_id,
        payload={"name": req.name, "vendor": req.vendor, "ip": req.ip_address}
    )

    return device
