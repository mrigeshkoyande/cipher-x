import re
from typing import List, Dict, Any, Tuple
from sqlalchemy.orm import Session
from app.models.db_models import Control, NormalizedFact, Finding, Framework

class ComplianceEngine:
    @staticmethod
    def evaluate_operator(op: str, observed: Any, expected: Any) -> bool:
        op = op.upper()
        if op == "EQUALS":
            return observed == expected
        elif op == "NOT_EQUALS":
            return observed != expected
        elif op == "GREATER_THAN":
            try:
                return float(observed) > float(expected)
            except (ValueError, TypeError):
                return False
        elif op == "LESS_THAN":
            try:
                return float(observed) < float(expected)
            except (ValueError, TypeError):
                return False
        elif op == "CONTAINS":
            if isinstance(observed, (list, set, tuple)):
                return expected in observed
            if isinstance(observed, str):
                return str(expected).lower() in str(observed).lower()
            return False
        elif op == "NOT_CONTAINS":
            return not ComplianceEngine.evaluate_operator("CONTAINS", observed, expected)
        elif op == "IN":
            if isinstance(expected, (list, set, tuple)):
                return observed in expected
            return False
        elif op == "REGEX":
            try:
                return bool(re.search(str(expected), str(observed)))
            except re.error:
                return False
        elif op == "EXISTS":
            return observed is not None
        elif op == "NOT_EXISTS":
            return observed is None
        return False

    @classmethod
    def evaluate_configuration(
        cls,
        db: Session,
        tenant_id: str,
        device_id: str,
        config_id: str,
        facts: List[NormalizedFact],
        framework_code: str = "CIS"
    ) -> List[Finding]:
        # Fetch framework
        framework = db.query(Framework).filter(Framework.code == framework_code).first()
        if not framework:
            controls = cls.get_default_controls()
            framework_id = "fw_cis_v1"
        else:
            framework_id = framework.id
            controls = framework.controls

        # Build fact dictionary mapping parameter -> NormalizedFact
        fact_map: Dict[str, NormalizedFact] = {}
        for f in facts:
            fact_map[f.parameter] = f

        findings: List[Finding] = []

        for ctrl in controls:
            param_name = ctrl.expected_parameter if isinstance(ctrl, Control) else ctrl["expected_parameter"]
            ctrl_id = ctrl.control_id if isinstance(ctrl, Control) else ctrl["control_id"]
            ctrl_title = ctrl.title if isinstance(ctrl, Control) else ctrl["title"]
            ctrl_desc = ctrl.description if isinstance(ctrl, Control) else ctrl["description"]
            ctrl_sev = ctrl.severity if isinstance(ctrl, Control) else ctrl["severity"]
            operator = ctrl.operator if isinstance(ctrl, Control) else ctrl["operator"]
            expected = ctrl.expected_value if isinstance(ctrl, Control) else ctrl["expected_value"]
            remediation_template = ctrl.remediation_template if isinstance(ctrl, Control) else ctrl["remediation_template"]
            verification_command = ctrl.verification_command if isinstance(ctrl, Control) else ctrl["verification_command"]

            fact = fact_map.get(param_name)

            if not fact:
                # Parameter not found in facts
                if operator == "NOT_EXISTS":
                    status = "PASS"
                elif operator == "EXISTS":
                    status = "FAIL"
                else:
                    status = "UNKNOWN"
                
                finding = Finding(
                    tenant_id=tenant_id,
                    device_id=device_id,
                    configuration_id=config_id,
                    framework_id=framework_id,
                    control_id=ctrl_id,
                    status=status,
                    severity=ctrl_sev,
                    title=ctrl_title,
                    description=ctrl_desc,
                    observed_value="Not Found in Configuration",
                    expected_value=expected,
                    confidence=0.5 if status == "UNKNOWN" else 1.0,
                    start_line=0,
                    end_line=0,
                    evidence_text="Parameter not declared in uploaded configuration",
                    remediation_command=remediation_template,
                    risk_impact=f"Potential violation of {ctrl_id}: {ctrl_title}",
                    verification_command=verification_command
                )
                findings.append(finding)
                continue

            if fact.is_unknown:
                status = "REVIEW" # Unknown syntax requires review, NEVER PASS
                finding = Finding(
                    tenant_id=tenant_id,
                    device_id=device_id,
                    configuration_id=config_id,
                    framework_id=framework_id,
                    control_id=ctrl_id,
                    status=status,
                    severity=ctrl_sev,
                    title=f"{ctrl_title} (Syntax Review Required)",
                    description=ctrl_desc,
                    observed_value=fact.raw_text,
                    expected_value=expected,
                    confidence=fact.confidence,
                    start_line=fact.start_line,
                    end_line=fact.end_line,
                    evidence_text=fact.raw_text,
                    remediation_command=remediation_template,
                    risk_impact="Unknown vendor syntax detected. Human review required before verifying compliance.",
                    verification_command=verification_command
                )
                findings.append(finding)
                continue

            # Evaluate operator deterministically
            is_compliant = cls.evaluate_operator(operator, fact.value, expected)
            status = "PASS" if is_compliant else "FAIL"

            finding = Finding(
                tenant_id=tenant_id,
                device_id=device_id,
                configuration_id=config_id,
                framework_id=framework_id,
                control_id=ctrl_id,
                status=status,
                severity=ctrl_sev,
                title=ctrl_title,
                description=ctrl_desc,
                observed_value=fact.value,
                expected_value=expected,
                confidence=fact.confidence,
                start_line=fact.start_line,
                end_line=fact.end_line,
                evidence_text=fact.raw_text,
                remediation_command=remediation_template if status == "FAIL" else None,
                risk_impact=f"Non-compliant setting for {ctrl_title} exposes asset to security risk." if status == "FAIL" else None,
                verification_command=verification_command
            )
            findings.append(finding)

        return findings

    @staticmethod
    def get_default_controls() -> List[Dict[str, Any]]:
        return [
            {
                "control_id": "CIS-1.1",
                "category": "Management",
                "title": "Disable Unencrypted Telnet Access",
                "description": "Ensure Telnet management access is disabled in favor of encrypted SSH v2.",
                "severity": "CRITICAL",
                "expected_parameter": "management.telnet.enabled",
                "operator": "EQUALS",
                "expected_value": False,
                "remediation_template": "line vty 0 15\n transport input ssh",
                "verification_command": "show running-config | section line vty"
            },
            {
                "control_id": "CIS-1.2",
                "category": "Management",
                "title": "Enforce SSH Version 2",
                "description": "Ensure SSH version 2 is explicitly configured for remote administration.",
                "severity": "HIGH",
                "expected_parameter": "management.ssh.version",
                "operator": "EQUALS",
                "expected_value": 2,
                "remediation_template": "ip ssh version 2",
                "verification_command": "show ip ssh"
            },
            {
                "control_id": "CIS-2.1",
                "category": "Logging",
                "title": "Configure Remote Syslog Logging Server",
                "description": "Ensure system log events are transmitted to a centralized remote syslog server.",
                "severity": "HIGH",
                "expected_parameter": "logging.remote_server_configured",
                "operator": "EQUALS",
                "expected_value": True,
                "remediation_template": "logging host 10.0.100.50",
                "verification_command": "show logging"
            },
            {
                "control_id": "CIS-3.1",
                "category": "Authentication",
                "title": "Enable Password Encryption for Stored Passwords",
                "description": "Ensure all plain-text passwords in configuration files are encrypted.",
                "severity": "MEDIUM",
                "expected_parameter": "password_policy.encryption_enabled",
                "operator": "EQUALS",
                "expected_value": True,
                "remediation_template": "service password-encryption",
                "verification_command": "show running-config | include service password-encryption"
            },
            {
                "control_id": "CIS-4.1",
                "category": "SNMP",
                "title": "Disable Read-Write SNMP Community Strings",
                "description": "Ensure SNMP write access is disabled to prevent unauthorized configuration changes.",
                "severity": "CRITICAL",
                "expected_parameter": "snmp.read_write_community_enabled",
                "operator": "NOT_EQUALS",
                "expected_value": True,
                "remediation_template": "no snmp-server community <community_name> rw",
                "verification_command": "show snmp community"
            }
        ]
