import hashlib
import json
import time
from typing import Dict, List, Any, Optional, Tuple

GENESIS_HASH = "0000000000000000000000000000000000000000000000000000000000000000"


class AuditEvent:
    def __init__(
        self,
        index: int,
        timestamp: float,
        event_type: str,
        actor: str,
        resource_id: str,
        payload: Dict[str, Any],
        previous_hash: str,
        event_hash: Optional[str] = None
    ):
        self.index = index
        self.timestamp = timestamp
        self.event_type = event_type
        self.actor = actor
        self.resource_id = resource_id
        self.payload = payload
        self.previous_hash = previous_hash
        self.event_hash = event_hash or self.compute_hash()

    def compute_hash(self) -> str:
        payload_str = json.dumps(self.payload, sort_keys=True)
        raw = f"{self.index}|{self.timestamp}|{self.event_type}|{self.actor}|{self.resource_id}|{payload_str}|{self.previous_hash}"
        return hashlib.sha256(raw.encode("utf-8")).hexdigest()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "index": self.index,
            "timestamp": self.timestamp,
            "event_type": self.event_type,
            "actor": self.actor,
            "resource_id": self.resource_id,
            "payload": self.payload,
            "previous_hash": self.previous_hash,
            "event_hash": self.event_hash
        }


class AuditIntegrityService:
    """Cryptographic audit trail with SHA-256 hash chaining and tamper detection."""

    def __init__(self):
        self.events: List[AuditEvent] = []
        self._initialize_genesis()

    def _initialize_genesis(self):
        genesis = AuditEvent(
            index=0,
            timestamp=1700000000.0,
            event_type="SYSTEM_GENESIS",
            actor="SYSTEM",
            resource_id="CIPHER-X-ROOT",
            payload={"message": "Cipher-X Cryptographic Audit Chain Initialized"},
            previous_hash=GENESIS_HASH
        )
        self.events.append(genesis)

    def record_event(
        self,
        event_type: str,
        actor: str,
        resource_id: str,
        payload: Dict[str, Any]
    ) -> AuditEvent:
        """Appends a new event cryptographically chained to the previous event hash."""
        prev_event = self.events[-1]
        new_event = AuditEvent(
            index=len(self.events),
            timestamp=time.time(),
            event_type=event_type,
            actor=actor,
            resource_id=resource_id,
            payload=payload,
            previous_hash=prev_event.event_hash
        )
        self.events.append(new_event)
        return new_event

    def verify_audit_integrity(self) -> Dict[str, Any]:
        """Validates hash chaining integrity from Genesis to the latest event."""
        if not self.events:
            return {"status": "TAMPERED", "valid": False, "message": "Audit chain is empty."}

        # Check Genesis
        if self.events[0].previous_hash != GENESIS_HASH:
            return {
                "status": "TAMPERED",
                "valid": False,
                "tampered_index": 0,
                "reason": "Genesis block previous_hash is invalid."
            }

        for i in range(len(self.events)):
            evt = self.events[i]
            expected_hash = evt.compute_hash()
            if evt.event_hash != expected_hash:
                return {
                    "status": "TAMPERED",
                    "valid": False,
                    "tampered_index": i,
                    "event_id": evt.index,
                    "reason": f"Hash mismatch at index {i}: stored '{evt.event_hash[:16]}...', computed '{expected_hash[:16]}...'."
                }

            if i > 0:
                prev_evt = self.events[i - 1]
                if evt.previous_hash != prev_evt.event_hash:
                    return {
                        "status": "TAMPERED",
                        "valid": False,
                        "tampered_index": i,
                        "reason": f"Chain broken at index {i}: previous_hash does not match hash of event {i-1}."
                    }

        return {
            "status": "VALID",
            "valid": True,
            "total_events": len(self.events),
            "latest_hash": self.events[-1].event_hash,
            "genesis_hash": self.events[0].event_hash,
            "message": f"Audit integrity verified across all {len(self.events)} events. Cryptographic chain is intact."
        }

    def simulate_tamper_demo(self, target_index: int, fake_payload_msg: str) -> Dict[str, Any]:
        """Simulates malicious database alteration for demonstration and verification testing."""
        if target_index <= 0 or target_index >= len(self.events):
            return {"error": f"Invalid target index {target_index} (must be between 1 and {len(self.events)-1})"}

        # Modify payload without recalculating chained hashes
        self.events[target_index].payload["message"] = fake_payload_msg
        return {
            "tampered_index": target_index,
            "notice": "Payload modified in memory without updating hash chain.",
            "verification_result": self.verify_audit_integrity()
        }

    def get_all_events(self) -> List[Dict[str, Any]]:
        return [e.to_dict() for e in self.events]


# Singleton instance
audit_integrity_service = AuditIntegrityService()
