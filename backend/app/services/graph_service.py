from typing import Dict, Any, List
from sqlalchemy.orm import Session
from app.models.db_models import Device, Configuration, Finding, NormalizedFact

class GraphService:
    @staticmethod
    def build_security_graph(db: Session, tenant_id: str, device_id: str = None) -> Dict[str, Any]:
        query = db.query(Device).filter(Device.tenant_id == tenant_id)
        if device_id:
            query = query.filter(Device.id == device_id)
        
        devices = query.all()
        nodes = []
        edges = []

        node_id_set = set()

        def add_node(nid: str, label: str, ntype: str, status: str = None, severity: str = None, data: dict = None):
            if nid not in node_id_set:
                node_id_set.add(nid)
                nodes.append({
                    "id": nid,
                    "label": label,
                    "type": ntype,
                    "status": status,
                    "severity": severity,
                    "data": data or {}
                })

        def add_edge(eid: str, source: str, target: str, label: str = None):
            edges.append({
                "id": eid,
                "source": source,
                "target": target,
                "label": label
            })

        for dev in devices:
            d_node_id = f"dev_{dev.id}"
            add_node(d_node_id, dev.name, "device", status=dev.status, data={"vendor": dev.vendor, "platform": dev.platform, "score": dev.compliance_score})

            latest_config = db.query(Configuration).filter(Configuration.device_id == dev.id).order_by(Configuration.version.desc()).first() if hasattr(Configuration.version, 'desc') else db.query(Configuration).filter(Configuration.device_id == dev.id).first()
            if latest_config:
                c_node_id = f"cfg_{latest_config.id}"
                add_node(c_node_id, f"{latest_config.filename} (v{latest_config.version})", "configuration", data={"hash": latest_config.sha256_hash[:8]})
                add_edge(f"e_{d_node_id}_{c_node_id}", d_node_id, c_node_id, "has_version")

                # Add findings
                findings = db.query(Finding).filter(Finding.configuration_id == latest_config.id).all()
                for find in findings[:6]: # top findings
                    f_node_id = f"find_{find.id}"
                    add_node(f_node_id, f"{find.control_id}: {find.title}", "finding", status=find.status, severity=find.severity, data={"observed": str(find.observed_value), "lines": f"{find.start_line}-{find.end_line}"})
                    add_edge(f"e_{c_node_id}_{f_node_id}", c_node_id, f_node_id, "evaluates")

                    if find.remediation_command:
                        rem_node_id = f"rem_{find.id}"
                        add_node(rem_node_id, f"Remediation: {find.control_id}", "remediation", severity=find.severity, data={"command": find.remediation_command})
                        add_edge(f"e_{f_node_id}_{rem_node_id}", f_node_id, rem_node_id, "mitigated_by")

        return {"nodes": nodes, "edges": edges}
