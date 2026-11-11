from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db

from models.reminder import Reminder
from models.user import User

from schemas.reminder import ReminderCreate, ReminderUpdate, ReminderResponse

from routers.users import get_current_user

router = APIRouter(prefix="/reminders",tags=["Reminders"])

@router.post("/", response_model=ReminderResponse, status_code=status.HTTP_201_CREATED)
def create_reminder(reminder_data: ReminderCreate,db: Session = Depends(get_db),current_user: User = Depends(get_current_user)):
    
    reminder = Reminder(user_id=current_user.id,**reminder_data.model_dump())

    db.add(reminder)
    db.commit()
    db.refresh(reminder)

    return reminder

@router.get("/", response_model=list[ReminderResponse])
def get_reminders(db: Session = Depends(get_db),current_user: User = Depends(get_current_user)):
    
    return db.query(Reminder).filter(Reminder.user_id == current_user.id).order_by(Reminder.reminder_time).all()

@router.put("/{reminder_id}", response_model=ReminderResponse)
def update_reminder(reminder_id: int,reminder_data: ReminderUpdate,db: Session = Depends(get_db),current_user: User = Depends(get_current_user)):
    
    reminder = db.query(Reminder).filter(Reminder.id == reminder_id,Reminder.user_id == current_user.id).first()

    if not reminder:
        raise HTTPException(status_code=404,detail="Reminder not found")

    update_data = reminder_data.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(reminder, key, value)

    db.commit()
    db.refresh(reminder)

    return reminder

@router.delete("/{reminder_id}")
def delete_reminder(reminder_id: int,db: Session = Depends(get_db),current_user: User = Depends(get_current_user)):
    
    reminder = db.query(Reminder).filter(Reminder.id == reminder_id,Reminder.user_id == current_user.id).first()

    if not reminder:
        raise HTTPException(status_code=404,detail="Reminder not found")

    db.delete(reminder)
    db.commit()

    return {"message": "Reminder deleted successfully"}