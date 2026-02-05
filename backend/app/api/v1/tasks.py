from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from app.schemas.task import TaskCreate
from app.services.pii_services import scrub_pii
from app.services.ai_service import stream_micro_wins

router = APIRouter()

@router.post("/decompose/stream")
async def decompose_task_stream(task_in: TaskCreate):
    # Step 1: Privacy Filter (Instruction scrub garne)
    safe_text = scrub_pii(task_in.instruction)
    
    # Step 2: Temporary Session ID create garne 
    # (Aba arko step ma hami yeslai Database bata generate garchhau)
    temp_session_id = 12345
    
    # Step 3: Stream call garda temp_session_id pass garne
    # YO LINE FIX GARNU PARNE CHHA:
    return StreamingResponse(
        stream_micro_wins(safe_text, temp_session_id), # <-- session_id thapne
        media_type="text/event-stream"
    )