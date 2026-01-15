from sqlalchemy.orm import Session
from . import models, schemas

def create_user(db: Session, user: schemas.UserCreate):
    db_user = models.User(**user.dict())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def create_task(db: Session, task: schemas.TaskCreate):
    db_task = models.Task(title=task.title, user_id=task.user_id)
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

def get_tasks_by_user(db: Session, user_id: int):
    return db.query(models.Task).filter(models.Task.user_id == user_id).all()
