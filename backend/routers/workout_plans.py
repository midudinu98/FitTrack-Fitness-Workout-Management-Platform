from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date
from typing import List

from database import get_db

from models.workout_plan import WorkoutPlan
from models.user import User

from schemas.workout_plan import WorkoutPlanCreate,WorkoutPlanResponse

from routers.users import get_current_user

router = APIRouter(prefix="/workout-plans",tags=["Workout Plans"])

# Create Workout Plan
@router.post("/", response_model=WorkoutPlanResponse, status_code=201)
def create_workout_plan(plan: WorkoutPlanCreate,db: Session = Depends(get_db),current_user: User = Depends(get_current_user)):
    
    new_plan = WorkoutPlan(user_id=current_user.id,title=plan.title,description=plan.description,scheduled_date=plan.scheduled_date)

    db.add(new_plan)
    db.commit()
    db.refresh(new_plan)

    return new_plan

# Get All Workout Plans
@router.get("/", response_model=List[WorkoutPlanResponse])
def get_workout_plans(db: Session = Depends(get_db),current_user: User = Depends(get_current_user)):
    
    plans = db.query(WorkoutPlan).filter(WorkoutPlan.user_id == current_user.id).order_by(WorkoutPlan.scheduled_date.asc()).all()

    return plans

# Get Upcoming Workout Plans
@router.get("/upcoming", response_model=List[WorkoutPlanResponse])
def get_upcoming_workouts(db: Session = Depends(get_db),current_user: User = Depends(get_current_user)):
    
    plans = db.query(WorkoutPlan).filter(WorkoutPlan.user_id == current_user.id,WorkoutPlan.scheduled_date >= date.today()).order_by(WorkoutPlan.scheduled_date.asc()).all()

    return plans