import uuid
import time
from typing import List, Optional
from fastapi import APIRouter, HTTPException, Depends
from app.schemas.all_schemas import ConfigurationUpload
from app.core.security import get_current_user, UserContext
from app.core.prompt_defense import prompt_defense
from app.database import db_store
from app.compliance_engine.evaluator import compliance_evaluator
from app.compliance_engine.loader import compliance_loader
from app.services.audit_integrity import audit_integrity_service
from app.services.blockchain_anchor import blockchain_anchor_service
from app.services.security_graph import security_graph_service
from app.services.drift_intelligence import drift_intelligence
from app.services.notification_service import notification_service
from app.services.webhook_dispatcher import webhook_dispatcher

router = APIRouter(prefix="/configurations", tags=["Configurations"])


@router.post("/upload", status_code=201)
async def upload_configuration(req: ConfigurationUpload, user: UserContext = Depends(get_current_user)):
    device = db_store.devices.get(req.device_id)
    if not device:
        raise HTTPException(status_code=404, detail=f"Device '{req.device_id}' not found.")

    # Apply prompt injection defense sanitization
    sanitized_config = prompt_defense.sanitize_untrusted_input(req.raw_config)
    vendor = device.get("vendor", "cisco")

    # Detect vendor if unspecified
    if vendor == "unknown":
        vendor = compliance_loader.detect_vendor(sanitized_config)
        device["vendor"] = vendor

    config_id = f"cfg-{uuid.uuid4().hex[:8]}"
    now = time.time()

    # Find previous version for drift comparison
    prev_configs = [c for c in db_store.configurations.values() if c["device_id"] == req.device_id]
    prev_config = sorted(prev_configs, key=lambda x: x["created_at"], reverse=True)[0] if prev_configs else None

    # Run compliance evaluation
    eval_result = compliance_evaluator.evaluate_configuration(sanitized_config, vendor)
    eval_result["evaluated_at"] = now
    eval_result["config_id"] = config_id
    eval_result["device_id"] = req.device_id

    # Run drift analysis if previous config exists
    drift_result = None
    if prev_config:
        drift_result = drift_intelligence.analyze_drift(prev_config["raw_config"], sanitized_config, vendor)
        if drift_result.get("has_security_drift"):
            notification_service.emit_notification(
                event_type="configuration_drift_detected",
                title=f"Configuration Drift Detected on {device['name']}",
                message=f"Detected {len(drift_result['drift_items'])} security-relevant parameter changes (Severity: {drift_result['drift_severity']}).",
                severity=drift_result["drift_severity"],
                resource_id=req.device_id,
                resource_type="device"
            )
            webhook_dispatcher.dispatch_event(
                event_name="drift.detected",
                tenant_id=user.tenant_id,
                resource={"device_id": req.device_id, "device_name": device["name"], "config_id": config_id},
                summary=f"Security drift on {device['name']}: {len(drift_result['drift_items'])} changes."
            )

    # Store config
    config_record = {
        "id": config_id,
        "device_id": req.device_id,
        "version_label": req.version_label or f"v{len(prev_configs)+1}.0",
        "raw_config": sanitized_config,
        "author": req.author or user.email,
        "change_reason": req.change_reason or "Configuration update",
        "created_at": now,
        "drift_analysis": drift_result
    }
    db_store.configurations[config_id] = config_record
    db_store.evaluations[req.device_id] = eval_result
    device["updated_at"] = now

    # Update Security Graph
    security_graph_service.build_graph_for_evaluation(
        device_id=req.device_id,
        device_name=device["name"],
        vendor=vendor,
        config_id=config_id,
        evaluation_result=eval_result
    )

    # Cryptographic Audit Log
    audit_integrity_service.record_event(
        event_type="CONFIGURATION_PROCESSED",
        actor=user.email,
        resource_id=config_id,
        payload={
            "device_id": req.device_id,
            "device_name": device["name"],
            "score": eval_result["compliance_score"],
            "grade": eval_result["grade"],
            "findings_count": len(eval_result["findings"])
        }
    )

    # Blockchain Anchor Configuration Hash
    anchor_proof = blockchain_anchor_service.anchor_configuration_hash(
        config_id=config_id,
        config_text=sanitized_config,
        device_id=req.device_id,
        device_name=device["name"],
        vendor=vendor
    )

    # Notify critical findings if any
    critical_findings = [f for f in eval_result["findings"] if f["severity"] == "CRITICAL"]
    if critical_findings:
        notification_service.emit_notification(
            event_type="critical_finding_detected",
            title=f"Critical Security Findings on {device['name']}",
            message=f"{len(critical_findings)} CRITICAL severity findings detected during automated compliance scan.",
            severity="CRITICAL",
            resource_id=req.device_id,
            resource_type="device"
        )
        webhook_dispatcher.dispatch_event(
            event_name="critical.finding",
            tenant_id=user.tenant_id,
            resource={"device_id": req.device_id, "device_name": device["name"], "findings": [f["control_id"] for f in critical_findings]},
            summary=f"{len(critical_findings)} critical findings on {device['name']}."
        )

    return {
        "configuration": config_record,
        "evaluation": eval_result,
        "drift_analysis": drift_result,
        "blockchain_anchor": anchor_proof
    }


@router.get("/{config_id}")
async def get_configuration(config_id: str, user: UserContext = Depends(get_current_user)):
    config = db_store.configurations.get(config_id)
    if not config:
        raise HTTPException(status_code=404, detail=f"Configuration '{config_id}' not found.")
    return config
