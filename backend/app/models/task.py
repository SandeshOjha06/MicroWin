from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship, DeclarativeBase

class Base(DeclarativeBase):
    pass

class Task(Base):
    __tablename__ = "tasks"
    id = Column(Integer, primary_key=True, index=True)
    goal = Column(String)
    
    # Relationship: Euta task ko dherai micro_wins hunchhan
    micro_wins = relationship("MicroWinModel", back_populates="owner")

class MicroWinModel(Base):
    __tablename__ = "micro_wins"
    id = Column(Integer, primary_key=True, index=True)
    task_id = Column(Integer, ForeignKey("tasks.id"))
    action = Column(String)
    is_completed = Column(Boolean, default=False)
    
    owner = relationship("Task", back_populates="micro_wins")