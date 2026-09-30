import difflib
import re
from typing import Dict, List, Any, Optional
from app.compliance_engine.evaluator import compliance_evaluator
from app.compliance_engine.loader import compliance_loader


class DriftItem:
    def __init__(
        self,
        change_type: str,  # ADDED, REMOVED, MODIFIED
        description: str,
        security_significance: str,  # CRITICAL, HIGH, MEDIUM, LOW, INFORMATIONAL
        affected_controls: List[str],
        before_snippet: str,
        after_snippet: str,
        risk_delta: float
    ):
        self.change_type = change_type
        self.description = description
        self.security_significance = security_significance
        self.affected_controls = affected_controls
        self.before_snippet = before_snippet
        self.after_snippet = after_snippet
        self.risk_delta = risk_delta

    def to_dict(self) -> Dict[str, Any]:
        return {
            "change_type": self.change_type,
            "description": self.description,
            "security_significance": self.security_significance,
            "affected_controls": self.affected_controls,
            "before_snippet": self.before_snippet,
            "after_snippet": self.after_snippet,
            "risk_delta": self.risk_delta
        }


class DriftIntelligenceService:
    """Analyzes configuration changes and evaluates security-relevant drift beyond plain text diffs."""

    def __init__(self):
        self.evaluator = compliance_evaluator
        self.loader = compliance_loader

    def analyze_drift(
        self,
        old_config: str,
        new_config: str,
        vendor: Optional[str] = None
    ) -> Dict[str, Any]:
        if not vendor or vendor == "unknown":
            vendor = self.loader.detect_vendor(new_config)

        # 1. Run compliance evaluations on both versions
        old_eval = self.evaluator.evaluate_configuration(old_config, vendor)
        new_eval = self.evaluator.evaluate_configuration(new_config, vendor)

        old_facts = old_eval.get("normalized_facts", {})
        new_facts = new_eval.get("normalized_facts", {})

        old_score = old_eval.get("compliance_score", 0.0)
        new_score = new_eval.get("compliance_score", 0.0)
        score_delta = round(new_score - old_score, 1)

        old_risk = old_eval.get("device_risk_score", 0.0)
        new_risk = new_eval.get("device_risk_score", 0.0)
        risk_delta = round(new_risk - old_risk, 1)

        drift_items: List[DriftItem] = []

        # 2. Fact-based semantic drift detection
        all_fact_keys = set(old_facts.keys()).union(set(new_facts.keys()))
        for key in all_fact_keys:
            val_before = old_facts.get(key)
            val_after = new_facts.get(key)

            if val_before != val_after:
                # Find matching controls
                affected_ctrls = []
                for cid, cdata in self.loader.controls.items():
                    if cdata.get("normalized_fact_key") == key:
                        affected_ctrls.append(cid)

                # Determine significance
                if key in ["telnet.enabled", "aaa.centralized_enabled", "firewall.stateful_inspection_enabled"]:
                    sig = "CRITICAL"
                    r_delta = 25.0 if val_after is True and "telnet" in key else -25.0
                elif key in ["ssh.version", "ssh.enabled", "snmp.version", "logging.remote_server_configured", "password.strong_hashing_enabled"]:
                    sig = "HIGH"
                    r_delta = 15.0
                elif key in ["session.inactivity_timeout_minutes", "ntp.configured", "acl.configured_with_default_deny"]:
                    sig = "MEDIUM"
                    r_delta = 8.0
                else:
                    sig = "LOW"
                    r_delta = 3.0

                drift_items.append(
                    DriftItem(
                        change_type="MODIFIED" if val_before is not None and val_after is not None else ("ADDED" if val_before is None else "REMOVED"),
                        description=f"Security parameter '{key}' changed from '{val_before}' to '{val_after}'.",
                        security_significance=sig,
                        affected_controls=affected_ctrls,
                        before_snippet=f"{key}: {val_before}",
                        after_snippet=f"{key}: {val_after}",
                        risk_delta=r_delta
                    )
                )

        # 3. Raw line diff for cosmetic / contextual tracking
        old_lines = old_config.splitlines(keepends=True)
        new_lines = new_config.splitlines(keepends=True)
        diff = list(difflib.unified_diff(old_lines, new_lines, fromfile="baseline_config", tofile="current_config", n=2))
        raw_diff_text = "".join(diff)

        # Classify cosmetic changes (e.g. descriptions, comments, interface names without security impact)
        cosmetic_changes = []
        for line in diff:
            if (line.startswith("+") or line.startswith("-")) and not line.startswith("+++") and not line.startswith("---"):
                clean = line[1:].strip()
                if clean.startswith("!") or clean.startswith("#") or "description" in clean.lower():
                    cosmetic_changes.append(clean)

        # Determine overall drift security level
        critical_count = sum(1 for d in drift_items if d.security_significance == "CRITICAL")
        high_count = sum(1 for d in drift_items if d.security_significance == "HIGH")

        if critical_count > 0:
            drift_severity = "CRITICAL"
        elif high_count > 0:
            drift_severity = "HIGH"
        elif len(drift_items) > 0:
            drift_severity = "MEDIUM"
        elif len(cosmetic_changes) > 0:
            drift_severity = "INFORMATIONAL"
        else:
            drift_severity = "NONE"

        return {
            "vendor": vendor,
            "drift_severity": drift_severity,
            "has_security_drift": len(drift_items) > 0,
            "score_before": old_score,
            "score_after": new_score,
            "score_delta": score_delta,
            "risk_before": old_risk,
            "risk_after": new_risk,
            "risk_delta": risk_delta,
            "drift_items": [d.to_dict() for d in drift_items],
            "cosmetic_changes_count": len(cosmetic_changes),
            "cosmetic_samples": cosmetic_changes[:5],
            "raw_diff": raw_diff_text,
            "new_findings_introduced": [
                f for f in new_eval.get("findings", [])
                if f["control_id"] not in [of["control_id"] for of in old_eval.get("findings", [])]
            ],
            "findings_resolved": [
                of for of in old_eval.get("findings", [])
                if of["control_id"] not in [nf["control_id"] for nf in new_eval.get("findings", [])]
            ]
        }


# Singleton instance
drift_intelligence = DriftIntelligenceService()
