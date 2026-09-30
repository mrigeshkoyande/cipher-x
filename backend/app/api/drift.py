from fastapi import APIRouter, HTTPException, Depends
from app.core.security import get_current_user, UserContext
from app.database import db_store
from app.services.drift_intelligence import drift_intelligence

router = APIRouter(prefix="/drift", tags=["Drift Intelligence"])


@router.get("/device/{device_id}")
async def get_device_drift_history(device_id: str, user: UserContext = Depends(get_current_user)):
    dev = db_store.devices.get(device_id)
    if not dev:
        raise HTTPException(status_code=404, detail=f"Device '{device_id}' not found.")

    configs = [c for c in db_store.configurations.values() if c["device_id"] == device_id]
    sorted_configs = sorted(configs, key=lambda x: x["created_at"])

    if len(sorted_configs) < 2:
        return {
            "device_id": device_id,
            "device_name": dev["name"],
            "has_drift": False,
            "message": "Device has fewer than 2 configuration versions. Upload a second version to analyze drift.",
            "versions": [{"id": c["id"], "version_label": c["version_label"], "created_at": c["created_at"]} for c in sorted_configs]
        }

    # Compare oldest/baseline to newest
    baseline = sorted_configs[0]
    current = sorted_configs[-1]
    drift_result = drift_intelligence.analyze_drift(baseline["raw_config"], current["raw_config"], dev["vendor"])

    return {
        "device_id": device_id,
        "device_name": dev["name"],
        "baseline_version": baseline["version_label"],
        "current_version": current["version_label"],
        **drift_result
    }


@router.post("/compare")
async def compare_raw_configs(payload: dict, user: UserContext = Depends(get_current_user)):
    old_config = payload.get("old_config", "")
    new_config = payload.get("new_config", "")
    vendor = payload.get("vendor", "cisco")
    return drift_intelligence.analyze_drift(old_config, new_config, vendor)
