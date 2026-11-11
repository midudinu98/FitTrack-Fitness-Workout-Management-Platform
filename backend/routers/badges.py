from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from database import get_db

from models.user import User
from models.badge import Badge
from models.user_badge import UserBadge
from models.workout import Workout
from models.streak import Streak
from models.goal import Goal

from schemas.badge import BadgeStatusResponse

from routers.users import get_current_user

router = APIRouter(prefix="/badges", tags=["Achievement Badges"])

# Default badge definitions
BADGE_DEFINITIONS = [
    {
        "name": "First Workout",
        "description": "Complete your first workout.",
        "icon": "🏅"
    },
    {
        "name": "Workout Enthusiast",
        "description": "Complete 10 workouts.",
        "icon": "💪"
    },
    {
        "name": "Fitness Champion",
        "description": "Complete 50 workouts.",
        "icon": "🏆"
    },
    {
        "name": "3 Day Streak",
        "description": "Maintain a 3-day workout streak.",
        "icon": "🔥"
    },
    {
        "name": "7 Day Streak",
        "description": "Maintain a 7-day workout streak.",
        "icon": "⚡"
    },
    {
        "name": "30 Day Streak",
        "description": "Maintain a 30-day workout streak.",
        "icon": "👑"
    },
    {
        "name": "Goal Achiever",
        "description": "Achieve your first fitness goal.",
        "icon": "🎯"
    }
]

def create_default_badges(db: Session):
    for item in BADGE_DEFINITIONS:
        existing = (db.query(Badge).filter(Badge.name == item["name"]).first())

        if not existing:
            db.add(Badge(**item))

    db.commit()

def award_badge(db: Session, user_id: int, badge_name: str):
    badge = (db.query(Badge).filter(Badge.name == badge_name).first())

    if not badge:
        return None

    existing = (db.query(UserBadge).filter(UserBadge.user_id == user_id,UserBadge.badge_id == badge.id).first())

    if existing:
        return None

    user_badge = UserBadge(user_id=user_id,badge_id=badge.id)

    db.add(user_badge)
    db.commit()
    db.refresh(user_badge)

    return badge

@router.get("/", response_model=list[BadgeStatusResponse])
def get_all_badges(db: Session = Depends(get_db),current_user: User = Depends(get_current_user)):
    
    create_default_badges(db)

    # Count completed workouts
    workout_count = (db.query(func.count(Workout.id)).filter(Workout.user_id == current_user.id).scalar())

    # Award workout milestone badges
    if workout_count >= 1:
        award_badge(db, current_user.id, "First Workout")

    if workout_count >= 10:
        award_badge(db, current_user.id, "Workout Enthusiast")

    if workout_count >= 50:
        award_badge(db, current_user.id, "Fitness Champion")

    # Check user's streak
    streak = (db.query(Streak).filter(Streak.user_id == current_user.id).first())

    if streak:
        if streak.longest_streak >= 3:
            award_badge(db, current_user.id, "3 Day Streak")

        if streak.longest_streak >= 7:
            award_badge(db, current_user.id, "7 Day Streak")

        if streak.longest_streak >= 30:
            award_badge(db, current_user.id, "30 Day Streak")

    # Check completed fitness goals
    from routers.goals import get_goal_status

    goals = (db.query(Goal).filter(Goal.user_id == current_user.id).all())

    for goal in goals:
        if get_goal_status(goal) == "Completed":
            award_badge(db, current_user.id, "Goal Achiever")
            break

    badges = db.query(Badge).all()

    earned_badges = (db.query(UserBadge).filter(UserBadge.user_id == current_user.id).all())

    earned_map = {item.badge_id: item.earned_at for item in earned_badges}

    return [{"badge": badge,
            "earned": badge.id in earned_map,
            "earned_at": earned_map.get(badge.id)}for badge in badges]
