from fastapi import APIRouter,Depends
from fastapi.responses import StreamingResponse
from app.schemas.task import TaskCreate
from app.services.pii_services import scrub_pii
from app.services.ai_service import stream_micro_wins
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.models.task import Task
from app.core.security import encrypt_data, decrypt_data
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from app.schemas.task import TaskRead
from app.core.security import decrypt_data
from typing import List

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
        stream_micro_wins(safe_text, new_task.id, db), 
        media_type="text/event-stream"
    )

@router.get("/", response_model=List[TaskRead])
async def get_all_tasks(db: AsyncSession = Depends(get_db)):
    """
    Fetches all tasks and their micro-wins, decrypting the data 
    before sending it to the frontend.
    """
    # 1. Fetch tasks with their related micro_wins (ordered by newest first)
    result = await db.execute(
        select(Task)
        .options(selectinload(Task.micro_wins))
        .order_by(Task.id.desc())
    )
    tasks = result.scalars().all()

    decrypted_tasks = []

    # 2. Decrypt the data for the response
    for task in tasks:
        try:
            # Decrypt the parent goal
            plain_goal = decrypt_data(task.encrypted_goal)
            
            # Decrypt each individual step
            decrypted_steps = []
            for mw in task.micro_wins:
                decrypted_steps.append({
                    "id": mw.id,
                    "step_order": mw.step_order,
                    "action": decrypt_data(mw.encrypted_action),
                    "is_completed": mw.is_completed
                })

            decrypted_tasks.append({
                "id": task.id,
                "goal": plain_goal,
                "is_completed": task.is_completed,
                "micro_wins": decrypted_steps
            })
        except Exception as e:
            # If decryption fails (e.g., wrong key), we skip that specific task
            print(f"Decryption failed for Task {task.id}: {e}")
            continue

    return decrypted_tasks
