# Cipher-X REST API Reference

Base URL: `/api/v1`
Interactive Swagger Documentation: `/api/docs`

## 1. Authentication (`/auth`)
- `POST /auth/login`: Authenticate and receive JWT Bearer token
- `GET /auth/me`: Get active authenticated user profile

## 2. Devices & Inventory (`/devices`)
- `GET /devices`: List managed devices with compliance scores and risk levels
- `GET /devices/{id}`: Get device details and evaluation history
- `POST /devices`: Register a new network device

## 3. Configuration Management (`/configurations`)
- `POST /configurations/upload`: Upload raw configuration text (runs prompt defense sanitization, compliance evaluation, drift detection, and blockchain anchoring)
- `GET /configurations/{id}`: Fetch raw configuration revision

## 4. Compliance & Controls (`/compliance`)
- `GET /compliance/frameworks`: List supported compliance frameworks (CIS, NIST, STIG, ISO, Custom)
- `GET /compliance/frameworks/{id}`: Get framework detail with control mappings
- `GET /compliance/controls`: List data-driven control library
- `GET /compliance/controls/{id}`: Get control evaluation logic and AST specification
- `POST /compliance/evaluate`: Evaluate custom configuration payload

## 5. Security Analytics (`/analytics`)
- `GET /analytics/organization-risk`: Comprehensive fleet risk posture, severity distribution, top failed controls, and framework matrix

## 6. Drift Intelligence (`/drift`)
- `GET /drift/device/{id}`: Compare configuration revisions and detect security-relevant drift
- `POST /drift/compare`: Compare two arbitrary configuration strings

## 7. Security Knowledge Graph (`/graph`)
- `GET /graph/full`: Full enterprise ontology graph
- `GET /graph/device/{id}`: Reachable subgraph for a device
- `GET /graph/control/{id}`: Impact subgraph for a control

## 8. What-If Simulator (`/whatif`)
- `GET /whatif/scenarios`: List predefined policy scenarios
- `POST /whatif/simulate`: Forecast compliance score delta and risk reduction for hypothetical configuration mutations

## 9. Remediation Playbooks (`/remediation`)
- `GET /remediation/{vendor}/{control_id}`: Get structured CLI remediation playbook with rollback and verification
- `POST /remediation/dry-run-preview`: Validate change sequence steps without altering hardware

## 10. Grounded AI Security Assistant (`/assistant`)
- `POST /assistant/query`: Ask natural language cybersecurity questions grounded in real telemetry

## 11. Evidence Explorer (`/evidence`)
- `GET /evidence/device/{device_id}/control/{control_id}`: Line-level evidence attribution and code window context

## 12. Audit Integrity & Blockchain (`/audit`, `/blockchain`)
- `GET /audit/events`: Cryptographically chained audit event stream
- `GET /audit/verify`: Re-compute and verify hash chain integrity (`VALID` or `TAMPERED`)
- `POST /audit/simulate-tamper`: Inject payload alteration to test tamper detection
- `GET /blockchain/anchors`: List anchored cryptographic Merkle proofs
- `GET /blockchain/verify/{anchor_id}`: Verify on-chain cryptographic anchor

## 13. Reports & Attestations (`/reports`)
- `GET /reports`: List generated reports
- `POST /reports/generate`: Generate and anchor multi-format compliance report
- `GET /reports/{id}`: Fetch full structured report
- `GET /reports/{id}/export/csv`: Download finding evidence table as CSV

## 14. System Health & Probes (`/health`, `/ready`)
- `GET /health`: Liveness probe
- `GET /ready`: Comprehensive subsystem readiness probe (DB, Redis, Storage, Worker, AI)
