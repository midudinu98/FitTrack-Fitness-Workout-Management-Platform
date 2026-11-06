from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from database import engine, Base

import models

from routers.users import router as users_router
from routers.workouts import router as workouts_router
from routers.progress import router as progress_router
from routers.goals import router as goals_router
from routers.reports import router as reports_router
from routers.notifications import router as notifications_router
from routers.workout_plans import router as workout_plans_router
from routers.exercises import router as exercises_router
from routers.workout_exercises import router as workout_exercises_router
from routers.streaks import router as streaks_router
from routers.badges import router as badges_router

# Load environment variables
load_dotenv()

# Create database tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI
app = FastAPI(title="FitTrack - Fitness & Workout Management Platform",
    description="Fitness tracking and workout management API",
    version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(users_router)
app.include_router(workouts_router)
app.include_router(progress_router)
app.include_router(goals_router)
app.include_router(reports_router)
app.include_router(notifications_router)
app.include_router(workout_plans_router)
app.include_router(exercises_router)
app.include_router(workout_exercises_router)
app.include_router(streaks_router)
app.include_router(badges_router)

# Root endpoint
@app.get("/")
def root():
    
    return {"message": "Welcome to FitTrack","status": "Running"}

# Health check endpoint
@app.get("/health")
def health_check():
    
    return {"status": "healthy"}