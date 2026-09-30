import time
import os
import sys

# Ensure backend root is on sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.database import db_store
from app.compliance_engine.evaluator import compliance_evaluator
from app.services.audit_integrity import audit_integrity_service
from app.services.blockchain_anchor import blockchain_anchor_service
from app.services.security_graph import security_graph_service
from app.services.notification_service import notification_service
from app.services.webhook_dispatcher import webhook_dispatcher
from app.services.report_generator import report_generator

# ==========================================
# REALISTIC DEMO CONFIGURATION DATASETS
# ==========================================

CISCO_CORE_CONFIG_V1 = """!
version 17.6
service timestamps debug datetime msec
service timestamps log datetime msec
service password-encryption
!
hostname Cisco-Core-Router-01
!
ip domain name enterprise.internal
!
security passwords min-length 8
enable secret 5 $1$mERr$hx5rVt7rPNoS4wqbXKX7m0
!
aaa new-model
aaa authentication login default group tacacs+ local
aaa authorization exec default group tacacs+ local
!
snmp-server community public RO
snmp-server community private RW
!
no ip http server
ip http secure-server
!
ip ssh version 1
!
interface Loopback0
 ip address 10.255.255.1 255.255.255.255
!
interface GigabitEthernet0/0/0
 description Primary Core Uplink
 ip address 10.100.1.1 255.255.255.252
 no shutdown
!
interface GigabitEthernet0/0/1
 description Datacenter Aggregation Link
 ip address 10.100.2.1 255.255.255.252
 no shutdown
!
router bgp 65001
 neighbor 10.100.1.2 remote-as 65002
!
line con 0
 exec-timeout 30 0
 stopbits 1
line vty 0 4
 exec-timeout 0 0
 transport input telnet ssh
line vty 5 15
 transport input telnet ssh
!
end"""

CISCO_ACCESS_SWITCH_CONFIG = """!
version 16.12
service timestamps log datetime msec
no service finger
no service pad
!
hostname Cisco-Access-Switch-04
!
ip domain name enterprise.internal
!
security passwords min-length 15
enable algorithm-type sha-512 secret $6$rounds=5000$saltsalt$c1ph3rxHashExample
!
aaa new-model
aaa authentication login default group radius local
aaa authorization exec default group radius local
aaa authorization commands 15 default group radius local
!
ip ssh version 2
ip ssh server algorithm encryption aes256-ctr aes192-ctr
!
no ip http server
no ip http secure-server
!
snmp-server group SECGROUP v3 priv
snmp-server user secadmin SECGROUP v3 auth sha-256 AuthPass2026! priv aes 256 PrivPass2026!
!
logging host 10.100.20.50
logging trap informational
!
ntp server 10.100.10.10
ntp server 10.100.10.11
!
login block-for 300 attempts 3 within 60
!
interface range GigabitEthernet1/0/1 - 24
 switchport mode access
 switchport port-security
 switchport port-security maximum 2
 switchport port-security violation shutdown
 spanning-tree bpduguard enable
 storm-control broadcast level 5.00
!
line con 0
 exec-timeout 10 0
line vty 0 15
 exec-timeout 10 0
 transport input ssh
!
end"""

JUNIPER_EDGE_CONFIG_V1 = """## Last changed: 2026-08-15 10:00:00 UTC
version 21.4R1.12;
system {
    host-name Juniper-Edge-Router-01;
    domain-name enterprise.internal;
    services {
        ssh {
            protocol-version v2;
            ciphers [ aes256-gcm@openssh.com aes128-gcm@openssh.com aes256-ctr ];
        }
        web-management {
            https {
                system-generated-certificate;
            }
        }
    }
    syslog {
        host 10.100.20.50 {
            any notice;
            authorization info;
        }
        time-format millisecond;
    }
    ntp {
        server 10.100.10.10 prefer;
        server 10.100.10.11;
    }
    login {
        password {
            format sha-512;
            minimum-length 15;
        }
        idle-timeout 10;
        retry-options {
            backoff-threshold 3;
        }
    }
}
snmp {
    v3 {
        usm {
            local-engine {
                user secadmin {
                    authentication-sha {
                        authentication-password "AuthPass2026!";
                    }
                    privacy-aes128 {
                        privacy-password "PrivPass2026!";
                    }
                }
            }
        }
    }
}
protocols {
    bgp {
        group EXTERNAL-PEERS {
            peer-as 65002;
            authentication-key "$9$BGP_S3cur3!";
            neighbor 192.168.1.1;
        }
    }
}"""

