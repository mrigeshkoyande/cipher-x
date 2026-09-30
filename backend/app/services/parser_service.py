import re
from typing import Dict, Any, List, Tuple, Optional

class RawFact:
    def __init__(self, category: str, parameter: str, value: Any, raw_text: str, start_line: int, end_line: int, confidence: float = 1.0, is_unknown: bool = False, raw_command: str = ""):
        self.category = category
        self.parameter = parameter
        self.value = value
        self.raw_text = raw_text
        self.start_line = start_line
        self.end_line = end_line
        self.confidence = confidence
        self.is_unknown = is_unknown
        self.raw_command = raw_command

class VendorDetector:
    @staticmethod
    def detect(content: str) -> Tuple[str, str, float]:
        """Detect vendor, platform, and confidence score."""
        content_lower = content.lower()
        
        # Cisco IOS / IOS-XE
        if "version 1" in content_lower or "service password-encryption" in content_lower or "line vty" in content_lower or "ios-xe" in content_lower or "cisco" in content_lower:
            return "Cisco", "IOS-XE", 0.98
        
        # Juniper Junos
        if "system {" in content_lower or "interfaces {" in content_lower or "set system" in content_lower or "juniper" in content_lower or "junos" in content_lower:
            return "Juniper", "Junos", 0.96
        
        # Fortinet FortiOS
        if "config system" in content_lower or "config firewall" in content_lower or "fortigate" in content_lower or "fortios" in content_lower:
            return "Fortinet", "FortiOS", 0.97
        
        # Palo Alto PAN-OS
        if "set deviceconfig" in content_lower or "set network" in content_lower or "paloalto" in content_lower or "pan-os" in content_lower:
            return "Palo Alto", "PAN-OS", 0.95
        
        return "Generic Network Vendor", "Generic CLI", 0.50

class BaseVendorAdapter:
    def parse(self, lines: List[str]) -> List[RawFact]:
        raise NotImplementedError

class CiscoAdapter(BaseVendorAdapter):
    def parse(self, lines: List[str]) -> List[RawFact]:
        facts: List[RawFact] = []
        
        # Track SSH, Telnet, Passwords, SNMP, Logging, NTP, Password policy
        in_line_vty = False
        vty_start = 0
        vty_lines = []
        
        for idx, line in enumerate(lines, 1):
            stripped = line.strip()
            if not stripped or stripped.startswith("!"):
                continue
            
            # SSH Version
            m_ssh = re.match(r"^ip\s+ssh\s+version\s+(\d+)", stripped, re.IGNORECASE)
            if m_ssh:
                val = int(m_ssh.group(1))
                facts.append(RawFact("management", "management.ssh.version", val, line, idx, idx, 1.0))
                facts.append(RawFact("management", "management.ssh.enabled", True, line, idx, idx, 1.0))
            
            # Service password encryption
            if "service password-encryption" in stripped:
                facts.append(RawFact("password_policy", "password_policy.encryption_enabled", True, line, idx, idx, 1.0))
            
            # Enable secret / password
            if stripped.startswith("enable secret"):
                facts.append(RawFact("authentication", "authentication.enable_secret_configured", True, line, idx, idx, 1.0))
            elif stripped.startswith("enable password"):
                facts.append(RawFact("authentication", "authentication.enable_secret_configured", False, line, idx, idx, 1.0))
            
            # Logging
            if stripped.startswith("logging host") or stripped.startswith("logging server"):
                facts.append(RawFact("logging", "logging.remote_server_configured", True, line, idx, idx, 1.0))
            
            # SNMP
            if "snmp-server community" in stripped:
                if "rw" in stripped.lower():
                    facts.append(RawFact("snmp", "snmp.read_write_community_enabled", True, line, idx, idx, 1.0))
                else:
                    facts.append(RawFact("snmp", "snmp.community_configured", True, line, idx, idx, 1.0))
            
            # Line vty transport input
            if stripped.startswith("line vty"):
                in_line_vty = True
                vty_start = idx
                vty_lines = [line]
            elif in_line_vty:
                vty_lines.append(line)
                if stripped.startswith("transport input"):
                    if "telnet" in stripped:
                        facts.append(RawFact("management", "management.telnet.enabled", True, "\n".join(vty_lines), vty_start, idx, 1.0))
                    else:
                        facts.append(RawFact("management", "management.telnet.enabled", False, "\n".join(vty_lines), vty_start, idx, 1.0))
                    in_line_vty = False
                elif stripped.startswith("line ") or stripped.startswith("!") or idx == len(lines):
                    in_line_vty = False

            # Unknown custom command simulation check
            if "custom-sec-proto" in stripped or "legacy-admin" in stripped:
                facts.append(RawFact("management", "management.unknown_custom_protocol", True, line, idx, idx, 0.65, is_unknown=True, raw_command=stripped))

        # Default SSH/Telnet checks if not explicitly found
        has_telnet = any(f.parameter == "management.telnet.enabled" for f in facts)
        if not has_telnet:
            # If no line vty transport input telnet found, default to false or check
            pass

        return facts

