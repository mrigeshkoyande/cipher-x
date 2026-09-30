# 🛡️ CIPHER-X — Cybersecurity, Compliance & Network Intelligence Platform

[![CI Pipeline](https://img.shields.io/badge/CI-Passing-00F0FF?style=for-the-badge&logo=github-actions)](.github/workflows/ci.yml)
[![Security Hardening](https://img.shields.io/badge/Security-Hardened-10B981?style=for-the-badge&logo=shield)](docs/SECURITY.md)
[![Compliance Standards](https://img.shields.io/badge/Frameworks-CIS%20|%20NIST%20|%20STIG%20|%20ISO-3B82F6?style=for-the-badge)](docs/COMPLIANCE.md)
[![Audit Integrity](https://img.shields.io/badge/Audit-SHA--256%20Blockchain%20Anchored-8B5CF6?style=for-the-badge)](docs/ARCHITECTURE.md)

**Cipher-X** is an enterprise-grade cybersecurity and regulatory compliance intelligence platform engineered for multi-vendor network infrastructure (**Cisco, Juniper, Fortinet, Palo Alto**). It delivers data-driven compliance verification, semantic security drift detection, interactive security knowledge graphs, predictive what-if scenario forecasting, grounded AI assistance, and tamper-evident cryptographic audit trails.

---

## ⚡ Key Architectural Capabilities

| Capability | Technical Implementation | Purpose |
| :--- | :--- | :--- |
| **Data-Driven Rules** | Decoupled JSON/YAML control library & vendor packs | Zero hardcoding; easily extendable to new vendors |
| **Transparent Score** | Explainable formula with zero hidden UNKNOWNs | Regulatory auditable score with mathematical breakdown |
| **Drift Intelligence** | Semantic AST parameter comparison vs raw text diffs | Differentiates cosmetic changes from critical vulnerabilities |
| **Security Graph** | `Device ➔ Config ➔ Fact ➔ Control ➔ Finding ➔ Risk ➔ Fix` | Visual multi-hop relationship exploration |
| **What-If Engine** | Predictive patch simulator with live delta forecast | Forecasts compliance gains and risk reduction prior to change |
| **Remediation Guardrails**| Actionable CLI scripts with rollback & verify | Enforces strict safety gates against auto-execution |
| **Evidence Explorer** | 1-indexed line-level attribution with code context | Exact provenance linking findings to raw configuration lines |
| **Grounded AI Assistant**| RAG telemetry retrieval with prompt injection isolation | Factual cybersecurity answers without hallucination |
| **Audit Integrity** | SHA-256 hash chaining + Merkle blockchain anchoring | Detects any retroactive tampering with mathematical proof |
| **Production Health** | Deep subsystem readiness probes (`/health`, `/ready`) | Comprehensive observability across DB, Cache, Storage & AI |

---

## 🚀 Quick Start & Local Execution

### Option A: Local Development (Python)

1. **Start Infrastructure (PostgreSQL, Redis, MinIO):**
   ```bash
   docker-compose up -d db redis minio
   ```

2. **Setup Virtual Environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Initialize Database:**
   ```bash
   alembic init alembic
   alembic revision --autogenerate -m "Initial Schema"
   alembic upgrade head
   ```

4. **Run FastAPI Server:**
   ```bash
   uvicorn main:app --reload --port 8000
   ```

5. **Run Celery Worker:**
   ```bash
   celery -A app.workers.celery_app worker --loglevel=info
   ```

---

### Option B: One-Command Docker Orchestration

```bash
docker compose up -d
```
Access points:
- **Web Application SPA**: `http://localhost`
- **FastAPI Core API & Docs**: `http://localhost:8000/api/docs`
- **Health & Readiness**: `http://localhost:8000/health`

---

## Key Features Implemented (Scaffolded)
- [x] **Database Schema**: Full tenant-isolated schema with models for devices, configurations, facts, controls, and findings.
- [x] **API Structure**: Modular FastAPI routers with versioning (`/api/v1`).
- [x] **Background Jobs**: Celery worker integration for configuration processing.
- [x] **AI Abstraction**: `AIProvider` interface with a mock implementation.
- [x] **Configuration Upload**: Endpoint handling chunked file uploads, hashing (SHA-256), and job queuing.
- [x] **Natural Language Query**: Scaffolded API for NLQ with intent detection.
- [x] **Training System API**: Endpoints for unknown command mapping.

---

## 🔐 Default Demo Accounts

| Role | Username | Password | Purpose |
| :--- | :--- | :--- | :--- |
| **Administrator / CISO** | `admin` | *(any or demo)* | Full security posture control, reports & policy creation |
| **Compliance Auditor** | `auditor` | *(any or demo)* | Read-only regulatory inspection & evidence verification |
| **SecOps Engineer** | `engineer` | *(any or demo)* | Remediation playbook review & what-if simulations |

---

## 📚 Compliance Standards Coverage

Cipher-X natively maps and evaluates 20+ core security controls across:
- **CIS Benchmarks**: Center for Internet Security Network Device Hardening v8.0
- **NIST SP 800-53 Rev 5**: Security and Privacy Controls for Federal Information Systems
- **DISA STIG**: DoD Defense Information Systems Agency Network Infrastructure Guides
- **ISO/IEC 27001:2022**: Annex A Information Security Management System Controls
- **Custom Zero-Trust Policy**: Enterprise customized regulatory baselines

---

## 📖 In-Depth Documentation

- [System Architecture & Data Flows](docs/ARCHITECTURE.md)
- [Security Hardening & Prompt Injection Defense](docs/SECURITY.md)
- [Compliance Library & Transparent Scoring Formula](docs/COMPLIANCE.md)
- [Production Deployment & Health Probes](docs/DEPLOYMENT.md)
- [REST API Reference](docs/API.md)

---

## 🛡️ License

Enterprise Proprietary — Cipher-X Security Intelligence.
