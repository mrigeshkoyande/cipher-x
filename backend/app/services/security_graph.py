from typing import Dict, List, Any, Optional, Set
import networkx as nx
from app.compliance_engine.loader import compliance_loader
from app.compliance_engine.evaluator import compliance_evaluator


class SecurityGraphService:
    """Security Knowledge & Relationship Graph Engine."""

    def __init__(self):
        self.graph = nx.DiGraph()
        self.loader = compliance_loader
        self.evaluator = compliance_evaluator

    def build_graph_for_evaluation(
        self,
        device_id: str,
        device_name: str,
        vendor: str,
        config_id: str,
        evaluation_result: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Builds directed graph nodes and edges for a device configuration evaluation."""
        g = nx.DiGraph()

        # 1. Device Node
        dev_node_id = f"dev:{device_id}"
        g.add_node(
            dev_node_id,
            id=dev_node_id,
            label=device_name,
            type="Device",
            vendor=vendor,
            risk_score=evaluation_result.get("device_risk_score", 0),
            grade=evaluation_result.get("grade", "N/A"),
            compliance_score=evaluation_result.get("compliance_score", 0)
        )

        # 2. Configuration Node
        cfg_node_id = f"cfg:{config_id}"
        g.add_node(
            cfg_node_id,
            id=cfg_node_id,
            label=f"Config ({vendor})",
            type="Configuration",
            vendor=vendor
        )
        g.add_edge(dev_node_id, cfg_node_id, relation="HAS_CONFIGURATION")

        # 3. Facts Nodes
        facts = evaluation_result.get("normalized_facts", {})
        for f_key, f_val in facts.items():
            fact_node_id = f"fact:{config_id}:{f_key}"
            g.add_node(
                fact_node_id,
                id=fact_node_id,
                label=f"{f_key} = {f_val}",
                type="Fact",
                key=f_key,
                value=str(f_val)
            )
            g.add_edge(cfg_node_id, fact_node_id, relation="EXTRACTED_FACT")

        # 4. Controls & Findings & Remediations
        all_results = evaluation_result.get("all_results", [])
        for res in all_results:
            ctrl_id = res["control_id"]
            ctrl_node_id = f"ctrl:{ctrl_id}"
            g.add_node(
                ctrl_node_id,
                id=ctrl_node_id,
                label=f"{ctrl_id}: {res['title'][:25]}...",
                title=res["title"],
                type="Control",
                severity=res["severity"],
                category=res["category"]
            )

            fact_key = res["normalized_fact"]["key"]
            fact_node_id = f"fact:{config_id}:{fact_key}"
            if g.has_node(fact_node_id):
                g.add_edge(fact_node_id, ctrl_node_id, relation="EVALUATES_FACT")

            # Finding Node if not passed
            if res["status"] in ["FAIL", "WARNING", "UNKNOWN"]:
                find_node_id = f"find:{device_id}:{ctrl_id}"
                g.add_node(
                    find_node_id,
                    id=find_node_id,
                    label=f"Finding: {ctrl_id} ({res['status']})",
                    type="Finding",
                    status=res["status"],
                    severity=res["severity"],
                    risk_score=res["risk_score"],
                    explanation=res["explanation"]
                )
                g.add_edge(ctrl_node_id, find_node_id, relation="GENERATES_FINDING")

                # Risk Node
                risk_node_id = f"risk:{find_node_id}"
                g.add_node(
                    risk_node_id,
                    id=risk_node_id,
                    label=f"Risk ({res['severity']}) - {res['risk_score']} pts",
                    type="Risk",
                    severity=res["severity"],
                    score=res["risk_score"]
                )
                g.add_edge(find_node_id, risk_node_id, relation="POSES_RISK")

                # Remediation Node
                if res.get("remediation"):
                    rem = res["remediation"]
                    rem_node_id = f"rem:{ctrl_id}"
                    g.add_node(
                        rem_node_id,
                        id=rem_node_id,
                        label=f"Fix: {rem['objective'][:30]}...",
                        type="Remediation",
                        objective=rem["objective"],
                        impact=rem.get("impact_level", "LOW"),
                        verification=rem.get("verification_command", "")
                    )
                    g.add_edge(risk_node_id, rem_node_id, relation="RESOLVED_BY")

        # Merge into global service graph
        self.graph = nx.compose(self.graph, g)
        return self._graph_to_dict(g)

    def _graph_to_dict(self, g: nx.DiGraph) -> Dict[str, Any]:
        nodes = []
        for n, data in g.nodes(data=True):
            nodes.append(data)
        edges = []
        for u, v, data in g.edges(data=True):
            edges.append({
                "source": u,
                "target": v,
                "relation": data.get("relation", "CONNECTS_TO")
            })
        return {"nodes": nodes, "edges": edges, "node_count": len(nodes), "edge_count": len(edges)}

    def query_device_subgraph(self, device_id: str) -> Dict[str, Any]:
        """Returns all graph elements connected to a specific device."""
        target_node = f"dev:{device_id}"
        if not self.graph.has_node(target_node):
            return {"nodes": [], "edges": [], "node_count": 0, "edge_count": 0}

        # Find reachable nodes (successors & predecessors up to depth 4)
        reachable_nodes = nx.descendants(self.graph, target_node)
        reachable_nodes.add(target_node)
        sub_g = self.graph.subgraph(reachable_nodes)
        return self._graph_to_dict(sub_g)

    def query_control_impact_subgraph(self, control_id: str) -> Dict[str, Any]:
        """Finds all devices, findings, and remediations connected to a given control ID."""
        ctrl_node = f"ctrl:{control_id}"
        if not self.graph.has_node(ctrl_node):
            return {"nodes": [], "edges": [], "node_count": 0, "edge_count": 0}

        # Include predecessors (Facts -> Configs -> Devices) and successors (Findings -> Risks -> Remediations)
        predecessors = nx.ancestors(self.graph, ctrl_node)
        successors = nx.descendants(self.graph, ctrl_node)
        all_nodes = predecessors.union(successors).union({ctrl_node})
        sub_g = self.graph.subgraph(all_nodes)
        return self._graph_to_dict(sub_g)

    def query_full_graph(self) -> Dict[str, Any]:
        return self._graph_to_dict(self.graph)


# Singleton instance
security_graph_service = SecurityGraphService()
