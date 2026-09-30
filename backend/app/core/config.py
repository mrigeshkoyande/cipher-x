from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "CIPHER-X"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    SECRET_KEY: str = "cipherx-super-secret-key-change-in-production-32bytesmin"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 # 1 day
    
    DATABASE_URL: str = "sqlite:///./cipherx.db"
    
    STORAGE_DIR: str = "./storage/configurations"
    
    # AI settings
    AI_PROVIDER: str = "mock" # "gemini", "openai", "mock"
    GEMINI_API_KEY: Optional[str] = None
    OPENAI_API_KEY: Optional[str] = None
    
    class Config:
        case_sensitive = True

settings = Settings()
