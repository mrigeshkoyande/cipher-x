from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.core.security import get_current_user, CurrentUser
from app.models.db_models import Device, Configuration, Finding
from app.schemas.pydantic_schemas import DeviceCreate, DeviceResponse

router = APIRouter()

@router.get("", response_model=List[DeviceResponse])
def list_devices(
    vendor: Optional[str] = None,
    platform: Optional[str] = None,
    status: Optional[str] = None,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Device).filter(Device.tenant_id == current_user.tenant_id)
    if vendor:
        query = query.filter(Device.vendor == vendor)
    if platform:
        query = query.filter(Device.platform == platform)
    if status:
        query = query.filter(Device.status == status)
    return query.all()

@router.post("", response_model=DeviceResponse)
def create_device(
    req: DeviceCreate,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    device = Device(
        tenant_id=current_user.tenant_id,
        name=req.name,
        vendor=req.vendor,
        platform=req.platform,
        os_version=req.os_version,
        ip_address=req.ip_address,
        status="Healthy",
        compliance_score=100.0,
        risk_level="LOW"
    )
    db.add(device)
    db.commit()
    db.refresh(device)
    return device

@router.get("/{device_id}", response_model=DeviceResponse)
def get_device(
    device_id: str,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    device = db.query(Device).filter(Device.id == device_id, Device.tenant_id == current_user.tenant_id).first()
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")
    return device
