from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timezone

from app.core.database import get_db
from app.core.security import get_current_user, CurrentUser, require_role
from app.models.db_models import Mapping, NormalizedFact, Configuration
from app.schemas.pydantic_schemas import MappingResponse, MappingActionRequest
from app.services.audit_service import AuditService

router = APIRouter()

@router.get("", response_model=List[MappingResponse])
def list_mappings(
    status: Optional[str] = None,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Mapping).filter(Mapping.tenant_id == current_user.tenant_id)
    if status:
        query = query.filter(Mapping.status == status)
    return query.order_by(Mapping.created_at.desc()).all()

@router.post("/{mapping_id}/action", response_model=MappingResponse)
def execute_mapping_action(
    mapping_id: str,
    req: MappingActionRequest,
    current_user: CurrentUser = Depends(require_role(["ADMIN", "SECURITY_ANALYST"])),
    db: Session = Depends(get_db)
):
    mapping = db.query(Mapping).filter(Mapping.id == mapping_id, Mapping.tenant_id == current_user.tenant_id).first()
    if not mapping:
        raise HTTPException(status_code=404, detail="Mapping not found")

    action = req.action.upper()
    if action == "APPROVE":
        mapping.status = "VALIDATED"
        mapping.approved_by = current_user.username
        mapping.approved_at = datetime.now(timezone.utc)
        if req.normalized_parameter:
            mapping.normalized_parameter = req.normalized_parameter
        if req.transformation:
            mapping.transformation = req.transformation
    elif action == "EDIT":
        if req.normalized_parameter:
            mapping.normalized_parameter = req.normalized_parameter
        if req.transformation:
            mapping.transformation = req.transformation
    elif action == "REJECT":
        mapping.status = "REJECTED"
    elif action == "DEPRECATE":
        mapping.status = "REJECTED"

    db.commit()
    db.refresh(mapping)

    AuditService.log_event(
        db,
        current_user.tenant_id,
        current_user.username,
        f"MAPPING_{action}",
        "mapping",
        mapping.id,
        f"Executed {action} on mapping for '{mapping.raw_command_pattern}'",
        {"parameter": mapping.normalized_parameter, "status": mapping.status}
    )

    return mapping
