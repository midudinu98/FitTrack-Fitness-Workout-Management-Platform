from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import date, timedelta

from database import get_db

from models.user import User
from models.workout import Workout
from models.streak import Streak

from schemas.streak import StreakResponse

from routers.users import get_current_user

router = APIRouter(prefix="/streaks", tags=["Streak Tracking"])

@router.get("/", response_model=StreakResponse)
def get_streak(db: Session = Depends(get_db),current_user: User = Depends(get_current_user)):
    
    today = date.today()

    # Get all unique workout dates for the logged-in user
    workout_dates = (db.query(Workout.workout_date).filter(Workout.user_id == current_user.id).distinct().order_by(Workout.workout_date.desc()).all())

    dates = [row[0] for row in workout_dates]

    current_streak = 0
    longest_streak = 0
    last_workout_date = dates[0] if dates else None

    if dates:
        # Calculate the longest streak from workout history
        streak_count = 1
        longest_streak = 1

        for index in range(1, len(dates)):
            difference = (dates[index - 1] - dates[index]).days

            if difference == 1:
                streak_count += 1
            else:
                streak_count = 1

            longest_streak = max(longest_streak, streak_count)

        # Current streak remains active if the latest workout
        # was today or yesterday.
        if last_workout_date >= today - timedelta(days=1):
            current_streak = 1

            for index in range(1, len(dates)):
                difference = (dates[index - 1] - dates[index]).days

                if difference == 1:
                    current_streak += 1
                else:
                    break

    # Save or update the user's streak record
    streak = (db.query(Streak).filter(Streak.user_id == current_user.id).first())

    if streak is None:
        streak = Streak(user_id=current_user.id,
            current_streak=current_streak,
            longest_streak=longest_streak,
            last_workout_date=last_workout_date)
        db.add(streak)
    else:
        streak.current_streak = current_streak
        streak.longest_streak = longest_streak
        streak.last_workout_date = last_workout_date

    db.commit()
    db.refresh(streak)

    return streak