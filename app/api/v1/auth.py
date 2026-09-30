from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/login")
async def login(req: LoginRequest):
    # Mock token return
    return {"access_token": "mock-jwt-token", "token_type": "bearer"}

@router.post("/logout")
async def logout():
    return {"status": "success"}

@router.get("/me")
async def get_current_user():
    return {
        "email": "admin@cipher-x.com",
        "role": "ADMIN",
        "tenant_id": "00000000-0000-0000-0000-000000000001"
    }
