from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import date

from database import get_db

from models.user import User
from models.goal import Goal
from models.notification import Notification

from schemas.goal import GoalCreate, GoalUpdate, GoalResponse

from routers.users import get_current_user

router = APIRouter(prefix="/goals",tags=["Goal Management"])

def get_goal_status(goal):
    
    if goal.goal_type == "Weight Loss":
        completed = goal.current_value <= goal.target_value
    else:
        completed = goal.current_value >= goal.target_value

    if completed:
        return "Completed"

    if goal.deadline < date.today():
        return "Overdue"

    return "Active"

def format_goal(goal):
    return {"id": goal.id,
        "user_id": goal.user_id,
        "goal_type": goal.goal_type,
        "target_value": goal.target_value,
        "current_value": goal.current_value,
        "deadline": goal.deadline,
        "created_at": goal.created_at,
        "status": get_goal_status(goal)}

@router.post("/", status_code=status.HTTP_201_CREATED)
def create_goal(goal_data: GoalCreate,db: Session = Depends(get_db),current_user: User = Depends(get_current_user)):
    
    if goal_data.deadline < date.today():
        raise HTTPException(status_code=400,detail="Deadline must be today or a future date")

    new_goal = Goal(user_id=current_user.id,
        goal_type=goal_data.goal_type,
        target_value=goal_data.target_value,
        current_value=goal_data.current_value,
        deadline=goal_data.deadline)

    db.add(new_goal)
    db.commit()
    db.refresh(new_goal)

    return format_goal(new_goal)

@router.get("/")
def get_goals(db: Session = Depends(get_db),current_user: User = Depends(get_current_user)):
    
    goals = (db.query(Goal).filter(Goal.user_id == current_user.id).order_by(Goal.created_at.desc()).all())

    return [format_goal(goal) for goal in goals]

@router.put("/{goal_id}")
def update_goal(goal_id: int,goal_data: GoalUpdate,db: Session = Depends(get_db),current_user: User = Depends(get_current_user)):
    
    goal = (db.query(Goal).filter(Goal.id == goal_id,Goal.user_id == current_user.id).first())

    if goal is None:
        raise HTTPException(status_code=404,detail="Goal not found")

    previous_status = get_goal_status(goal)
    goal.current_value = goal_data.current_value
    new_status = get_goal_status(goal)

    # Create notification when goal is completed
    if new_status == "Completed" and previous_status != "Completed":
        notification = Notification(user_id=current_user.id,title="Goal Completed!",
        message=f"Congratulations! You have completed your {goal.goal_type} goal.",
        is_read=False)

        db.add(notification)

    db.commit()
    db.refresh(goal)

@router.delete("/{goal_id}")
def delete_goal(goal_id: int,db: Session = Depends(get_db),current_user: User = Depends(get_current_user)):
    
    goal = (db.query(Goal)
        .filter(Goal.id == goal_id,Goal.user_id == current_user.id).first())

    if goal is None:
        raise HTTPException(status_code=404,detail="Goal not found")

    db.delete(goal)
    db.commit()

    return {"message": "Goal deleted successfully"}