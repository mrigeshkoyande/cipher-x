from fastapi import APIRouter, HTTPException, Depends
from app.schemas.all_schemas import WebhookCreateRequest
from app.core.security import get_current_user, UserContext
from app.services.webhook_dispatcher import webhook_dispatcher

router = APIRouter(prefix="/webhooks", tags=["Webhooks"])


@router.get("/subscriptions")
async def list_webhook_subscriptions(user: UserContext = Depends(get_current_user)):
    return webhook_dispatcher.list_subscriptions(user.tenant_id)


@router.post("/subscriptions", status_code=201)
async def create_webhook_subscription(req: WebhookCreateRequest, user: UserContext = Depends(get_current_user)):
    sub = webhook_dispatcher.register_subscription(
        tenant_id=user.tenant_id,
        url=req.url,
        events=req.events,
        secret=req.secret
    )
    return sub


@router.get("/deliveries")
async def list_deliveries(user: UserContext = Depends(get_current_user)):
    return webhook_dispatcher.list_delivery_history()


@router.post("/test-ping")
async def test_ping_event(user: UserContext = Depends(get_current_user)):
    deliveries = webhook_dispatcher.dispatch_event(
        event_name="compliance.completed",
        tenant_id=user.tenant_id,
        resource={"test": True, "ping": "Cipher-X Health Check"},
        summary="Test ping event dispatched."
    )
    return {"dispatched_deliveries": len(deliveries), "details": deliveries}
