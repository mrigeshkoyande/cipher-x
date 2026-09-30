import os
import sys
import hashlib
from datetime import datetime, timezone

# Ensure backend root is on Python path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from app.core.database import SessionLocal, engine, Base
from app.core.security import get_password_hash
from app.models.db_models import (
    Tenant, User, Device, Configuration, NormalizedFact,
    Framework, Control, Finding, Mapping, Report, AuditEvent
)

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # Check if already seeded
        if db.query(Tenant).filter(Tenant.id == "tenant_default").first():
            print("Database already contains initial seed data.")
            return

        print("Seeding CIPHER-X database...")

        # 1. Create Default Tenant
        tenant = Tenant(id="tenant_default", name="Acme Cybersecurity Operations")
        db.add(tenant)
        db.commit()

        # 2. Create Users
        admin_user = User(
            id="usr_admin",
            tenant_id=tenant.id,
            username="admin",
            email="admin@cipherx.sec",
            hashed_password=get_password_hash("admin123"),
            role="ADMIN"
        )
        analyst_user = User(
            id="usr_analyst",
            tenant_id=tenant.id,
            username="analyst",
            email="analyst@cipherx.sec",
            hashed_password=get_password_hash("password"),
            role="SECURITY_ANALYST"
        )
        db.add(admin_user)
        db.add(analyst_user)
        db.commit()

        # 3. Create Frameworks & Controls
        cis_fw = Framework(
            id="fw_cis_v8",
            code="CIS",
            name="CIS Benchmarks v8.0",
            version="8.0",
            description="Center for Internet Security Network Configuration Baseline"
        )
        db.add(cis_fw)
        db.commit()

        ctrl1 = Control(
            id="ctrl_cis_1_1",
            framework_id=cis_fw.id,
            control_id="CIS-1.1",
            category="Management",
            title="Disable Unencrypted Telnet Management Access",
            description="Ensure Telnet management access is disabled on all line vty interfaces in favor of SSH v2.",
            severity="CRITICAL",
            expected_parameter="management.telnet.enabled",
            operator="EQUALS",
            expected_value=False,
            remediation_template="line vty 0 15\n transport input ssh",
            verification_command="show running-config | section line vty"
        )
        ctrl2 = Control(
            id="ctrl_cis_1_2",
            framework_id=cis_fw.id,
            control_id="CIS-1.2",
            category="Management",
            title="Enforce SSH Version 2 Protocol",
            description="Ensure SSH version 2 is explicitly configured for all administrative sessions.",
            severity="HIGH",
            expected_parameter="management.ssh.version",
            operator="EQUALS",
            expected_value=2,
            remediation_template="ip ssh version 2",
            verification_command="show ip ssh"
        )
        ctrl3 = Control(
            id="ctrl_cis_2_1",
            framework_id=cis_fw.id,
            control_id="CIS-2.1",
            category="Logging",
            title="Configure Remote Syslog Logging Server",
            description="Ensure system logs are forwarded to a remote centralized syslog daemon.",
            severity="HIGH",
            expected_parameter="logging.remote_server_configured",
            operator="EQUALS",
            expected_value=True,
            remediation_template="logging host 10.0.100.50",
            verification_command="show logging"
        )
        ctrl4 = Control(
            id="ctrl_cis_3_1",
            framework_id=cis_fw.id,
            control_id="CIS-3.1",
            category="Password Policy",
            title="Enable Service Password Encryption",
            description="Encrypt all cleartext passwords stored in the configuration file.",
            severity="MEDIUM",
            expected_parameter="password_policy.encryption_enabled",
            operator="EQUALS",
            expected_value=True,
            remediation_template="service password-encryption",
            verification_command="show running-config | include service password-encryption"
        )
        db.add_all([ctrl1, ctrl2, ctrl3, ctrl4])
        db.commit()

        # 4. Create Sample Devices & Configurations
        devices_data = [
            ("CORE-SW-01", "Cisco", "IOS-XE", "17.3.4", "10.0.1.1", "Healthy", 92.5, "LOW"),
            ("EDGE-FW-02", "Fortinet", "FortiOS", "7.2.1", "10.0.2.1", "Review", 71.0, "HIGH"),
            ("BRANCH-RTR-07", "Juniper", "Junos", "21.4R1", "10.0.3.1", "Healthy", 88.0, "LOW"),
            ("DC-FW-01", "Palo Alto", "PAN-OS", "10.1.0", "10.0.4.1", "Risk", 63.5, "CRITICAL")
        ]

        configs_sample = {
            "Cisco": """! CIPHER-X Sample Configuration — Cisco IOS-XE
version 17.3
hostname CORE-SW-01
!
service password-encryption
enable secret 9 $9$8aKx9k$vN7x.
!
ip ssh version 2
!
line vty 0 4
 transport input ssh
 login local
!
logging host 10.0.100.50
snmp-server community secret-read RO
""",
            "Fortinet": """# CIPHER-X Sample Configuration — Fortinet FortiOS
config system global
    set hostname EDGE-FW-02
end
config system interface
    edit "port1"
        set allowaccess ssh telnet
    next
end
config log syslogd setting
    set status enable
    set server "10.0.100.50"
end
""",
            "Juniper": """# CIPHER-X Sample Configuration — Juniper Junos
system {
    host-name BRANCH-RTR-07;
    services {
        ssh {
            protocol-version v2;
        }
    }
    syslog {
        host 10.0.100.50 {
            any notice;
        }
    }
}
""",
            "Palo Alto": """# CIPHER-X Sample Configuration — Palo Alto PAN-OS
set deviceconfig system hostname DC-FW-01
set deviceconfig system service enable-telnet yes
set deviceconfig system service disable-ssh no
set deviceconfig system syslog 10.0.100.50
"""
        }

        for name, vendor, platform, os_ver, ip_addr, status, score, risk in devices_data:
            dev = Device(
                tenant_id=tenant.id,
                name=name,
                vendor=vendor,
                platform=platform,
                os_version=os_ver,
                ip_address=ip_addr,
                status=status,
                compliance_score=score,
                risk_level=risk,
                last_scanned_at=datetime.now(timezone.utc)
            )
            db.add(dev)
            db.commit()
            db.refresh(dev)

            cfg_text = configs_sample.get(vendor, configs_sample["Cisco"])
            content_bytes = cfg_text.encode('utf-8')
            sha256 = hashlib.sha256(content_bytes).hexdigest()
            file_path = os.path.join("./storage/configurations", f"{sha256}_{name}.cfg")

            with open(file_path, "wb") as f:
                f.write(content_bytes)

            config = Configuration(
                tenant_id=tenant.id,
                device_id=dev.id,
                version=1,
                filename=f"{name}.cfg",
                sha256_hash=sha256,
                file_path=file_path,
                raw_content=cfg_text,
                status="COMPLETED" if status != "Review" else "REVIEW_REQUIRED",
                vendor_detected=vendor,
                platform_detected=platform,
                confidence=0.98,
                line_count=len(cfg_text.splitlines())
            )
            db.add(config)
            db.commit()
            db.refresh(config)

            # Facts
            has_telnet = "telnet" in cfg_text and "enable-telnet yes" in cfg_text or "allowaccess ssh telnet" in cfg_text
            f1 = NormalizedFact(
                tenant_id=tenant.id,
                configuration_id=config.id,
                category="management",
                parameter="management.telnet.enabled",
                value=has_telnet,
                raw_text="set allowaccess ssh telnet" if has_telnet else "transport input ssh",
                start_line=8,
                end_line=10,
                confidence=1.0,
                is_unknown=False
            )
            f2 = NormalizedFact(
                tenant_id=tenant.id,
                configuration_id=config.id,
                category="management",
                parameter="management.ssh.version",
                value=2,
                raw_text="ip ssh version 2",
                start_line=6,
                end_line=6,
                confidence=1.0,
                is_unknown=False
            )
            f3 = NormalizedFact(
                tenant_id=tenant.id,
                configuration_id=config.id,
                category="logging",
                parameter="logging.remote_server_configured",
                value=True,
                raw_text="logging host 10.0.100.50",
                start_line=12,
                end_line=12,
                confidence=1.0,
                is_unknown=False
            )
            f4 = NormalizedFact(
                tenant_id=tenant.id,
                configuration_id=config.id,
                category="password_policy",
                parameter="password_policy.encryption_enabled",
                value=True,
                raw_text="service password-encryption",
                start_line=4,
                end_line=4,
                confidence=1.0,
                is_unknown=False
            )
            db.add_all([f1, f2, f3, f4])
            db.commit()

            # Findings
            if has_telnet:
                find1 = Finding(
                    tenant_id=tenant.id,
                    device_id=dev.id,
                    configuration_id=config.id,
                    framework_id=cis_fw.id,
                    control_id="CIS-1.1",
                    status="FAIL",
                    severity="CRITICAL",
                    title="Disable Unencrypted Telnet Access",
                    description="Telnet service is enabled, allowing unencrypted cleartext administrative access across the network.",
                    observed_value=True,
                    expected_value=False,
                    confidence=1.0,
                    start_line=8,
                    end_line=10,
                    evidence_text="set allowaccess ssh telnet",
                    remediation_command="set allowaccess ssh",
                    risk_impact="Telnet transmits credentials in cleartext, exposing administrative access to passive wiretapping.",
                    verification_command="show running-config"
                )
                db.add(find1)
            else:
                find1 = Finding(
                    tenant_id=tenant.id,
                    device_id=dev.id,
                    configuration_id=config.id,
                    framework_id=cis_fw.id,
                    control_id="CIS-1.1",
                    status="PASS",
                    severity="CRITICAL",
                    title="Disable Unencrypted Telnet Access",
                    description="Telnet management access is disabled.",
                    observed_value=False,
                    expected_value=False,
                    confidence=1.0,
                    start_line=8,
                    end_line=10,
                    evidence_text="transport input ssh",
                    verification_command="show running-config"
                )
                db.add(find1)
            db.commit()

        # 5. Create Sample Unknown Mapping for Training Studio
        mapping1 = Mapping(
            tenant_id=tenant.id,
            vendor="Fortinet",
            platform="FortiOS",
            raw_command_pattern="set custom-sec-proto enable",
            normalized_parameter="management.remote_access.custom_proto",
            expected_type="boolean",
            transformation="parse_boolean",
            confidence=0.87,
            status="PENDING",
            created_by="AI"
        )
        db.add(mapping1)
        db.commit()

        # 6. Audit Trail
        AuditEvent_rec = AuditEvent(
            tenant_id=tenant.id,
            actor="admin",
            action="SYSTEM_INITIALIZED",
            entity_type="system",
            entity_id="sys_01",
            description="CIPHER-X system baseline initialized with 4 assets and CIS benchmark framework",
            sha256_hash="e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
        )
        db.add(AuditEvent_rec)
        db.commit()

        print("CIPHER-X database successfully seeded with initial assets!")

    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
