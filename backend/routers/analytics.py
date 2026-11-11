from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import date, timedelta
from collections import Counter

from database import get_db

from models.user import User
from models.workout import Workout
from models.goal import Goal
from models.streak import Streak

from routers.users import get_current_user

router = APIRouter(prefix="/analytics",tags=["Advanced Analytics"])

@router.get("/dashboard")
def get_advanced_analytics(db: Session = Depends(get_db),current_user: User = Depends(get_current_user)):
    
    today = date.today()
    start_date = today - timedelta(days=29)

    workouts = db.query(Workout).filter(Workout.user_id == current_user.id).all()

    recent_workouts = [workout for workout in workouts if start_date <= workout.workout_date <= today]

    # Weekly performance - last 7 weeks
    weekly_performance = []

    for i in range(6, -1, -1):
        week_start = today - timedelta(days=today.weekday()) - timedelta(weeks=i)
        week_end = week_start + timedelta(days=6)

        week_workouts = [workout for workout in workouts if week_start <= workout.workout_date <= min(week_end, today)]

        weekly_performance.append({
            "week": week_start.strftime("%d %b"),
            "workouts": len(week_workouts),
            "duration": sum(w.duration for w in week_workouts),
            "calories": sum(w.calories_burned for w in week_workouts)
        })

    # Monthly performance - last 6 months
    monthly_performance = []

    for i in range(5, -1, -1):
        month_start = (
            today.replace(day=1) - timedelta(days=1)
        ).replace(day=1)

        # Move back by i months
        year = today.year
        month = today.month - i

        while month <= 0:
            month += 12
            year -= 1

        month_start = date(year, month, 1)

        if month == 12:
            next_month = date(year + 1, 1, 1)
        else:
            next_month = date(year, month + 1, 1)

        month_end = next_month - timedelta(days=1)

        month_workouts = [
            workout for workout in workouts
            if month_start <= workout.workout_date <= min(month_end, today)
        ]

        monthly_performance.append({
            "month": month_start.strftime("%b %Y"),
            "workouts": len(month_workouts),
            "duration": sum(w.duration for w in month_workouts),
            "calories": sum(w.calories_burned for w in month_workouts)
        })

    # Goal completion analytics
    goals = db.query(Goal).filter(
        Goal.user_id == current_user.id
    ).all()

    completed_goals = [
        goal for goal in goals
        if goal.current_value >= goal.target_value
    ]

    goal_completion_rate = (
        round((len(completed_goals) / len(goals)) * 100, 2)
        if goals else 0
    )

    # Workout consistency - last 30 days
    workout_dates = {
        workout.workout_date
        for workout in recent_workouts
    }

    consistency_rate = round(
        (len(workout_dates) / 30) * 100, 2
    )

    # Current streak and longest streak
    sorted_dates = sorted(workout_dates, reverse=True)

    current_streak = 0

    if sorted_dates:
        streak_date = today

        if sorted_dates[0] == today - timedelta(days=1):
            streak_date = sorted_dates[0]

        while streak_date in workout_dates:
            current_streak += 1
            streak_date -= timedelta(days=1)

    longest_streak = 0
    temporary_streak = 0
    previous_date = None

    all_workout_dates = sorted({
        workout.workout_date for workout in workouts
    })

    for workout_date in all_workout_dates:
        if (
            previous_date is None
            or workout_date == previous_date + timedelta(days=1)
        ):
            temporary_streak += 1
        else:
            temporary_streak = 1

        longest_streak = max(
            longest_streak,
            temporary_streak
        )

        previous_date = workout_date

    # Performance statistics
    total_workouts = len(recent_workouts)

    total_duration = sum(
        workout.duration for workout in recent_workouts
    )

    total_calories = sum(
        workout.calories_burned for workout in recent_workouts
    )

    average_duration = (
        round(total_duration / total_workouts, 2)
        if total_workouts else 0
    )

    average_calories = (
        round(total_calories / total_workouts, 2)
        if total_workouts else 0
    )

    categories = Counter(
        workout.category for workout in recent_workouts
    )

    most_frequent_category = (
        categories.most_common(1)[0][0]
        if categories else "No workouts yet"
    )

    # Performance insights
    insights = []

    if total_workouts == 0:
        insights.append(
            "Start recording workouts to generate performance insights."
        )
    else:
        insights.append(
            f"You completed {total_workouts} workouts in the last 30 days."
        )

        if consistency_rate >= 70:
            insights.append(
                "Excellent workout consistency! Keep it up."
            )
        elif consistency_rate >= 40:
            insights.append(
                "Good progress. Try to maintain a more regular workout schedule."
            )
        else:
            insights.append(
                "Try to increase your workout frequency."
            )

        insights.append(
            f"Your most frequent workout category is {most_frequent_category}."
        )

    if goals:
        insights.append(
            f"You completed {len(completed_goals)} out of {len(goals)} goals."
        )

    return {
        "weekly_performance": weekly_performance,
        "monthly_performance": monthly_performance,
        "goal_analytics": {
            "total_goals": len(goals),
            "completed_goals": len(completed_goals),
            "completion_rate": goal_completion_rate
        },
        "consistency": {
            "total_workout_days": len(workout_dates),
            "total_days": 30,
            "consistency_rate": consistency_rate,
            "current_streak": current_streak,
            "longest_streak": longest_streak
        },
        "performance_insights": {
            "total_workouts": total_workouts,
            "total_duration": total_duration,
            "total_calories": round(total_calories, 2),
            "average_duration": average_duration,
            "average_calories": average_calories,
            "most_frequent_category": most_frequent_category,
            "insights": insights
        }
    }