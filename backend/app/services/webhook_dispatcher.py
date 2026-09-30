import hmac
import hashlib
import json
import time
import uuid
from typing import Dict, List, Any, Optional


class WebhookSubscription:
    def __init__(
        self,
        id: str,
        tenant_id: str,
        url: str,
        secret: str,
        events: List[str],
        enabled: bool = True
    ):
        self.id = id
        self.tenant_id = tenant_id
        self.url = url
        self.secret = secret
        self.events = events
        self.enabled = enabled

    def to_dict(self, mask_secret: bool = True) -> Dict[str, Any]:
        return {
            "id": self.id,
            "tenant_id": self.tenant_id,
            "url": self.url,
            "secret": self.secret[:4] + "..." if mask_secret else self.secret,
            "events": self.events,
            "enabled": self.enabled
        }


class WebhookDispatcherService:
    """Manages outbound event subscriptions and signed webhook deliveries."""

    def __init__(self):
        self.subscriptions: Dict[str, WebhookSubscription] = {}
        self.delivery_history: List[Dict[str, Any]] = []

    def register_subscription(
        self,
        tenant_id: str,
        url: str,
        events: List[str],
        secret: Optional[str] = None
    ) -> Dict[str, Any]:
        sub_id = f"sub-{uuid.uuid4().hex[:10]}"
        sec = secret or uuid.uuid4().hex
        sub = WebhookSubscription(
            id=sub_id,
            tenant_id=tenant_id,
            url=url,
            secret=sec,
            events=events
        )
        self.subscriptions[sub_id] = sub
        return sub.to_dict(mask_secret=False)

    def compute_signature(self, payload_bytes: bytes, secret: str) -> str:
        """Computes HMAC-SHA256 signature for webhook payload authentication."""
        signature = hmac.new(secret.encode("utf-8"), payload_bytes, hashlib.sha256).hexdigest()
        return f"sha256={signature}"

    def verify_signature(self, payload_bytes: bytes, secret: str, signature_header: str) -> bool:
        """Verifies inbound webhook signature against computed hash."""
        expected = self.compute_signature(payload_bytes, secret)
        return hmac.compare_digest(expected, signature_header)

    def dispatch_event(
        self,
        event_name: str,
        tenant_id: str,
        resource: Dict[str, Any],
        summary: str
    ) -> List[Dict[str, Any]]:
        """Dispatches event to matching subscribers."""
        payload = {
            "event": event_name,
            "timestamp": time.time(),
            "tenant": tenant_id,
            "resource": resource,
            "summary": summary
        }
        payload_bytes = json.dumps(payload, sort_keys=True).encode("utf-8")
        results = []

        for sub in self.subscriptions.values():
            if sub.tenant_id == tenant_id and (event_name in sub.events or "*" in sub.events) and sub.enabled:
                signature = self.compute_signature(payload_bytes, sub.secret)
                delivery = {
                    "delivery_id": f"del-{uuid.uuid4().hex[:10]}",
                    "subscription_id": sub.id,
                    "target_url": sub.url,
                    "event": event_name,
                    "timestamp": time.time(),
                    "headers": {
                        "Content-Type": "application/json",
                        "X-CipherX-Signature": signature,
                        "X-CipherX-Event": event_name
                    },
                    "payload": payload,
                    "status": "DELIVERED_SIMULATED",
                    "response_code": 200
                }
                self.delivery_history.insert(0, delivery)
                results.append(delivery)

        return results

    def list_subscriptions(self, tenant_id: str) -> List[Dict[str, Any]]:
        return [s.to_dict(mask_secret=True) for s in self.subscriptions.values() if s.tenant_id == tenant_id]

    def list_delivery_history(self, limit: int = 50) -> List[Dict[str, Any]]:
        return self.delivery_history[:limit]


# Singleton instance
webhook_dispatcher = WebhookDispatcherService()
