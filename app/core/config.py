import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "Cipher-X"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    SECRET_KEY: str = "supersecretkey_change_me_in_production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days
    
    # Database
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_USER: str = "cipherx"
    POSTGRES_PASSWORD: str = "cipherx_password"
    POSTGRES_DB: str = "cipherx"
    POSTGRES_PORT: str = "5432"
    
    @property
    def SQLALCHEMY_DATABASE_URI(self) -> str:
        return f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
        
    @property
    def SQLALCHEMY_SYNC_DATABASE_URI(self) -> str:
        return f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"

    # Redis / Celery
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # MinIO / S3
    S3_ENDPOINT: str = "http://localhost:9000"
    S3_ACCESS_KEY: str = "minioadmin"
    S3_SECRET_KEY: str = "minioadmin123"
    S3_BUCKET: str = "cipherx-configs"
    
    # AI Providers
    OPENAI_API_KEY: str = ""
    GEMINI_API_KEY: str = ""
    
    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True)

settings = Settings()