# Juniper V2 - Drifted (Insecure changes introduced)
JUNIPER_EDGE_CONFIG_V2 = """## Last changed: 2026-09-28 14:22:10 UTC
version 21.4R1.12;
system {
    host-name Juniper-Edge-Router-01;
    domain-name enterprise.internal;
    services {
        ssh {
            protocol-version v2;
            ciphers [ 3des-cbc aes256-ctr ];
        }
        telnet;
        web-management {
            http;
            https {
                system-generated-certificate;
            }
        }
    }
    syslog {
        host 10.100.20.50 {
            any notice;
        }
    }
    login {
        idle-timeout 30;
    }
}
snmp {
    community public {
        authorization read-only;
    }
}"""

FORTINET_FW_CONFIG = """#config-version=FG600E-7.2.4-FW-build1396-221018:opmode=0:vdom=0:user=admin
#conf_ref=3284092384
config system global
    set hostname "Fortinet-DC-Firewall-01"
    set admintimeout 10
    set admin-ssh-v1 disable
    set admin-ssh-port 22
    set admin-sport 443
    set strong-crypto enable
    set ssl-min-proto-version tls1-2
    set admin-lockout-threshold 3
    set admin-lockout-duration 300
end
config system interface
    edit "port1"
        set vdom "root"
        set ip 10.200.1.1 255.255.255.0
        set allowaccess ping https ssh
        set type physical
    next
    edit "mgmt"
        set dedicated-to management
        set ip 192.168.100.2 255.255.255.0
        set allowaccess ping https ssh
    next
end
config log syslogd setting
    set status enable
    set server "10.100.20.50"
    set mode udp
    set port 514
    set format rfc5424
end
config system ntp
    set ntpsync enable
    set type custom
    config ntpserver
        edit 1
            set server "10.100.10.10"
        next
    end
end
config system password-policy
    set status enable
    set min-length 15
end
config user tacacs+
    edit "TACACS-SRV"
        set server "10.100.30.15"
        set key "C1ph3rX!S3cur3K3y"
    next
end
config firewall policy
    edit 1
        set name "LAN-TO-WAN-INSPECT"
        set srcintf "port1"
        set dstintf "port2"
        set srcaddr "all"
        set dstaddr "all"
        set action accept
        set schedule "always"
        set service "ALL"
        set utm-status enable
        set logtraffic all
    next
    edit 0
        set name "DEFAULT-DENY-ALL"
        set srcintf "any"
        set dstintf "any"
        set srcaddr "all"
        set dstaddr "all"
        set action deny
        set schedule "always"
        set service "ALL"
        set logtraffic all
    next
end"""

PALO_ALTO_FW_CONFIG = """set deviceconfig system hostname PaloAlto-Border-FW-01
set deviceconfig system domain enterprise.internal
set deviceconfig system ip-address 192.168.100.3 netmask 255.255.255.0 default-gateway 192.168.100.1
set deviceconfig system service disable-telnet yes
set deviceconfig system service disable-http yes
set deviceconfig system ssh ciphers [ aes256-gcm aes128-gcm aes256-ctr ]
set deviceconfig system ssh macs [ hmac-sha2-512 hmac-sha2-256 ]
set deviceconfig setting management idle-timeout 10
set deviceconfig setting management failed-attempts 3
set deviceconfig setting management lockout-time 5
set mgt-config password-complexity enabled yes minimum-length 15
set shared log-settings syslog SIEM-FORWARDER server 10.100.20.50 transport UDP port 514 format IETF facility LOG_LOCAL7
set deviceconfig system ntp-servers primary-ntp-server ntp-server-address 10.100.10.10
set deviceconfig system ntp-servers secondary-ntp-server ntp-server-address 10.100.10.11
set shared server-profile tacplus TACACS-CLUSTER server TACACS-01 ip-address 10.100.30.15 secret "C1ph3rX!S3cur3K3y" port 49
set shared authentication-profile TACACS-AUTH-PROF method tacplus server-profile TACACS-CLUSTER
set deviceconfig system authentication-profile TACACS-AUTH-PROF
set rulebase security rules TRUST-TO-UNTRUST from TRUST to UNTRUST source any destination any service [ application-default ] action allow profile-setting group "Strict-Security-Group" log-end yes
set rulebase default-security-rules rules interzone-default action drop log-end yes"""


