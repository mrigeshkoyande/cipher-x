from sqlalchemy import Column, String, Integer, Float, Boolean, Text, DateTime, ForeignKey, Enum as SQLEnum, JSON
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import uuid
from app.core.database import Base

def generate_uuid():
    return str(uuid.uuid4())

def utc_now():
    return datetime.now(timezone.utc)

class Tenant(Base):
    __tablename__ = "tenants"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False)
    created_at = Column(DateTime, default=utc_now)

class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    tenant_id = Column(String, ForeignKey("tenants.id"), nullable=False, index=True)
    username = Column(String, unique=True, nullable=False, index=True)
    email = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="SECURITY_ANALYST") # ADMIN, SECURITY_ANALYST, NETWORK_ADMIN, AUDITOR, VIEWER
    created_at = Column(DateTime, default=utc_now)

class Device(Base):
    __tablename__ = "devices"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    tenant_id = Column(String, ForeignKey("tenants.id"), nullable=False, index=True)
    name = Column(String, nullable=False, index=True)
    vendor = Column(String, nullable=False) # Cisco, Juniper, Fortinet, Palo Alto
    platform = Column(String, nullable=False) # IOS-XE, Junos, FortiOS, PAN-OS
    os_version = Column(String, nullable=True)
    ip_address = Column(String, nullable=True)
    status = Column(String, default="Healthy") # Healthy, Review, Risk, Unknown
    compliance_score = Column(Float, default=0.0)
    risk_level = Column(String, default="LOW") # CRITICAL, HIGH, MEDIUM, LOW
    last_scanned_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=utc_now)
    
    configurations = relationship("Configuration", back_populates="device", cascade="all, delete-orphan")
    findings = relationship("Finding", back_populates="device", cascade="all, delete-orphan")

class Configuration(Base):
    __tablename__ = "configurations"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    tenant_id = Column(String, ForeignKey("tenants.id"), nullable=False, index=True)
    device_id = Column(String, ForeignKey("devices.id"), nullable=False, index=True)
    version = Column(Integer, default=1)
    filename = Column(String, nullable=False)
    sha256_hash = Column(String, nullable=False, index=True)
    file_path = Column(String, nullable=False)
    raw_content = Column(Text, nullable=False)
    status = Column(String, default="QUEUED") # QUEUED, PROCESSING, COMPLETED, REVIEW_REQUIRED, FAILED
    vendor_detected = Column(String, nullable=True)
    platform_detected = Column(String, nullable=True)
    confidence = Column(Float, default=0.0)
    line_count = Column(Integer, default=0)
    uploaded_at = Column(DateTime, default=utc_now)
    
    device = relationship("Device", back_populates="configurations")
    facts = relationship("NormalizedFact", back_populates="configuration", cascade="all, delete-orphan")
    findings = relationship("Finding", back_populates="configuration", cascade="all, delete-orphan")

class NormalizedFact(Base):
    __tablename__ = "normalized_facts"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    tenant_id = Column(String, ForeignKey("tenants.id"), nullable=False, index=True)
    configuration_id = Column(String, ForeignKey("configurations.id"), nullable=False, index=True)
    category = Column(String, nullable=False) # management, auth, logging, network, firewall, crypto, services, interfaces, snmp, password_policy
    parameter = Column(String, nullable=False, index=True) # e.g. management.ssh.enabled
    value = Column(JSON, nullable=True) # Normalized value (boolean, int, string, list, dict)
    raw_text = Column(Text, nullable=False)
    start_line = Column(Integer, nullable=False)
    end_line = Column(Integer, nullable=False)
    confidence = Column(Float, default=1.0)
    is_unknown = Column(Boolean, default=False)
    ai_suggested = Column(Boolean, default=False)
    suggestion_reason = Column(Text, nullable=True)
    created_at = Column(DateTime, default=utc_now)
    
    configuration = relationship("Configuration", back_populates="facts")

class Mapping(Base):
    __tablename__ = "mappings"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    tenant_id = Column(String, ForeignKey("tenants.id"), nullable=False, index=True)
    vendor = Column(String, nullable=False)
    platform = Column(String, nullable=False)
    raw_command_pattern = Column(Text, nullable=False)
    normalized_parameter = Column(String, nullable=False)
    expected_type = Column(String, default="boolean")
    transformation = Column(String, default="parse_boolean")
    confidence = Column(Float, default=0.85)
    status = Column(String, default="PENDING") # PENDING, VALIDATED, REJECTED
    created_by = Column(String, default="AI") # AI or User ID
    approved_by = Column(String, nullable=True)
    approved_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=utc_now)

class Framework(Base):
    __tablename__ = "frameworks"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    code = Column(String, unique=True, nullable=False) # CIS, NIST_800_53, DISA_STIG, ISO_27001, CUSTOM
    name = Column(String, nullable=False)
    version = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    
    controls = relationship("Control", back_populates="framework", cascade="all, delete-orphan")

