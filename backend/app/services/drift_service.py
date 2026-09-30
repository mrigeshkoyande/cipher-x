import difflib
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from app.models.db_models import Configuration, NormalizedFact, Device

class DriftService:
    @staticmethod
    def compare_configurations(db: Session, config_old: Configuration, config_new: Configuration) -> Dict[str, Any]:
        # Line-by-line diff
        lines_old = config_old.raw_content.splitlines()
        lines_new = config_new.raw_content.splitlines()
        
        diff = difflib.unified_diff(
            lines_old,
            lines_new,
            fromfile=f"v{config_old.version} ({config_old.filename})",
            tofile=f"v{config_new.version} ({config_new.filename})",
            lineterm=""
        )

        line_diff = []
        for line in diff:
            if line.startswith("+") and not line.startswith("+++"):
                line_diff.append({"type": "ADDED", "text": line[1:]})
            elif line.startswith("-") and not line.startswith("---"):
                line_diff.append({"type": "REMOVED", "text": line[1:]})
            elif not line.startswith("@@"):
                line_diff.append({"type": "UNCHANGED", "text": line})

        # Fact comparison
        facts_old = {f.parameter: f for f in config_old.facts}
        facts_new = {f.parameter: f for f in config_new.facts}

        added_facts = []
        removed_facts = []
        changed_facts = []

        for param, f_new in facts_new.items():
            if param not in facts_old:
                added_facts.append({
                    "parameter": param,
                    "value": f_new.value,
                    "category": f_new.category,
                    "line": f_new.start_line
                })
            else:
                f_old = facts_old[param]
                if f_old.value != f_new.value:
                    changed_facts.append({
                        "parameter": param,
                        "old_value": f_old.value,
                        "new_value": f_new.value,
                        "category": f_new.category,
                        "line": f_new.start_line
                    })

        for param, f_old in facts_old.items():
            if param not in facts_new:
                removed_facts.append({
                    "parameter": param,
                    "value": f_old.value,
                    "category": f_old.category,
                    "line": f_old.start_line
                })

        # Risk change assessment
        risk_change = "NO_CHANGE"
        if len(added_facts) > 0 or len(changed_facts) > 0 or len(removed_facts) > 0:
            # Check if security sensitive parameters changed
            sec_params = [p for p in list(facts_old.keys()) + list(facts_new.keys()) if "ssh" in p or "telnet" in p or "password" in p]
            if len(sec_params) > 0:
                risk_change = "CHANGED"

        return {
            "device_id": config_old.device_id,
            "config_id_old": config_old.id,
            "config_id_new": config_new.id,
            "version_old": config_old.version,
            "version_new": config_new.version,
            "added_facts": added_facts,
            "removed_facts": removed_facts,
            "changed_facts": changed_facts,
            "line_diff": line_diff[:100], # Cap at 100 for UI responsiveness
            "risk_change": risk_change,
            "affected_controls_count": len(added_facts) + len(changed_facts) + len(removed_facts)
        }
