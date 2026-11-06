from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import date, timedelta
import calendar

from database import get_db

from models.user import User
from models.workout import Workout
from models.progress import Progress

from schemas.progress import ProgressResponse

from routers.users import get_current_user

router = APIRouter(prefix="/progress",tags=["Progress Comparison"])

def calculate_stats(db: Session, user_id: int, start_date: date, end_date: date):
    
    workouts = (db.query(Workout).filter(Workout.user_id == user_id,
            Workout.workout_date >= start_date,
            Workout.workout_date <= end_date).all())

    return {"total_workouts": len(workouts),
        "total_duration": sum(w.duration for w in workouts),
        "total_calories": sum(w.calories_burned for w in workouts)}

def calculate_change(current, previous):
    
    if previous == 0:
        return None

    return round(((current - previous) / previous) * 100, 2)

def build_comparison(current, previous):
    
    return {"current": current,
        "previous": previous,
        "changes": {"workouts": calculate_change(
                current["total_workouts"],
                previous["total_workouts"]),
            "duration": calculate_change(
                current["total_duration"],
                previous["total_duration"]),
            "calories": calculate_change(
                current["total_calories"],
                previous["total_calories"])}}

def build_insights(comparison):
    
    insights = []

    labels = {"workouts": "Workout count",
        "duration": "Workout duration",
        "calories": "Calories burned"}

    for metric, percentage in comparison["changes"].items():
        if percentage is None:
            insights.append(f"{labels[metric]}: No previous activity available for comparison.")
        elif percentage > 0:
            insights.append(f"{labels[metric]} increased by {percentage}%.")
        elif percentage < 0:
            insights.append(f"{labels[metric]} decreased by {abs(percentage)}%.")
        else:
            insights.append(f"{labels[metric]} remained unchanged.")

    return insights

# Existing daily progress API
@router.get("/daily", response_model=ProgressResponse)
def get_daily_progress(progress_date: date = None,db: Session = Depends(get_db),current_user: User = Depends(get_current_user)):
    
    if progress_date is None:
        progress_date = date.today()

    workouts = (db.query(Workout).filter(Workout.user_id == current_user.id,Workout.workout_date == progress_date).all())

    total_workouts = len(workouts)
    total_calories = sum(w.calories_burned for w in workouts)

    progress = (db.query(Progress).filter(Progress.user_id == current_user.id,Progress.date == progress_date).first())

    if progress is None:
        progress = Progress(user_id=current_user.id,
            total_workouts=total_workouts,
            total_calories=total_calories,
            date=progress_date)
        db.add(progress)
    else:
        progress.total_workouts = total_workouts
        progress.total_calories = total_calories

    db.commit()
    db.refresh(progress)

    return progress

# Weekly progress comparison
@router.get("/weekly-comparison")
def weekly_comparison(db: Session = Depends(get_db),current_user: User = Depends(get_current_user)):
    
    today = date.today()

    current_start = today - timedelta(days=today.weekday())
    current_end = today

    previous_end = current_start - timedelta(days=1)
    previous_start = previous_end - timedelta(days=6)

    current = calculate_stats(db, current_user.id, current_start, current_end)

    previous = calculate_stats(db, current_user.id, previous_start, previous_end)

    comparison = build_comparison(current, previous)

    return {"period": "Weekly",
        "current_period": {"start": current_start,
            "end": current_end},
        "previous_period": {"start": previous_start,
            "end": previous_end},
        **comparison,
        "insights": build_insights(comparison)}

# Monthly progress comparison
@router.get("/monthly-comparison")
def monthly_comparison(db: Session = Depends(get_db),current_user: User = Depends(get_current_user)):
    
    today = date.today()

    current_start = today.replace(day=1)
    current_end = today

    previous_month_last_day = current_start - timedelta(days=1)

    previous_month_day = min(today.day,calendar.monthrange(previous_month_last_day.year,previous_month_last_day.month)[1])

    previous_start = previous_month_last_day.replace(day=1)
    previous_end = previous_month_last_day.replace(day=previous_month_day)

    current = calculate_stats(db, current_user.id, current_start, current_end)

    previous = calculate_stats(db, current_user.id, previous_start, previous_end)

    comparison = build_comparison(current, previous)

    return {"period": "Monthly",
        "current_period": {"start": current_start,
            "end": current_end},
        "previous_period": {"start": previous_start,
            "end": previous_end},
        **comparison,
        "insights": build_insights(comparison)}