from abc import ABC, abstractmethod
from typing import Dict, Any, List
import json
from pydantic import BaseModel, Field

class ExtractedFact(BaseModel):
    parameter: str
    value: Any
    confidence: float
    evidence: Dict[str, Any]

class AIExtractionResult(BaseModel):
    facts: List[ExtractedFact]
    unknown_commands: List[str]

class AIProvider(ABC):
    @abstractmethod
    async def extract_security_facts(self, raw_config: str, vendor: str) -> AIExtractionResult:
        pass

    @abstractmethod
    async def explain_finding(self, finding: Dict[str, Any]) -> str:
        pass

    @abstractmethod
    async def generate_remediation_explanation(self, control: Dict[str, Any], current_state: str) -> str:
        pass

class MockAIProvider(AIProvider):
    # Fallback/mock for testing
    async def extract_security_facts(self, raw_config: str, vendor: str) -> AIExtractionResult:
        return AIExtractionResult(
            facts=[ExtractedFact(
                parameter="management.ssh.version", 
                value=2, 
                confidence=0.9, 
                evidence={"line_start": 1, "line_end": 1, "source_text": "ip ssh version 2"}
            )],
            unknown_commands=[]
        )

    async def explain_finding(self, finding: Dict[str, Any]) -> str:
        return "This is a mock explanation."

    async def generate_remediation_explanation(self, control: Dict[str, Any], current_state: str) -> str:
        return "Please apply the mock remediation."

# I will implement GeminiProvider as an example in a separate file if needed.
