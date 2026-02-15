from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List

# For initial registration
class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)

# For login (separate from create — no min_length needed for UX)
class UserLogin(BaseModel):
    email: EmailStr
    password: str

# For updating the Neuro-Profile (Cognitive Map)
class UserProfileUpdate(BaseModel):
    preferences: Optional[str] = None
    struggle_areas: Optional[str] = None
    granularity_level: Optional[int] = Field(default=3, ge=1, le=5)

# For returning user data (Response Model)
class UserRead(BaseModel):
    id: int
    email: EmailStr
    preferences: Optional[str] = None
    struggle_areas: Optional[str] = None
    granularity_level: int
    auth_provider: str = "email"

    class Config:
        from_attributes = True

# JWT Token Response
class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserRead