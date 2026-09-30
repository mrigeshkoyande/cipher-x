import uuid
from typing import List, Optional
from sqlalchemy import String, Boolean, ForeignKey, JSON, Enum as SQLEnum, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
import enum

from .base import BaseModel

class RoleEnum(str, enum.Enum):
    ADMIN = "ADMIN"
    SECURITY_ANALYST = "SECURITY_ANALYST"
    NETWORK_ADMIN = "NETWORK_ADMIN"
    AUDITOR = "AUDITOR"
    VIEWER = "VIEWER"

class ConfigStatus(str, enum.Enum):
    UPLOADED = "UPLOADED"
    PROCESSING = "PROCESSING"
    NORMALIZED = "NORMALIZED"
    COMPLIANCE_RUNNING = "COMPLIANCE_RUNNING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"
    REVIEW_REQUIRED = "REVIEW_REQUIRED"

class ConfidenceLevel(str, enum.Enum):
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"
    REVIEW_REQUIRED = "REVIEW_REQUIRED"

class ComplianceStatus(str, enum.Enum):
    PASS = "PASS"
    FAIL = "FAIL"
    WARNING = "WARNING"
    REVIEW = "REVIEW"
    NOT_APPLICABLE = "NOT_APPLICABLE"
    UNKNOWN = "UNKNOWN"

class Tenant(BaseModel):
    __tablename__ = "tenants"
    name: Mapped[str] = mapped_column(String, unique=True, index=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    users: Mapped[List["User"]] = relationship(back_populates="tenant")
    devices: Mapped[List["Device"]] = relationship(back_populates="tenant")

class User(BaseModel):
    __tablename__ = "users"
    tenant_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("tenants.id"))
    email: Mapped[str] = mapped_column(String, unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column(String)
    full_name: Mapped[str] = mapped_column(String)
    role: Mapped[RoleEnum] = mapped_column(SQLEnum(RoleEnum))
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    tenant: Mapped["Tenant"] = relationship(back_populates="users")

class Device(BaseModel):
    __tablename__ = "devices"
    tenant_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("tenants.id"))
    name: Mapped[str] = mapped_column(String, index=True)
    vendor: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    model: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    device_type: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    platform: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    os_version: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    environment: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    owner: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    status: Mapped[str] = mapped_column(String, default="ACTIVE")
    is_archived: Mapped[bool] = mapped_column(Boolean, default=False)

    tenant: Mapped["Tenant"] = relationship(back_populates="devices")
    configurations: Mapped[List["Configuration"]] = relationship(back_populates="device")

class Configuration(BaseModel):
    __tablename__ = "configurations"
    tenant_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("tenants.id"))
    device_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("devices.id"))
    filename: Mapped[str] = mapped_column(String)
    file_size: Mapped[int] = mapped_column()
    sha256_hash: Mapped[str] = mapped_column(String, index=True)
    storage_path: Mapped[str] = mapped_column(String)
    status: Mapped[ConfigStatus] = mapped_column(SQLEnum(ConfigStatus), default=ConfigStatus.UPLOADED)
    version: Mapped[int] = mapped_column(default=1)

    device: Mapped["Device"] = relationship(back_populates="configurations")
    facts: Mapped[List["NormalizedFact"]] = relationship(back_populates="configuration")

class NormalizedFact(BaseModel):
    __tablename__ = "normalized_facts"
    tenant_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("tenants.id"))
    configuration_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("configurations.id"))
    parameter: Mapped[str] = mapped_column(String, index=True)
    value: Mapped[str] = mapped_column(String) # Cast everything to string for storage, or use JSON
    confidence_score: Mapped[float] = mapped_column(Float)
    confidence_level: Mapped[ConfidenceLevel] = mapped_column(SQLEnum(ConfidenceLevel))
    source_lines: Mapped[Optional[str]] = mapped_column(String, nullable=True) # e.g. "42-45"
    source_text: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    mapping_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), nullable=True)

    configuration: Mapped["Configuration"] = relationship(back_populates="facts")

class Control(BaseModel):
    __tablename__ = "controls"
    control_id: Mapped[str] = mapped_column(String, index=True) # e.g., SSH-001
    framework: Mapped[str] = mapped_column(String, index=True) # e.g., CIS
    parameter: Mapped[str] = mapped_column(String)
    operator: Mapped[str] = mapped_column(String)
    expected_value: Mapped[str] = mapped_column(String)
    severity: Mapped[str] = mapped_column(String)
    description: Mapped[Optional[str]] = mapped_column(String, nullable=True)

class Finding(BaseModel):
    __tablename__ = "findings"
    tenant_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("tenants.id"))
    device_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("devices.id"))
    configuration_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("configurations.id"))
    control_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("controls.id"))
    
    status: Mapped[ComplianceStatus] = mapped_column(SQLEnum(ComplianceStatus))
    observed_value: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    confidence_level: Mapped[ConfidenceLevel] = mapped_column(SQLEnum(ConfidenceLevel))
    
    device: Mapped["Device"] = relationship()
    configuration: Mapped["Configuration"] = relationship()
    control: Mapped["Control"] = relationship()

class AuditEvent(BaseModel):
    __tablename__ = "audit_events"
    tenant_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("tenants.id"))
    actor_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"))
    action: Mapped[str] = mapped_column(String)
    entity_type: Mapped[str] = mapped_column(String)
    entity_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True))
    metadata_json: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
