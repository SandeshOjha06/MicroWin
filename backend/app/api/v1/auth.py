"""
Auth router: email/password + Google OAuth2 + Facebook OAuth2
All endpoints return JWT tokens.
"""
from fastapi import APIRouter, Depends, HTTPException, status
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
    db: AsyncSession, email: str, provider: str, provider_id: str
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


# ─── Google OAuth2 ────────────────────────────────────────────
GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"
GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo"


@router.get("/google/login")
async def google_login():
    """Redirect user to Google OAuth consent screen."""
    if not settings.GOOGLE_CLIENT_ID:
        raise HTTPException(status_code=501, detail="Google OAuth not configured")

    params = {
        "client_id": settings.GOOGLE_CLIENT_ID,
        "redirect_uri": f"{settings.FRONTEND_URL}/auth/callback",
        "response_type": "code",
        "scope": "openid email profile",
        "access_type": "offline",
        "state": "google",
        "prompt": "consent",
    }
    return RedirectResponse(f"{GOOGLE_AUTH_URL}?{urlencode(params)}")


@router.get("/google/callback", response_model=TokenResponse)
async def google_callback(code: str, db: AsyncSession = Depends(get_db)):
    """Exchange Google auth code for user info, create/find user, return JWT."""
    async with httpx.AsyncClient() as client:
        # Exchange code for tokens
        token_resp = await client.post(GOOGLE_TOKEN_URL, data={
            "code": code,
            "client_id": settings.GOOGLE_CLIENT_ID,
            "client_secret": settings.GOOGLE_CLIENT_SECRET,
            "redirect_uri": f"{settings.FRONTEND_URL}/auth/callback",
            "grant_type": "authorization_code",
        })
        if token_resp.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to get Google token")

        tokens = token_resp.json()

        # Get user info
        userinfo_resp = await client.get(
            GOOGLE_USERINFO_URL,
            headers={"Authorization": f"Bearer {tokens['access_token']}"},
        )
        if userinfo_resp.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to get Google user info")

        userinfo = userinfo_resp.json()

    user = await _get_or_create_social_user(
        db, email=userinfo["email"], provider="google", provider_id=userinfo["id"]
    )
    return _build_token_response(user)


# ─── Facebook OAuth2 ─────────────────────────────────────────
FB_AUTH_URL = "https://www.facebook.com/v18.0/dialog/oauth"
FB_TOKEN_URL = "https://graph.facebook.com/v18.0/oauth/access_token"
FB_USERINFO_URL = "https://graph.facebook.com/v18.0/me"


@router.get("/facebook/login")
async def facebook_login():
    """Redirect user to Facebook OAuth consent screen."""
    if not settings.FACEBOOK_APP_ID:
        raise HTTPException(status_code=501, detail="Facebook OAuth not configured")

    params = {
        "client_id": settings.FACEBOOK_APP_ID,
        "redirect_uri": f"{settings.FRONTEND_URL}/auth/callback",
        "scope": "email,public_profile",
        "response_type": "code",
        "state": "facebook",
    }
    return RedirectResponse(f"{FB_AUTH_URL}?{urlencode(params)}")


@router.get("/facebook/callback", response_model=TokenResponse)
async def facebook_callback(code: str, db: AsyncSession = Depends(get_db)):
    """Exchange Facebook auth code for user info, create/find user, return JWT."""
    async with httpx.AsyncClient() as client:
        # Exchange code for token
        token_resp = await client.get(FB_TOKEN_URL, params={
            "code": code,
            "client_id": settings.FACEBOOK_APP_ID,
            "client_secret": settings.FACEBOOK_APP_SECRET,
            "redirect_uri": f"{settings.FRONTEND_URL}/auth/callback",
        })
        if token_resp.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to get Facebook token")

        access_token = token_resp.json()["access_token"]

        # Get user info
        userinfo_resp = await client.get(FB_USERINFO_URL, params={
            "fields": "id,email,name",
            "access_token": access_token,
        })
        if userinfo_resp.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to get Facebook user info")

        userinfo = userinfo_resp.json()

    if "email" not in userinfo:
        raise HTTPException(status_code=400, detail="Email not provided by Facebook")

    user = await _get_or_create_social_user(
        db, email=userinfo["email"], provider="facebook", provider_id=userinfo["id"]
    )
    return _build_token_response(user)
