from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Optional
from app.core.database import get_db
from app.core.security import get_current_user, CurrentUser
from app.schemas.pydantic_schemas import SecurityGraphResponse
from app.services.graph_service import GraphService

router = APIRouter()

@router.get("", response_model=SecurityGraphResponse)
def get_security_graph(
    device_id: Optional[str] = None,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    graph = GraphService.build_security_graph(db, current_user.tenant_id, device_id)
    return graph
