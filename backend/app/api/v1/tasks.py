from fastapi import APIRouter,Depends
from fastapi.responses import StreamingResponse
from app.schemas.task import TaskCreate
from app.services.pii_services import scrub_pii
from app.services.ai_service import stream_micro_wins
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.models.task import Task
from app.core.security import encrypt_data, decrypt_data

router = APIRouter()

@router.post("/decompose/stream")
async def decompose_task_stream(
    task_in: TaskCreate, 
    db: AsyncSession = Depends(get_db) # This 'injects' the DB session
):
    # 1. Clean the text (PII scrubbing)
    safe_text = scrub_pii(task_in.instruction)

    # 2. Encrypt the goal
    encrypted_goal = encrypt_data(safe_text)

    # 3. Create a New Task in the DB
    new_task = Task(encrypted_goal=encrypted_goal)
    db.add(new_task)
    await db.commit()   # Save permanently
    await db.refresh(new_task) # This gives us the new 'id' (like 1, 2, 3)

    # Now we pass the REAL new_task.id to the AI service
    return StreamingResponse(
        stream_micro_wins(safe_text, new_task.id), 
        media_type="text/event-stream"
    )