def seed_demo_dataset():
    """Initializes the complete demo environment with 5 realistic devices, multi-version configs, evaluations, and audit logs."""
    if len(db_store.devices) > 0:
        return

    now = time.time()

    # 1. Tenant & Users
    tenant_id = "ten-default-01"
    db_store.tenants[tenant_id] = {
        "id": tenant_id,
        "name": "Acme Global Financial Networks",
        "industry": "Financial Services & Banking Infrastructure",
        "created_at": now
    }

    db_store.users["admin"] = {
        "id": "usr-admin-01",
        "username": "admin",
        "email": "admin@cipherx.enterprise.io",
        "role": "admin",
        "tenant_id": tenant_id,
        "full_name": "Chief Information Security Officer"
    }
    db_store.users["auditor"] = {
        "id": "usr-auditor-02",
        "username": "auditor",
        "email": "auditor@cipherx.enterprise.io",
        "role": "auditor",
        "tenant_id": tenant_id,
        "full_name": "Compliance Lead Auditor"
    }
    db_store.users["engineer"] = {
        "id": "usr-eng-03",
        "username": "engineer",
        "email": "engineer@cipherx.enterprise.io",
        "role": "security_engineer",
        "tenant_id": tenant_id,
        "full_name": "SecOps Principal Engineer"
    }

    # 2. Devices Seed
    devices_seed = [
        {
            "id": "dev-cisco-core-01",
            "name": "Cisco-Core-Router-01",
            "vendor": "cisco",
            "model": "Catalyst 9500 / ASR 1000",
            "ip_address": "10.100.1.1",
            "location": "Dallas Core Datacenter DC-1",
            "environment": "Production Core",
            "tags": ["core", "backbone", "cisco", "high-priority"],
            "config_v1": CISCO_CORE_CONFIG_V1,
            "config_v2": None
        },
        {
            "id": "dev-cisco-switch-04",
            "name": "Cisco-Access-Switch-04",
            "vendor": "cisco",
            "model": "Catalyst 9300-48P",
            "ip_address": "10.100.10.4",
            "location": "Dallas Floor 4 IDF-B",
            "environment": "Production Access",
            "tags": ["access", "switchport", "cisco", "hardened"],
            "config_v1": CISCO_ACCESS_SWITCH_CONFIG,
            "config_v2": None
        },
        {
            "id": "dev-juniper-edge-01",
            "name": "Juniper-Edge-Router-01",
            "vendor": "juniper",
            "model": "MX480 Universal Routing Platform",
            "ip_address": "192.168.1.1",
            "location": "Chicago Carrier Exchange Equinix CH1",
            "environment": "Production WAN Edge",
            "tags": ["edge", "wan", "juniper", "bgp", "drift-demo"],
            "config_v1": JUNIPER_EDGE_CONFIG_V1,
            "config_v2": JUNIPER_EDGE_CONFIG_V2
        },
        {
            "id": "dev-fortinet-fw-01",
            "name": "Fortinet-DC-Firewall-01",
            "vendor": "fortinet",
            "model": "FortiGate 600E Next-Gen Firewall",
            "ip_address": "10.200.1.1",
            "location": "Dallas DMZ Firewall Cluster",
            "environment": "Production Perimeter",
            "tags": ["firewall", "dmz", "fortinet", "utm"],
            "config_v1": FORTINET_FW_CONFIG,
            "config_v2": None
        },
        {
            "id": "dev-palo-alto-fw-01",
            "name": "PaloAlto-Border-FW-01",
            "vendor": "palo_alto",
            "model": "PA-5450 High-Throughput NGFW",
            "ip_address": "192.168.100.3",
            "location": "Ashburn Border Peering DC-2",
            "environment": "Production Border",
            "tags": ["firewall", "border", "palo_alto", "pan-os", "zero-trust"],
            "config_v1": PALO_ALTO_FW_CONFIG,
            "config_v2": None
        }
    ]

    for d in devices_seed:
        dev_id = d["id"]
        dev_obj = {
            "id": dev_id,
            "name": d["name"],
            "vendor": d["vendor"],
            "model": d["model"],
            "ip_address": d["ip_address"],
            "location": d["location"],
            "environment": d["environment"],
            "tags": d["tags"],
            "tenant_id": tenant_id,
            "created_at": now - 86400 * 5,
            "updated_at": now
        }
        db_store.devices[dev_id] = dev_obj

        # Config V1
        cfg1_id = f"cfg-{dev_id[:12]}-v1"
        db_store.configurations[cfg1_id] = {
            "id": cfg1_id,
            "device_id": dev_id,
            "version_label": "v1.0 (Baseline)",
            "raw_config": d["config_v1"],
            "author": "network.architect@cipherx.enterprise.io",
            "change_reason": "Baseline compliance deployment",
            "created_at": now - 86400 * 5
        }

        # If V2 exists (e.g. Juniper drift demo)
        target_config = d["config_v1"]
        active_config_id = cfg1_id
        if d.get("config_v2"):
            cfg2_id = f"cfg-{dev_id[:12]}-v2"
            db_store.configurations[cfg2_id] = {
                "id": cfg2_id,
                "device_id": dev_id,
                "version_label": "v2.0 (Recent Drift)",
                "raw_config": d["config_v2"],
                "author": "sec-ops@cipherx.enterprise.io",
                "change_reason": "Emergency maintenance configuration changes",
                "created_at": now - 3600 * 4
            }
            target_config = d["config_v2"]
            active_config_id = cfg2_id

        # Run Compliance Evaluation
        eval_res = compliance_evaluator.evaluate_configuration(target_config, d["vendor"])
        eval_res["evaluated_at"] = now
        eval_res["config_id"] = active_config_id
        eval_res["device_id"] = dev_id
        db_store.evaluations[dev_id] = eval_res

        # Build Security Graph
        security_graph_service.build_graph_for_evaluation(
            device_id=dev_id,
            device_name=d["name"],
            vendor=d["vendor"],
            config_id=active_config_id,
            evaluation_result=eval_res
        )

        # Cryptographic Audit Record
        audit_integrity_service.record_event(
            event_type="DEVICE_COMPLIANCE_EVALUATED",
            actor="admin@cipherx.enterprise.io",
            resource_id=dev_id,
            payload={
                "device_name": d["name"],
                "score": eval_res["compliance_score"],
                "grade": eval_res["grade"],
                "risk_score": eval_res["device_risk_score"],
                "findings": len(eval_res["findings"])
            }
        )

        # Blockchain Anchor
        blockchain_anchor_service.anchor_configuration_hash(
            config_id=active_config_id,
            config_text=target_config,
            device_id=dev_id,
            device_name=d["name"],
            vendor=d["vendor"]
        )

    # 3. Seed Initial Reports
    report_generator.generate_report(
        report_type="ORGANIZATION",
        title="Enterprise Fleet Security & Compliance Baseline Report",
        target_name="Acme Financial Network Infrastructure Fleet",
        evaluation_data={
            "compliance_score": 84.5,
            "grade": "B",
            "device_risk_score": 28.5,
            "device_risk_level": "MEDIUM",
            "findings": db_store.evaluations.get("dev-cisco-core-01", {}).get("findings", []),
            "passed_controls": db_store.evaluations.get("dev-cisco-switch-04", {}).get("passed_controls", []),
            "counts": {"PASS": 18, "FAIL": 4, "WARNING": 2, "UNKNOWN": 1}
        },
        author="admin@cipherx.enterprise.io"
    )

    # 4. Seed Notifications
    notification_service.emit_notification(
        event_type="critical_finding_detected",
        title="Critical Vulnerability: Telnet Enabled on Core Router",
        message="Cisco-Core-Router-01 permits cleartext Telnet management. Violates CIS-NET-1.2 and NIST AC-17(1).",
        severity="CRITICAL",
        resource_id="dev-cisco-core-01",
        resource_type="device"
    )
    notification_service.emit_notification(
        event_type="configuration_drift_detected",
        title="Security Drift Alert on Juniper-Edge-Router-01",
        message="Recent config revision v2.0 introduced 3DES cipher suites and Telnet service.",
        severity="HIGH",
        resource_id="dev-juniper-edge-01",
        resource_type="device"
    )

    # 5. Seed Webhooks
    webhook_dispatcher.register_subscription(
        tenant_id=tenant_id,
        url="https://siem.enterprise.internal/api/v1/cipherx-events",
        events=["critical.finding", "drift.detected", "compliance.completed"]
    )

    print("[SUCCESS] Cipher-X demo environment seeded with 5 devices, evaluations, graphs, and audit ledger.")


if __name__ == "__main__":
    seed_demo_dataset()
