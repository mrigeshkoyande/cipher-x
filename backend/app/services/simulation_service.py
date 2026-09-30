from typing import Dict, Any, List
from sqlalchemy.orm import Session
import uuid
from app.models.db_models import Device, Configuration, NormalizedFact, Finding, WhatIfSession
from app.services.compliance_engine import ComplianceEngine

class SimulationService:
    @staticmethod
    def run_simulation(db: Session, tenant_id: str, device_id: str, parameter: str, proposed_value: Any) -> Dict[str, Any]:
        device = db.query(Device).filter(Device.id == device_id, Device.tenant_id == tenant_id).first()
        if not device:
            raise ValueError("Device not found")

        config = db.query(Configuration).filter(Configuration.device_id == device_id).order_by(Configuration.version.desc()).first() if hasattr(Configuration.version, 'desc') else db.query(Configuration).filter(Configuration.device_id == device_id).first()
        
        if not config:
            baseline_score = device.compliance_score or 75.0
            facts = []
        else:
            facts = config.facts
            # Calculate actual baseline score from findings
            findings_baseline = db.query(Finding).filter(Finding.configuration_id == config.id).all()
            passed = sum(1 for f in findings_baseline if f.status == "PASS")
            total = len(findings_baseline) or 1
            baseline_score = (passed / total) * 100.0

        # Create virtual mutated fact list
        simulated_facts = []
        param_updated = False

        for f in facts:
            if f.parameter == parameter:
                simulated_facts.append(NormalizedFact(
                    tenant_id=tenant_id,
                    configuration_id=config.id if config else "sim-cfg",
                    category=f.category,
                    parameter=parameter,
                    value=proposed_value,
                    raw_text=f"SIMULATED: {parameter} = {proposed_value}",
                    start_line=f.start_line,
                    end_line=f.end_line,
                    confidence=1.0,
                    is_unknown=False
                ))
                param_updated = True
            else:
                simulated_facts.append(f)

        if not param_updated:
            category = parameter.split(".")[0] if "." in parameter else "management"
            simulated_facts.append(NormalizedFact(
                tenant_id=tenant_id,
                configuration_id=config.id if config else "sim-cfg",
                category=category,
                parameter=parameter,
                value=proposed_value,
                raw_text=f"SIMULATED: {parameter} = {proposed_value}",
                start_line=1,
                end_line=1,
                confidence=1.0,
                is_unknown=False
            ))

        # Run compliance engine on mutated facts
        sim_findings = ComplianceEngine.evaluate_configuration(
            db, tenant_id, device_id, config.id if config else "sim-cfg", simulated_facts, "CIS"
        )

        sim_passed = sum(1 for f in sim_findings if f.status == "PASS")
        sim_total = len(sim_findings) or 1
        simulated_score = (sim_passed / sim_total) * 100.0

        affected_controls = []
        for sf in sim_findings:
            if sf.status == "PASS" and any(f.status == "FAIL" for f in (findings_baseline if config else [])):
                affected_controls.append({"control_id": sf.control_id, "title": sf.title, "change": "IMPROVED"})
            elif sf.status == "FAIL":
                affected_controls.append({"control_id": sf.control_id, "title": sf.title, "change": "FAILED"})

        session_id = f"sim_{uuid.uuid4().hex[:8]}"

        session_rec = WhatIfSession(
            id=session_id,
            tenant_id=tenant_id,
            device_id=device_id,
            proposed_changes_json={parameter: proposed_value},
            baseline_score=baseline_score,
            simulated_score=simulated_score,
            affected_controls_json=affected_controls
        )
        db.add(session_rec)
        db.commit()

        return {
            "session_id": session_id,
            "device_id": device_id,
            "device_name": device.name,
            "baseline_score": round(baseline_score, 1),
            "simulated_score": round(simulated_score, 1),
            "baseline_failed_controls": (len(findings_baseline) - passed) if config else 2,
            "simulated_failed_controls": sim_total - sim_passed,
            "improved_controls_count": max(0, sim_passed - passed if config else 2),
            "worsened_controls_count": 0,
            "affected_controls": affected_controls,
            "disclaimer": "SIMULATION ONLY — NO PRODUCTION CONFIGURATION WAS CHANGED."
        }
