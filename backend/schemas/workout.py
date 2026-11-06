from pydantic import BaseModel, Field, ConfigDict
from datetime import date, datetime
from typing import Literal

class WorkoutCreate(BaseModel):
    workout_name: str = Field(min_length=2, max_length=100)
    category: Literal["Cardio", "Strength", "Yoga"]
    duration: int = Field(gt=0, le=1440)
    calories_burned: float = Field(ge=0, le=10000)
    workout_date: date

class WorkoutUpdate(BaseModel):
    workout_name: str = Field(min_length=2, max_length=100)
    category: Literal["Cardio", "Strength", "Yoga"]
    duration: int = Field(gt=0, le=1440)
    calories_burned: float = Field(ge=0, le=10000)
    workout_date: date

class WorkoutResponse(BaseModel):
    id: int
    user_id: int
    workout_name: str
    category: str
    duration: int
    calories_burned: float
    workout_date: date
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)