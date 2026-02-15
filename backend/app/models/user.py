# app/models/user.py
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.db.session import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String, nullable=True)  # Nullable for social login users
    
    # OAuth2 provider tracking
    auth_provider = Column(String, default="email")  # "email", "google", "facebook"
    provider_id = Column(String, nullable=True)       # External OAuth user ID

    # --- The Neuro-Profile (Stored Encrypted) ---
    encrypted_preferences = Column(String, nullable=True) 
    encrypted_struggle_areas = Column(String, nullable=True)
    granularity_level = Column(Integer, default=3) 

    tasks = relationship("Task", back_populates="owner")