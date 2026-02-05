# backend/list_models.py
from google import genai
from dotenv import load_dotenv
import os

load_dotenv()
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

print("Available Models:")
for model in client.models.list():
    print(f" - {model.name}")