import re
from typing import Dict, List, Any, Optional
from app.compliance_engine.evaluator import compliance_evaluator
from app.compliance_engine.loader import compliance_loader
from app.services.remediation_service import remediation_service
from app.services.whatif_simulator import whatif_simulator


class SecurityAssistantService:
    """Grounded Natural Language Security Assistant."""

    def __init__(self):
        self.evaluator = compliance_evaluator
        self.loader = compliance_loader
        self.remediation_service = remediation_service
        self.whatif_service = whatif_simulator

    def process_query(
        self,
        query: str,
        context_devices: Optional[List[Dict[str, Any]]] = None
    ) -> Dict[str, Any]:
        """Processes natural language query by retrieving factual telemetry and generating grounded response."""
        q = query.lower().strip()
        devices = context_devices or []

        # 1. "Which devices allow Telnet?" / "Telnet enabled"
        if "telnet" in q and ("which" in q or "who" in q or "show" in q or "allow" in q or "failed" in q or "list" in q):
            matching_devices = []
            for d in devices:
                eval_res = d.get("evaluation", {})
                facts = eval_res.get("normalized_facts", {})
                if facts.get("telnet.enabled") is True or any(f.get("control_id") == "CTRL-TELNET-01" for f in eval_res.get("findings", [])):
                    matching_devices.append({
                        "device_id": d.get("id"),
                        "device_name": d.get("name"),
                        "vendor": d.get("vendor"),
                        "evidence": "Telnet daemon is active on VTY transport input lines.",
                        "control_failed": "CTRL-TELNET-01 (CIS-NET-1.2, NIST AC-17(1))"
                    })

            if matching_devices:
                text = f"Found **{len(matching_devices)} device(s)** with active Telnet service:\n\n"
                for dev in matching_devices:
                    text += f"• **{dev['device_name']}** ({dev['vendor'].upper()}) — *Failed {dev['control_failed']}*\n"
                text += "\n> [!CAUTION]\n> Telnet transmits administrative credentials in plaintext. Remediate immediately using SSHv2."
                return {
                    "query": query,
                    "intent": "INSECURE_TELNET_QUERY",
                    "grounded_facts": matching_devices,
                    "answer": text,
                    "suggested_actions": ["Run What-If: Disable Telnet", "View Cisco Core Router Remediation"]
                }
            else:
                return {
                    "query": query,
                    "intent": "INSECURE_TELNET_QUERY",
                    "grounded_facts": [],
                    "answer": "No devices in the current fleet permit cleartext Telnet management. All inspected devices have Telnet disabled.",
                    "suggested_actions": ["Check SSH compliance", "Run full compliance scan"]
                }

        # 2. "Which devices failed SSH?"
        if "ssh" in q and ("fail" in q or "which" in q or "show" in q or "version" in q):
            matching_devices = []
            for d in devices:
                eval_res = d.get("evaluation", {})
                ssh_finding = next((f for f in eval_res.get("findings", []) if f.get("control_id") == "CTRL-SSH-01"), None)
                if ssh_finding:
                    matching_devices.append({
                        "device_id": d.get("id"),
                        "device_name": d.get("name"),
                        "vendor": d.get("vendor"),
                        "explanation": ssh_finding.get("explanation"),
                        "status": ssh_finding.get("status")
                    })

            text = f"Found **{len(matching_devices)} device(s)** that failed or triggered warnings for SSH compliance (CTRL-SSH-01):\n\n"
            for dev in matching_devices:
                text += f"• **{dev['device_name']}** ({dev['vendor'].upper()}): {dev['explanation']}\n"
            return {
                "query": query,
                "intent": "SSH_COMPLIANCE_QUERY",
                "grounded_facts": matching_devices,
                "answer": text,
                "suggested_actions": ["Apply SSHv2 Remediation", "View CIS Benchmark"]
            }

        # 3. "Which devices have weak cryptography?"
        if "crypt" in q or "cipher" in q or "weak" in q:
            matching_devices = []
            for d in devices:
                eval_res = d.get("evaluation", {})
                crypto_finding = next((f for f in eval_res.get("findings", []) if f.get("control_id") == "CTRL-CRYPTO-01"), None)
                if crypto_finding:
                    matching_devices.append({
                        "device_id": d.get("id"),
                        "device_name": d.get("name"),
                        "vendor": d.get("vendor"),
                        "details": crypto_finding.get("explanation")
                    })

            text = f"Identified **{len(matching_devices)} device(s)** utilizing weak cryptography or legacy ciphers (e.g. 3DES, DES, CBC, MD5):\n\n"
            for dev in matching_devices:
                text += f"• **{dev['device_name']}** ({dev['vendor'].upper()}): {dev['details']}\n"
            return {
                "query": query,
                "intent": "WEAK_CRYPTOGRAPHY_QUERY",
                "grounded_facts": matching_devices,
                "answer": text,
                "suggested_actions": ["Simulate: Enforce AES-256-GCM", "View NIST SC-13 Controls"]
            }

        # 4. "Show critical findings" / "Critical findings"
        if "critical" in q or "top findings" in q or "high risk" in q:
            critical_findings = []
            for d in devices:
                eval_res = d.get("evaluation", {})
                for f in eval_res.get("findings", []):
                    if f.get("severity") == "CRITICAL":
                        critical_findings.append({
                            "device_name": d.get("name"),
                            "control_id": f.get("control_id"),
                            "title": f.get("title"),
                            "explanation": f.get("explanation")
                        })

            text = f"**Summary of Critical Security Findings ({len(critical_findings)} active):**\n\n"
            for cf in critical_findings:
                text += f"🔴 **{cf['device_name']}** — `{cf['control_id']}`: **{cf['title']}**\n   *Reason*: {cf['explanation']}\n\n"
            return {
                "query": query,
                "intent": "CRITICAL_FINDINGS_QUERY",
                "grounded_facts": critical_findings,
                "answer": text,
                "suggested_actions": ["Generate Executive Risk Report", "View Remediation Playbooks"]
            }

        # 5. "What happens if I disable Telnet?" / What-if simulation query
        if "what happens" in q or "what if" in q or "simulate" in q:
            # Run simulation on first device or Cisco Core
            sample_dev = devices[0] if devices else None
            sample_cfg = sample_dev.get("raw_config", "line vty 0 4\n transport input telnet ssh\n") if sample_dev else "line vty 0 4\n transport input telnet ssh\n"
            sim_res = self.whatif_service.simulate(sample_cfg, vendor="cisco", scenario_id="scenario_disable_telnet")
            
            text = (
                f"### What-If Simulation: Disable Telnet\n\n"
                f"• **Compliance Score Impact**: `{sim_res['baseline']['compliance_score']}%` ➔ **`{sim_res['projected']['compliance_score']}%`** "
                f"(**+{sim_res['deltas']['compliance_score_delta']}%** improvement)\n"
                f"• **Risk Score Impact**: `{sim_res['baseline']['risk_score']} pts` ➔ **`{sim_res['projected']['risk_score']} pts`** "
                f"(**{sim_res['deltas']['risk_score_delta']} pts** risk reduction)\n"
                f"• **Findings Resolved**: {sim_res['deltas']['findings_resolved_count']} critical finding(s)\n\n"
                f"Resolved Control: `CTRL-TELNET-01` (NIST AC-17(1), CIS-NET-1.2, DISA STIG-NET-000020)."
            )
            return {
                "query": query,
                "intent": "WHAT_IF_QUERY",
                "grounded_facts": sim_res,
                "answer": text,
                "suggested_actions": ["Review Remediation Playbook", "Simulate Centralized AAA"]
            }

        # 6. "How can I remediate this finding?" / "Remediation for..."
        if "remediat" in q or "fix" in q or "how to" in q:
            # Check if mentions specific control or keyword
            ctrl_target = "CTRL-TELNET-01"
            if "ssh" in q:
                ctrl_target = "CTRL-SSH-01"
            elif "snmp" in q:
                ctrl_target = "CTRL-SNMP-01"
            elif "password" in q:
                ctrl_target = "CTRL-PASS-01"
            elif "log" in q:
                ctrl_target = "CTRL-LOG-01"

            rem = self.remediation_service.get_remediation_for_finding("cisco", ctrl_target)
            if rem:
                text = (
                    f"### Remediation Playbook: `{rem['control_id']}` — {rem['control_title']}\n\n"
                    f"**Objective**: {rem['objective']}\n\n"
                    f"**CLI Remediation Commands**:\n```cisco\n{rem['cli_command']}\n```\n\n"
                    f"**Verification Command**:\n`{rem['verification_command']}`\n\n"
                    f"**Rollback Command**:\n```cisco\n{rem['rollback_command']}\n```\n\n"
                    f"> [!IMPORTANT]\n> **Safety Guardrail**: Cipher-X never executes CLI changes automatically. Review through change approval board."
                )
                return {
                    "query": query,
                    "intent": "REMEDIATION_QUERY",
                    "grounded_facts": rem,
                    "answer": text,
                    "suggested_actions": ["Download Change Script", "Verify Audit Trail"]
                }

        # Default fallback grounded response
        total_devs = len(devices)
        return {
            "query": query,
            "intent": "GENERAL_SECURITY_QUERY",
            "grounded_facts": {"total_devices_analyzed": total_devs},
            "answer": (
                f"I analyzed {total_devs} network devices in your environment. "
                "You can ask me specific security questions such as:\n"
                "• *'Which devices allow Telnet?'*\n"
                "• *'Which devices failed SSH?'*\n"
                "• *'Show critical findings'* \n"
                "• *'What happens if I disable Telnet?'*\n"
                "• *'How can I remediate CTRL-SSH-01?'*"
            ),
            "suggested_actions": ["Show Critical Findings", "Which devices allow Telnet?", "What happens if I disable Telnet?"]
        }


# Singleton instance
security_assistant = SecurityAssistantService()
