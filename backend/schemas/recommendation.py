from pydantic import BaseModel, ConfigDict
from typing import Optional

class ExerciseSuggestion(BaseModel):
    id: int
    name: str
    category: str
    description: Optional[str] = None
    duration: int

    model_config = ConfigDict(from_attributes=True)

class WorkoutRecommendation(BaseModel):
    title: str
    category: str
    reason: str
    recommended_duration: int
    intensity: str
    exercises: list[ExerciseSuggestion]

class RecommendationResponse(BaseModel):
    goal_summary: Optional[str] = None
    current_streak: int
    recommendations: list[WorkoutRecommendation]
    message: str