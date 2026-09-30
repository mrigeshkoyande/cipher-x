import pytest
from app.services.parser_service import VendorDetector, ParserEngine
from app.services.compliance_engine import ComplianceEngine

def test_vendor_detector():
    cisco_cfg = "hostname CORE-SW-01\nservice password-encryption\nip ssh version 2"
    vendor, platform, conf = VendorDetector.detect(cisco_cfg)
    assert vendor == "Cisco"
    assert platform == "IOS-XE"
    assert conf >= 0.90

def test_cisco_parser():
    cisco_cfg = """
hostname CORE-SW-01
service password-encryption
enable secret 9 $9$8aKx9k
ip ssh version 2
line vty 0 4
 transport input telnet ssh
logging host 10.0.100.50
"""
    vendor, platform, conf, facts = ParserEngine.parse_configuration(cisco_cfg)
    assert vendor == "Cisco"
    assert len(facts) >= 4

    ssh_facts = [f for f in facts if f.parameter == "management.ssh.version"]
    assert len(ssh_facts) == 1
    assert ssh_facts[0].value == 2

    telnet_facts = [f for f in facts if f.parameter == "management.telnet.enabled"]
    assert len(telnet_facts) == 1
    assert telnet_facts[0].value == True

def test_compliance_operators():
    assert ComplianceEngine.evaluate_operator("EQUALS", 2, 2) is True
    assert ComplianceEngine.evaluate_operator("EQUALS", False, True) is False
    assert ComplianceEngine.evaluate_operator("NOT_EQUALS", True, False) is True
    assert ComplianceEngine.evaluate_operator("GREATER_THAN", 10, 5) is True
    assert ComplianceEngine.evaluate_operator("CONTAINS", ["ssh", "telnet"], "telnet") is True
