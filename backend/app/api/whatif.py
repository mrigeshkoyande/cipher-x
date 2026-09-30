from fastapi import APIRouter, HTTPException, Depends
from app.schemas.all_schemas import WhatIfRequest
from app.core.security import get_current_user, UserContext
from app.services.whatif_simulator import whatif_simulator
from app.database import db_store

router = APIRouter(prefix="/whatif", tags=["What-If Intelligence"])


@router.get("/scenarios")
async def list_predefined_scenarios(user: UserContext = Depends(get_current_user)):
    return whatif_simulator.get_predefined_scenarios()


@router.post("/simulate")
async def run_simulation(req: WhatIfRequest, user: UserContext = Depends(get_current_user)):
    base_config = req.base_config
    vendor = req.vendor

    if req.device_id and not base_config:
        dev = db_store.devices.get(req.device_id)
        if not dev:
            raise HTTPException(status_code=404, detail=f"Device '{req.device_id}' not found.")
        configs = [c for c in db_store.configurations.values() if c["device_id"] == req.device_id]
        if not configs:
            raise HTTPException(status_code=400, detail="Device has no configurations to simulate on.")
        latest_cfg = sorted(configs, key=lambda x: x["created_at"], reverse=True)[0]
        base_config = latest_cfg["raw_config"]
        vendor = dev.get("vendor", "cisco")

    if not base_config:
        raise HTTPException(status_code=400, detail="Must provide either base_config or device_id.")

    result = whatif_simulator.simulate(
        base_config=base_config,
        vendor=vendor,
        scenario_id=req.scenario_id,
        custom_patch=req.custom_patch
    )
    return result
