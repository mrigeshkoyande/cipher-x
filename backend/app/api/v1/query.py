from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_user, CurrentUser
from app.schemas.pydantic_schemas import QueryRequest, QueryResponse
from app.services.query_service import QueryService

router = APIRouter()

@router.post("", response_model=QueryResponse)
def query_analyst_console(
    req: QueryRequest,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    result = QueryService.process_natural_query(db, current_user.tenant_id, req.question)
    return result
