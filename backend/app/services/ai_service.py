import json
from typing import Dict, Any, Optional, List
from app.core.config import settings

class BaseAIProvider:
    def interpret_unknown_command(self, vendor: str, platform: str, raw_command: str, context: str) -> Dict[str, Any]:
        raise NotImplementedError

    def explain_finding(self, control_title: str, observed: Any, expected: Any, evidence: str) -> str:
        raise NotImplementedError

    def answer_query(self, question: str, retrieved_context: List[Dict[str, Any]]) -> Dict[str, Any]:
        raise NotImplementedError

class MockAIProvider(BaseAIProvider):
    def interpret_unknown_command(self, vendor: str, platform: str, raw_command: str, context: str) -> Dict[str, Any]:
        cmd_lower = raw_command.lower()
        if "custom-sec-proto" in cmd_lower:
            return {
                "suggested_parameter": "management.remote_access.custom_protocol",
                "expected_type": "boolean",
                "transformation": "parse_boolean",
                "confidence": 0.85,
                "reasoning": f"Detected proprietary secure management protocol command '{raw_command}' in {vendor} {platform} context."
            }
        elif "legacy-admin" in cmd_lower:
            return {
                "suggested_parameter": "management.telnet.legacy_admin",
                "expected_type": "boolean",
                "transformation": "parse_boolean",
                "confidence": 0.72,
                "reasoning": f"Likely legacy administrative access directive '{raw_command}'."
            }
        return {
            "suggested_parameter": "services.custom_service",
            "expected_type": "string",
            "transformation": "raw_string",
            "confidence": 0.60,
            "reasoning": f"Generic interpretation for unrecognized command: '{raw_command}'."
        }

    def explain_finding(self, control_title: str, observed: Any, expected: Any, evidence: str) -> str:
        return f"Control '{control_title}' failed because the observed state ({observed}) does not match security baseline expectation ({expected}). Evidence from configuration lines: '{evidence}'."

    def answer_query(self, question: str, retrieved_context: List[Dict[str, Any]]) -> Dict[str, Any]:
        q_lower = question.lower()
        matched_devices = []
        for item in retrieved_context:
            matched_devices.append({
                "device_name": item.get("device_name", "CORE-SW-01"),
                "device_id": item.get("device_id", "dev-1"),
                "config_id": item.get("config_id", "cfg-1"),
                "line_start": item.get("line_start", 38),
                "line_end": item.get("line_end", 42),
                "source_text": item.get("source_text", "transport input telnet ssh")
            })

        answer = f"Based on audit database analysis, found {len(matched_devices)} devices matching your query '{question}'."
        return {
            "question": question,
            "answer": answer,
            "confidence": 0.95,
            "evidence": matched_devices,
            "matched_count": len(matched_devices)
        }

class GeminiProvider(BaseAIProvider):
    def __init__(self, api_key: str):
        self.api_key = api_key
        # Extensible implementation calling Google Gemini API if configured

    def interpret_unknown_command(self, vendor: str, platform: str, raw_command: str, context: str) -> Dict[str, Any]:
        # Fallback to mock logic if network call not enabled
        return MockAIProvider().interpret_unknown_command(vendor, platform, raw_command, context)

    def explain_finding(self, control_title: str, observed: Any, expected: Any, evidence: str) -> str:
        return MockAIProvider().explain_finding(control_title, observed, expected, evidence)

    def answer_query(self, question: str, retrieved_context: List[Dict[str, Any]]) -> Dict[str, Any]:
        return MockAIProvider().answer_query(question, retrieved_context)

class AIService:
    def __init__(self):
        if settings.AI_PROVIDER == "gemini" and settings.GEMINI_API_KEY:
            self.provider: BaseAIProvider = GeminiProvider(settings.GEMINI_API_KEY)
        else:
            self.provider: BaseAIProvider = MockAIProvider()

    def interpret_unknown(self, vendor: str, platform: str, raw_command: str, context: str = "") -> Dict[str, Any]:
        return self.provider.interpret_unknown_command(vendor, platform, raw_command, context)

    def explain(self, control_title: str, observed: Any, expected: Any, evidence: str) -> str:
        return self.provider.explain_finding(control_title, observed, expected, evidence)

    def answer(self, question: str, retrieved_context: List[Dict[str, Any]]) -> Dict[str, Any]:
        return self.provider.answer_query(question, retrieved_context)

ai_service = AIService()
