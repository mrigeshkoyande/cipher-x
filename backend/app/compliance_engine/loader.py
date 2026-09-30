import json
import os
from pathlib import Path
from typing import Dict, List, Any, Optional

RULES_DIR = Path(__file__).parent / "rules"
FRAMEWORKS_DIR = Path(__file__).parent / "frameworks"
VENDOR_PACKS_DIR = Path(__file__).parent / "vendor_packs"


class ComplianceLoader:
    """Data-driven loader for frameworks, controls, and vendor packs."""

    def __init__(self):
        self.frameworks: Dict[str, Dict[str, Any]] = {}
        self.controls: Dict[str, Dict[str, Any]] = {}
        self.vendor_packs: Dict[str, Dict[str, Any]] = {}
        self.reload_all()

    def reload_all(self):
        self.load_frameworks()
        self.load_controls()
        self.load_vendor_packs()

    def load_frameworks(self):
        self.frameworks.clear()
        if not FRAMEWORKS_DIR.exists():
            return
        for file in FRAMEWORKS_DIR.glob("*.json"):
            try:
                with open(file, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    self.frameworks[data["id"]] = data
            except Exception as e:
                print(f"[ERROR] Failed to load framework {file}: {e}")

    def load_controls(self):
        self.controls.clear()
        if not RULES_DIR.exists():
            return
        for file in RULES_DIR.glob("*.json"):
            try:
                with open(file, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    if isinstance(data, list):
                        for ctrl in data:
                            self.controls[ctrl["id"]] = ctrl
                    elif isinstance(data, dict):
                        self.controls[data["id"]] = data
            except Exception as e:
                print(f"[ERROR] Failed to load control rule {file}: {e}")

    def load_vendor_packs(self):
        self.vendor_packs.clear()
        if not VENDOR_PACKS_DIR.exists():
            return
        for file in VENDOR_PACKS_DIR.glob("*.json"):
            try:
                with open(file, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    self.vendor_packs[data["vendor"].lower()] = data
            except Exception as e:
                print(f"[ERROR] Failed to load vendor pack {file}: {e}")

    def get_framework(self, framework_id: str) -> Optional[Dict[str, Any]]:
        return self.frameworks.get(framework_id)

    def get_control(self, control_id: str) -> Optional[Dict[str, Any]]:
        return self.controls.get(control_id)

    def get_vendor_pack(self, vendor: str) -> Optional[Dict[str, Any]]:
        return self.vendor_packs.get(vendor.lower())

    def detect_vendor(self, config_text: str) -> str:
        """Detect vendor from raw configuration snippet."""
        import re
        for vendor_name, pack in self.vendor_packs.items():
            patterns = pack.get("detection_patterns", [])
            for pattern in patterns:
                if re.search(pattern, config_text, re.MULTILINE | re.IGNORECASE):
                    return vendor_name
        # Fallbacks
        lower = config_text.lower()
        if "cisco" in lower or "line vty" in lower or "interface gigabitethernet" in lower:
            return "cisco"
        elif "juniper" in lower or "junos" in lower or "set system services" in lower:
            return "juniper"
        elif "fortinet" in lower or "fortios" in lower or "config firewall" in lower:
            return "fortinet"
        elif "palo alto" in lower or "pan-os" in lower or "set deviceconfig" in lower:
            return "palo_alto"
        return "unknown"


# Global singleton instance
compliance_loader = ComplianceLoader()
