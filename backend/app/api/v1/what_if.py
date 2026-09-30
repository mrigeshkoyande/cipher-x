from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_user, CurrentUser
from app.schemas.pydantic_schemas import SimulationRequest, SimulationResponse
from app.services.simulation_service import SimulationService

router = APIRouter()

@router.post("/simulate", response_model=SimulationResponse)
def simulate_change(
    req: SimulationRequest,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        res = SimulationService.run_simulation(
            db, current_user.tenant_id, req.device_id, req.parameter, req.proposed_value
        )
        return res
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
