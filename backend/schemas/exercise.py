from pydantic import BaseModel, ConfigDict, Field
from typing import Optional, Literal

class ExerciseCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=150)
    category: Literal["Cardio", "Strength", "Yoga"]
    description: Optional[str] = None
    duration: int = Field(..., gt=0)

class ExerciseResponse(BaseModel):
    id: int
    name: str
    category: str
    description: Optional[str] = None
    duration: int

    model_config = ConfigDict(from_attributes=True)