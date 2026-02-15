from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.session import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserProfileUpdate, UserRead
from app.core.security import encrypt_data, decrypt_data, hash_password

router = APIRouter()

# --- 1. SIGNUP ENDPOINT ---
@router.post("/", response_model=UserRead, status_code=status.HTTP_201_CREATED)
async def signup(user_in: UserCreate, db: AsyncSession = Depends(get_db)):
    # Check if user already exists
    query = select(User).where(User.email == user_in.email)
    result = await db.execute(query)
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=400, 
            detail="User with this email already exists."
        )

    # Use hash_password for the 'hashed_password' column
    new_user = User(
        email=user_in.email,
        hashed_password=hash_password(user_in.password),
        granularity_level=3 # Default middle-ground
    )
    
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    return new_user

# --- 2. UPDATE PROFILE (Neuro-Profile Entry) ---
@router.patch("/profile/{user_id}", response_model=UserRead)
async def update_neuro_profile(
    user_id: int, 
    profile_in: UserProfileUpdate, 
    db: AsyncSession = Depends(get_db)
):
    user = await db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Use Fernet encryption for sensitive cognitive data
    if profile_in.preferences is not None:
        user.encrypted_preferences = encrypt_data(profile_in.preferences)
    
    if profile_in.struggle_areas is not None:
        user.encrypted_struggle_areas = encrypt_data(profile_in.struggle_areas)
    
    if profile_in.granularity_level is not None:
        user.granularity_level = profile_in.granularity_level

    await db.commit()
    await db.refresh(user)
    return user

# --- 3. FETCH USER DATA (Loading Dashboard) ---
@router.get("/{user_id}", response_model=UserRead)
async def get_user_dashboard_data(user_id: int, db: AsyncSession = Depends(get_db)):
    user = await db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Decrypt the personal struggles so the UI can show them
    return {
        "id": user.id,
        "email": user.email,
        "preferences": decrypt_data(user.encrypted_preferences) if user.encrypted_preferences else None,
        "struggle_areas": decrypt_data(user.encrypted_struggle_areas) if user.encrypted_struggle_areas else None,
        "granularity_level": user.granularity_level
    }

