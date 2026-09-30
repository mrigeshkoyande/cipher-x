# CIPHER-X BRAIN — Intelligence, Parsing & Compliance Engine Specification 🧠

> **Document Version:** 1.0.0  
> **Status:** Production Architecture Specification  
> **Target Audience:** Security Engineers, System Architects, Platform Developers

---

## 📑 Table of Contents

1. [Architectural Philosophy: Deterministic vs. Probabilistic](#1-architectural-philosophy-deterministic-vs-probabilistic)
2. [Multi-Vendor AST Parsing & Grammar Engine](#2-multi-vendor-ast-parsing--grammar-engine)
   - [Vendor Detection & Fingerprinting Heuristics](#21-vendor-detection--fingerprinting-heuristics)
   - [Lexical Processing & Context Tracking](#22-lexical-processing--context-tracking)
   - [The Canonical NormalizedFact Model](#23-the-canonical-normalizedfact-model)
3. [The Deterministic Compliance Evaluation Engine](#3-the-deterministic-compliance-evaluation-engine)
   - [Operator Algebra](#31-operator-algebra)
   - [Multi-Framework Mapping Matrix](#32-multi-framework-mapping-matrix)
   - [Compliance Scoring Formulation](#33-compliance-scoring-formulation)
   - [Evidence Binding & Cryptographic Line Coordinate Tracing](#34-evidence-binding--cryptographic-line-coordinate-tracing)
4. [AI Co-Pilot & Adaptive Intelligence Pipeline](#4-ai-co-pilot--adaptive-intelligence-pipeline)
   - [Provider Abstraction & Fault Tolerance](#41-provider-abstraction--fault-tolerance)
   - [Unknown Command Hypothesis Generation](#42-unknown-command-hypothesis-generation)
   - [Natural Language Query Synthesis (RAG)](#43-natural-language-query-synthesis-rag)
5. [The Active Learning Training Studio](#5-the-active-learning-training-studio)
   - [Human-in-the-Loop Feedback Loop](#51-human-in-the-loop-feedback-loop)
   - [Grammar Rule Persistence & Dynamic Ingestion](#52-grammar-rule-persistence--dynamic-ingestion)
6. [Security Topology Knowledge Graph Engine](#6-security-topology-knowledge-graph-engine)
   - [Entity Extraction & Node Typing](#61-entity-extraction--node-typing)
   - [Adjacency & Blast Radius Traversal](#62-adjacency--blast-radius-traversal)
7. [What-If Blast Radius Simulation Engine](#7-what-if-blast-radius-simulation-engine)
   - [State Mutation & AST Delta Modeling](#71-state-mutation--ast-delta-modeling)
   - [Hypothetical Compliance Delta Projection](#72-hypothetical-compliance-delta-projection)
8. [Configuration Drift & Temporal Diffing](#8-configuration-drift--temporal-diffing)
   - [Lexical vs. Semantic AST Diffing](#81-lexical-vs-semantic-ast-diffing)
   - [Drift Severity Scoring](#82-drift-severity-scoring)
9. [Autonomous Remediation & Rollback Generation](#9-autonomous-remediation--rollback-generation)

---

## 1. Architectural Philosophy: Deterministic vs. Probabilistic

A fundamental tenet in mission-critical network security operations is that **probabilistic models (Large Language Models) must never be the final arbiter of compliance truth.**

```
                     ┌──────────────────────────────────────────────┐
                     │          RAW NETWORK CONFIGURATION           │
                     └──────────────────────┬───────────────────────┘
                                            │
                                            ▼
                     ┌──────────────────────────────────────────────┐
                     │      DETERMINISTIC MULTI-VENDOR PARSER       │
                     │  - Exact AST extraction                      │
                     │  - Line-by-line coordinate mapping           │
                     └──────────────┬───────────────────────────────┘
                                    │
                  ┌─────────────────┴─────────────────┐
                  ▼                                   ▼
        [ Known Syntax Path ]               [ Unknown Syntax Path ]
                  │                                   │
                  ▼                                   ▼
        ┌──────────────────┐                ┌──────────────────┐
        │  NormalizedFact  │                │  AI Hypothesizer │
        │  Extraction      │                │  (Gemini Model)  │
        └─────────┬────────┘                └─────────┬────────┘
                  │                                   │
                  │                         ┌─────────▼────────┐
                  │                         │  Training Studio │
                  │                         │  (Human Analyst) │
                  │                         └─────────┬────────┘
                  │                                   │ (Approved)
                  ▼                                   ▼
        ┌──────────────────────────────────────────────────────┐
        │        DETERMINISTIC COMPLIANCE ENGINE (CIS/NIST)     │
        │        - Mathematical Operator Evaluation            │
        │        - 100% Reproducible Finding Generation        │
        └──────────────────────────────────────────────────────┘
```

### Why Pure LLMs Fail for Network Audits
1. **Hallucination of Non-Existent Commands**: LLMs frequently assume default statements exist that were disabled in sub-blocks.
2. **Loss of Non-Repudiable Evidence**: Auditors require exact line numbers (`lines 38-42 in core-sw-01.cfg`). LLMs fail at exact line indexing across 10,000-line running configurations.
3. **Non-Deterministic Outputs**: Re-running an audit on the same configuration must produce the identical cryptographic result every second of every day.

**CIPHER-X Solution:**
- **Deterministic Core**: Compiles configurations into strongly-typed `NormalizedFact` entities with rigorous regex and state machines.
- **AI as Co-Pilot**: LLMs are restricted to parsing unrecognized proprietary commands, hypothesizing schemas for human approval in the Training Studio, translating natural language queries into structured database lookups, and generating human-readable explanations.

---

## 2. Multi-Vendor AST Parsing & Grammar Engine

### 2.1 Vendor Detection & Fingerprinting Heuristics
Before parsing, `VendorDetector.detect()` runs pattern-matching heuristics over the initial byte stream to establish vendor identity, OS platform, and confidence score:

| Vendor | Primary Markers | Platform Identified | Confidence |
| :--- | :--- | :--- | :--- |
| **Cisco** | `service password-encryption`, `line vty`, `ios-xe`, `version 1` | `IOS-XE` / `IOS` | 0.98 |
| **Juniper** | `system {`, `interfaces {`, `set system`, `junos` | `Junos` | 0.96 |
| **Fortinet** | `config system`, `config firewall`, `fortigate`, `fortios` | `FortiOS` | 0.97 |
| **Palo Alto** | `set deviceconfig`, `set network`, `pan-os`, `paloalto` | `PAN-OS` | 0.95 |
| **Generic** | *(Fallback CLI syntax)* | `Generic CLI` | 0.50 |

### 2.2 Lexical Processing & Context Tracking
Network configurations use diverse formatting conventions:
- **Hierarchical Bracket Blocks** (Juniper Junos: `protocols { bgp { ... } }`)
- **Block Indentation & Exit Delimiters** (Cisco: `line vty 0 4` followed by child lines ending with `!`)
- **Table Directives** (Fortinet: `config router bgp` ... `edit 1` ... `next` ... `end`)
- **Flat Set Statements** (Palo Alto / Junos set format: `set system services ssh protocol-version v2`)

The `parser_service.py` architecture maintains a lexical state machine:
- Tracks current parent context (`in_line_vty`, `current_interface`, `in_snmp`).
- Accumulates multi-line declarations into contiguous line ranges (`start_line`, `end_line`).
- Extracts values and casts them into native Python types (booleans, integers, strings, CIDR networks).

### 2.3 The Canonical NormalizedFact Model
Every valid statement is mapped into a normalized fact structure:

```python
class RawFact:
    category: str        # e.g., "management", "password_policy", "snmp", "logging"
    parameter: str       # Dot-delimited canonical path, e.g., "management.ssh.version"
    value: Any           # Strongly typed value (int 2, bool True, "AES-256")
    raw_text: str        # Exact raw configuration string from file
    start_line: int      # 1-indexed starting line in file
    end_line: int        # 1-indexed ending line in file
    confidence: float    # Parser confidence (1.0 for native rules, <1.0 for AI rules)
    is_unknown: bool     # True if command required AI heuristic inference
    raw_command: str     # Raw command token
```

---

## 3. The Deterministic Compliance Evaluation Engine

### 3.1 Operator Algebra
`ComplianceEngine.evaluate_operator(op, observed, expected)` implements a mathematically rigorous evaluation algebra:

```
┌──────────────────┬──────────────────────────────────────────────────────────┐
│ Operator         │ Evaluation Logic                                         │
├──────────────────┼──────────────────────────────────────────────────────────┤
│ EQUALS           │ observed == expected                                     │
│ NOT_EQUALS       │ observed != expected                                     │
│ GREATER_THAN     │ float(observed) > float(expected)                        │
│ LESS_THAN        │ float(observed) < float(expected)                        │
│ CONTAINS         │ expected in observed (list or case-insensitive string)   │
│ NOT_CONTAINS     │ not CONTAINS(observed, expected)                         │
│ IN               │ observed in expected (iterable collection)               │
│ REGEX            │ re.search(regex_pattern, observed)                       │
│ EXISTS           │ observed is not None                                     │
│ NOT_EXISTS       │ observed is None                                         │
└──────────────────┴──────────────────────────────────────────────────────────┘
```

### 3.2 Multi-Framework Mapping Matrix
A single `NormalizedFact` satisfies controls across multiple independent regulatory standards:

| Normalized Parameter | CIS Benchmark Control | NIST 800-53 Rev 5 | PCI-DSS v4.0 | ISO 27001:2022 |
| :--- | :--- | :--- | :--- | :--- |
| `management.ssh.version >= 2` | CIS 1.1.1 (Level 1) | SC-8, IA-5(1) | Req 2.2.4 | A.8.20 |
| `management.telnet.enabled == False`| CIS 1.1.2 (Level 1) | AC-17, CM-7 | Req 2.2.3 | A.8.20 |
| `snmp.v3_enabled == True` | CIS 1.2.1 (Level 1) | IA-2, SC-13 | Req 2.2.7 | A.8.24 |
| `logging.syslog.remote_host == EXISTS`| CIS 1.3.1 (Level 1)| AU-2, AU-4, AU-9 | Req 10.2.1 | A.8.15 |
| `password_policy.min_length >= 12` | CIS 1.4.1 (Level 2)| IA-5(1) | Req 8.3.6 | A.8.5 |

### 3.3 Compliance Scoring Formulation
The compliance score $S_{framework}$ for any device or tenant is computed as a weighted ratio:

$$S = \frac{\sum_{i=1}^{N_{passed}} w(c_i)}{\sum_{j=1}^{N_{total}} w(c_j)} \times 100$$

Where weights $w(c)$ reflect control severity:
- **CRITICAL**: Weight = 4.0
- **HIGH**: Weight = 3.0
- **MEDIUM**: Weight = 2.0
- **LOW**: Weight = 1.0

### 3.4 Evidence Binding & Cryptographic Line Coordinate Tracing
When a finding is produced, the engine binds the exact line coordinates to the finding record:

```json
{
  "finding_id": "find-cisco-core-01-telnet-001",
  "control_id": "CIS-1.1.2",
  "severity": "CRITICAL",
  "title": "Telnet Remote Management Protocol Enabled",
  "observed_value": true,
  "expected_value": false,
  "line_start": 38,
  "line_end": 42,
  "evidence_snippet": "line vty 0 4\n transport input telnet ssh\n login local",
  "remediation_summary": "Configure 'transport input ssh' under line vty configuration."
}
```

---

## 4. AI Co-Pilot & Adaptive Intelligence Pipeline

### 4.1 Provider Abstraction & Fault Tolerance
The AI pipeline relies on a polymorphic provider model defined in `ai_service.py`:
- `BaseAIProvider`: Abstract base interface.
- `GeminiProvider`: Connects to Google's Gemini LLM using REST/gRPC when `GEMINI_API_KEY` is provided.
- `MockAIProvider`: Zero-dependency, offline deterministic fallback engine ensuring 100% uptime in air-gapped secure labs.

### 4.2 Unknown Command Hypothesis Generation
When the parser encounters a line unrecognized by its native grammar rules:
1. It extracts the raw command token (e.g. `service custom-sec-proto 9443`).
2. Transmits the snippet and enclosing vendor context to `AIService.interpret_unknown()`.
3. The model returns a structured JSON hypothesis:
   - `suggested_parameter`: Canonical dot-path (e.g., `management.remote_access.custom_protocol`).
   - `expected_type`: Data type (`boolean`, `integer`, `string`).
   - `confidence`: Algorithmic probability ($0.0 \le C \le 1.0$).
   - `reasoning`: Technical rationale.
4. If $C \ge 0.90$, the fact is ingested in draft mode; if $C < 0.90$, it triggers a review event in the Training Studio.

### 4.3 Natural Language Query Synthesis (RAG)
Analysts can query their entire fleet in plain English (e.g., *"Which core routers still have Telnet enabled or lack NTP synchronization?"*):
1. **Query Deconstruction**: Extracts entities (`core routers`), protocols (`Telnet`, `NTP`), and status condition (`enabled`, `missing`).
2. **Context Retrieval**: Queries SQLite/PostgreSQL `NormalizedFact` and `Device` tables for matching parameter paths.
3. **Evidence Synthesis**: Returns natural language answers with direct links to device configurations and exact line numbers.

---

## 5. The Active Learning Training Studio

```
┌──────────────────┐     Unrecognized     ┌────────────────────┐
│ Multi-Vendor CLI ├─────────────────────►│ AI Hypothesis Engine│
└──────────────────┘                      └─────────┬──────────┘
                                                    │ Low Confidence
                                                    ▼
                                          ┌────────────────────┐
                                          │  Training Studio   │
                                          │ (Analyst Interface)│
                                          └─────────┬──────────┘
                                                    │
                             ┌──────────────────────┴──────────────────────┐
                             │ Approve / Remap                              │ Reject
                             ▼                                             ▼
                 ┌────────────────────────┐                    ┌──────────────────────┐
                 │ Permanent Grammar Rule │                    │ Ignored Rule Base    │
                 │ Stored in Database     │                    │ (Discard Noise)      │
                 └───────────┬────────────┘                    └──────────────────────┘
                             │
                             ▼
                 Applied to All Future Audits
```

### 5.1 Human-in-the-Loop Feedback Loop
- **Pending Review Pool**: Collects all unrecognized syntax across uploads.
- **Interactive Review Card**: Shows raw configuration context, AI suggestion, and proposed canonical parameter.
- **Analyst Actions**:
  - **Approve**: Confirms the parameter path and data type.
  - **Modify & Map**: Edits the parameter path to an existing canonical schema.
  - **Dismiss**: Marks the line as cosmetic/irrelevant banner text.

### 5.2 Grammar Rule Persistence & Dynamic Ingestion
Approved training rules are saved to the database. On subsequent parse runs, `parser_service.py` executes user-approved dynamic rules before invoking the generic fallback, ensuring zero code redeployment.

---

## 6. Security Topology Knowledge Graph Engine

### 6.1 Entity Extraction & Node Typing
`graph_service.py` synthesizes parsed configuration facts into an interactive network topology powered by `@xyflow/react`:
- **Nodes**:
  - `DeviceNode`: Hardware identity, vendor badge, compliance score indicator.
  - `InterfaceNode`: Physical/logical ports (GigabitEthernet, loopback, vlan).
  - `VlanNode`: Broadcast domains and segmentation.
  - `PolicyNode`: Access Control Lists (ACLs) and firewall rule sets.
- **Edges**:
  - `CONNECTED_TO`: Physical interconnects derived from IP/subnet adjacency.
  - `MEMBER_OF`: VLAN memberships.
  - `PROTECTED_BY`: ACL / Firewall policy bindings.

### 6.2 Adjacency & Blast Radius Traversal
When a device is compromised or modified:
1. Depth-First Search (DFS) traverses neighboring subnets and peering interfaces.
2. Identifies all downstream systems exposed to unencrypted management protocols.
3. Visualizes highlighted risk propagation paths on the graph canvas.

---

## 7. What-If Blast Radius Simulation Engine

```
[ Current Golden Config ] ───► [ Proposed CLI Delta ]
             │                              │
             ▼                              ▼
    Current Fact Model             Simulated Fact Model
             │                              │
             ▼                              ▼
   Compliance Score: 84%          Compliance Score: 92%
             │                              │
             └──────────────┬───────────────┘
                            ▼
               [ Predicted Impact Matrix ]
               - 3 Findings Remediated
               - 1 New Severity Finding Introduced
               - Blast Radius: 4 Subnets Affected
```

### 7.1 State Mutation & AST Delta Modeling
The simulation engine (`simulation_service.py`) operates in an ephemeral transaction:
1. Deep-copies the existing `NormalizedFact` state for the target device.
2. Applies proposed CLI additions or removals.
3. Re-evaluates grammar rules against the mutated state.

### 7.2 Hypothetical Compliance Delta Projection
- Computes $\Delta S = S_{simulated} - S_{current}$.
- Flags **Regressions**: Instances where fixing one finding inadvertently introduces a new security defect (e.g., restricting an ACL but accidentally opening Telnet access).

---

## 8. Configuration Drift & Temporal Diffing

### 8.1 Lexical vs. Semantic AST Diffing
Standard `git diff` produces false alarms due to timestamp updates, NTP drift, or comment shifts. CIPHER-X performs **Dual-Layer Diffing**:
1. **Lexical Layer**: Classic line-by-line unified diff.
2. **Semantic AST Layer**: Compares normalized facts. If a line moves from line 40 to line 80 but retains its value (`snmp-server community encrypted`), the semantic diff registers **NO DRIFT**.

### 8.2 Drift Severity Scoring
- **CRITICAL DRIFT**: Deletion of authentication controls, modification of firewall allow-rules, enabling unencrypted management.
- **LOW DRIFT**: Interface description changes, hostname suffix updates.

---

## 9. Autonomous Remediation & Rollback Generation

For every violation, CIPHER-X synthesizes vendor-specific remediation scripts:

```cisco
! ==========================================
! CIPHER-X REMEDIATION SCRIPT
! Device: CORE-SW-01 (Cisco IOS-XE)
! Control: CIS-1.1.2 (Disable Telnet)
! ==========================================
configure terminal
line vty 0 4
 transport input ssh
 exit
line vty 5 15
 transport input ssh
 exit
end
write memory
```

```cisco
! ==========================================
! CIPHER-X EMERGENCY ROLLBACK SCRIPT
! ==========================================
configure terminal
line vty 0 4
 transport input telnet ssh
 exit
line vty 5 15
 transport input telnet ssh
 exit
end
```

---

**CIPHER-X Brain Core.** Where rigorous deterministic engineering meets active machine intelligence.
