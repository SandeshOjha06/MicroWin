from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from app.core.config import settings

# Engine setup: Postgres uses 'postgresql+asyncpg'
engine = create_async_engine(
    settings.DATABASE_URL, 
    echo=False,
    # Postgres specific: prevents connection drop in cloud
    pool_pre_ping=True 
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine, 
    class_=AsyncSession, 
    expire_on_commit=False
)

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session