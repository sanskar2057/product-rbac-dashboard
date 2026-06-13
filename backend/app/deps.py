import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from .rbac import Permission, has_permission, permissions_for
from .schemas import PublicUser
from .security import ACCESS, decode_token
from .users import User, get_user

_bearer = HTTPBearer(description="Paste the access token returned by /auth/login")

_CREDENTIALS_ERROR = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Could not validate credentials",
    headers={"WWW-Authenticate": "Bearer"},
)


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(_bearer),
) -> User:
    try:
        payload = decode_token(credentials.credentials)
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Access token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.PyJWTError:
        raise _CREDENTIALS_ERROR

    if payload.get("type") != ACCESS:
        raise _CREDENTIALS_ERROR

    user = get_user(payload.get("sub", ""))
    if user is None:
        raise _CREDENTIALS_ERROR
    return user


def require_permission(permission: Permission):
    """Build a dependency that lets a request through only if the user's role grants it."""

    def guard(user: User = Depends(get_current_user)) -> User:
        if not has_permission(user.role, permission):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Your role does not allow this action",
            )
        return user

    return guard


def to_public(user: User) -> PublicUser:
    return PublicUser(
        email=user.email,
        name=user.name,
        role=user.role,
        permissions=permissions_for(user.role),
    )
