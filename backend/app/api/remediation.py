from fastapi import APIRouter, HTTPException, Depends
from app.core.security import get_current_user, UserContext
from app.services.remediation_service import remediation_service
from app.compliance_engine.loader import compliance_loader

router = APIRouter(prefix="/remediation", tags=["Remediation Intelligence"])


@router.get("/{vendor}/{control_id}")
async def get_remediation(vendor: str, control_id: str, user: UserContext = Depends(get_current_user)):
    rem = remediation_service.get_remediation_for_finding(vendor, control_id)
    if not rem:
        raise HTTPException(status_code=404, detail=f"No remediation playbook available for control '{control_id}' on vendor '{vendor}'.")
    return rem


@router.post("/dry-run-preview")
async def preview_execution_guardrail(payload: dict, user: UserContext = Depends(get_current_user)):
    vendor = payload.get("vendor", "cisco")
    control_id = payload.get("control_id", "CTRL-SSH-01")
    notes = payload.get("notes", "Operator review")
    return remediation_service.simulate_execution(vendor, control_id, notes)
