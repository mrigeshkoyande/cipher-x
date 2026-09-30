from pydantic import BaseModel, Field
from typing import Optional, List, Any, Dict
from datetime import datetime

# --- Auth Schemas ---
class TokenSchema(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: str
    username: str
    role: str
    tenant_id: str

class LoginRequest(BaseModel):
    username: str
    password: str
    tenant_id: Optional[str] = "tenant_default"

class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    role: str = "SECURITY_ANALYST"
    tenant_id: Optional[str] = "tenant_default"

class UserResponse(BaseModel):
    id: str
    tenant_id: str
    username: str
    email: str
    role: str
    created_at: datetime
    
    class Config:
        from_attributes = True

# --- Device Schemas ---
class DeviceCreate(BaseModel):
    name: str
    vendor: str # Cisco, Juniper, Fortinet, Palo Alto
    platform: str # IOS-XE, Junos, FortiOS, PAN-OS
    os_version: Optional[str] = None
    ip_address: Optional[str] = None

class DeviceResponse(BaseModel):
    id: str
    tenant_id: str
    name: str
    vendor: str
    platform: str
    os_version: Optional[str] = None
    ip_address: Optional[str] = None
    status: str
    compliance_score: float
    risk_level: str
    last_scanned_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True

# --- Configuration & Fact Schemas ---
class NormalizedFactResponse(BaseModel):
    id: str
    configuration_id: str
    category: str
    parameter: str
    value: Any
    raw_text: str
    start_line: int
    end_line: int
    confidence: float
    is_unknown: bool
    ai_suggested: bool
    suggestion_reason: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class ConfigurationResponse(BaseModel):
    id: str
    tenant_id: str
    device_id: str
    version: int
    filename: str
    sha256_hash: str
    status: str
    vendor_detected: Optional[str] = None
    platform_detected: Optional[str] = None
    confidence: float
    line_count: int
    uploaded_at: datetime
    raw_content: Optional[str] = None

    class Config:
        from_attributes = True

class ProcessingStageStatus(BaseModel):
    stage: str
    title: str
    status: str # COMPLETED, PROCESSING, QUEUED, REVIEW_REQUIRED, FAILED
    duration_ms: Optional[int] = 0
    confidence: Optional[float] = 1.0
    details: Optional[str] = None

class ProcessingPipelineResponse(BaseModel):
    job_id: str
    configuration_id: str
    current_stage: str
    status: str
    progress_percent: int
    stages: List[ProcessingStageStatus]
    error_message: Optional[str] = None

# --- Compliance & Finding Schemas ---
class FindingResponse(BaseModel):
    id: str
    tenant_id: str
    device_id: str
    configuration_id: str
    framework_id: str
    control_id: str
    status: str
    severity: str
    title: str
    description: str
    observed_value: Any
    expected_value: Any
    confidence: float
    start_line: int
    end_line: int
    evidence_text: Optional[str] = None
    remediation_command: Optional[str] = None
    risk_impact: Optional[str] = None
    verification_command: Optional[str] = None
    is_reviewed: bool
    created_at: datetime

    class Config:
        from_attributes = True

class ControlResponse(BaseModel):
    id: str
    framework_id: str
    control_id: str
    category: str
    title: str
    description: str
    severity: str
    expected_parameter: str
    operator: str
    expected_value: Any
    remediation_template: str
    verification_command: str

    class Config:
        from_attributes = True

class FrameworkResponse(BaseModel):
    id: str
    code: str
    name: str
    version: str
    description: Optional[str] = None
    controls_count: Optional[int] = 0

    class Config:
        from_attributes = True

# --- Training Studio Schemas ---
class MappingResponse(BaseModel):
    id: str
    tenant_id: str
    vendor: str
    platform: str
    raw_command_pattern: str
    normalized_parameter: str
    expected_type: str
    transformation: str
    confidence: float
    status: str
    created_by: str
    approved_by: Optional[str] = None
    approved_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True

class MappingActionRequest(BaseModel):
    action: str # APPROVE, EDIT, REJECT, DEPRECATE
    normalized_parameter: Optional[str] = None
    transformation: Optional[str] = None

# --- Report Schemas ---
class ReportResponse(BaseModel):
    id: str
    tenant_id: str
    title: str
    device_id: str
    configuration_id: str
    framework_code: str
    compliance_score: float
    total_controls: int
    passed_controls: int
    failed_controls: int
    critical_findings: int
    report_url: Optional[str] = None
    sha256_hash: str
    created_at: datetime

    class Config:
        from_attributes = True

# --- Security Graph Schemas ---
class GraphNode(BaseModel):
    id: str
    label: str
    type: str # device, configuration, fact, control, finding, risk, remediation
    status: Optional[str] = None
    severity: Optional[str] = None
    data: Dict[str, Any] = {}

class GraphEdge(BaseModel):
    id: str
    source: str
    target: str
    label: Optional[str] = None

class SecurityGraphResponse(BaseModel):
    nodes: List[GraphNode]
    edges: List[GraphEdge]

# --- Analyst Query Schemas ---
class QueryRequest(BaseModel):
    question: str

class EvidenceReference(BaseModel):
    device_name: str
    device_id: str
    config_id: str
    line_start: int
    line_end: int
    source_text: str

class QueryResponse(BaseModel):
    question: str
    answer: str
    confidence: float
    evidence: List[EvidenceReference]
    matched_count: int

# --- What-If Simulation Schemas ---
class SimulationRequest(BaseModel):
    device_id: str
    parameter: str # e.g. management.ssh.version
    proposed_value: Any # e.g. 2

class SimulationResponse(BaseModel):
    session_id: str
    device_id: str
    device_name: str
    baseline_score: float
    simulated_score: float
    baseline_failed_controls: int
    simulated_failed_controls: int
    improved_controls_count: int
    worsened_controls_count: int
    affected_controls: List[Dict[str, Any]]
    disclaimer: str = "SIMULATION ONLY — NO PRODUCTION CONFIGURATION WAS CHANGED."

# --- Drift Schemas ---
class DriftResponse(BaseModel):
    drift_id: str
    device_id: str
    config_id_old: str
    config_id_new: str
    version_old: int
    version_new: int
    added_facts: List[Dict[str, Any]]
    removed_facts: List[Dict[str, Any]]
    changed_facts: List[Dict[str, Any]]
    line_diff: List[Dict[str, Any]]
    risk_change: str
    affected_controls_count: int

# --- Audit Trail Schemas ---
class AuditEventResponse(BaseModel):
    id: str
    tenant_id: str
    actor: str
    action: str
    entity_type: str
    entity_id: str
    description: str
    event_metadata: Optional[Dict[str, Any]] = None
    sha256_hash: str
    timestamp: datetime

    class Config:
        from_attributes = True
