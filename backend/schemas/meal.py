from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Literal

class MealCreate(BaseModel):
    meal_type: Literal["Breakfast", "Lunch", "Dinner", "Snacks"]
    food_name: str
    calories: float
    protein: float
    carbs: float
    fats: float

class MealResponse(BaseModel):
    id: int
    user_id: int
    meal_type: str
    food_name: str
    calories: float
    protein: float
    carbs: float
    fats: float
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class NutritionSummary(BaseModel):
    total_calories: float
    total_protein: float
    total_carbs: float
    total_fats: float
    total_meals: int
