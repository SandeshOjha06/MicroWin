import json
from google import genai
from app.core.config import settings
from app.schemas.task import MicroWin, TaskStreamChunk

client = genai.Client(api_key=settings.GEMINI_API_KEY)

async def stream_micro_wins(safe_instruction: str, session_id: int):
    prompt = (
        f"Goal: {safe_instruction}\n"
        "Break this into 3 tiny actions. Output each as one JSON object per line: "
        "{\"action\": \"...\"}"
    )

    try:
        # Gemini stream start
        stream = client.models.generate_content_stream(
            model='gemini-2.5-flash', 
            contents=prompt
        )

        buffer = ""
        step_counter = 1
        
        # यो लुपले पूरै AI response नसकिएसम्म साथ दिन्छ
        for chunk in stream:
            if chunk.text:
                buffer += chunk.text
                
                # यदि buffer मा एउटा पूर्ण JSON object (}) भेटियो भने
                if "}" in buffer:
                    # हामी buffer लाई lines मा टुक्राउँछौँ
                    lines = buffer.split('\n')
                    
                    # अन्तिम line बाहेक सबै पूर्ण हुन सक्छन् (अन्तिम line अपूर्ण हुन सक्छ)
                    for line in lines[:-1]:
                        line = line.strip()
                        if line.startswith('{') and line.endswith('}'):
                            try:
                                raw_data = json.loads(line)
                                chunk_data = TaskStreamChunk(
                                    id=session_id,
                                    original_goal=safe_instruction,
                                    current_step=MicroWin(
                                        step_id=step_counter,
                                        action=raw_data["action"]
                                    )
                                )
                                yield f"data: {chunk_data.model_dump_json()}\n\n"
                                step_counter += 1
                            except:
                                continue
                    
                    # अपूर्ण रहन सक्ने अन्तिम line लाई buffer मा फिर्ता राख्ने
                    buffer = lines[-1]

    except Exception as e:
        yield f"data: {{\"error\": \"{str(e)}\"}}\n\n"