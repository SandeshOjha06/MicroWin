import json
from google import genai
from google.genai import types
from app.core.config import settings
from app.schemas.task import MicroWin, TaskStreamChunk

# New Client Initialization
client = genai.Client(api_key=settings.GEMINI_API_KEY)

async def stream_micro_wins(safe_instruction: str, session_id: int):
    prompt = (
        f"Goal: {safe_instruction}\n"
        "Break this into 3 tiny, physical actions. "
        "Output each action as a single JSON object: {\"action\": \"...\"}. "
        "Return each JSON object on a NEW line. No markdown."
    )

    # Gemini 2.0 Flash is the best balance of speed and intelligence
    # Note: Using generate_content_stream for the 5-second rule
    stream = client.models.generate_content_stream(
        model='gemini-2.5-flash', 
        contents=prompt
    )

    buffer = ""
    step_counter = 1
    
    for chunk in stream:
        if chunk.text:
            buffer += chunk.text
            
            # Look for a complete JSON object
            if "}" in chunk.text:
                try:
                    # Logic to extract only the last line (the new step)
                    lines = buffer.strip().split('\n')
                    last_line = lines[-1].strip()
                    
                    raw_data = json.loads(last_line)
                    
                    new_step = MicroWin(
                        step_id=step_counter,
                        action=raw_data["action"]
                    )
                    
                    stream_chunk = TaskStreamChunk(
                        id=session_id,
                        original_goal=safe_instruction,
                        current_step=new_step
                    )
                    
                    yield f"data: {stream_chunk.model_dump_json()}\n\n"
                    
                    buffer = "" # Clear for next step
                    step_counter += 1
                except (json.JSONDecodeError, KeyError):
                    continue