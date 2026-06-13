from datetime import datetime, timedelta, timezone

import bcrypt
import jwt

from .config import get_settings
from .rbac import Role

ACCESS = "access"
REFRESH = "refresh"


def hash_password(plain: str) -> str:
    return bcrypt.hashpw(plain.encode(), bcrypt.gensalt()).decode()


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode(), hashed.encode())


def _encode(subject: str, role: Role, token_type: str, lifetime: timedelta) -> str:
    settings = get_settings()
    now = datetime.now(timezone.utc)
    payload = {
        "sub": subject,
        "role": role.value,
        "type": token_type,
        "iat": now,
        "exp": now + lifetime,
    }
    return jwt.encode(payload, settings.jwt_secret, algorithm=settings.jwt_algorithm)


def create_access_token(subject: str, role: Role) -> str:
    settings = get_settings()
    return _encode(subject, role, ACCESS, timedelta(minutes=settings.access_token_ttl_minutes))


def create_refresh_token(subject: str, role: Role) -> str:
    settings = get_settings()
    return _encode(subject, role, REFRESH, timedelta(days=settings.refresh_token_ttl_days))


def decode_token(token: str) -> dict:
    settings = get_settings()
    return jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])
