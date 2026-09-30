from typing import Dict, List, Any, Optional
from app.compliance_engine.loader import compliance_loader


class RemediationService:
    """Manages vendor remediation playbooks, validation guardrails, and rollback workflows."""

    def __init__(self):
        self.loader = compliance_loader

    def get_remediation_for_finding(self, vendor: str, control_id: str) -> Optional[Dict[str, Any]]:
        """Retrieves structured remediation playbook for a vendor and control ID."""
        ctrl = self.loader.get_control(control_id)
        if not ctrl:
            return None

        rem_ref = ctrl.get("remediation_ref")
        if not rem_ref:
            return None

        pack = self.loader.get_vendor_pack(vendor)
        if not pack:
            return None

        rem_data = pack.get("remediations", {}).get(rem_ref)
        if not rem_data:
            return None

        return {
            "control_id": control_id,
            "control_title": ctrl.get("title", control_id),
            "severity": ctrl.get("severity", "MEDIUM"),
            "vendor": vendor,
            "remediation_ref": rem_ref,
            "objective": rem_data.get("objective", ""),
            "cli_command": rem_data.get("cli_command", ""),
            "before_example": rem_data.get("before_example", ""),
            "after_example": rem_data.get("after_example", ""),
            "verification_command": rem_data.get("verification_command", ""),
            "rollback_command": rem_data.get("rollback_command", ""),
            "impact_level": rem_data.get("impact_level", "LOW"),
            "explanation": rem_data.get("explanation", ""),
            "safety_warning": "CRITICAL SAFETY POLICY: Automated CLI execution is strictly prohibited by Cipher-X safety policies. Copy commands to an approved change management workflow."
        }

    def simulate_execution(self, vendor: str, control_id: str, operator_notes: Optional[str] = None) -> Dict[str, Any]:
        """Dry-run execution validator. Returns execution preview and enforces guardrails."""
        rem = self.get_remediation_for_finding(vendor, control_id)
        if not rem:
            return {
                "success": False,
                "error": f"No remediation playbook available for control '{control_id}' on vendor '{vendor}'."
            }

        return {
            "status": "GUARDRAIL_PREVIEW_ONLY",
            "message": "Automated execution blocked by policy. Provided below is the validated change script for manual maintenance window approval.",
            "remediation": rem,
            "operator_notes": operator_notes,
            "execution_steps": [
                {"step": 1, "action": "PRE-VERIFICATION", "command": rem["verification_command"]},
                {"step": 2, "action": "APPLY_CONFIG", "commands": rem["cli_command"].splitlines()},
                {"step": 3, "action": "POST-VERIFICATION", "command": rem["verification_command"]},
                {"step": 4, "action": "ROLLBACK_PREPARED", "commands": rem["rollback_command"].splitlines()}
            ]
        }


# Singleton instance
remediation_service = RemediationService()