class JuniperAdapter(BaseVendorAdapter):
    def parse(self, lines: List[str]) -> List[RawFact]:
        facts: List[RawFact] = []
        for idx, line in enumerate(lines, 1):
            stripped = line.strip()
            if not stripped or stripped.startswith("#") or stripped.startswith("/*"):
                continue
            
            if "system services ssh" in stripped:
                facts.append(RawFact("management", "management.ssh.enabled", True, line, idx, idx, 1.0))
                facts.append(RawFact("management", "management.ssh.version", 2, line, idx, idx, 1.0))
            if "system services telnet" in stripped:
                facts.append(RawFact("management", "management.telnet.enabled", True, line, idx, idx, 1.0))
            if "system syslog host" in stripped:
                facts.append(RawFact("logging", "logging.remote_server_configured", True, line, idx, idx, 1.0))
            if "juniper-custom-admin" in stripped:
                facts.append(RawFact("management", "management.juniper_custom_admin", True, line, idx, idx, 0.60, is_unknown=True, raw_command=stripped))

        return facts

class FortinetAdapter(BaseVendorAdapter):
    def parse(self, lines: List[str]) -> List[RawFact]:
        facts: List[RawFact] = []
        for idx, line in enumerate(lines, 1):
            stripped = line.strip()
            if "set allowaccess" in stripped:
                if "ssh" in stripped:
                    facts.append(RawFact("management", "management.ssh.enabled", True, line, idx, idx, 1.0))
                if "telnet" in stripped:
                    facts.append(RawFact("management", "management.telnet.enabled", True, line, idx, idx, 1.0))
                else:
                    facts.append(RawFact("management", "management.telnet.enabled", False, line, idx, idx, 1.0))
            if "config log syslogd" in stripped or "set status enable" in stripped:
                facts.append(RawFact("logging", "logging.remote_server_configured", True, line, idx, idx, 1.0))

        return facts

class PaloAltoAdapter(BaseVendorAdapter):
    def parse(self, lines: List[str]) -> List[RawFact]:
        facts: List[RawFact] = []
        for idx, line in enumerate(lines, 1):
            stripped = line.strip()
            if "set deviceconfig system service disable-telnet yes" in stripped:
                facts.append(RawFact("management", "management.telnet.enabled", False, line, idx, idx, 1.0))
            elif "set deviceconfig system service enable-telnet yes" in stripped:
                facts.append(RawFact("management", "management.telnet.enabled", True, line, idx, idx, 1.0))
            if "set deviceconfig system service disable-ssh no" in stripped or "ssh" in stripped:
                facts.append(RawFact("management", "management.ssh.enabled", True, line, idx, idx, 1.0))

        return facts

class ParserEngine:
    @staticmethod
    def parse_configuration(raw_content: str) -> Tuple[str, str, float, List[RawFact]]:
        vendor, platform, confidence = VendorDetector.detect(raw_content)
        lines = raw_content.splitlines()
        
        if vendor == "Cisco":
            adapter = CiscoAdapter()
        elif vendor == "Juniper":
            adapter = JuniperAdapter()
        elif vendor == "Fortinet":
            adapter = FortinetAdapter()
        elif vendor == "Palo Alto":
            adapter = PaloAltoAdapter()
        else:
            adapter = CiscoAdapter() # Fallback to Cisco style
            
        facts = adapter.parse(lines)
        return vendor, platform, confidence, facts
