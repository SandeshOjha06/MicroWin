from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional

# Single step structure
class MicroWin(BaseModel):
    step_id: int
    action: str
    is_completed: bool = False

# What the user sends us (Validation at the gate)
class TaskCreate(BaseModel):
    instruction: str = Field(..., min_length=5, max_length=500)

# NEW: Validation for each streamed chunk
# This ensures the frontend receives a consistent object every time
class TaskStreamChunk(BaseModel):
    id: int  # The Session ID
    original_goal: str
    current_step: MicroWin  # The specific step being streamed right now

# Standard full response (for DB retrieval)
class MicroWinRead(BaseModel):
    id: int
    step_order: int
    action: str  # This will hold the DECRYPTED text
    is_completed: bool

    class Config:
        from_attributes = True

class TaskRead(BaseModel):
    id: int
    goal: str    # This will hold the DECRYPTED text
    is_completed: bool
    micro_wins: List[MicroWinRead]

    class Config:
        from_attributes = True


