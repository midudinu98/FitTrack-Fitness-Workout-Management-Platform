from pydantic import BaseModel, ConfigDict
from datetime import date, datetime
from typing import Optional

class WorkoutPlanCreate(BaseModel):
    title: str
    description: Optional[str] = None
    scheduled_date: date

class WorkoutPlanResponse(BaseModel):
    id: int
    user_id: int
    title: str
    description: Optional[str] = None
    scheduled_date: date
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)