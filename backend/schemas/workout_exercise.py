from pydantic import BaseModel, ConfigDict

class WorkoutExerciseCreate(BaseModel):
    workout_id: int
    exercise_id: int

class WorkoutExerciseResponse(BaseModel):
    id: int
    workout_id: int
    exercise_id: int

    model_config = ConfigDict(from_attributes=True)