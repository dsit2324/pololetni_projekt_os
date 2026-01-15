from fastapi import FastAPI, Depends
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from pathlib import Path
from .database import SessionLocal, engine
from . import models, schemas, crud

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="ToDo App")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ---------- API ----------
@app.post("/api/users", response_model=schemas.UserResponse)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    return crud.create_user(db, user)

@app.post("/api/tasks", response_model=schemas.TaskResponse)
def create_task(task: schemas.TaskCreate, db: Session = Depends(get_db)):
    return crud.create_task(db, task)

@app.get("/api/users/{user_id}/tasks", response_model=list[schemas.TaskResponse])
def get_tasks(user_id: int, db: Session = Depends(get_db)):
    return crud.get_tasks_by_user(db, user_id)

# ---------- STATIC FILES ----------
app.mount("/static", StaticFiles(directory="app/static"), name="static")

@app.get("/")
async def root():
    return FileResponse("app/static/index.html", media_type="text/html")
