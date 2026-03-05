import json
import re
import time
from google import genai
from google.genai import types
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import update, select
from app.core.config import settings
from app.schemas.task import MicroWin, TaskStreamChunk
from app.models.task import MicroWinModel, Task
from app.models.user import User
from app.core.security import encrypt_data, decrypt_data

client = genai.Client(api_key=settings.GEMINI_API_KEY)

_FENCE_RE = re.compile(r'^```(?:json)?\s*$', re.IGNORECASE)

def _clean_line(line: str) -> str:
    """Remove markdown fences and trim to bare JSON."""
    line = line.strip()
    if _FENCE_RE.match(line):
        return ""
    line = re.sub(r'^```(?:json)?\s*', '', line)
    line = re.sub(r'\s*```$', '', line)
    return line.strip()


async def stream_micro_wins(safe_instruction: str, task_id: int, user_id: int, db: AsyncSession):
    """
    Fetches user neuro-profile, customizes the prompt, and streams tasks.
    Includes latency metrics as SSE events to satisfy the <5s requirement.
    """

    t_start = time.perf_counter()
    first_token_emitted = False

    # 1. Fetch User Profile for Individualization
    user_result = await db.execute(select(User).where(User.id == user_id))
    user = user_result.scalar_one_or_none()
    
    # Decrypt preferences if they exist
    preferences = decrypt_data(user.encrypted_preferences) if user and user.encrypted_preferences else "None"
    struggles = decrypt_data(user.encrypted_struggle_areas) if user and user.encrypted_struggle_areas else "None"
    granularity = user.granularity_level if user else 3

    # 2. Compact prompt — fewer tokens = faster TTFT
    detail_instruction = {
        1: "extremely brief, with only 2-3 words per step",
        2: "short and simple, with basic actions",
        3: "moderate detail, explaining what to do clearly",
        4: "highly detailed, including actionable advice for each step",
        5: "incredibly detailed, essentially micro-actions with how-to context"
    }.get(granularity, "moderate detail")

    prompt = (
        f"Break this goal into exactly 4 to 5 steps.\n"
        f"Detail Level: {detail_instruction} (granularity {granularity}/5).\n"
        f"Goal: {safe_instruction}\n"
        f"Struggles: {struggles} | Prefs: {preferences}\n"
        "Output ONLY raw JSON lines, NO markdown, NO code fences, NO extra text:\n"
        "{\"title\":\"3-4 word title\"}\n"
        "{\"action\":\"step text\"}\n"
        "{\"status\":\"end\"}"
    )

    try:
        # Use async streaming with fast non-thinking model
        # Reverted to gemini-2.5-flash-lite to avoid the 'limit: 0' Free Tier quota issue on 2.0-flash
        stream = await client.aio.models.generate_content_stream(
            model='gemini-2.5-flash-lite',
            contents=prompt,
            config=types.GenerateContentConfig(
                temperature=0.7,
                max_output_tokens=300,
            ),
        )

        buffer = ""
        step_counter = 1
        title_set = False  # Track if AI provided a title
        
        async for chunk in stream:
            if chunk.text:
                print(f"RAW CHUNK: {repr(chunk.text)}")
                # ─── Time-to-First-Token ──────────────────────
                if not first_token_emitted:
                    ttft_ms = round((time.perf_counter() - t_start) * 1000)
                    yield f"data: {{\"latency_ms\": {ttft_ms}}}\n\n"
                    first_token_emitted = True

                buffer += chunk.text
                
                json_objects = re.findall(r'\{[^{}]*\}', buffer)
                
                if json_objects:
                    last_match_end = buffer.rfind(json_objects[-1]) + len(json_objects[-1])
                    buffer = buffer[last_match_end:] # Keep rest of buffer for next chunk
                    
                    for json_str in json_objects:
                        try:
                            raw_data = json.loads(json_str)

                            # Handle AI-Generated Title
                            if "title" in raw_data:
                                stmt = update(Task).where(Task.id == task_id).values(title=raw_data["title"])
                                await db.execute(stmt)
                                await db.flush()
                                title_set = True
                                yield f"data: {{\"sidebar_title\": \"{raw_data['title']}\"}}\n\n"
                                continue
                            
                            if raw_data.get("status") == "end":
                                # Commit all flushed changes at once
                                await db.commit()
                                # ─── Total Latency ────────────────────
                                total_ms = round((time.perf_counter() - t_start) * 1000)
                                yield f"data: {{\"total_latency_ms\": {total_ms}}}\n\n"
                                return 

                            action_text = raw_data.get("action")
                            if action_text:
                                # Encrypting for Privacy-First Cloud storage
                                encrypted_action = encrypt_data(action_text)
                                
                                new_step = MicroWinModel(
                                    task_id=task_id,
                                    encrypted_action=encrypted_action,
                                    is_completed=False,
                                    step_order=step_counter
                                )
                                db.add(new_step)
                                # Flush to get IDs without committing
                                await db.flush()

                                # Yield for UI
                                chunk_data = TaskStreamChunk(
                                    id=task_id,
                                    original_goal=safe_instruction,
                                    current_step=MicroWin(
                                        step_id=step_counter,
                                        action=action_text
                                    )
                                )
                                yield f"data: {chunk_data.model_dump_json()}\n\n"
                                step_counter += 1

                        except json.JSONDecodeError:
                            continue

        # Fallback title: if AI never provided one, use the instruction
        if not title_set:
            fallback_title = safe_instruction[:40].strip()
            if len(safe_instruction) > 40:
                fallback_title += "…"
            stmt = update(Task).where(Task.id == task_id).values(title=fallback_title)
            await db.execute(stmt)
            yield f"data: {{\"sidebar_title\": \"{fallback_title}\"}}\n\n"

        # Commit all remaining flushed changes
        await db.commit()
        # If stream ends without explicit "end" status, still emit total latency
        total_ms = round((time.perf_counter() - t_start) * 1000)
        yield f"data: {{\"total_latency_ms\": {total_ms}}}\n\n"

    except Exception as e:
        print(f"AI Stream Error: {str(e)}")
        # Check if it's a quota error
        if "429" in str(e) or "quota" in str(e).lower():
             yield f"data: {{\"error\": \"Google AI Rate Limit Reached. Please wait a minute and try again.\"}}\n\n"
        else:
             yield f"data: {{\"error\": \"AI Stream Error: {str(e)}\"}}\n\n"