from typing import Dict, List, Any, Optional
from app.compliance_engine.evaluator import compliance_evaluator
from app.compliance_engine.loader import compliance_loader


class WhatIfScenarioSimulator:
    """Simulates hypothetical configuration changes and forecasts compliance and risk outcomes."""

    def __init__(self):
        self.evaluator = compliance_evaluator
        self.loader = compliance_loader

    def get_predefined_scenarios(self) -> List[Dict[str, Any]]:
        return [
            {
                "id": "scenario_disable_telnet",
                "name": "Disable Insecure Telnet Service",
                "description": "Removes telnet listeners and locks virtual terminal access to encrypted SSH only.",
                "category": "Management Hardening",
                "targeted_control": "CTRL-TELNET-01"
            },
            {
                "id": "scenario_enable_ssh_v2",
                "name": "Enforce SSHv2 with Strong Ciphers",
                "description": "Mandates SSHv2 protocol and disables weak CBC/3DES ciphers in favor of AES-256.",
                "category": "Cryptographic Hardening",
                "targeted_control": "CTRL-SSH-01"
            },
            {
                "id": "scenario_enable_remote_logging",
                "name": "Configure Centralized Remote Syslog",
                "description": "Adds enterprise SIEM syslog forwarder with millisecond timestamp precision.",
                "category": "Audit & Accountability",
                "targeted_control": "CTRL-LOG-01"
            },
            {
                "id": "scenario_enforce_password_policy",
                "name": "Enforce 15-Character Password Minimum & SHA-512",
                "description": "Upgrades local secret hashing to Type 9 / SHA-512 and enforces 15-char minimum.",
                "category": "Identification & Authentication",
                "targeted_control": "CTRL-PASS-01"
            },
            {
                "id": "scenario_snmpv3_authpriv",
                "name": "Enforce SNMPv3 AuthPriv & Remove Public Community",
                "description": "Replaces insecure v1/v2c SNMP communities with authenticated SNMPv3 USM group.",
                "category": "Network Monitoring",
                "targeted_control": "CTRL-SNMP-01"
            },
            {
                "id": "scenario_session_timeout",
                "name": "Enforce 10-Minute Administrative Idle Timeout",
                "description": "Sets console and VTY idle session disconnect to 10 minutes (600s).",
                "category": "Session Management",
                "targeted_control": "CTRL-TIMEOUT-01"
            },
            {
                "id": "scenario_enable_centralized_aaa",
                "name": "Enforce Centralized TACACS+ AAA Authentication",
                "description": "Activates AAA model and delegates operator authentication to TACACS+ cluster.",
                "category": "Access Control",
                "targeted_control": "CTRL-AAA-01"
            }
        ]

    def apply_scenario_patch(self, config_text: str, vendor: str, scenario_id: str, custom_patch: Optional[str] = None) -> str:
        """Applies scenario CLI mutations to the base configuration text."""
        if custom_patch:
            return config_text.rstrip() + "\n" + custom_patch.strip() + "\n"

        vendor = vendor.lower()

        if scenario_id == "scenario_disable_telnet":
            if vendor == "cisco":
                # Remove telnet mentions, ensure ssh
                res = config_text.replace("transport input telnet ssh", "transport input ssh")
                res = res.replace("transport input all", "transport input ssh")
                if "transport input ssh" not in res:
                    res += "\nline vty 0 15\n transport input ssh\n"
                return res
            elif vendor == "juniper":
                lines = [l for l in config_text.splitlines() if "set system services telnet" not in l]
                return "\n".join(lines)
            elif vendor == "fortinet":
                return config_text.replace("telnet", "")
            elif vendor == "palo_alto":
                return config_text + "\nset deviceconfig system service disable-telnet yes\n"

        elif scenario_id == "scenario_enable_ssh_v2":
            if vendor == "cisco":
                return config_text + "\nip ssh version 2\nip ssh server algorithm encryption aes256-ctr\n"
            elif vendor == "juniper":
                return config_text + "\nset system services ssh protocol-version v2\n"
            elif vendor == "fortinet":
                return config_text + "\nconfig system global\n set admin-ssh-v1 disable\n set strong-crypto enable\nend\n"
            elif vendor == "palo_alto":
                return config_text + "\nset deviceconfig system ssh ciphers [ aes256-gcm aes128-gcm ]\n"

        elif scenario_id == "scenario_enable_remote_logging":
            if vendor == "cisco":
                return config_text + "\nlogging host 10.100.20.50\nservice timestamps log datetime msec\n"
            elif vendor == "juniper":
                return config_text + "\nset system syslog host 10.100.20.50 any notice\nset system syslog time-format millisecond\n"
            elif vendor == "fortinet":
                return config_text + "\nconfig log syslogd setting\n set status enable\n set server 10.100.20.50\n set format rfc5424\nend\n"
            elif vendor == "palo_alto":
                return config_text + "\nset shared log-settings syslog SIEM-FORWARDER server 10.100.20.50\n"

        elif scenario_id == "scenario_enforce_password_policy":
            if vendor == "cisco":
                return config_text + "\nsecurity passwords min-length 15\nenable algorithm-type sha-512 secret StrongSecret2026!\n"
            elif vendor == "juniper":
                return config_text + "\nset system login password minimum-length 15\nset system login password format sha-512\n"
            elif vendor == "fortinet":
                return config_text + "\nconfig system password-policy\n set status enable\n set min-length 15\nend\n"
            elif vendor == "palo_alto":
                return config_text + "\nset mgt-config password-complexity enabled yes minimum-length 15\n"

        elif scenario_id == "scenario_snmpv3_authpriv":
            if vendor == "cisco":
                res = config_text.replace("snmp-server community public", "! snmp-server community public removed")
                res = res.replace("snmp-server community private", "! snmp-server community private removed")
                res += "\nsnmp-server group SECGROUP v3 priv\nsnmp-server user secadmin SECGROUP v3 auth sha-256 AuthPass2026! priv aes 256 PrivPass2026!\n"
                return res
            elif vendor == "juniper":
                lines = [l for l in config_text.splitlines() if "snmp community" not in l]
                return "\n".join(lines) + "\nset snmp v3 usm local-engine user secadmin authentication-sha ...\n"
            elif vendor == "fortinet":
                return config_text + "\nconfig system snmp user\n edit secadmin\n set security-level auth-priv\n next\nend\n"
            elif vendor == "palo_alto":
                return config_text + "\nset deviceconfig system snmp-setting version v3 snmp-user secadmin\n"

        elif scenario_id == "scenario_session_timeout":
            if vendor == "cisco":
                return config_text + "\nline con 0\n exec-timeout 10 0\nline vty 0 15\n exec-timeout 10 0\n"
            elif vendor == "juniper":
                return config_text + "\nset system login idle-timeout 10\n"
            elif vendor == "fortinet":
                return config_text + "\nconfig system global\n set admintimeout 10\nend\n"
            elif vendor == "palo_alto":
                return config_text + "\nset deviceconfig setting management idle-timeout 10\n"

        elif scenario_id == "scenario_enable_centralized_aaa":
            if vendor == "cisco":
                return config_text + "\naaa new-model\naaa authentication login default group tacacs+ local\n"
            elif vendor == "juniper":
                return config_text + "\nset system authentication-order [ tacplus password ]\n"
            elif vendor == "fortinet":
                return config_text + "\nconfig user tacacs+\n edit TACACS-SRV\n set server 10.100.30.15\n next\nend\n"
            elif vendor == "palo_alto":
                return config_text + "\nset shared authentication-profile TACACS-AUTH-PROF method tacplus\n"

        return config_text

    def simulate(
        self,
        base_config: str,
        vendor: Optional[str] = None,
        scenario_id: Optional[str] = None,
        custom_patch: Optional[str] = None
    ) -> Dict[str, Any]:
        """Runs what-if simulation and computes projected compliance, risk, and finding deltas."""
        if not vendor or vendor == "unknown":
            vendor = self.loader.detect_vendor(base_config)

        simulated_config = self.apply_scenario_patch(base_config, vendor, scenario_id or "custom", custom_patch)

        # Baseline eval
        baseline_eval = self.evaluator.evaluate_configuration(base_config, vendor)
        # Simulated eval
        simulated_eval = self.evaluator.evaluate_configuration(simulated_config, vendor)

        base_score = baseline_eval["compliance_score"]
        sim_score = simulated_eval["compliance_score"]
        score_delta = round(sim_score - base_score, 1)

        base_risk = baseline_eval["device_risk_score"]
        sim_risk = simulated_eval["device_risk_score"]
        risk_delta = round(sim_risk - base_risk, 1)

        base_finding_ctrls = {f["control_id"] for f in baseline_eval["findings"]}
        sim_finding_ctrls = {f["control_id"] for f in simulated_eval["findings"]}

        resolved_findings = [f for f in baseline_eval["findings"] if f["control_id"] not in sim_finding_ctrls]
        new_findings = [f for f in simulated_eval["findings"] if f["control_id"] not in base_finding_ctrls]

        affected_controls = list(set([f["control_id"] for f in resolved_findings] + [f["control_id"] for f in new_findings]))

        return {
            "scenario_id": scenario_id or "custom_patch",
            "vendor": vendor,
            "baseline": {
                "compliance_score": base_score,
                "grade": baseline_eval["grade"],
                "risk_score": base_risk,
                "total_findings": len(baseline_eval["findings"]),
                "counts": baseline_eval["counts"]
            },
            "projected": {
                "compliance_score": sim_score,
                "grade": simulated_eval["grade"],
                "risk_score": sim_risk,
                "total_findings": len(simulated_eval["findings"]),
                "counts": simulated_eval["counts"]
            },
            "deltas": {
                "compliance_score_delta": score_delta,
                "risk_score_delta": risk_delta,
                "findings_resolved_count": len(resolved_findings),
                "new_findings_count": len(new_findings)
            },
            "resolved_findings": resolved_findings,
            "new_findings": new_findings,
            "affected_controls": affected_controls,
            "simulated_configuration_snippet": simulated_config[-300:] if len(simulated_config) > 300 else simulated_config
        }


# Singleton instance
whatif_simulator = WhatIfScenarioSimulator()
