# uses pydantic for data validation and serialization
from pydantic import BaseModel, Field
from typing import List

# The structure of a single "Micro-Win" step
class MicroStep(BaseModel):
    step_id: int
    action: str
    time_estimate: str = "2 mins"

# What the user sends to us
class TaskRequest(BaseModel):
    instruction: str = Field(..., min_length=5, example="I need to clean my desk")

# What we send back to the user
class TaskResponse(BaseModel):
    status: str = "success"
    scrubbed_instruction: str
    micro_wins: List[MicroStep]