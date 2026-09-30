from fastapi import APIRouter, HTTPException, Depends
from app.core.security import get_current_user, UserContext
from app.services.blockchain_anchor import blockchain_anchor_service

router = APIRouter(prefix="/blockchain", tags=["Blockchain Hash Anchoring"])


@router.get("/anchors")
async def list_blockchain_anchors(user: UserContext = Depends(get_current_user)):
    return blockchain_anchor_service.list_anchors()


@router.get("/verify/{anchor_id}")
async def verify_blockchain_anchor(anchor_id: str, user: UserContext = Depends(get_current_user)):
    res = blockchain_anchor_service.verify_anchor(anchor_id)
    if res.get("status") == "NOT_FOUND":
        raise HTTPException(status_code=404, detail=res["message"])
    return res
