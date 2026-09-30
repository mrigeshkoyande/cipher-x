from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.core.security import get_current_user, CurrentUser
from app.models.db_models import AuditEvent
from app.schemas.pydantic_schemas import AuditEventResponse

router = APIRouter()

@router.get("", response_model=List[AuditEventResponse])
def list_audit_events(
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(AuditEvent).filter(AuditEvent.tenant_id == current_user.tenant_id).order_by(AuditEvent.timestamp.desc()).all()
