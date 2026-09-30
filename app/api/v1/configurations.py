from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import uuid
import hashlib
import os
import aiofiles

from app.core.database import get_db
from app.models.core import Configuration, ConfigStatus, Device
from pydantic import BaseModel

router = APIRouter()

class ConfigResponse(BaseModel):
    id: uuid.UUID
    device_id: uuid.UUID
    filename: str
    status: ConfigStatus
    version: int

    class Config:
        from_attributes = True

async def get_current_tenant_id():
    return uuid.UUID('00000000-0000-0000-0000-000000000001')

def calculate_sha256(filepath: str) -> str:
    sha256_hash = hashlib.sha256()
    with open(filepath, "rb") as f:
        for byte_block in iter(lambda: f.read(4096), b""):
            sha256_hash.update(byte_block)
    return sha256_hash.hexdigest()

# Mock celery task submission
def queue_processing_job(config_id: uuid.UUID):
    # In reality: process_configuration_task.delay(config_id)
    print(f"Queued job for {config_id}")

@router.post("/upload/{device_id}", response_model=ConfigResponse)
async def upload_configuration(
    device_id: uuid.UUID,
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    tenant_id: uuid.UUID = Depends(get_current_tenant_id)
):
    # 1. validate device exists
    device = await db.scalar(select(Device).where(Device.id == device_id, Device.tenant_id == tenant_id))
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")

    # 2. store securely
    os.makedirs("/tmp/cipherx/configs", exist_ok=True)
    temp_path = f"/tmp/cipherx/configs/{uuid.uuid4()}_{file.filename}"
    
    file_size = 0
    async with aiofiles.open(temp_path, 'wb') as out_file:
        while content := await file.read(1024 * 1024):  # 1MB chunks
            await out_file.write(content)
            file_size += len(content)

    # 3. hash
    file_hash = calculate_sha256(temp_path)

    # Determine next version
    result = await db.execute(select(Configuration).where(Configuration.device_id == device_id).order_by(Configuration.version.desc()).limit(1))
    latest_config = result.scalar_one_or_none()
    next_version = (latest_config.version + 1) if latest_config else 1

    # 4. create DB record
    db_config = Configuration(
        tenant_id=tenant_id,
        device_id=device_id,
        filename=file.filename,
        file_size=file_size,
        sha256_hash=file_hash,
        storage_path=temp_path, # In reality, upload to MinIO/S3 here
        status=ConfigStatus.UPLOADED,
        version=next_version
    )
    db.add(db_config)
    await db.commit()
    await db.refresh(db_config)

    # 5. queue job
    queue_processing_job(db_config.id)

    # 6. return configuration ID (and metadata)
    return db_config

@router.get("/{config_id}", response_model=ConfigResponse)
async def get_configuration(
    config_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    tenant_id: uuid.UUID = Depends(get_current_tenant_id)
):
    query = select(Configuration).where(Configuration.id == config_id, Configuration.tenant_id == tenant_id)
    config = await db.scalar(query)
    if not config:
        raise HTTPException(status_code=404, detail="Configuration not found")
    return config
