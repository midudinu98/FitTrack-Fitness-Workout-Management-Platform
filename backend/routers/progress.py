from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import date

from database import get_db

from models.user import User
from models.workout import Workout
from models.progress import Progress

from schemas.progress import ProgressResponse

from routers.users import get_current_user

router = APIRouter(prefix="/progress",tags=["Daily Progress Tracking"])

@router.get("/daily", response_model=ProgressResponse)
def get_daily_progress(progress_date: date = None,db: Session = Depends(get_db),current_user: User = Depends(get_current_user)):
    
    if progress_date is None:
        progress_date = date.today()

    workouts = (db.query(Workout).filter(Workout.user_id == current_user.id,Workout.workout_date == progress_date).all())

    total_workouts = len(workouts)

    total_calories = sum(workout.calories_burned for workout in workouts)

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