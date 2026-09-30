import pytest
from app.compliance_engine.evaluator import compliance_evaluator
from app.compliance_engine.loader import compliance_loader


GOLDEN_CISCO_FIXTURE = {
    "input_config": """hostname Cisco-Golden-Router
ip ssh version 2
line vty 0 4
 transport input telnet ssh
snmp-server community public RO
""",
    "expected_vendor": "cisco",
    "expected_facts": {
        "ssh.version": 2,
        "telnet.enabled": True,
        "snmp.has_default_community": True
    },
    "expected_failed_controls": ["CTRL-TELNET-01", "CTRL-SNMP-01"],
    "expected_passed_controls": ["CTRL-SSH-01"]
}


GOLDEN_JUNIPER_FIXTURE = {
    "input_config": """system {
    host-name Juniper-Golden-MX;
    services {
        ssh {
            protocol-version v2;
        }
        web-management {
            https;
        }
    }
}
""",
    "expected_vendor": "juniper",
    "expected_facts": {
        "ssh.version": 2,
        "https.server_enabled": True
    },
    "expected_passed_controls": ["CTRL-SSH-01", "CTRL-HTTPS-01"]
}


def test_golden_cisco_regression():
    res = compliance_evaluator.evaluate_configuration(GOLDEN_CISCO_FIXTURE["input_config"], "cisco")
    facts = res["normalized_facts"]
    for k, v in GOLDEN_CISCO_FIXTURE["expected_facts"].items():
        assert facts.get(k) == v, f"Fact mismatch for {k}: expected {v}, got {facts.get(k)}"

    finding_ctrl_ids = [f["control_id"] for f in res["findings"]]
    for expected_fail in GOLDEN_CISCO_FIXTURE["expected_failed_controls"]:
        assert expected_fail in finding_ctrl_ids, f"Expected failed control {expected_fail} not found in findings"

    passed_ctrl_ids = [p["control_id"] for p in res["passed_controls"]]
    for expected_pass in GOLDEN_CISCO_FIXTURE["expected_passed_controls"]:
        assert expected_pass in passed_ctrl_ids, f"Expected passed control {expected_pass} not found in passed"


def test_golden_juniper_regression():
    res = compliance_evaluator.evaluate_configuration(GOLDEN_JUNIPER_FIXTURE["input_config"], "juniper")
    facts = res["normalized_facts"]
    for k, v in GOLDEN_JUNIPER_FIXTURE["expected_facts"].items():
        assert facts.get(k) == v, f"Fact mismatch for {k}: expected {v}, got {facts.get(k)}"

    passed_ctrl_ids = [p["control_id"] for p in res["passed_controls"]]
    for expected_pass in GOLDEN_JUNIPER_FIXTURE["expected_passed_controls"]:
        assert expected_pass in passed_ctrl_ids, f"Expected passed control {expected_pass} not found in passed"


def test_security_regression_unknown_never_pass():
    """Security rule: Unmapped or unknown parameters must NEVER silently PASS."""
    empty_config = "! empty dummy text with no parameters\n"
    res = compliance_evaluator.evaluate_configuration(empty_config, "cisco")
    # All controls requiring positive verification should either FAIL, WARN, or be marked UNKNOWN
    for result in res["all_results"]:
        if result["status"] == "PASS":
            # Only default-safe negative controls can be pass, but never positive security requirements
            assert result["control_id"] not in ["CTRL-SSH-01", "CTRL-AAA-01", "CTRL-LOG-01", "CTRL-NTP-01"]
