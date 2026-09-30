import re
from typing import Dict, List, Any, Optional, Tuple
from app.compliance_engine.loader import compliance_loader


class EvaluationEvidence:
    def __init__(self, line_number: Optional[int], raw_text: str, fact_key: str, extracted_value: Any, confidence: float = 1.0):
        self.line_number = line_number
        self.raw_text = raw_text
        self.fact_key = fact_key
        self.extracted_value = extracted_value
        self.confidence = confidence

    def to_dict(self) -> Dict[str, Any]:
        return {
            "line_number": self.line_number,
            "raw_text": self.raw_text,
            "fact_key": self.fact_key,
            "extracted_value": self.extracted_value,
            "confidence": self.confidence
        }


class ControlEvaluationResult:
    def __init__(
        self,
        control_id: str,
        title: str,
        severity: str,
        category: str,
        status: str,  # PASS, FAIL, WARNING, REVIEW, UNKNOWN
        explanation: str,
        evidence: List[Dict[str, Any]],
        normalized_fact: Dict[str, Any],
        remediation: Optional[Dict[str, Any]] = None,
        confidence: float = 1.0,
        risk_score: float = 0.0
    ):
        self.control_id = control_id
        self.title = title
        self.severity = severity
        self.category = category
        self.status = status
        self.explanation = explanation
        self.evidence = evidence
        self.normalized_fact = normalized_fact
        self.remediation = remediation
        self.confidence = confidence
        self.risk_score = risk_score

    def to_dict(self) -> Dict[str, Any]:
        return {
            "control_id": self.control_id,
            "title": self.title,
            "severity": self.severity,
            "category": self.category,
            "status": self.status,
            "explanation": self.explanation,
            "evidence": self.evidence,
            "normalized_fact": self.normalized_fact,
            "remediation": self.remediation,
            "confidence": self.confidence,
            "risk_score": self.risk_score
        }


