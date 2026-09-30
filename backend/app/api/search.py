import uuid
import time
from fastapi import APIRouter, Depends
from app.schemas.all_schemas import SavedSearchCreate
from app.core.security import get_current_user, UserContext
from app.database import db_store
from app.compliance_engine.loader import compliance_loader

router = APIRouter(prefix="/search", tags=["Advanced Search"])


@router.get("")
async def search_all(q: str = "", user: UserContext = Depends(get_current_user)):
    query = q.lower().strip()
    if not query:
        return {"devices": [], "findings": [], "controls": []}

    # Match devices
    matched_devices = []
    for d in db_store.devices.values():
        if query in d["name"].lower() or query in d["vendor"].lower() or query in d["ip_address"]:
            matched_devices.append(d)

    # Match controls
    matched_controls = []
    for c in compliance_loader.controls.values():
        if query in c["id"].lower() or query in c["title"].lower() or query in c["category"].lower():
            matched_controls.append(c)

    # Match findings across evaluations
    matched_findings = []
    for dev_id, ev in db_store.evaluations.items():
        dev = db_store.devices.get(dev_id, {})
        for f in ev.get("findings", []):
            if query in f["control_id"].lower() or query in f["title"].lower() or query in f["explanation"].lower():
                matched_findings.append({
                    **f,
                    "device_id": dev_id,
                    "device_name": dev.get("name", "Unknown")
                })

    return {
        "query": q,
        "results_count": len(matched_devices) + len(matched_controls) + len(matched_findings),
        "devices": matched_devices,
        "controls": matched_controls,
        "findings": matched_findings
    }


@router.get("/saved")
async def list_saved_searches(user: UserContext = Depends(get_current_user)):
    return list(db_store.saved_searches.values())


@router.post("/saved", status_code=201)
async def save_search(req: SavedSearchCreate, user: UserContext = Depends(get_current_user)):
    search_id = f"search-{uuid.uuid4().hex[:8]}"
    item = {
        "id": search_id,
        "name": req.name,
        "query": req.query,
        "filters": req.filters or {},
        "created_at": time.time(),
        "created_by": user.email
    }
    db_store.saved_searches[search_id] = item
    return item
