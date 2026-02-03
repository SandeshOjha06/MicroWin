# uses the LLM model for MicroWin AI services
from openai import OpenAI
import os

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

async def generate_micro_wins(safe_text: str):
    # This system prompt is your "Secret Sauce" for the hackathon
    prompt = f"Break this goal into 3-5 tiny, physical actions: {safe_text}"
    
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}]
    )
    # Note: In the final version, we'll parse this into the MicroStep list
    return response.choices[0].message.content