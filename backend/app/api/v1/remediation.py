from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from app.core.database import get_db
from app.core.security import get_current_user, CurrentUser
from app.models.db_models import Finding, Device

router = APIRouter()

@router.get("")
def get_remediations(
    severity: str = None,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Finding).filter(
        Finding.tenant_id == current_user.tenant_id,
        Finding.status == "FAIL",
        Finding.remediation_command != None
    )
    if severity:
        query = query.filter(Finding.severity == severity)
        
    findings = query.all()
    results = []
    
    for f in findings:
        dev = db.query(Device).filter(Device.id == f.device_id).first()
        results.append({
            "finding_id": f.id,
            "device_id": f.device_id,
            "device_name": dev.name if dev else "CORE-SW-01",
            "vendor": dev.vendor if dev else "Cisco",
            "platform": dev.platform if dev else "IOS-XE",
            "severity": f.severity,
            "control_id": f.control_id,
            "title": f.title,
            "recommended_command": f.remediation_command,
            "risk_impact": f.risk_impact or "May disconnect existing unencrypted sessions.",
            "verification_command": f.verification_command or "show running-config",
            "evidence_lines": f"{f.start_line}-{f.end_line}",
            "evidence_text": f.evidence_text
        })
        
    return results
