from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.core.security import get_current_user, CurrentUser
from app.models.db_models import Finding
from app.schemas.pydantic_schemas import FindingResponse

router = APIRouter()

@router.get("", response_model=List[FindingResponse])
def list_findings(
    severity: Optional[str] = None,
    status: Optional[str] = None,
    device_id: Optional[str] = None,
    config_id: Optional[str] = None,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Finding).filter(Finding.tenant_id == current_user.tenant_id)
    if severity:
        query = query.filter(Finding.severity == severity)
    if status:
        query = query.filter(Finding.status == status)
    if device_id:
        query = query.filter(Finding.device_id == device_id)
    if config_id:
        query = query.filter(Finding.configuration_id == config_id)
    return query.order_by(Finding.created_at.desc()).all()

@router.get("/{finding_id}", response_model=FindingResponse)
def get_finding(
    finding_id: str,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    finding = db.query(Finding).filter(Finding.id == finding_id, Finding.tenant_id == current_user.tenant_id).first()
    if not finding:
        raise HTTPException(status_code=404, detail="Finding not found")
    return finding

@router.post("/{finding_id}/review", response_model=FindingResponse)
def mark_finding_reviewed(
    finding_id: str,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    finding = db.query(Finding).filter(Finding.id == finding_id, Finding.tenant_id == current_user.tenant_id).first()
    if not finding:
        raise HTTPException(status_code=404, detail="Finding not found")
    finding.is_reviewed = True
    db.commit()
    db.refresh(finding)
    return finding
