from sqlalchemy import Column, Integer, Boolean, LargeBinary
from app.db.session import Base # <--- Change this to import from session

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    encrypted_goal = Column(LargeBinary, nullable=False)
    is_completed = Column(Boolean, default=False)