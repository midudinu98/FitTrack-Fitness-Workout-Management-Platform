from pydantic import BaseModel, ConfigDict
from datetime import date, datetime

class ProgressResponse(BaseModel):
    id: int
    user_id: int
    total_workouts: int
    total_calories: float
    date: date
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)