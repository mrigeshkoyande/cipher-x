import time
from datetime import datetime, timedelta
from typing import Optional, Dict, Any, List
import jwt
from passlib.context import CryptContext
from fastapi import HTTPException, Security, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security_scheme = HTTPBearer(auto_error=False)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire, "iat": datetime.utcnow()})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


def decode_access_token(token: str) -> Optional[Dict[str, Any]]:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except jwt.PyJWTError:
        return None


class UserContext:
    def __init__(self, user_id: str, email: str, role: str, tenant_id: str):
        self.user_id = user_id
        self.email = email
        self.role = role
        self.tenant_id = tenant_id

    def is_admin(self) -> bool:
        return self.role == "admin"


async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security_scheme)
) -> UserContext:
    """Extracts and verifies JWT bearer token or provides default authenticated demo context."""
    if not credentials:
        # Fallback to demo context if no auth header provided
        return UserContext(
            user_id="usr-demo-admin",
            email="admin@cipherx.enterprise.io",
            role="admin",
            tenant_id="ten-default-01"
        )

    token = credentials.credentials
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return UserContext(
        user_id=payload.get("sub", "usr-demo-admin"),
        email=payload.get("email", "admin@cipherx.enterprise.io"),
        role=payload.get("role", "admin"),
        tenant_id=payload.get("tenant_id", "ten-default-01")
    )


def require_roles(allowed_roles: List[str]):
    def role_checker(user: UserContext = Depends(get_current_user)):
        if user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"User role '{user.role}' is not authorized to access this resource. Required: {allowed_roles}"
            )
        return user
    return role_checker
