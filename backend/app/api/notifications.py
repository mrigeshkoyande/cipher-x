from fastapi import APIRouter, HTTPException, Depends
from app.core.security import get_current_user, UserContext
from app.services.notification_service import notification_service

router = APIRouter(prefix="/notifications", tags=["Notifications"])


@router.get("")
async def list_notifications(unread_only: bool = False, user: UserContext = Depends(get_current_user)):
    return {
        "notifications": notification_service.list_notifications(unread_only=unread_only),
        "unread_count": notification_service.get_unread_count()
    }


@router.patch("/{notification_id}/read")
async def mark_notification_read(notification_id: str, user: UserContext = Depends(get_current_user)):
    success = notification_service.mark_as_read(notification_id)
    if not success:
        raise HTTPException(status_code=404, detail="Notification not found.")
    return {"success": True, "unread_count": notification_service.get_unread_count()}


@router.post("/read-all")
async def mark_all_read(user: UserContext = Depends(get_current_user)):
    count = notification_service.mark_all_as_read()
    return {"marked_read_count": count, "unread_count": 0}
