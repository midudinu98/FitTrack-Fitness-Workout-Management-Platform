from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date

from database import get_db

from models.user import User
from models.water_tracking import WaterTracking

from schemas.water_tracking import WaterTrackingCreate,WaterTrackingResponse,WaterSummary

from routers.users import get_current_user

router = APIRouter(prefix="/water",tags=["Water Intake Tracker"])

DAILY_WATER_GOAL = 2000

@router.post("/",response_model=WaterTrackingResponse,status_code=status.HTTP_201_CREATED)
def log_water_intake(water_data: WaterTrackingCreate,db: Session = Depends(get_db),current_user: User = Depends(get_current_user)):
    
    new_entry = WaterTracking(user_id=current_user.id,quantity=water_data.quantity,date=date.today())

    db.add(new_entry)
    db.commit()
    db.refresh(new_entry)

    return new_entry

@router.get("/",response_model=list[WaterTrackingResponse])
def get_water_intake(db: Session = Depends(get_db),current_user: User = Depends(get_current_user)):
    
    return (db.query(WaterTracking).filter(WaterTracking.user_id == current_user.id,WaterTracking.date == date.today()).order_by(WaterTracking.id.desc()).all())

@router.get("/summary", response_model=WaterSummary)
def get_water_summary(db: Session = Depends(get_db),current_user: User = Depends(get_current_user)):
    
    total_quantity = (db.query(func.coalesce(func.sum(WaterTracking.quantity), 0)).filter(WaterTracking.user_id == current_user.id,WaterTracking.date == date.today()).scalar())

    remaining = max(DAILY_WATER_GOAL - total_quantity, 0)

    progress = min((total_quantity / DAILY_WATER_GOAL) * 100,100)

    return {"total_quantity": total_quantity,
        "daily_goal": DAILY_WATER_GOAL,
        "remaining_quantity": remaining,
        "progress_percentage": round(progress, 2)}