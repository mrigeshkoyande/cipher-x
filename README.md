# Cipher-X Backend Platform

Welcome to the Cipher-X backend repository. This is a modular, AI-assisted security configuration normalization and compliance engine.

## Stack
- Python 3.12+
- FastAPI
- SQLAlchemy 2 (asyncpg)
- PostgreSQL
- Redis + Celery (Background Workers)
- MinIO (S3 compatible storage)
- Docker Compose

## Architecture Overview
The system follows a modular pipeline approach:
`API -> Services -> Workers -> Normalization -> Compliance -> Findings -> Remediation -> Reports`

- **app/api**: FastAPI routes (auth, devices, configurations, reports, etc.)
- **app/core**: Database connection, settings, security.
- **app/models**: SQLAlchemy models for all domains (Tenants, Devices, Configurations, Facts, Controls, Findings, Audit Events).
- **app/services**: Core logic, including the AI Provider abstraction (in `app/services/ai/provider.py`).
- **app/workers**: Celery app and tasks for async processing (vendor detection -> parsing -> AI extraction -> compliance -> findings).

## Setup & Running

1. **Start Infrastructure (PostgreSQL, Redis, MinIO):**
   ```bash
   docker-compose up -d
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
   # Configure alembic.ini with the sqlalchemy.url
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

## Key Features Implemented (Scaffolded)
- [x] **Database Schema**: Full tenant-isolated schema with models for devices, configurations, facts, controls, and findings.
- [x] **API Structure**: Modular FastAPI routers with versioning (`/api/v1`).
- [x] **Background Jobs**: Celery worker integration for configuration processing.
- [x] **AI Abstraction**: `AIProvider` interface with a mock implementation.
- [x] **Configuration Upload**: Endpoint handling chunked file uploads, hashing (SHA-256), and job queuing.
- [x] **Natural Language Query**: Scaffolded API for NLQ with intent detection.
- [x] **Training System API**: Endpoints for unknown command mapping.
