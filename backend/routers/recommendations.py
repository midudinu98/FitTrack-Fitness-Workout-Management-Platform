from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import date, timedelta
from collections import Counter

from database import get_db

from models.workout import Workout
from models.goal import Goal
from models.streak import Streak
from models.exercise import Exercise
from models.user import User

from routers.users import get_current_user

from schemas.recommendation import ExerciseSuggestion,WorkoutRecommendation,RecommendationResponse

router = APIRouter(prefix="/recommendations",tags=["AI Workout Suggestions"])

def get_recommended_categories(goal_type):
    
    goal = (goal_type or "").lower()

    if "weight loss" in goal:
        return ["Cardio", "HIIT", "Strength"]

    elif "muscle gain" in goal:
        return ["Strength", "Resistance", "Cardio"]

    elif "steps" in goal:
        return ["Walking", "Cardio", "Strength"]

    return ["Strength", "Cardio", "Flexibility"]

def get_matching_exercises(exercises, category, limit=5):
    
    keywords = category.lower().split()

    matching = [exercise for exercise in exercises
        if any(keyword in exercise.category.lower()
            for keyword in keywords)]

    if not matching:
        matching = exercises

    return matching[:limit]

@router.get("/", response_model=RecommendationResponse)
def get_workout_recommendations(db: Session = Depends(get_db),current_user: User = Depends(get_current_user)):
    
    today = date.today()
    
    thirty_days_ago = today - timedelta(days=30)

    # Get user's latest goal
    goal = (db.query(Goal).filter(Goal.user_id == current_user.id).order_by(Goal.created_at.desc()).first())

    # Get recent workout history
    workouts = (db.query(Workout).filter(Workout.user_id == current_user.id,Workout.workout_date >= thirty_days_ago,Workout.workout_date <= today).order_by(Workout.workout_date.desc()).all())

    # Get workout streak
    streak = (db.query(Streak).filter(Streak.user_id == current_user.id).first())

    current_streak = streak.current_streak if streak else 0

    # Get available exercises
    exercises = (db.query(Exercise).order_by(Exercise.name.asc()).all())

    # Calculate past performance
    if workouts:
        average_duration = round(sum(w.duration for w in workouts) / len(workouts))

        category_counts = Counter(w.category.lower() for w in workouts)

        most_common_category = category_counts.most_common(1)[0][0]

        average_calories = round(sum(w.calories_burned for w in workouts) / len(workouts))

    else:
        average_duration = 30
        most_common_category = None
        average_calories = 0

    recommended_duration = max(15, min(60, average_duration))

    # Determine recommendation categories
    goal_type = goal.goal_type if goal else "General Fitness"

    categories = get_recommended_categories(goal_type)

    recommendations = []

    for category in categories[:3]:

        selected_exercises = get_matching_exercises(exercises,category)

        if not selected_exercises:
            continue

        exercise_suggestions = [ExerciseSuggestion.model_validate(exercise)
            for exercise in selected_exercises]

        reason = f"Recommended based on your {goal_type} goal."

        if current_streak >= 7:
            intensity = "Moderate to High"
            reason += " Your consistent workout streak supports regular training."

        elif current_streak >= 1:
            intensity = "Moderate"
            reason += " Keep building your workout consistency."

        else:
            intensity = "Beginner Friendly"
            reason += " Start gradually and build consistency."

        if most_common_category:
            if category.lower() == most_common_category:
                reason += " This also matches your recent workout activity."

        recommendations.append(WorkoutRecommendation(title=f"{category} Workout",
                category=category,
                reason=reason,
                recommended_duration=recommended_duration,
                intensity=intensity,
                exercises=exercise_suggestions))

    if not exercises:
        message = ("Your Exercise Library is empty. Add exercises "
            "to receive personalized workout suggestions.")

    elif not workouts:
        message = ("Recommendations are based on your fitness goal. "
            "Log workouts regularly for more personalized suggestions.")

    else:
        message = (f"Recommendations generated using your last "
            f"30 days of workout activity. Average calories burned: "
            f"{average_calories} per workout.")

    return RecommendationResponse(goal_summary=goal_type,
        current_streak=current_streak,
        recommendations=recommendations,
        message=message)