from fastapi import APIRouter, Depends
from app.schemas.all_schemas import AssistantQueryRequest
from app.core.security import get_current_user, UserContext
from app.database import db_store
from app.services.security_assistant import security_assistant

router = APIRouter(prefix="/assistant", tags=["Security Assistant"])


@router.post("/query")
async def ask_security_assistant(req: AssistantQueryRequest, user: UserContext = Depends(get_current_user)):
    # Prepare enriched device fleet context
    fleet_context = []
    for d in db_store.devices.values():
        dev_id = d["id"]
        dev_eval = db_store.evaluations.get(dev_id, {})
        configs = [c for c in db_store.configurations.values() if c["device_id"] == dev_id]
        latest_cfg = sorted(configs, key=lambda x: x["created_at"], reverse=True)[0] if configs else None
        fleet_context.append({
            "id": dev_id,
            "name": d["name"],
            "vendor": d["vendor"],
            "raw_config": latest_cfg["raw_config"] if latest_cfg else "",
            "evaluation": dev_eval
        })

    response = security_assistant.process_query(req.query, fleet_context)
    return response
