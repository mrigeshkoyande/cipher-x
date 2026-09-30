from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.database import get_db
from app.core.security import get_current_user, CurrentUser
from app.models.db_models import Configuration, Device
from app.schemas.pydantic_schemas import DriftResponse
from app.services.drift_service import DriftService

router = APIRouter()

@router.get("/compare", response_model=DriftResponse)
def compare_drift(
    config_id_old: str,
    config_id_new: str,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    c_old = db.query(Configuration).filter(Configuration.id == config_id_old, Configuration.tenant_id == current_user.tenant_id).first()
    c_new = db.query(Configuration).filter(Configuration.id == config_id_new, Configuration.tenant_id == current_user.tenant_id).first()
    
    if not c_old or not c_new:
        raise HTTPException(status_code=404, detail="One or both configuration versions not found")
        
    drift_data = DriftService.compare_configurations(db, c_old, c_new)
    
    return DriftResponse(
        drift_id=f"drift_{c_old.id[:4]}_{c_new.id[:4]}",
        device_id=drift_data["device_id"],
        config_id_old=c_old.id,
        config_id_new=c_new.id,
        version_old=drift_data["version_old"],
        version_new=drift_data["version_new"],
        added_facts=drift_data["added_facts"],
        removed_facts=drift_data["removed_facts"],
        changed_facts=drift_data["changed_facts"],
        line_diff=drift_data["line_diff"],
        risk_change=drift_data["risk_change"],
        affected_controls_count=drift_data["affected_controls_count"]
    )
