from pydantic import ConfigDict
from pydantic_settings import BaseSettings
from typing import Optional, List, Union
import json

class Settings(BaseSettings):
    PROJECT_NAME: str = "CIPHER-X"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = "production" # "development", "staging", "production"
    
    SECRET_KEY: str = "cipherx-super-secret-key-change-in-production-32bytesmin"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 # 1 day
    REQUIRE_AUTH: bool = True
    
    # CORS Origins (comma-separated string or list)
    ALLOWED_ORIGINS: Union[str, List[str]] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://localhost"
    ]
    
    DATABASE_URL: str = "sqlite:///./cipherx.db"
    STORAGE_DIR: str = "./storage/configurations"
    
    # AI settings
    AI_PROVIDER: str = "mock" # "gemini", "openai", "mock"
    GEMINI_API_KEY: Optional[str] = None
    OPENAI_API_KEY: Optional[str] = None
    
    model_config = ConfigDict(case_sensitive=True, extra="ignore", env_file=".env")

    def get_cors_origins(self) -> List[str]:
        if isinstance(self.ALLOWED_ORIGINS, str):
            try:
                return json.loads(self.ALLOWED_ORIGINS)
            except Exception:
                return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",") if origin.strip()]
        return self.ALLOWED_ORIGINS

settings = Settings()

