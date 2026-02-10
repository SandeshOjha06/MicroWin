import asyncio
import os
from dotenv import load_dotenv

# 1. FORCE LOAD .ENV FIRST
# This ensures the variables are in the system environment
load_dotenv() 

from backend.app.db.session import engine, Base
# Import all models so Base knows which tables to create
from backend.app.models.task import Task 

async def init_db():
    print("🚀 Connecting to Neon Cloud...")
    try:
        async with engine.begin() as conn:
            # 2. RUN SCHEMA CREATION
            await conn.run_sync(Base.metadata.create_all)
        print("✅ Success! Your tables are now live in the cloud.")
    except Exception as e:
        print(f"❌ Error during initialization: {e}")

if __name__ == "__main__":
    asyncio.run(init_db())