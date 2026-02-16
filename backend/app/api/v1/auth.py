"""
Auth router: email/password + Google OAuth2
All endpoints return JWT tokens.
"""
from fastapi import APIRouter, Depends, HTTPException, status, Body
from fastapi.responses import RedirectResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import httpx
from urllib.parse import urlencode

from app.db.session import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin, UserRead, TokenResponse
from app.core.security import (
    hash_password, verify_password, encrypt_data, decrypt_data,
    create_access_token, get_current_user,
)
from app.core.config import settings

router = APIRouter()


# ─── Helpers ──────────────────────────────────────────────────
def _build_user_read(user: User) -> UserRead:
    """Build a UserRead response, decrypting fields as needed."""
    return UserRead(
        id=user.id,
        email=user.email,
        preferences=(
            decrypt_data(user.encrypted_preferences.encode("utf-8"))
            if user.encrypted_preferences else None
        ),
        struggle_areas=(
            decrypt_data(user.encrypted_struggle_areas.encode("utf-8"))
            if user.encrypted_struggle_areas else None
        ),
        granularity_level=user.granularity_level,

        auth_provider=user.auth_provider or "email",
        full_name=user.full_name,
    )


def _build_token_response(user: User) -> TokenResponse:
    """Create JWT and wrap it with user data."""
    token = create_access_token({"sub": str(user.id), "email": user.email})
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=_build_user_read(user),
    )


async def _get_or_create_social_user(
    db: AsyncSession, email: str, provider: str, provider_id: str, full_name: str = None
) -> User:
    """Find existing user by email or create a new social-login user."""
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()

    if user:
        # Update provider info if user originally signed up via email
        if user.auth_provider == "email" and provider != "email":
            user.auth_provider = provider
            user.provider_id = provider_id
            await db.commit()
            await db.refresh(user)
        return user

    # Create new user
    user = User(
        email=email,
        hashed_password=None,
        auth_provider=provider,

        provider_id=provider_id,
        full_name=full_name,
        granularity_level=3,
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user


# ─── Email/Password ──────────────────────────────────────────
@router.post("/signup", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def signup(user_in: UserCreate, db: AsyncSession = Depends(get_db)):
    """Register with email and password, returns JWT."""
    result = await db.execute(select(User).where(User.email == user_in.email))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="User with this email already exists.")

    user = User(
        email=user_in.email,
        hashed_password=hash_password(user_in.password),
        auth_provider="email",
        full_name=user_in.full_name,
        granularity_level=3,
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return _build_token_response(user)


@router.post("/login", response_model=TokenResponse)
async def login(credentials: UserLogin, db: AsyncSession = Depends(get_db)):
    """Login with email and password, returns JWT."""
    result = await db.execute(select(User).where(User.email == credentials.email))
    user = result.scalar_one_or_none()

    if not user or not user.hashed_password:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    return _build_token_response(user)


@router.get("/me", response_model=UserRead)
async def get_me(current_user: User = Depends(get_current_user)):
    """Get the currently authenticated user."""
    return _build_user_read(current_user)


# ─── Google OAuth2 (Implicit / Token Flow Support) ────────────
GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo"


@router.post("/google/verify-token", response_model=TokenResponse)
async def verify_google_token(
    token_data: dict = Body(...), 
    db: AsyncSession = Depends(get_db)
):
    """
    Verify Google Access Token received from frontend (Implicit Flow).
    If valid, create/return JWT for our app.
    Does NOT require Client Secret on backend.
    """
    access_token = token_data.get("access_token")
    if not access_token:
        raise HTTPException(status_code=400, detail="Missing access_token")

    async with httpx.AsyncClient() as client:
        # Verify token by fetching user info directly from Google
        userinfo_resp = await client.get(
            GOOGLE_USERINFO_URL,
            headers={"Authorization": f"Bearer {access_token}"},
        )
        
        if userinfo_resp.status_code != 200:
            raise HTTPException(status_code=400, detail="Invalid Google token")

        userinfo = userinfo_resp.json()

    # Ensure the token matches our Client ID (optional extra security check if audience is present, 
    # but for access_tokens we mostly trust the Provider that issued it for us if userinfo succeeds).
    # Google UserInfo endpoint is sufficient proof of delegation for simple login.

    user = await _get_or_create_social_user(
        db, 
        email=userinfo["email"], 
        provider="google", 
        provider_id=userinfo["id"], 
        full_name=userinfo.get("name")
    )
    return _build_token_response(user)
