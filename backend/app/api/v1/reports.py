from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import List, Optional
import os

from app.core.database import get_db
from app.core.security import get_current_user, CurrentUser
from app.models.db_models import Report, Device, Configuration, Finding
from app.schemas.pydantic_schemas import ReportResponse
from app.services.pdf_report_service import PDFReportService
from app.services.audit_service import AuditService

router = APIRouter()

@router.get("", response_model=List[ReportResponse])
def list_reports(
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(Report).filter(Report.tenant_id == current_user.tenant_id).order_by(Report.created_at.desc()).all()

@router.post("/generate", response_model=ReportResponse)
def generate_report(
    device_id: str,
    framework_code: str = "CIS",
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    device = db.query(Device).filter(Device.id == device_id, Device.tenant_id == current_user.tenant_id).first()
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")
        
    config = db.query(Configuration).filter(Configuration.device_id == device_id).order_by(Configuration.version.desc()).first() if hasattr(Configuration.version, 'desc') else db.query(Configuration).filter(Configuration.device_id == device_id).first()
    
    if not config:
        raise HTTPException(status_code=400, detail="No configuration found for this device")
        
    findings = db.query(Finding).filter(Finding.configuration_id == config.id).all()
    
    total = len(findings) or 1
    passed = sum(1 for f in findings if f.status == "PASS")
    failed = sum(1 for f in findings if f.status == "FAIL")
    critical = sum(1 for f in findings if f.severity == "CRITICAL" and f.status == "FAIL")
    score = (passed / total) * 100.0
    
    import uuid
    report_id = f"rpt_{uuid.uuid4().hex[:8]}"
    title = f"{device.name} {framework_code} Compliance Audit"
    
    findings_data = [
        {
            "control_id": f.control_id,
            "title": f.title,
            "status": f.status,
            "severity": f.severity,
            "start_line": f.start_line,
            "end_line": f.end_line,
            "evidence_text": f.evidence_text,
            "remediation_command": f.remediation_command
        } for f in findings
    ]
    
    pdf_path = PDFReportService.generate_compliance_report(
        report_id=report_id,
        title=title,
        device_name=device.name,
        vendor=device.vendor,
        platform=device.platform,
        config_version=config.version,
        sha256_hash=config.sha256_hash,
        framework_code=framework_code,
        compliance_score=score,
        findings_data=findings_data
    )
    
    report = Report(
        id=report_id,
        tenant_id=current_user.tenant_id,
        title=title,
        device_id=device.id,
        configuration_id=config.id,
        framework_code=framework_code,
        compliance_score=score,
        total_controls=total,
        passed_controls=passed,
        failed_controls=failed,
        critical_findings=critical,
        report_url=f"/api/v1/reports/{report_id}/download",
        sha256_hash=config.sha256_hash
    )
    db.add(report)
    db.commit()
    db.refresh(report)
    
    AuditService.log_event(
        db,
        current_user.tenant_id,
        current_user.username,
        "REPORT_GENERATED",
        "report",
        report.id,
        f"Generated PDF compliance report for {device.name} ({framework_code})",
        {"score": score, "critical": critical}
    )
    
    return report

@router.get("/{report_id}/download")
def download_report(
    report_id: str,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    report = db.query(Report).filter(Report.id == report_id, Report.tenant_id == current_user.tenant_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
        
    pdf_path = os.path.join(settings.STORAGE_DIR, f"report_{report_id}.pdf")
    if not os.path.exists(pdf_path):
        # Regenerate if missing
        device = db.query(Device).filter(Device.id == report.device_id).first()
        config = db.query(Configuration).filter(Configuration.id == report.configuration_id).first()
        findings = db.query(Finding).filter(Finding.configuration_id == config.id).all() if config else []
        findings_data = [
            {"control_id": f.control_id, "title": f.title, "status": f.status, "severity": f.severity, "start_line": f.start_line, "end_line": f.end_line, "evidence_text": f.evidence_text, "remediation_command": f.remediation_command} for f in findings
        ]
        pdf_path = PDFReportService.generate_compliance_report(
            report_id=report_id,
            title=report.title,
            device_name=device.name if device else "CORE-SW-01",
            vendor=device.vendor if device else "Cisco",
            platform=device.platform if device else "IOS-XE",
            config_version=config.version if config else 1,
            sha256_hash=report.sha256_hash,
            framework_code=report.framework_code,
            compliance_score=report.compliance_score,
            findings_data=findings_data
        )

    return FileResponse(pdf_path, media_type="application/pdf", filename=f"CIPHER-X_{report.title.replace(' ', '_')}.pdf")
