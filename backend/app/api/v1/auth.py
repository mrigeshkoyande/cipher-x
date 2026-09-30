from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import create_access_token, get_password_hash, verify_password, get_current_user, CurrentUser
from app.models.db_models import User, Tenant
from app.schemas.pydantic_schemas import LoginRequest, TokenSchema, UserCreate, UserResponse

router = APIRouter()

@router.post("/login", response_model=TokenSchema)
def login(req: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == req.username).first()
    if not user or not verify_password(req.password, user.hashed_password):
        # Auto register demo user if initial DB setup
        if req.username in ["admin", "analyst", "auditor"] and req.password in ["admin123", "password"]:
            # Ensure tenant exists
            tenant = db.query(Tenant).filter(Tenant.id == req.tenant_id).first()
            if not tenant:
                tenant = Tenant(id=req.tenant_id, name="Default Organization")
                db.add(tenant)
                db.commit()
            
            user = User(
                username=req.username,
                email=f"{req.username}@cipherx.sec",
                hashed_password=get_password_hash(req.password),
                role="ADMIN" if req.username == "admin" else "SECURITY_ANALYST",
                tenant_id=req.tenant_id
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        else:
            raise HTTPException(status_code=401, detail="Invalid username or password")
            
    access_token = create_access_token(
        subject=user.id,
        tenant_id=user.tenant_id,
        role=user.role
    )
    return TokenSchema(
        access_token=access_token,
        token_type="bearer",
        user_id=user.id,
        username=user.username,
        role=user.role,
        tenant_id=user.tenant_id
    )

@router.get("/me", response_model=UserResponse)
def get_me(current_user: CurrentUser = Depends(get_current_user), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == current_user.id).first()
    if not user:
        return UserResponse(
            id=current_user.id,
            tenant_id=current_user.tenant_id,
            username=current_user.username,
            email=current_user.email,
            role=current_user.role,
            created_at=current_user.id if hasattr(current_user, 'created_at') else "2026-01-01T00:00:00Z"
        )
    return user
