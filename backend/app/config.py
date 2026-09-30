import os
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    APP_NAME: str = "Cipher-X Security & Compliance Platform"
    APP_VERSION: str = "3.0.0"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    API_V1_PREFIX: str = "/api/v1"
    
    # Security & Auth
    SECRET_KEY: str = os.getenv("SECRET_KEY", "cipherx-super-secret-key-change-in-production-2026")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./cipherx.db")
    
    # Redis & Storage
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    STORAGE_TYPE: str = os.getenv("STORAGE_TYPE", "local")
    STORAGE_PATH: str = os.getenv("STORAGE_PATH", "./data_storage")
    
    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 120
    
    # AI Provider
    AI_PROVIDER: str = os.getenv("AI_PROVIDER", "deterministic_grounded")
    AI_API_KEY: str = os.getenv("AI_API_KEY", "")
    
    # CORS
    CORS_ORIGINS: list[str] = ["*"]

    class Config:
        case_sensitive = True


settings = Settings()
