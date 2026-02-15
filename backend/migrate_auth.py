"""
Migration script: Add auth_provider and provider_id columns to the users table.
Run once: python migrate_auth.py
"""
import asyncio
from sqlalchemy import text
from app.db.session import engine


async def migrate():
    async with engine.begin() as conn:
        # Add auth_provider column (default 'email')
        await conn.execute(text("""
            ALTER TABLE users 
            ADD COLUMN IF NOT EXISTS auth_provider VARCHAR DEFAULT 'email'
        """))

        # Add provider_id column (nullable)
        await conn.execute(text("""
            ALTER TABLE users 
            ADD COLUMN IF NOT EXISTS provider_id VARCHAR
        """))

        # Make hashed_password nullable (for social login users)
        await conn.execute(text("""
            ALTER TABLE users 
            ALTER COLUMN hashed_password DROP NOT NULL
        """))

    print("✅ Migration complete: auth_provider, provider_id columns added.")


if __name__ == "__main__":
    asyncio.run(migrate())
