from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db

from models.workout import Workout
from schemas.workout import WorkoutCreate, WorkoutUpdate, WorkoutResponse

from models.user import User
from routers.users import get_current_user

router = APIRouter(prefix="/workouts",tags=["Workout Management"])

# Add a new workout
@router.post("/",response_model=WorkoutResponse,status_code=status.HTTP_201_CREATED)
def create_workout(workout_data: WorkoutCreate,db: Session = Depends(get_db),current_user: User = Depends(get_current_user)):
    
    new_workout = Workout(user_id=current_user.id,
        workout_name=workout_data.workout_name,
        category=workout_data.category,
        duration=workout_data.duration,
        calories_burned=workout_data.calories_burned,
        workout_date=workout_data.workout_date)

    db.add(new_workout)
    db.commit()
    db.refresh(new_workout)

    return new_workout

# Fetch workouts belonging to the logged-in user
@router.get("/", response_model=list[WorkoutResponse])
def get_workouts(db: Session = Depends(get_db),current_user: User = Depends(get_current_user)):
    
    workouts = (db.query(Workout).filter(Workout.user_id == current_user.id).order_by(Workout.workout_date.desc()).all())

    return workouts

# Edit an existing workout
@router.put("/{workout_id}", response_model=WorkoutResponse)
def update_workout(workout_id: int,workout_data: WorkoutUpdate,db: Session = Depends(get_db),current_user: User = Depends(get_current_user)):
    
    workout = (db.query(Workout).filter(Workout.id == workout_id,Workout.user_id == current_user.id).first())

    if workout is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Workout not found")

    workout.workout_name = workout_data.workout_name
    workout.category = workout_data.category
    workout.duration = workout_data.duration
    workout.calories_burned = workout_data.calories_burned
    workout.workout_date = workout_data.workout_date

    db.commit()
    db.refresh(workout)

    return workout

# Delete an existing workout
@router.delete("/{workout_id}")
def delete_workout(workout_id: int,db: Session = Depends(get_db),current_user: User = Depends(get_current_user)):
    
    workout = (db.query(Workout).filter(Workout.id == workout_id,Workout.user_id == current_user.id).first())

    if workout is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Workout not found")

    db.delete(workout)
    db.commit()

    return {"message": "Workout deleted successfully"}