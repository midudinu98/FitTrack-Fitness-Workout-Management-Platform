from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date, timedelta
import calendar

from database import get_db
from models.workout import Workout
from models.user import User

from routers.users import get_current_user

router = APIRouter(prefix="/reports",tags=["Reports & Analytics"])

# Weekly Workout Summary
@router.get("/weekly")
def weekly_report(db: Session = Depends(get_db),current_user: User = Depends(get_current_user)):
    
    today = date.today()
    start_date = today - timedelta(days=6)

    workouts = (db.query(Workout).filter(Workout.user_id == current_user.id,Workout.workout_date >= start_date,Workout.workout_date <= today).all())

    return {"start_date": start_date,
        "end_date": today,
        "total_workouts": len(workouts),
        "total_duration": sum(w.duration for w in workouts),
        "total_calories": sum(w.calories_burned for w in workouts),
        "workouts": [{"date": w.workout_date,
                "workout_name": w.workout_name,
                "category": w.category,
                "duration": w.duration,
                "calories_burned": w.calories_burned
            }for w in workouts]}

# Monthly Progress Report
@router.get("/monthly")
def monthly_report(year: int,month: int,db: Session = Depends(get_db),current_user: User = Depends(get_current_user)):
    
    if month < 1 or month > 12:
        from fastapi import HTTPException
        raise HTTPException(status_code=400,detail="Month must be between 1 and 12")

    last_day = calendar.monthrange(year, month)[1]

    start_date = date(year, month, 1)
    end_date = date(year, month, last_day)

    workouts = (db.query(Workout).filter(Workout.user_id == current_user.id,Workout.workout_date >= start_date,Workout.workout_date <= end_date).all())

    return {"year": year,
        "month": month,
        "total_workouts": len(workouts),
        "total_duration": sum(w.duration for w in workouts),
        "total_calories": sum(w.calories_burned for w in workouts),
        "workouts_by_category": {category: count
            for category, count in (db.query(Workout.category,func.count(Workout.id)).filter(Workout.user_id == current_user.id,
                    Workout.workout_date >= start_date,
                    Workout.workout_date <= end_date).group_by(Workout.category).all())}}

# Calories Tracking
@router.get("/calories")
def calories_report(db: Session = Depends(get_db),current_user: User = Depends(get_current_user)):
    
    results = (db.query(Workout.workout_date,func.sum(Workout.calories_burned).label("total_calories")).filter(Workout.user_id == current_user.id).group_by(Workout.workout_date).order_by(Workout.workout_date.asc()).all())

    return {"calories_tracking": [{"date": result.workout_date,"calories": result.total_calories}for result in results]}