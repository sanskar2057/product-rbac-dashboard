import jwt
from fastapi import APIRouter, Depends, HTTPException, status

from .deps import get_current_user, to_public
from .schemas import AccessToken, LoginRequest, PublicUser, RefreshRequest, TokenPair
from .security import (
    REFRESH,
    create_access_token,
    create_refresh_token,
    decode_token,
    verify_password,
)
from .users import User, get_user

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=TokenPair)
def login(body: LoginRequest) -> TokenPair:
    user = get_user(body.email)
    if user is None or not verify_password(body.password, user.password_hash):
        # Same message either way so we don't leak which emails exist.
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    return TokenPair(
        access_token=create_access_token(user.email, user.role),
        refresh_token=create_refresh_token(user.email, user.role),
        user=to_public(user),
    )


@router.post("/refresh", response_model=AccessToken)
def refresh(body: RefreshRequest) -> AccessToken:
    try:
        payload = decode_token(body.refresh_token)
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token",
        )

    if payload.get("type") != REFRESH:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
        )

    user = get_user(payload.get("sub", ""))
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
        )

    return AccessToken(access_token=create_access_token(user.email, user.role))


@router.get("/me", response_model=PublicUser)
def me(user: User = Depends(get_current_user)) -> PublicUser:
    return to_public(user)
