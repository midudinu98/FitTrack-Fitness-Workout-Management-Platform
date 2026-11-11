from pydantic import BaseModel, ConfigDict, Field
from datetime import date

class WaterTrackingCreate(BaseModel):
    quantity: int = Field(gt=0)

class WaterTrackingResponse(BaseModel):
    id: int
    user_id: int
    quantity: int
    date: date

    model_config = ConfigDict(from_attributes=True)

class WaterSummary(BaseModel):
    total_quantity: int
    daily_goal: int
    remaining_quantity: int
    progress_percentage: float