class Control(Base):
    __tablename__ = "controls"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    framework_id = Column(String, ForeignKey("frameworks.id"), nullable=False, index=True)
    control_id = Column(String, nullable=False, index=True) # e.g. SSH-001, CIS-1.1
    category = Column(String, nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    severity = Column(String, nullable=False) # CRITICAL, HIGH, MEDIUM, LOW, INFORMATIONAL
    expected_parameter = Column(String, nullable=False)
    operator = Column(String, nullable=False) # EQUALS, NOT_EQUALS, GREATER_THAN, LESS_THAN, CONTAINS, NOT_CONTAINS, IN, REGEX, EXISTS, NOT_EXISTS
    expected_value = Column(JSON, nullable=True)
    remediation_template = Column(Text, nullable=False)
    verification_command = Column(Text, nullable=False)
    
    framework = relationship("Framework", back_populates="controls")

class Finding(Base):
    __tablename__ = "findings"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    tenant_id = Column(String, ForeignKey("tenants.id"), nullable=False, index=True)
    device_id = Column(String, ForeignKey("devices.id"), nullable=False, index=True)
    configuration_id = Column(String, ForeignKey("configurations.id"), nullable=False, index=True)
    framework_id = Column(String, ForeignKey("frameworks.id"), nullable=False, index=True)
    control_id = Column(String, nullable=False, index=True)
    status = Column(String, nullable=False) # PASS, FAIL, WARNING, REVIEW, NOT_APPLICABLE, UNKNOWN
    severity = Column(String, nullable=False) # CRITICAL, HIGH, MEDIUM, LOW, INFORMATIONAL
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    observed_value = Column(JSON, nullable=True)
    expected_value = Column(JSON, nullable=True)
    confidence = Column(Float, default=1.0)
    start_line = Column(Integer, default=0)
    end_line = Column(Integer, default=0)
    evidence_text = Column(Text, nullable=True)
    remediation_command = Column(Text, nullable=True)
    risk_impact = Column(Text, nullable=True)
    verification_command = Column(Text, nullable=True)
    is_reviewed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=utc_now)
    
    device = relationship("Device", back_populates="findings")
    configuration = relationship("Configuration", back_populates="findings")

class Report(Base):
    __tablename__ = "reports"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    tenant_id = Column(String, ForeignKey("tenants.id"), nullable=False, index=True)
    title = Column(String, nullable=False)
    device_id = Column(String, ForeignKey("devices.id"), nullable=False)
    configuration_id = Column(String, ForeignKey("configurations.id"), nullable=False)
    framework_code = Column(String, nullable=False)
    compliance_score = Column(Float, default=0.0)
    total_controls = Column(Integer, default=0)
    passed_controls = Column(Integer, default=0)
    failed_controls = Column(Integer, default=0)
    critical_findings = Column(Integer, default=0)
    report_url = Column(String, nullable=True)
    sha256_hash = Column(String, nullable=False)
    created_at = Column(DateTime, default=utc_now)

class AuditEvent(Base):
    __tablename__ = "audit_events"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    tenant_id = Column(String, ForeignKey("tenants.id"), nullable=False, index=True)
    actor = Column(String, nullable=False)
    action = Column(String, nullable=False)
    entity_type = Column(String, nullable=False)
    entity_id = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    event_metadata = Column(JSON, nullable=True)
    sha256_hash = Column(String, nullable=False)
    timestamp = Column(DateTime, default=utc_now)

class ProcessingJob(Base):
    __tablename__ = "processing_jobs"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    tenant_id = Column(String, ForeignKey("tenants.id"), nullable=False, index=True)
    configuration_id = Column(String, ForeignKey("configurations.id"), nullable=False, index=True)
    current_stage = Column(String, default="UPLOAD")
    status = Column(String, default="QUEUED") # QUEUED, PROCESSING, COMPLETED, REVIEW_REQUIRED, FAILED
    progress_percent = Column(Integer, default=0)
    stages_json = Column(JSON, nullable=True)
    error_message = Column(Text, nullable=True)
    started_at = Column(DateTime, default=utc_now)
    completed_at = Column(DateTime, nullable=True)

class DriftEvent(Base):
    __tablename__ = "drift_events"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    tenant_id = Column(String, ForeignKey("tenants.id"), nullable=False, index=True)
    device_id = Column(String, ForeignKey("devices.id"), nullable=False, index=True)
    config_id_old = Column(String, ForeignKey("configurations.id"), nullable=False)
    config_id_new = Column(String, ForeignKey("configurations.id"), nullable=False)
    added_facts_json = Column(JSON, nullable=True)
    removed_facts_json = Column(JSON, nullable=True)
    changed_facts_json = Column(JSON, nullable=True)
    risk_change = Column(String, default="NO_CHANGE") # INCREASED, DECREASED, NO_CHANGE
    created_at = Column(DateTime, default=utc_now)

class WhatIfSession(Base):
    __tablename__ = "what_if_sessions"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    tenant_id = Column(String, ForeignKey("tenants.id"), nullable=False, index=True)
    device_id = Column(String, ForeignKey("devices.id"), nullable=False, index=True)
    proposed_changes_json = Column(JSON, nullable=False)
    baseline_score = Column(Float, default=0.0)
    simulated_score = Column(Float, default=0.0)
    affected_controls_json = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=utc_now)
