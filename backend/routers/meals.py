from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date

from database import get_db

from models.user import User
from models.meal import Meal

from schemas.meal import MealCreate, MealResponse, NutritionSummary

from routers.users import get_current_user

router = APIRouter(prefix="/meals", tags=["Nutrition & Meal Tracking"])

# Add a new meal
@router.post("/", response_model=MealResponse, status_code=status.HTTP_201_CREATED)
def create_meal(meal_data: MealCreate,db: Session = Depends(get_db),current_user: User = Depends(get_current_user)):

    new_meal = Meal(user_id=current_user.id,
        meal_type=meal_data.meal_type,
        food_name=meal_data.food_name,
        calories=meal_data.calories,
        protein=meal_data.protein,
        carbs=meal_data.carbs,
        fats=meal_data.fats)

    db.add(new_meal)
    db.commit()
    db.refresh(new_meal)

    return new_meal

# Fetch meals belonging to the logged-in user
@router.get("/", response_model=list[MealResponse])
def get_meals(db: Session = Depends(get_db),current_user: User = Depends(get_current_user)):

    meals = (db.query(Meal).filter(Meal.user_id == current_user.id).order_by(Meal.created_at.desc()).all())

    return meals

# Get daily nutrition summary
@router.get("/summary", response_model=NutritionSummary)
def get_nutrition_summary(db: Session = Depends(get_db),current_user: User = Depends(get_current_user)):

    today = date.today()

    summary = db.query(func.coalesce(func.sum(Meal.calories), 0).label("total_calories"),
        func.coalesce(func.sum(Meal.protein), 0).label("total_protein"),
        func.coalesce(func.sum(Meal.carbs), 0).label("total_carbs"),
        func.coalesce(func.sum(Meal.fats), 0).label("total_fats"),
        func.count(Meal.id).label("total_meals")).filter(Meal.user_id == current_user.id,func.date(Meal.created_at) == today).first()

    return {"total_calories": summary.total_calories,
        "total_protein": summary.total_protein,
        "total_carbs": summary.total_carbs,
        "total_fats": summary.total_fats,
        "total_meals": summary.total_meals}