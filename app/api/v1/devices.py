from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional
import uuid

from app.core.database import get_db
from app.models.core import Device
from pydantic import BaseModel

router = APIRouter()

class DeviceCreate(BaseModel):
    name: str
    vendor: Optional[str] = None
    model: Optional[str] = None
    device_type: Optional[str] = None
    platform: Optional[str] = None
    os_version: Optional[str] = None
    environment: Optional[str] = None
    owner: Optional[str] = None

class DeviceResponse(DeviceCreate):
    id: uuid.UUID
    tenant_id: uuid.UUID
    status: str
    is_archived: bool

    class Config:
        from_attributes = True

# Mock current user for now
async def get_current_tenant_id():
    # In reality, this extracts tenant_id from JWT
    return uuid.UUID('00000000-0000-0000-0000-000000000001')

@router.post("/", response_model=DeviceResponse)
async def create_device(
    device_in: DeviceCreate, 
    db: AsyncSession = Depends(get_db),
    tenant_id: uuid.UUID = Depends(get_current_tenant_id)
):
    db_device = Device(**device_in.model_dump(), tenant_id=tenant_id)
    db.add(db_device)
    await db.commit()
    await db.refresh(db_device)
    return db_device

@router.get("/", response_model=List[DeviceResponse])
async def list_devices(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    tenant_id: uuid.UUID = Depends(get_current_tenant_id)
):
    query = select(Device).where(Device.tenant_id == tenant_id).offset(skip).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()

@router.get("/{device_id}", response_model=DeviceResponse)
async def get_device(
    device_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    tenant_id: uuid.UUID = Depends(get_current_tenant_id)
):
    query = select(Device).where(Device.id == device_id, Device.tenant_id == tenant_id)
    result = await db.execute(query)
    device = result.scalar_one_or_none()
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")
    return device
