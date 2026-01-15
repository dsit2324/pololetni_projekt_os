from pydantic import BaseModel

class UserCreate(BaseModel):
    username: str
    email: str

class UserResponse(UserCreate):
    id: int
    class Config:
        orm_mode = True

class TaskCreate(BaseModel):
    title: str
    user_id: int

class TaskResponse(TaskCreate):
    id: int
    status: str
    class Config:
        orm_mode = True
