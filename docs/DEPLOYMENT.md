# Cipher-X Production Deployment & Operations Guide

## 1. Production Docker Orchestration

Launch the full production stack:
```bash
docker compose up -d --build
```

Verify service containers:
```bash
docker compose ps
```

| Container | Image / Base | Internal Port | Exposed Port | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `cipherx-frontend` | `nginx:alpine` | 80 | 80 | React SPA + Reverse Proxy |
| `cipherx-backend` | `python:3.13-slim` | 8000 | 8000 | FastAPI Compliance Core API |
| `cipherx-worker` | `python:3.13-slim` | N/A | N/A | Background task processing |
| `cipherx-redis` | `redis:7-alpine` | 6379 | 6379 | Cache & Event broker |
| `cipherx-minio` | `minio/minio` | 9000, 9001 | 9000, 9001 | Object storage artifact store |

---

## 2. Health & Readiness Monitoring

Cipher-X exposes Kubernetes-compatible health and readiness probes:

- **Liveness Probe**: `GET /health` (Returns `200 OK` if the web application is alive)
- **Readiness Probe**: `GET /ready` (Verifies database connectivity, compliance engine loader, redis queue, object storage, and AI engine status).

Example Response from `/ready`:
```json
{
  "status": "READY",
  "environment": "production",
  "subsystems": {
    "api": {"status": "UP", "latency_ms": 1.2},
    "database": {"status": "UP", "type": "PostgreSQL", "records_count": 5},
    "compliance_engine": {"status": "UP", "frameworks_loaded": 5, "controls_loaded": 20},
    "redis_cache": {"status": "UP"},
    "object_storage": {"status": "UP"},
    "ai_security_provider": {"status": "UP", "provider": "deterministic_grounded"}
  }
}
```
