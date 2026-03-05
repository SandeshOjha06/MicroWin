import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.tasks import router as tasks_router
from app.api.v1.user import router as users_router
from app.api.v1.auth import router as auth_router
from app.core.config import settings

# IMPORT MODELS HERE TO REGISTER THEM WITH SQLALCHEMY
from app.models.task import Task
from app.models.user import User

from app.db.session import engine, Base

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Auto-create tables on startup (safe: create_all is a no-op if tables exist)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield

app = FastAPI(title="MicroWin API", lifespan=lifespan)

# ─── CORS ─────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.FRONTEND_URL,
        "http://localhost:5173",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Routers ──────────────────────────────────────────────────
app.include_router(auth_router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(tasks_router, prefix="/api/v1/tasks", tags=["tasks"])
app.include_router(users_router, prefix="/api/v1/users", tags=["users"])

# ─── Serve Frontend in Production (Docker) ────────────────
STATIC_DIR = os.path.join(os.path.dirname(__file__), "static")
if os.path.isdir(STATIC_DIR):
    from fastapi.staticfiles import StaticFiles
    from fastapi.responses import FileResponse

    @app.get("/assets/{rest_of_path:path}")
    async def serve_assets(rest_of_path: str):
        return FileResponse(os.path.join(STATIC_DIR, "assets", rest_of_path))

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        file_path = os.path.join(STATIC_DIR, full_path)
        if os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(STATIC_DIR, "index.html"))
else:
    @app.get("/")
    def read_root():
        return {"message": "MicroWin Backend is Running"}