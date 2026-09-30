# CIPHER-X 🛡️⚡
### AI-Powered Multi-Vendor Network Security Compliance Auditor

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg?style=flat&logo=fastapi)](https://fastapi.tiangolo.com)
[![React 19](https://img.shields.io/badge/Frontend-React%2019-61DAFB.svg?style=flat&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6.svg?style=flat&logo=typescript)](https://www.typescriptlang.org)
[![Python 3.13](https://img.shields.io/badge/Python-3.13%2B-3776AB.svg?style=flat&logo=python)](https://python.org)
[![Tailwind CSS v4](https://img.shields.io/badge/Styling-Tailwind%20v4-38B2AC.svg?style=flat&logo=tailwind-css)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> **Understand. Audit. Secure.**  
> CIPHER-X is an enterprise-grade network security compliance and posture management platform that parses heterogeneous network configurations (Cisco, Juniper, Fortinet, Palo Alto), extracts normalized configuration facts, audits them deterministically against industry standards (CIS, NIST, PCI-DSS, ISO 27001), and leverages active-learning AI to handle unknown syntax, blast-radius simulations, and autonomous remediation.

---

## 📑 Table of Contents

1. [Executive Overview](#-executive-overview)
2. [Key Capabilities](#-key-capabilities)
3. [Architecture Overview](#-architecture-overview)
4. [Technology Stack](#-technology-stack)
5. [Directory Layout](#-directory-layout)
6. [Getting Started (Local Development)](#-getting-started-local-development)
   - [Prerequisites](#prerequisites)
   - [Backend Setup](#1-backend-setup)
   - [Frontend Setup](#2-frontend-setup)
7. [Environment Configuration](#-environment-configuration)
8. [API Documentation](#-api-documentation)
9. [Core Workflows](#-core-workflows)
   - [Configuration Ingestion & Fingerprinting](#1-configuration-ingestion--fingerprinting)
   - [Deterministic Compliance Auditing](#2-deterministic-compliance-auditing)
   - [Human-in-the-Loop Training Studio](#3-human-in-the-loop-training-studio)
   - [Security Topology Knowledge Graph](#4-security-topology-knowledge-graph)
   - [What-If Blast Radius Simulation](#5-what-if-blast-radius-simulation)
   - [Configuration Drift Timeline](#6-configuration-drift-timeline)
10. [Automated Testing](#-automated-testing)
11. [Production & Kubernetes Deployment](#-production--kubernetes-deployment)
12. [Related Documentation](#-related-documentation)

---

## 🌟 Executive Overview

Modern enterprise networks span multiple hardware vendors, firmware iterations, and syntax dialects. Auditing these environments typically involves fragile regex scripts or human error:
- **Vendor Fragmentation**: A Cisco IOS-XE command differs drastically from Juniper Junos hierarchical blocks, FortiOS tables, or Palo Alto set directives.
- **Hallucination Risk**: Pure LLMs hallucinate security rules, missing subtle syntax deviations or misinterpreting critical access-lists.
- **Evidence Gap**: Compliance auditors require exact line-numbered evidence, not vague summaries.

**CIPHER-X solves this through a hybrid architecture:**
1. **Deterministic Core**: Parsers transform raw CLI dumps into canonical `NormalizedFact` representations with exact line-range coordinates.
2. **Deterministic Rules Engine**: Controls are evaluated using mathematical operators (`EQUALS`, `CONTAINS`, `REGEX`, `GREATER_THAN`) with zero hallucination.
3. **Probabilistic AI Co-Pilot (Gemini / Adaptive Provider)**: Discovers unrecognized vendor idioms, assists in natural-language queries, and simulates configuration changes.
4. **Active Learning Training Studio**: Security analysts review AI suggestions once, and CIPHER-X commits the grammar rule permanently to its deterministic engine.

---

## 🚀 Key Capabilities

- **Multi-Vendor CLI Parser**: Native grammar adapters for:
  - **Cisco Systems**: IOS, IOS-XE, NX-OS, ASA
  - **Juniper Networks**: Junos OS (hierarchical & set syntax)
  - **Fortinet**: FortiOS CLI (`config system`, `config firewall`)
  - **Palo Alto Networks**: PAN-OS set hierarchies
- **Multi-Standard Compliance Auditing**:
  - **CIS Benchmarks** (Level 1 & Level 2 profiles)
  - **NIST SP 800-53 Rev 5** (AC, CM, IA, SC controls)
  - **PCI-DSS v4.0** (Cardholder Data Environment firewalls)
  - **ISO/IEC 27001:2022** (A.8 Technological controls)
- **Cinematic Startup & Official Identity**:
  - Dynamic 8-second boot telemetry splash screen with countdown and audio toggle.
  - Official high-resolution brand badge throughout the application.
- **Interactive Security Topology Graph**:
  - Interactive nodes and dependency edges rendered with `@xyflow/react`.
  - Visual blast-radius inspection and interface interconnect mapping.
- **Configuration Drift Engine**:
  - Side-by-side AST and lexical diffing across historical uploads.
  - Severity classification for unauthorized drift.
- **What-If Simulation Sandbox**:
  - Test prospective configuration changes before deploying to production routers and firewalls.
  - Predict compliance score delta and new potential vulnerabilities.
- **Automated Remediation CLI Generator**:
  - Generates vendor-tailored CLI commands to remediate findings.
  - Produces rollback scripts to prevent operational lockouts.
- **Executive & Technical PDF Reports**:
  - Generates structured audit reports with compliance scores, executive summaries, and full evidence tables.

---

## 🏗️ Architecture Overview

```
                      ┌──────────────────────────────────────────┐
                      │          React 19 + TypeScript           │
                      │   Vite Dev Server (Port: 5173)           │
                      │  - Dashboard & Finding Drill-Down        │
                      │  - Interactive Security Graph (@xyflow)  │
                      │  - Training Studio (Human-in-the-Loop)   │
                      │  - 8-Sec Cinematic Launch Video Splash   │
                      └────────────────────┬─────────────────────┘
                                           │ HTTP /api/v1 (Proxy)
                                           ▼
                      ┌──────────────────────────────────────────┐
                      │          FastAPI Backend Service         │
                      │          Uvicorn (Port: 8000)            │
                      └────────────────────┬─────────────────────┘
                                           │
         ┌─────────────────────────────────┼────────────────────────────────┐
         │                                 │                                │
         ▼                                 ▼                                ▼
┌──────────────────┐             ┌───────────────────┐            ┌──────────────────┐
│ Vendor Detector  │             │ Compliance Engine │            │    AI Engine     │
│ & AST Parsers    │             │  (Deterministic)  │            │ (Gemini/Adaptive)│
├──────────────────┤             ├───────────────────┤            ├──────────────────┤
│ - Cisco Adapter  │             │ - CIS Benchmarks  │            │ - Unknown Parser │
│ - Juniper Junos  │             │ - NIST 800-53     │            │ - Natural Query  │
│ - Fortinet Forti │             │ - PCI-DSS v4.0    │            │ - Blast Radius   │
│ - Palo Alto PAN  │             │ - ISO 27001       │            │ - Remediation    │
└────────┬─────────┘             └─────────┬─────────┘            └────────┬─────────┘
         │                                 │                               │
         └─────────────────┬───────────────┴───────────────────────────────┘
                           ▼
                 ┌───────────────────┐
                 │ SQLite / Postgres │
                 │   Database Core   │
                 └───────────────────┘
```

---

## 💻 Technology Stack

### Backend
- **Framework**: [FastAPI 0.115+](https://fastapi.tiangolo.com)
- **Runtime**: Python 3.13+
- **ASGI Server**: Uvicorn
- **ORM & Database**: SQLAlchemy with SQLite (Local) / PostgreSQL (Production)
- **Validation**: Pydantic v2
- **AI Integration**: Google Gemini API / Extensible Provider Interface
- **PDF Generation**: ReportLab / Custom PDF service

### Frontend
- **Framework**: [React 19](https://react.dev) + [TypeScript](https://www.typescriptlang.org)
- **Build Tool**: [Vite 8](https://vitejs.dev)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com) + Custom Cyber Theme Variables
- **Interactive Graph**: [@xyflow/react](https://reactflow.dev)
- **Charts & Data Viz**: [Recharts](https://recharts.org)
- **Icons**: Lucide React
- **Linter**: Oxlint

---

## 📂 Directory Layout

```
cipher-x/
├── backend/
│   ├── app/
│   │   ├── api/v1/                  # API Routers (Auth, Devices, Compliance, etc.)
│   │   │   ├── audit.py             # System audit trail endpoints
│   │   │   ├── auth.py              # JWT authentication & session management
│   │   │   ├── compliance.py        # Framework evaluations & scorecards
│   │   │   ├── configurations.py    # Raw config upload, parsing, line retrieval
│   │   │   ├── devices.py           # Device inventory & metadata
│   │   │   ├── drift.py             # Configuration drift analysis
│   │   │   ├── findings.py          # Finding deep-dives & evidence
│   │   │   ├── graph.py             # Security topology graph nodes & edges
│   │   │   ├── health.py            # Health check & system status
│   │   │   ├── query.py             # Natural language analyst queries
│   │   │   ├── remediation.py       # Automated fix & rollback generation
│   │   │   ├── reports.py           # Audit report generation
│   │   │   ├── training.py          # Training studio human-in-the-loop endpoints
│   │   │   └── what_if.py           # What-if blast radius simulation
│   │   ├── core/                    # Security, database connection, settings
│   │   ├── models/                  # SQLAlchemy ORM models
│   │   ├── schemas/                 # Pydantic request/response schemas
│   │   └── services/                # Business logic engines
│   │       ├── ai_service.py        # Gemini & Adaptive AI provider
│   │       ├── compliance_engine.py # Deterministic multi-framework auditor
│   │       ├── drift_service.py     # AST & lexical diff comparison
│   │       ├── graph_service.py     # Graph node & topology synthesis
│   │       ├── parser_service.py    # Multi-vendor AST CLI adapters
│   │       ├── pdf_report_service.py# Executive & technical PDF reports
│   │       └── simulation_service.py# Blast radius & change simulator
├── frontend/
│   ├── public/                      # Static assets (app-logo.png, launch-video.mp4)
│   ├── src/
│   │   ├── components/              # Modular UI components
│   │   │   ├── common/              # Splash screen, modals, status tags
│   │   │   └── layout/              # Sidebar, Topbar, AppShell
│   │   ├── pages/                   # 18 Application Pages
│   │   │   ├── DashboardPage.tsx    # Executive posture scorecard & alert radar
│   │   │   ├── DevicesPage.tsx      # Multi-vendor device inventory
│   │   │   ├── CompliancePage.tsx   # Framework breakdown & control scores
│   │   │   ├── FindingsPage.tsx     # Finding drill-down & line evidence
│   │   │   ├── TrainingPage.tsx     # AI unknown command feedback loop
│   │   │   ├── SecurityGraphPage.tsx# Interactive network topology
│   │   │   ├── SimulationPage.tsx   # What-if sandbox
│   │   │   └── DriftPage.tsx        # Temporal config diffs
│   │   ├── index.css                # CIPHER-X design system & dark tokens
│   │   └── App.tsx                  # Routing & launch video controller
├── deploy/                          # Production deployment assets
│   └── k8s/                         # Kubernetes manifests (00 through 08)
├── design/                          # Source brand assets & startup videos
├── test_fixtures/                   # Sample vendor configurations
├── brain.md                         # Detailed AI & Compliance Engine Spec
├── design.md                        # Visual Design System & UX Specification
├── main.py                          # FastAPI entrypoint runner
└── pytest.ini                       # Test runner configuration
```

---

## 🛠️ Getting Started (Local Development)

### Prerequisites
- **Python**: 3.11 or higher (3.13 recommended)
- **Node.js**: 18.0 or higher
- **Package Managers**: `pip` and `npm`

### 1. Backend Setup

1. Open your terminal in the project root:
   ```bash
   cd cipher-x
   ```
2. Create and activate a Python virtual environment (optional but recommended):
   ```bash
   # Windows PowerShell:
   python -m venv venv
   .\venv\Scripts\Activate.ps1

   # Linux / macOS:
   python3 -m venv venv
   source venv/bin/activate
   ```
3. Install backend dependencies:
   ```bash
   pip install fastapi uvicorn sqlalchemy pydantic pydantic-settings pytest
   ```
4. Start the FastAPI backend:
   ```bash
   python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
   ```
5. Verify backend health by visiting [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs) in your browser.

### 2. Frontend Setup

1. In a separate terminal, navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Launch the Vite development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:5173/](http://localhost:5173/) to access the application.

---

## ⚙️ Environment Configuration

Backend configuration is loaded via environment variables or a `.env` file in the root directory:

| Variable | Default | Description |
| :--- | :--- | :--- |
| `PROJECT_NAME` | `CIPHER-X` | Application display name |
| `VERSION` | `1.0.0` | API release version |
| `API_V1_STR` | `/api/v1` | Root API route prefix |
| `SECRET_KEY` | *(Internal Secret)* | Key for signing JWT tokens |
| `ACCESS_TOKEN_EXPIRE_MINUTES`| `1440` (24h) | Auth token expiration window |
| `DATABASE_URL` | `sqlite:///./cipherx.db` | Database connection string |
| `STORAGE_DIR` | `./storage/configurations` | Local store for raw configuration files |
| `AI_PROVIDER` | `mock` | `mock` for local offline dev, or `gemini` |
| `GEMINI_API_KEY` | *(None)* | Google Gemini API Key for production AI queries |

---

## 📖 API Documentation

Once the backend is running, complete interactive OpenAPI documentation is accessible at:
- **Swagger UI**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **ReDoc**: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

### Primary API Endpoints

- `POST /api/v1/configurations/upload` — Ingest raw network config file.
- `GET /api/v1/compliance/scorecards` — Retrieve compliance posture across frameworks.
- `GET /api/v1/findings/` — Query security findings with severity, status, and device filters.
- `GET /api/v1/training/pending` — Fetch unknown commands requiring analyst feedback.
- `POST /api/v1/training/approve` — Commit verified rule interpretation into the engine.
- `POST /api/v1/what-if/simulate` — Predict impact of CLI configuration changes.
- `GET /api/v1/drift/compare` — Compare two configuration snapshots.
- `POST /api/v1/query/` — Natural language query interface with source citations.
- `POST /api/v1/remediation/generate` — Generate CLI fix scripts with rollback directives.

---

## 🔄 Core Workflows

### 1. Configuration Ingestion & Fingerprinting
When a raw text configuration file is uploaded:
1. `VendorDetector` inspects syntax heuristics to classify the device vendor (`Cisco`, `Juniper`, `Fortinet`, `Palo Alto`) and platform with confidence metrics.
2. The appropriate `VendorAdapter` parses the text line-by-line into an AST.
3. Every recognized statement produces a `NormalizedFact` with parameter paths (e.g., `management.ssh.version = 2`), line coordinates (`start_line`, `end_line`), and source text.
4. Unknown statements are tagged as `is_unknown = True` and forwarded to the Training Studio.

### 2. Deterministic Compliance Auditing
1. For each registered compliance standard (e.g. CIS Cisco IOS Benchmark v2.0):
   - The engine queries the controls catalog.
   - Evaluates the operator (`EQUALS`, `LESS_THAN`, `REGEX`, etc.) against the facts.
2. If the observed value violates the rule:
   - A `Finding` record is generated with a unique finding ID.
   - Exact configuration line numbers are bound as non-repudiable audit evidence.
   - Severity is assigned: `CRITICAL`, `HIGH`, `MEDIUM`, or `LOW`.

### 3. Human-in-the-Loop Training Studio
1. Unknown proprietary commands are analyzed by the AI provider to hypothesize their parameter classification and security implication.
2. The security analyst reviews the suggestion in the Training Studio UI.
3. Upon approval, the rule is stored in the database, automatically updating all future parser passes without code deployment.

---

## 🧪 Automated Testing

Run the comprehensive test suite locally:

```bash
# Run backend pytest suite:
python -m pytest

# Run frontend typescript validation:
cd frontend
npm run build

# Run frontend linting:
npm run lint
```

---

## 🚢 Production & Kubernetes Deployment

Kubernetes manifests are organized sequentially under [deploy/k8s/](file:///c:/Users/Mrigesh%20koyande/OneDrive/Desktop/cipher-x/cipher-x/deploy/k8s):

```bash
kubectl apply -f deploy/k8s/00-namespace.yaml
kubectl apply -f deploy/k8s/01-configmap.yaml
kubectl apply -f deploy/k8s/02-secret.yaml
kubectl apply -f deploy/k8s/03-postgres.yaml
kubectl apply -f deploy/k8s/04-redis.yaml
kubectl apply -f deploy/k8s/05-backend.yaml
kubectl apply -f deploy/k8s/06-frontend.yaml
kubectl apply -f deploy/k8s/07-worker.yaml
kubectl apply -f deploy/k8s/08-ingress.yaml
```

---

## 📚 Related Documentation

For deep technical insights, review the companion design documents:
- [brain.md](file:///c:/Users/Mrigesh%20koyande/OneDrive/Desktop/cipher-x/cipher-x/brain.md): Deep-dive into AI decision trees, AST parsing, AST diffing, active learning, and compliance algorithms.
- [design.md](file:///c:/Users/Mrigesh%20koyande/OneDrive/Desktop/cipher-x/cipher-x/design.md): Design system tokens, color palettes, visual guidelines, UI components, and layout architecture.

---

**© CIPHER-X Development Team.** Built with security, clarity, and precision.
