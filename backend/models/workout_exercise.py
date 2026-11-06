from sqlalchemy import Column, Integer, ForeignKey, UniqueConstraint
from database import Base

class WorkoutExercise(Base):
    
    __tablename__ = "workout_exercises"

    id = Column(Integer, primary_key=True, index=True)
    workout_id = Column(Integer,ForeignKey("workouts.id"),nullable=False)
    exercise_id = Column(Integer,ForeignKey("exercises.id"),nullable=False)

    __table_args__ = (UniqueConstraint("workout_id","exercise_id",name="unique_workout_exercise"),)