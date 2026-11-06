from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db

from models.exercise import Exercise

from schemas.exercise import ExerciseCreate, ExerciseResponse

from routers.users import get_current_user

router = APIRouter(prefix="/exercises",tags=["Exercise Library"])

# View all exercises
@router.get("/", response_model=list[ExerciseResponse])
def get_exercises(db: Session = Depends(get_db),current_user=Depends(get_current_user)):
    
    return db.query(Exercise).order_by(Exercise.name.asc()).all()

# Add a new exercise
@router.post("/", response_model=ExerciseResponse)
def create_exercise(exercise: ExerciseCreate,db: Session = Depends(get_db),current_user=Depends(get_current_user)):
    
    existing_exercise = db.query(Exercise).filter(Exercise.name.ilike(exercise.name.strip())).first()

    if existing_exercise:
        raise HTTPException(status_code=400,detail="Exercise already exists")

    new_exercise = Exercise(name=exercise.name.strip(),category=exercise.category,description=exercise.description,duration=exercise.duration)

    db.add(new_exercise)
    db.commit()
    db.refresh(new_exercise)

    return new_exercise

# Search exercises by name
@router.get("/search", response_model=list[ExerciseResponse])
def search_exercises(name: str,db: Session = Depends(get_db),current_user=Depends(get_current_user)):
    
    return db.query(Exercise).filter(Exercise.name.ilike(f"%{name.strip()}%")).order_by(Exercise.name.asc()).all()

# Filter exercises by category
@router.get("/category/{category}", response_model=list[ExerciseResponse])
def filter_exercises(category: str,db: Session = Depends(get_db),current_user=Depends(get_current_user)):
    
    valid_categories = ["Cardio", "Strength", "Yoga"]

    if category not in valid_categories:
        raise HTTPException(status_code=400,detail="Invalid category")

    return db.query(Exercise).filter(Exercise.category == category).order_by(Exercise.name.asc()).all()