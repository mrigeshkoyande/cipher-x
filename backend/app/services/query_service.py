from typing import Dict, Any, List
from sqlalchemy.orm import Session
from app.models.db_models import Finding, Device, Configuration
from app.services.ai_service import ai_service

class QueryService:
    @staticmethod
    def process_natural_query(db: Session, tenant_id: str, question: str) -> Dict[str, Any]:
        q_lower = question.lower()
        
        retrieved_context = []
        
        if "telnet" in q_lower or "unencrypted" in q_lower:
            findings = db.query(Finding).filter(
                Finding.tenant_id == tenant_id,
                Finding.control_id.like("%CIS-1.1%") | Finding.title.like("%Telnet%")
            ).all()
        elif "ssh" in q_lower:
            findings = db.query(Finding).filter(
                Finding.tenant_id == tenant_id,
                Finding.control_id.like("%CIS-1.2%") | Finding.title.like("%SSH%")
            ).all()
        elif "critical" in q_lower or "high" in q_lower:
            findings = db.query(Finding).filter(
                Finding.tenant_id == tenant_id,
                Finding.severity.in_(["CRITICAL", "HIGH"])
            ).all()
        else:
            findings = db.query(Finding).filter(Finding.tenant_id == tenant_id).limit(10).all()

        for f in findings:
            dev = db.query(Device).filter(Device.id == f.device_id).first()
            retrieved_context.append({
                "device_name": dev.name if dev else "CORE-SW-01",
                "device_id": f.device_id,
                "config_id": f.configuration_id,
                "line_start": f.start_line,
                "line_end": f.end_line,
                "source_text": f.evidence_text or f"Finding {f.control_id}"
            })

        # Ask AI service to format evidence-backed response
        ai_response = ai_service.answer(question, retrieved_context)
        return ai_response
