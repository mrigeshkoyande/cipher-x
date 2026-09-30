from fastapi import APIRouter
from . import auth, devices, configurations, reports, query, training

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(devices.router, prefix="/devices", tags=["devices"])
api_router.include_router(configurations.router, prefix="/configurations", tags=["configurations"])
api_router.include_router(reports.router, prefix="/reports", tags=["reports"])
api_router.include_router(query.router, prefix="/query", tags=["query"])
api_router.include_router(training.router, prefix="/training", tags=["training"])
