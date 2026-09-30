from fastapi import APIRouter
from pydantic import BaseModel
import uuid

router = APIRouter()

class MappingCreate(BaseModel):
    raw_command: str
    vendor: str
    suggested_parameter: str
    suggested_value: str

@router.get("/unknown")
async def get_unknown_commands():
    # Returns a list of unknown commands found by the AI that need mapping
    return []

@router.post("/mappings")
async def create_mapping(mapping: MappingCreate):
    return {"status": "created", "id": str(uuid.uuid4())}

@router.patch("/mappings/{mapping_id}")
async def update_mapping(mapping_id: uuid.UUID, status: str):
    return {"status": "updated"}

@router.post("/mappings/{mapping_id}/validate")
async def validate_mapping(mapping_id: uuid.UUID):
    return {"status": "validated"}
