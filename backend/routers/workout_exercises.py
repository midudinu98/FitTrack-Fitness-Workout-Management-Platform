from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db

from models.workout import Workout
from models.exercise import Exercise
from models.workout_exercise import WorkoutExercise

from schemas.workout_exercise import WorkoutExerciseCreate,WorkoutExerciseResponse

from routers.users import get_current_user

router = APIRouter(prefix="/workout-exercises",tags=["Workout Exercises"])

# Add an exercise to a workout
@router.post("/", response_model=WorkoutExerciseResponse)
def add_exercise_to_workout(data: WorkoutExerciseCreate,db: Session = Depends(get_db),current_user=Depends(get_current_user)):
    
    workout = db.query(Workout).filter(Workout.id == data.workout_id,Workout.user_id == current_user.id).first()

    if not workout:
        raise HTTPException(status_code=404,detail="Workout not found")

    exercise = db.query(Exercise).filter(Exercise.id == data.exercise_id).first()

    if not exercise:
        raise HTTPException(status_code=404,detail="Exercise not found")

    existing = db.query(WorkoutExercise).filter(WorkoutExercise.workout_id == data.workout_id,WorkoutExercise.exercise_id == data.exercise_id).first()

    if existing:
        raise HTTPException(status_code=400,detail="Exercise already added to this workout")

    workout_exercise = WorkoutExercise(workout_id=data.workout_id,exercise_id=data.exercise_id)

    db.add(workout_exercise)
    db.commit()
    db.refresh(workout_exercise)

    return workout_exercise

# View exercises added to a workout
@router.get("/{workout_id}",response_model=list[WorkoutExerciseResponse])
def get_workout_exercises(workout_id: int,db: Session = Depends(get_db),current_user=Depends(get_current_user)):
    
    workout = db.query(Workout).filter(Workout.id == workout_id,Workout.user_id == current_user.id).first()

    if not workout:
        raise HTTPException(status_code=404,detail="Workout not found")

    return db.query(WorkoutExercise).filter(WorkoutExercise.workout_id == workout_id).all()