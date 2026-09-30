from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import engine, Base

# Import API routers
from app.api.v1 import (
    auth, devices, configurations, compliance, findings,
    training, remediation, reports, drift, query, what_if,
    graph, audit, health
)

# Initialize DB tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    description="CIPHER-X — AI-Powered Network Security Compliance Auditor"
)

# Enable CORS for Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API v1 routers
app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["Auth"])
app.include_router(devices.router, prefix=f"{settings.API_V1_STR}/devices", tags=["Devices"])
app.include_router(configurations.router, prefix=f"{settings.API_V1_STR}/configurations", tags=["Configurations"])
app.include_router(compliance.router, prefix=f"{settings.API_V1_STR}/compliance", tags=["Compliance"])
app.include_router(findings.router, prefix=f"{settings.API_V1_STR}/findings", tags=["Findings"])
app.include_router(training.router, prefix=f"{settings.API_V1_STR}/training", tags=["Training Studio"])
app.include_router(remediation.router, prefix=f"{settings.API_V1_STR}/remediation", tags=["Remediation"])
app.include_router(reports.router, prefix=f"{settings.API_V1_STR}/reports", tags=["Reports"])
app.include_router(drift.router, prefix=f"{settings.API_V1_STR}/drift", tags=["Configuration Drift"])
app.include_router(query.router, prefix=f"{settings.API_V1_STR}/query", tags=["Analyst Query"])
app.include_router(what_if.router, prefix=f"{settings.API_V1_STR}/what-if", tags=["What-If Simulation"])
app.include_router(graph.router, prefix=f"{settings.API_V1_STR}/graph", tags=["Security Graph"])
app.include_router(audit.router, prefix=f"{settings.API_V1_STR}/audit", tags=["Audit Trail"])
app.include_router(health.router, prefix=f"{settings.API_V1_STR}", tags=["Health"])

@app.get("/")
def root():
    return {"name": settings.PROJECT_NAME, "version": settings.VERSION, "docs": "/docs"}