class ComplianceEvaluator:
    """Core Compliance & Security Analytics Engine."""

    def __init__(self):
        self.loader = compliance_loader

    def extract_normalized_facts(self, config_text: str, vendor: str) -> Tuple[Dict[str, Any], List[EvaluationEvidence]]:
        """Parses configuration lines and extracts normalized parameter facts with source line evidence."""
        pack = self.loader.get_vendor_pack(vendor)
        facts: Dict[str, Any] = {}
        evidences: List[EvaluationEvidence] = []

        if not pack:
            # Vendor pack not found - return empty
            return facts, evidences

        extractors = pack.get("parameter_extractors", {})
        lines = config_text.splitlines()

        for fact_key, rule in extractors.items():
            patterns = rule.get("patterns", [])
            negative_patterns = rule.get("negative_patterns", [])
            default_val = rule.get("default", None)
            is_inverse = rule.get("is_inverse", False)

            matched_val = None
            found_evidence: Optional[EvaluationEvidence] = None

            # First check full multiline regex patterns if applicable
            for pattern in patterns:
                # Check line by line to accurately pin the line number
                for line_idx, line in enumerate(lines, start=1):
                    match = re.search(pattern, line, re.IGNORECASE)
                    if match:
                        if "val" in match.groupdict():
                            raw_group = match.group("val")
                            # Convert to int if digits
                            matched_val = int(raw_group) if raw_group.isdigit() else raw_group
                        else:
                            matched_val = False if is_inverse else True
                        found_evidence = EvaluationEvidence(
                            line_number=line_idx,
                            raw_text=line.strip(),
                            fact_key=fact_key,
                            extracted_value=matched_val,
                            confidence=0.98
                        )
                        break
                if found_evidence:
                    break

            # If not found line-by-line, check multiline config block
            if found_evidence is None:
                for pattern in patterns:
                    match = re.search(pattern, config_text, re.MULTILINE | re.IGNORECASE)
                    if match:
                        if "val" in match.groupdict():
                            raw_group = match.group("val")
                            matched_val = int(raw_group) if raw_group.isdigit() else raw_group
                        else:
                            matched_val = False if is_inverse else True
                        found_evidence = EvaluationEvidence(
                            line_number=None,
                            raw_text=match.group(0)[:120],
                            fact_key=fact_key,
                            extracted_value=matched_val,
                            confidence=0.92
                        )
                        break

            # Check negative patterns
            if negative_patterns:
                for neg_pattern in negative_patterns:
                    for line_idx, line in enumerate(lines, start=1):
                        match = re.search(neg_pattern, line, re.IGNORECASE)
                        if match:
                            matched_val = False
                            found_evidence = EvaluationEvidence(
                                line_number=line_idx,
                                raw_text=line.strip(),
                                fact_key=fact_key,
                                extracted_value=False,
                                confidence=0.98
                            )
                            break
                    if found_evidence:
                        break

            if found_evidence is not None:
                facts[fact_key] = matched_val
                evidences.append(found_evidence)
            else:
                facts[fact_key] = default_val

        return facts, evidences

    def evaluate_condition(self, actual: Any, operator: str, expected: Any) -> bool:
        if actual is None:
            return False

        if operator == "equals":
            return str(actual).lower() == str(expected).lower()
        elif operator == "not_equals":
            return str(actual).lower() != str(expected).lower()
        elif operator == "is_true":
            return bool(actual) is True
        elif operator == "is_false":
            return bool(actual) is False
        elif operator == "greater_than_or_equal":
            try:
                return float(actual) >= float(expected)
            except (ValueError, TypeError):
                return False
        elif operator == "less_than_or_equal":
            try:
                return float(actual) <= float(expected)
            except (ValueError, TypeError):
                return False
        elif operator == "in_list":
            if isinstance(expected, list):
                return str(actual).lower() in [str(x).lower() for x in expected]
            return False
        elif operator == "contains":
            return str(expected).lower() in str(actual).lower()
        return False

    def evaluate_configuration(
        self,
        config_text: str,
        vendor: Optional[str] = None,
        framework_ids: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        """Runs the complete compliance evaluation, risk assessment, and score explanation."""
        if not vendor or vendor == "unknown":
            vendor = self.loader.detect_vendor(config_text)

        vendor_pack = self.loader.get_vendor_pack(vendor)
        remediations_dict = vendor_pack.get("remediations", {}) if vendor_pack else {}

        facts, evidences = self.extract_normalized_facts(config_text, vendor)

        # Build evidence lookup
        evidence_by_key = {}
        for ev in evidences:
            evidence_by_key[ev.fact_key] = ev.to_dict()

        # Determine target controls
        target_control_ids = set()
        if framework_ids:
            for fw_id in framework_ids:
                fw = self.loader.get_framework(fw_id)
                if fw:
                    for ctrl_ref in fw.get("control_mappings", {}).values():
                        target_control_ids.add(ctrl_ref)
        else:
            target_control_ids = set(self.loader.controls.keys())

        results: List[ControlEvaluationResult] = []
        counts = {"PASS": 0, "FAIL": 0, "WARNING": 0, "REVIEW": 0, "UNKNOWN": 0}
        severity_counts = {"CRITICAL": 0, "HIGH": 0, "MEDIUM": 0, "LOW": 0, "UNKNOWN": 0}

        for ctrl_id in sorted(target_control_ids):
            ctrl = self.loader.get_control(ctrl_id)
            if not ctrl:
                continue

            title = ctrl.get("title", ctrl_id)
            severity = ctrl.get("severity", "MEDIUM")
            category = ctrl.get("category", "General Security")
            fact_key = ctrl.get("normalized_fact_key")
            operator = ctrl.get("operator")
            expected_val = ctrl.get("expected_value")
            rem_ref = ctrl.get("remediation_ref")
            remediation = remediations_dict.get(rem_ref) if rem_ref else None

            # Calculate individual risk weighting
            sev_weights = {"CRITICAL": 25.0, "HIGH": 15.0, "MEDIUM": 8.0, "LOW": 3.0}
            base_risk = sev_weights.get(severity, 5.0)

            actual_val = facts.get(fact_key)
            matching_ev = evidence_by_key.get(fact_key)
            ev_list = [matching_ev] if matching_ev else []

            # Check if fact was extractable or unknown
            if actual_val is None:
                status = "UNKNOWN"
                explanation = f"Could not determine status: parameter '{fact_key}' was not found or syntax is unmapped for vendor '{vendor}'."
                counts["UNKNOWN"] += 1
                severity_counts["UNKNOWN"] += 1
                ctrl_risk = base_risk * 0.4
                confidence = 0.5
            else:
                passed = self.evaluate_condition(actual_val, operator, expected_val)

                # Fallback condition check if defined
                if not passed and "fallback_fact_key" in ctrl:
                    fallback_key = ctrl["fallback_fact_key"]
                    fallback_op = ctrl.get("fallback_operator", "is_true")
                    if self.evaluate_condition(facts.get(fallback_key), fallback_op, True):
                        status = "WARNING"
                        explanation = ctrl.get("warning_message", "Partially compliant.")
                        counts["WARNING"] += 1
                        ctrl_risk = base_risk * 0.3
                        confidence = 0.85
                    else:
                        status = "FAIL"
                        explanation = ctrl.get("failure_message", f"Failed requirement: expected '{expected_val}', got '{actual_val}'.")
                        counts["FAIL"] += 1
                        severity_counts[severity] += 1
                        ctrl_risk = base_risk
                        confidence = 0.95
                elif passed:
                    # Secondary check if present
                    if "secondary_check" in ctrl:
                        sec = ctrl["secondary_check"]
                        sec_val = facts.get(sec["fact_key"])
                        sec_passed = self.evaluate_condition(sec_val, sec["operator"], sec["expected_value"])
                        if not sec_passed:
                            status = "WARNING"
                            explanation = ctrl.get("warning_message", f"Primary condition passed, but secondary condition '{sec['fact_key']}' requires review.")
                            counts["WARNING"] += 1
                            ctrl_risk = base_risk * 0.4
                            confidence = 0.90
                        else:
                            status = "PASS"
                            explanation = f"Passed: parameter '{fact_key}' satisfied requirement ({actual_val})."
                            counts["PASS"] += 1
                            ctrl_risk = 0.0
                            confidence = 0.98
                    else:
                        status = "PASS"
                        explanation = f"Passed: parameter '{fact_key}' satisfied requirement ({actual_val})."
                        counts["PASS"] += 1
                        ctrl_risk = 0.0
                        confidence = 0.98
                else:
                    status = "FAIL"
                    explanation = ctrl.get("failure_message", f"Failed requirement: expected '{expected_val}', got '{actual_val}'.")
                    counts["FAIL"] += 1
                    severity_counts[severity] += 1
                    ctrl_risk = base_risk
                    confidence = 0.95

            results.append(
                ControlEvaluationResult(
                    control_id=ctrl_id,
                    title=title,
                    severity=severity,
                    category=category,
                    status=status,
                    explanation=explanation,
                    evidence=ev_list,
                    normalized_fact={"key": fact_key, "value": actual_val},
                    remediation=remediation,
                    confidence=confidence,
                    risk_score=ctrl_risk
                )
            )

        # Transparent Explainable Compliance Score calculation
        total_applicable = len(results)
        if total_applicable > 0:
            raw_score = ((counts["PASS"] * 1.0) + (counts["WARNING"] * 0.5)) / total_applicable * 100.0
            compliance_score = round(raw_score, 1)
        else:
            compliance_score = 0.0

        # Letter Grade
        if compliance_score >= 90.0:
            grade = "A"
        elif compliance_score >= 80.0:
            grade = "B"
        elif compliance_score >= 70.0:
            grade = "C"
        elif compliance_score >= 60.0:
            grade = "D"
        else:
            grade = "F"

        # Explainable Score Breakdown
        score_explanation = (
            f"Compliance Score: {compliance_score}% (Grade {grade}). "
            f"Out of {total_applicable} applicable controls: {counts['PASS']} PASSED (100% weight), "
            f"{counts['WARNING']} WARNINGS (50% weight), {counts['FAIL']} FAILED (0% weight), and "
            f"{counts['UNKNOWN']} UNKNOWN/UNMAPPED. "
        )
        if counts["UNKNOWN"] > 0:
            score_explanation += f"Notice: {counts['UNKNOWN']} control(s) could not be determined with high certainty and require manual review."

        # Overall Device Risk Score (0-100 scale)
        total_raw_risk = sum(r.risk_score for r in results)
        device_risk_score = min(100.0, round(total_raw_risk, 1))

        # Device Risk Level
        if device_risk_score >= 70:
            device_risk_level = "CRITICAL"
        elif device_risk_score >= 40:
            device_risk_level = "HIGH"
        elif device_risk_score >= 20:
            device_risk_level = "MEDIUM"
        else:
            device_risk_level = "LOW"

        # Framework Breakdown
        framework_scores = {}
        for fw_id, fw in self.loader.frameworks.items():
            fw_mappings = fw.get("control_mappings", {})
            mapped_ctrls = set(fw_mappings.values())
            fw_results = [r for r in results if r.control_id in mapped_ctrls]
            if fw_results:
                fw_passed = sum(1 for r in fw_results if r.status == "PASS")
                fw_warn = sum(1 for r in fw_results if r.status == "WARNING")
                fw_score = round(((fw_passed * 1.0) + (fw_warn * 0.5)) / len(fw_results) * 100.0, 1)
                framework_scores[fw_id] = {
                    "name": fw.get("name", fw_id),
                    "score": fw_score,
                    "total": len(fw_results),
                    "passed": fw_passed,
                    "failed": sum(1 for r in fw_results if r.status == "FAIL"),
                    "warning": fw_warn,
                    "unknown": sum(1 for r in fw_results if r.status == "UNKNOWN")
                }

        return {
            "vendor": vendor,
            "total_applicable_controls": total_applicable,
            "counts": counts,
            "severity_counts": severity_counts,
            "compliance_score": compliance_score,
            "grade": grade,
            "score_explanation": score_explanation,
            "device_risk_score": device_risk_score,
            "device_risk_level": device_risk_level,
            "normalized_facts": facts,
            "evidences": [e.to_dict() for e in evidences],
            "findings": [r.to_dict() for r in results if r.status in ["FAIL", "WARNING", "UNKNOWN"]],
            "passed_controls": [r.to_dict() for r in results if r.status == "PASS"],
            "all_results": [r.to_dict() for r in results],
            "framework_scores": framework_scores
        }


# Global evaluator singleton
compliance_evaluator = ComplianceEvaluator()
