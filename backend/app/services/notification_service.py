import time
import uuid
from typing import Dict, List, Any, Optional


class NotificationItem:
    def __init__(
        self,
        id: str,
        event_type: str,
        title: str,
        message: str,
        severity: str,  # CRITICAL, HIGH, MEDIUM, LOW, INFO
        resource_id: Optional[str] = None,
        resource_type: Optional[str] = None,
        read: bool = False,
        created_at: Optional[float] = None
    ):
        self.id = id
        self.event_type = event_type
        self.title = title
        self.message = message
        self.severity = severity
        self.resource_id = resource_id
        self.resource_type = resource_type
        self.read = read
        self.created_at = created_at or time.time()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "event_type": self.event_type,
            "title": self.title,
            "message": self.message,
            "severity": self.severity,
            "resource_id": self.resource_id,
            "resource_type": self.resource_type,
            "read": self.read,
            "created_at": self.created_at
        }


class NotificationService:
    """Manages multi-channel notifications (In-app, Email, Slack, Teams)."""

    def __init__(self):
        self.in_app_notifications: List[NotificationItem] = []
        self.channel_configs: Dict[str, Dict[str, Any]] = {
            "email": {"enabled": False, "smtp_host": "smtp.enterprise.internal", "recipients": ["soc-alerts@cipherx.io"]},
            "slack": {"enabled": False, "webhook_url": "https://hooks.slack.com/services/REDACTED", "channel": "#sec-ops"},
            "teams": {"enabled": False, "webhook_url": "https://outlook.office.com/webhook/REDACTED"}
        }

    def emit_notification(
        self,
        event_type: str,
        title: str,
        message: str,
        severity: str = "INFO",
        resource_id: Optional[str] = None,
        resource_type: Optional[str] = None
    ) -> NotificationItem:
        """Dispatches notification to in-app store and active integration channels."""
        notif = NotificationItem(
            id=f"notif-{uuid.uuid4().hex[:10]}",
            event_type=event_type,
            title=title,
            message=message,
            severity=severity,
            resource_id=resource_id,
            resource_type=resource_type
        )
        self.in_app_notifications.insert(0, notif)
        return notif

    def list_notifications(self, unread_only: bool = False, limit: int = 50) -> List[Dict[str, Any]]:
        items = self.in_app_notifications
        if unread_only:
            items = [n for n in items if not n.read]
        return [n.to_dict() for n in items[:limit]]

    def mark_as_read(self, notification_id: str) -> bool:
        for n in self.in_app_notifications:
            if n.id == notification_id:
                n.read = True
                return True
        return False

    def mark_all_as_read(self) -> int:
        count = 0
        for n in self.in_app_notifications:
            if not n.read:
                n.read = True
                count += 1
        return count

    def get_unread_count(self) -> int:
        return sum(1 for n in self.in_app_notifications if not n.read)

    def format_slack_payload(self, notif: NotificationItem) -> Dict[str, Any]:
        """Template for Slack webhook without exposing tokens."""
        color = {"CRITICAL": "#ff0000", "HIGH": "#ff9900", "MEDIUM": "#ffcc00", "LOW": "#36a64f", "INFO": "#439fe0"}.get(notif.severity, "#439fe0")
        return {
            "text": f"*{notif.title}*",
            "attachments": [
                {
                    "color": color,
                    "fields": [
                        {"title": "Event Type", "value": notif.event_type, "short": True},
                        {"title": "Severity", "value": notif.severity, "short": True},
                        {"title": "Resource", "value": f"{notif.resource_type}:{notif.resource_id}", "short": True},
                        {"title": "Details", "value": notif.message, "short": False}
                    ],
                    "footer": "Cipher-X Security Intelligence",
                    "ts": int(notif.created_at)
                }
            ]
        }


# Singleton instance
notification_service = NotificationService()
