from fastapi import APIRouter, HTTPException, Depends, status
from app.schemas.all_schemas import LoginRequest, TokenResponse
from app.core.security import create_access_token, verify_password, get_current_user, UserContext
from app.database import db_store

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/login", response_model=TokenResponse)
async def login(req: LoginRequest):
    # Support default demo users
    user = db_store.users.get(req.username)
    if not user:
        # Create demo admin if first login
        if req.username in ["admin", "auditor", "engineer"]:
            user = {
                "id": f"usr-{req.username}",
                "username": req.username,
                "email": f"{req.username}@cipherx.enterprise.io",
                "role": "admin" if req.username == "admin" else ("auditor" if req.username == "auditor" else "security_engineer"),
                "tenant_id": "ten-default-01",
                "full_name": req.username.capitalize() + " User"
            }
            db_store.users[req.username] = user
        else:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid username or password."
            )

    token = create_access_token({
        "sub": user["id"],
        "username": user["username"],
        "email": user["email"],
        "role": user["role"],
        "tenant_id": user["tenant_id"]
    })

    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=user
    )


@router.get("/me")
async def get_current_user_profile(user: UserContext = Depends(get_current_user)):
    return {
        "user_id": user.user_id,
        "email": user.email,
        "role": user.role,
        "tenant_id": user.tenant_id
    }
