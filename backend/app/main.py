from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.config import settings
from app.core.observability import ObservabilityMiddleware
from app.core.rate_limiter import rate_limit_middleware

# Import all API Routers
from app.api.auth import router as auth_router
from app.api.devices import router as devices_router
from app.api.configurations import router as configurations_router
from app.api.compliance import router as compliance_router
from app.api.analytics import router as analytics_router
from app.api.drift import router as drift_router
from app.api.graph import router as graph_router
from app.api.whatif import router as whatif_router
from app.api.remediation import router as remediation_router
from app.api.assistant import router as assistant_router
from app.api.evidence import router as evidence_router
from app.api.reports import router as reports_router
from app.api.audit import router as audit_router
from app.api.blockchain import router as blockchain_router
from app.api.notifications import router as notifications_router
from app.api.webhooks import router as webhooks_router
from app.api.health import router as health_router
from app.api.search import router as search_router

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Cipher-X Enterprise Network Cybersecurity, Compliance Verification & Intelligence Platform",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Observability Middleware
app.add_middleware(ObservabilityMiddleware)

# Security Response Headers Middleware
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    # Rate limiter check
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    response.headers["Content-Security-Policy"] = "default-src 'self'; img-src 'self' data: https:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
    return response

# Include Subsystem Routers
api_v1 = settings.API_V1_PREFIX

app.include_router(health_router)
app.include_router(auth_router, prefix=api_v1)
app.include_router(devices_router, prefix=api_v1)
app.include_router(configurations_router, prefix=api_v1)
app.include_router(compliance_router, prefix=api_v1)
app.include_router(analytics_router, prefix=api_v1)
app.include_router(drift_router, prefix=api_v1)
app.include_router(graph_router, prefix=api_v1)
app.include_router(whatif_router, prefix=api_v1)
app.include_router(remediation_router, prefix=api_v1)
app.include_router(assistant_router, prefix=api_v1)
app.include_router(evidence_router, prefix=api_v1)
app.include_router(reports_router, prefix=api_v1)
app.include_router(audit_router, prefix=api_v1)
app.include_router(blockchain_router, prefix=api_v1)
app.include_router(notifications_router, prefix=api_v1)
app.include_router(webhooks_router, prefix=api_v1)
app.include_router(search_router, prefix=api_v1)


@app.on_event("startup")
async def startup_event():
    # Auto-seed database if empty
    from seed import seed_demo_dataset
    seed_demo_dataset()


@app.get("/")
async def root():
    return {
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "OPERATIONAL",
        "docs": "/api/docs",
        "health": "/health",
        "readiness": "/ready"
    }
