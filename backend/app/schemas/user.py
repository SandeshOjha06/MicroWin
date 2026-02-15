from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List

# For initial registration
class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)

# For updating the Neuro-Profile (Cognitive Map)
class UserProfileUpdate(BaseModel):
    # e.g., "I prefer visual instructions", "Avoid long paragraphs"
    preferences: Optional[str] = None
    # e.g., "Kitchen tasks", "Morning routines", "Dense reading"
    struggle_areas: Optional[str] = None
    # 1-5 scale to determine how "micro" the wins should be
    granularity_level: Optional[int] = Field(default=3, ge=1, le=5)

# For returning user data (Response Model)
class UserRead(BaseModel):
    id: int
    email: EmailStr
    # Add Optional[...] and = None to these two lines
    preferences: Optional[str] = None
    struggle_areas: Optional[str] = None
    granularity_level: int

    class Config:
        from_attributes = True