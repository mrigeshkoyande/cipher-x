from fastapi import APIRouter, HTTPException, Depends
from app.schemas.all_schemas import TamperSimulationRequest
from app.core.security import get_current_user, UserContext
from app.services.audit_integrity import audit_integrity_service

router = APIRouter(prefix="/audit", tags=["Audit Integrity"])


@router.get("/events")
async def list_audit_events(user: UserContext = Depends(get_current_user)):
    return audit_integrity_service.get_all_events()


@router.get("/verify")
async def verify_audit_chain(user: UserContext = Depends(get_current_user)):
    """Verifies cryptographic hash chaining integrity across all audit events."""
    return audit_integrity_service.verify_audit_integrity()


@router.post("/simulate-tamper")
async def simulate_tamper_demo(req: TamperSimulationRequest, user: UserContext = Depends(get_current_user)):
    """Demonstrates tamper detection by injecting modified payload at given event index."""
    res = audit_integrity_service.simulate_tamper_demo(req.event_index, req.modified_message)
    if "error" in res:
        raise HTTPException(status_code=400, detail=res["error"])
    return res
