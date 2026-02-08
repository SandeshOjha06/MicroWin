from sqlalchemy import Column, Integer, Boolean, LargeBinary
from sqlalchemy.orm import DeclarativeBase

class Base(DeclarativeBase):
    pass

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    # We store the goal as 'Encrypted Bytes', not raw text
    encrypted_goal = Column(LargeBinary, nullable=False)
    is_completed = Column(Boolean, default=False)