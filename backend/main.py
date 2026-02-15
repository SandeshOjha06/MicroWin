from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.tasks import router as tasks_router
from app.api.v1.user import router as users_router
from app.api.v1.auth import router as auth_router
from app.core.config import settings

# IMPORT MODELS HERE TO REGISTER THEM WITH SQLALCHEMY
from app.models.task import Task
from app.models.user import User

app = FastAPI(title="MicroWin API")

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

@app.get("/")
def read_root():
    return {"message": "MicroWin Backend is Running"}