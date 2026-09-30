import hashlib
import json
import time
import uuid
from typing import Dict, List, Any, Optional
from app.services.audit_integrity import audit_integrity_service
from app.services.blockchain_anchor import blockchain_anchor_service


class ReportGeneratorService:
    """Generates cryptographic, tamper-evident compliance, drift, audit, and executive reports."""

    def __init__(self):
        self.reports_store: Dict[str, Dict[str, Any]] = {}

    def generate_report(
        self,
        report_type: str,  # DEVICE, ORGANIZATION, FRAMEWORK, AUDIT, DRIFT, EXECUTIVE
        title: str,
        target_name: str,
        evaluation_data: Dict[str, Any],
        drift_data: Optional[Dict[str, Any]] = None,
        author: str = "Cipher-X Security Engine"
    ) -> Dict[str, Any]:
        """Assembles comprehensive multi-section report with cryptographic integrity proof."""
        report_id = f"rep-{uuid.uuid4().hex[:12]}"
        created_at = time.time()
        timestamp_iso = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime(created_at))

        # Check current audit integrity
        audit_status = audit_integrity_service.verify_audit_integrity()

        findings = evaluation_data.get("findings", [])
        passed = evaluation_data.get("passed_controls", [])
        counts = evaluation_data.get("counts", {})
        score = evaluation_data.get("compliance_score", 0.0)
        grade = evaluation_data.get("grade", "N/A")
        risk_score = evaluation_data.get("device_risk_score", 0.0)

        # 1. Executive Summary
        exec_summary = (
            f"Cipher-X automated security and compliance assessment for {target_name}. "
            f"Overall compliance score is {score}% (Grade {grade}) with an aggregate risk score of {risk_score} pts. "
            f"Identified {len(findings)} non-compliant control findings requiring remediation. "
            f"Audit integrity verification status: {audit_status['status']}."
        )

        # 2. Evidence reconstruction
        evidence_records = []
        for f in findings:
            ev_list = f.get("evidence", [])
            for ev in ev_list:
                evidence_records.append({
                    "control_id": f.get("control_id"),
                    "control_title": f.get("title"),
                    "line_number": ev.get("line_number", "N/A"),
                    "raw_text": ev.get("raw_text", "N/A"),
                    "extracted_value": ev.get("extracted_value"),
                    "confidence": ev.get("confidence", 1.0)
                })

        # 3. Remediation table
        remediations = []
        for f in findings:
            rem = f.get("remediation")
            if rem:
                remediations.append({
                    "control_id": f.get("control_id"),
                    "objective": rem.get("objective"),
                    "cli_command": rem.get("cli_command"),
                    "verification": rem.get("verification_command"),
                    "rollback": rem.get("rollback_command"),
                    "impact": rem.get("impact_level")
                })

        # Assemble full report document
        report_payload = {
            "report_id": report_id,
            "report_type": report_type.upper(),
            "title": title,
            "target": target_name,
            "author": author,
            "created_at": created_at,
            "timestamp_iso": timestamp_iso,
            "executive_summary": exec_summary,
            "environment_summary": {
                "target_type": "Network Infrastructure Device / Enterprise Fleet",
                "vendor": evaluation_data.get("vendor", "Multi-Vendor"),
                "total_controls_evaluated": evaluation_data.get("total_applicable_controls", len(findings) + len(passed)),
                "evaluation_engine": "Cipher-X Compliance Engine v3.0"
            },
            "compliance_summary": {
                "compliance_score": score,
                "grade": grade,
                "score_explanation": evaluation_data.get("score_explanation", ""),
                "counts": counts,
                "framework_breakdown": evaluation_data.get("framework_scores", {})
            },
            "risk_summary": {
                "risk_score": risk_score,
                "risk_level": evaluation_data.get("device_risk_level", "MEDIUM"),
                "critical_findings_count": evaluation_data.get("severity_counts", {}).get("CRITICAL", 0),
                "high_findings_count": evaluation_data.get("severity_counts", {}).get("HIGH", 0)
            },
            "findings_detail": findings,
            "passed_controls": passed,
            "evidence_ledger": evidence_records,
            "remediation_playbooks": remediations,
            "drift_analysis": drift_data or {"has_security_drift": False, "drift_severity": "NONE"},
            "audit_integrity": {
                "status": audit_status["status"],
                "total_audit_events": audit_status.get("total_events", 0),
                "latest_audit_hash": audit_status.get("latest_hash", "GENESIS"),
                "verification_message": audit_status.get("message", "Verified")
            },
            "technical_appendix": {
                "hash_algorithm": "SHA-256 (NIST FIPS 180-4)",
                "blockchain_anchoring": "Supported",
                "parser_engine": "Deterministic Regex AST & Normalized Fact Map",
                "evidence_provenance": "Exact 1-Indexed Config Line Numbers"
            }
        }

        # Calculate cryptographic hash of entire report
        serialized = json.dumps(report_payload, sort_keys=True)
        report_hash = hashlib.sha256(serialized.encode("utf-8")).hexdigest()
        report_payload["cryptographic_hash"] = report_hash

        # Anchor on blockchain ledger
        anchor_record = blockchain_anchor_service.anchor_report_hash(
            report_id=report_id,
            report_data=report_payload,
            report_type=report_type
        )
        report_payload["blockchain_anchor"] = anchor_record

        self.reports_store[report_id] = report_payload
        return report_payload

    def get_report(self, report_id: str) -> Optional[Dict[str, Any]]:
        return self.reports_store.get(report_id)

    def list_reports(self) -> List[Dict[str, Any]]:
        return [
            {
                "report_id": r["report_id"],
                "report_type": r["report_type"],
                "title": r["title"],
                "target": r["target"],
                "created_at": r["created_at"],
                "compliance_score": r["compliance_summary"]["compliance_score"],
                "grade": r["compliance_summary"]["grade"],
                "cryptographic_hash": r["cryptographic_hash"]
            }
            for r in self.reports_store.values()
        ]

    def export_csv(self, report_id: str) -> str:
        """Exports finding and evidence tables as CSV."""
        rep = self.get_report(report_id)
        if not rep:
            return ""

        lines = ["Control ID,Title,Severity,Category,Status,Risk Score,Explanation,Remediation Objective"]
        for f in rep.get("findings_detail", []):
            rem_obj = f.get("remediation", {}).get("objective", "N/A") if f.get("remediation") else "N/A"
            clean_title = f.get("title", "").replace(",", ";")
            clean_expl = f.get("explanation", "").replace(",", ";").replace("\n", " ")
            lines.append(f"{f['control_id']},{clean_title},{f['severity']},{f['category']},{f['status']},{f.get('risk_score',0)},{clean_expl},{rem_obj}")
        return "\n".join(lines)


# Singleton instance
report_generator = ReportGeneratorService()
