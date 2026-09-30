import hashlib
import json
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from app.models.db_models import AuditEvent

class AuditService:
    @staticmethod
    def log_event(
        db: Session,
        tenant_id: str,
        actor: str,
        action: str,
        entity_type: str,
        entity_id: str,
        description: str,
        metadata: dict = None
    ) -> AuditEvent:
        ts = datetime.now(timezone.utc)
        meta_str = json.dumps(metadata or {}, sort_keys=True)
        raw_signature = f"{tenant_id}:{actor}:{action}:{entity_type}:{entity_id}:{ts.isoformat()}:{meta_str}"
        sha256_hash = hashlib.sha256(raw_signature.encode('utf-8')).hexdigest()

        event = AuditEvent(
            tenant_id=tenant_id,
            actor=actor,
            action=action,
            entity_type=entity_type,
            entity_id=entity_id,
            description=description,
            event_metadata=metadata or {},
            sha256_hash=sha256_hash,
            timestamp=ts
        )
        db.add(event)
        db.commit()
        db.refresh(event)
        return event

    @staticmethod
    def verify_event_integrity(event: AuditEvent) -> bool:
        meta_str = json.dumps(event.event_metadata or {}, sort_keys=True)
        raw_signature = f"{event.tenant_id}:{event.actor}:{event.action}:{event.entity_type}:{event.entity_id}:{event.timestamp.isoformat()}:{meta_str}"
        expected_hash = hashlib.sha256(raw_signature.encode('utf-8')).hexdigest()
        return event.sha256_hash == expected_hash
