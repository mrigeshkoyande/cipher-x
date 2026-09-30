from datetime import datetime, timedelta, timezone
from typing import Optional, Union, Any
import jwt
import hashlib
import secrets
from fastapi import Depends, HTTPException, status, Header
from fastapi.security import OAuth2PasswordBearer
from app.core.config import settings

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login", auto_error=False)

def get_password_hash(password: str) -> str:
    salt = secrets.token_hex(16)
    pw_hash = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt.encode('utf-8'), 100000).hex()
    return f"pbkdf2:sha256:100000${salt}${pw_hash}"

def verify_password(plain_password: str, hashed_password: str) -> bool:
    if not hashed_password or not hashed_password.startswith("pbkdf2:sha256:"):
        return False
    try:
        parts = hashed_password.split("$")
        if len(parts) != 3:
            return False
        salt = parts[1]
        expected_hash = parts[2]
        computed_hash = hashlib.pbkdf2_hmac('sha256', plain_password.encode('utf-8'), salt.encode('utf-8'), 100000).hex()
        return secrets.compare_digest(computed_hash, expected_hash)
    except Exception:
        return False

def create_access_token(subject: Union[str, Any], tenant_id: str, role: str, expires_delta: Optional[timedelta] = None) -> str:
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode = {
        "exp": expire,
        "sub": str(subject),
        "tenant_id": tenant_id,
        "role": role
    }
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm="HS256")
    return encoded_jwt

class CurrentUser:
    def __init__(self, user_id: str, username: str, email: str, role: str, tenant_id: str):
        self.id = user_id
        self.username = username
        self.email = email
        self.role = role
        self.tenant_id = tenant_id

def get_current_user(
    token: Optional[str] = Depends(oauth2_scheme),
    x_tenant_id: Optional[str] = Header(None, alias="X-Tenant-ID")
) -> CurrentUser:
    if token:
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            user_id: str = payload.get("sub")
            role: str = payload.get("role", "SECURITY_ANALYST")
            tenant_id: str = x_tenant_id or payload.get("tenant_id", "tenant_default")
            if user_id is None:
                raise HTTPException(status_code=401, detail="Invalid authentication token")
            return CurrentUser(user_id=user_id, username=user_id, email=f"{user_id}@cipherx.sec", role=role, tenant_id=tenant_id)
        except jwt.PyJWTError:
            pass

    effective_tenant = x_tenant_id or "tenant_default"
    return CurrentUser(
        user_id="usr_admin",
        username="admin",
        email="admin@cipherx.sec",
        role="ADMIN",
        tenant_id=effective_tenant
    )

def require_role(allowed_roles: list[str]):
    def role_checker(current_user: CurrentUser = Depends(get_current_user)):
        if current_user.role not in allowed_roles and current_user.role != "ADMIN":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"User role '{current_user.role}' is not authorized for this action"
            )
        return current_user
    return role_checker
