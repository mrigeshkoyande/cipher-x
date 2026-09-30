from pydantic import BaseModel, Field
from typing import Dict, List, Any, Optional


class LoginRequest(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Dict[str, Any]


class DeviceCreate(BaseModel):
    name: str
    vendor: str  # cisco, juniper, fortinet, palo_alto
    model: str
    ip_address: str
    location: Optional[str] = "Primary Datacenter"
    environment: Optional[str] = "Production"
    tags: Optional[List[str]] = []


class ConfigurationUpload(BaseModel):
    device_id: str
    raw_config: str
    version_label: Optional[str] = "v1.0"
    author: Optional[str] = "admin"
    change_reason: Optional[str] = "Initial configuration baseline"


class EvaluationRequest(BaseModel):
    config_text: Optional[str] = None
    device_id: Optional[str] = None
    vendor: Optional[str] = None
    framework_ids: Optional[List[str]] = None


class WhatIfRequest(BaseModel):
    device_id: Optional[str] = None
    base_config: Optional[str] = None
    vendor: Optional[str] = None
    scenario_id: Optional[str] = None
    custom_patch: Optional[str] = None


class AssistantQueryRequest(BaseModel):
    query: str
    device_id: Optional[str] = None


class ReportCreateRequest(BaseModel):
    report_type: str = "ORGANIZATION"  # DEVICE, ORGANIZATION, FRAMEWORK, AUDIT, DRIFT, EXECUTIVE
    title: str
    target_name: Optional[str] = "Enterprise Fleet"
    device_id: Optional[str] = None
    framework_id: Optional[str] = None


class WebhookCreateRequest(BaseModel):
    url: str
    events: List[str] = ["*"]
    secret: Optional[str] = None


class TamperSimulationRequest(BaseModel):
    event_index: int
    modified_message: str


class SavedSearchCreate(BaseModel):
    name: str
    query: str
    filters: Optional[Dict[str, Any]] = {}
