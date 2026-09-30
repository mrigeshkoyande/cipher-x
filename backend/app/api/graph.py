from fastapi import APIRouter, HTTPException, Depends
from app.core.security import get_current_user, UserContext
from app.services.security_graph import security_graph_service
from app.database import db_store

router = APIRouter(prefix="/graph", tags=["Security Graph"])


@router.get("/full")
async def get_full_security_graph(user: UserContext = Depends(get_current_user)):
    return security_graph_service.query_full_graph()


@router.get("/device/{device_id}")
async def get_device_subgraph(device_id: str, user: UserContext = Depends(get_current_user)):
    return security_graph_service.query_device_subgraph(device_id)


@router.get("/control/{control_id}")
async def get_control_impact_subgraph(control_id: str, user: UserContext = Depends(get_current_user)):
    return security_graph_service.query_control_impact_subgraph(control_id)
