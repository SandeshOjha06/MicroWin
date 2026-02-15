from fastapi import FastAPI
from app.api.v1.tasks import router as tasks_router
# IMPORT MODELS HERE TO REGISTER THEM WITH SQLALCHEMY
from app.models.task import Task
from app.models.user import User 
from app.api.v1.user import router as users_router

app = FastAPI(title="MicroWin API")

app.include_router(tasks_router, prefix="/api/v1/tasks", tags=["tasks"])
app.include_router(users_router, prefix="/api/v1/users", tags=["users"])

# @app.get("/")
# def read_root():
#     return {"message": "MicroWin Backend is Running"}