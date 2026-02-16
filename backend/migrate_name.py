"""
Migration script: Add full_name column to the users table.
Run once: python migrate_name.py
"""
import asyncio
from sqlalchemy import text
from app.db.session import engine


async def migrate():
    async with engine.begin() as conn:
        # Add full_name column (nullable)
        await conn.execute(text("""
            ALTER TABLE users 
            ADD COLUMN IF NOT EXISTS full_name VARCHAR
        """))

    print("✅ Migration complete: full_name column added.")


if __name__ == "__main__":
    asyncio.run(migrate())
