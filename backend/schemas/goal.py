from pydantic import BaseModel, Field, ConfigDict
from datetime import date, datetime
from typing import Literal

class GoalCreate(BaseModel):
    goal_type: Literal["Weight Loss", "Muscle Gain", "Steps"]
    target_value: float = Field(gt=0)
    current_value: float = Field(default=0, ge=0)
    deadline: date

class GoalUpdate(BaseModel):
    current_value: float = Field(ge=0)

class GoalResponse(BaseModel):
    id: int
    user_id: int
    goal_type: str
    target_value: float
    current_value: float
    deadline: date
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)