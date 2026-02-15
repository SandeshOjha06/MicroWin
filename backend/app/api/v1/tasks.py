from fastapi import APIRouter,Depends, HTTPException, status    
from fastapi.responses import StreamingResponse
from app.schemas.task import TaskCreate
from app.services.pii_services import scrub_pii
from app.services.ai_service import stream_micro_wins
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.models.task import Task, MicroWinModel
from app.core.security import encrypt_data, decrypt_data
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from app.schemas.task import TaskRead
from app.core.security import decrypt_data
from typing import List
from app import db

router = APIRouter()

@router.post("/decompose/stream")
async def decompose_task_stream(
    task_in: TaskCreate, 
    user_id: int, # Ensure this is coming from the request
    db: AsyncSession = Depends(get_db)
):
    # 1. Clean the text
    safe_text = scrub_pii(task_in.instruction)

    # 2. Encrypt AND Decode to string
    # This turns b'gAAAA...' into 'gAAAA...' so the DB doesn't crash
    encrypted_goal_str = encrypt_data(safe_text).decode('utf-8')

    # 3. Create Task with the correct user_id
    new_task = Task(
        encrypted_goal=encrypted_goal_str,
        user_id=user_id,
        is_completed=False
    )
    db.add(new_task)
    await db.commit()
    await db.refresh(new_task)

    return StreamingResponse(
        stream_micro_wins(safe_text, new_task.id, user_id, db),
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

@router.get("/user/{user_id}")
async def get_user_sidebar_tasks(user_id: int, db: AsyncSession = Depends(get_db)):
    """
    Returns only the titles of tasks belonging to a specific user.
    Use this to populate the sidebar.
    """
    result = await db.execute(
        select(Task.id, Task.title).where(Task.user_id == user_id).order_by(Task.id.desc())
    )
    tasks = result.all()
    # Format: [{"id": 1, "title": "House of Cards"}, ...]
    return [{"id": t.id, "title": t.title or "Untitled Task"} for t in tasks]

@router.get("/{task_id}")
async def get_task_details(task_id: int, db: AsyncSession = Depends(get_db)):
    """
    Returns the goal and all associated Micro-Wins (decrypted).
    Use this when a user clicks a sidebar item.
    """
    # 1. Fetch Task
    task = await db.get(Task, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    # 2. Fetch associated Micro-Wins
    result = await db.execute(
        select(MicroWinModel).where(MicroWinModel.task_id == task_id).order_by(MicroWinModel.step_order)
    )
    steps = result.scalars().all()

    return {
        "id": task.id,
        "title": task.title,
        "goal": decrypt_data(task.encrypted_goal.encode('utf-8')),
        "steps": [
            {
                "id": s.id,
                "action": decrypt_data(s.encrypted_action), # Decrypt for UI
                "is_completed": s.is_completed,
                "order": s.step_order
            } for s in steps
        ]
    }


@router.delete("/{task_id}", status_code=204)
async def delete_task(task_id: int, db: AsyncSession = Depends(get_db)):
    """Delete a task and all its micro-wins (cascade)."""
    task = await db.get(Task, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    await db.delete(task)
    await db.commit()
    return None

@router.patch("/microwins/{step_id}", status_code=200)
async def update_microwin_status(step_id: int, is_completed: bool, db: AsyncSession = Depends(get_db)):
    """Update the completion status of a specific micro-win step."""
    step = await db.get(MicroWinModel, step_id)
    if not step:
        raise HTTPException(status_code=404, detail="Micro-win step not found")
    
    step.is_completed = is_completed
    await db.commit()
    return {"id": step.id, "is_completed": step.is_completed}