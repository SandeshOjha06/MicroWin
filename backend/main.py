#fastapi ko endpoints haru banaucha
from fastapi import FastAPI, HTTPException
from app.schemas.task import TaskRequest, TaskResponse
from app.services.pii_services import mask_pii
from app.services.ai_service import generate_micro_wins

app = FastAPI()

@app.post("/api/v1/decompose", response_model=TaskResponse)
async def process_user_instruction(request: TaskRequest):
    try:
        # 1. THE FILTER: Clean the data locally
        safe_instruction = mask_pii(request.instruction)
        
        # 2. THE BRAIN: Get steps from the AI
        raw_ai_output = await generate_micro_wins(safe_instruction)
        
        # 3. THE DELIVERY: Return the response
        return {
            "scrubbed_instruction": safe_instruction,
            "micro_wins": [
                {"step_id": 1, "action": "Clear the surface", "time_estimate": "2 mins"},
                {"step_id": 2, "action": "Wipe with a cloth", "time_estimate": "1 min"}
            ] 
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))