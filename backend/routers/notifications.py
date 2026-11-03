from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date

from database import get_db

from models.notification import Notification
from models.user import User
from models.workout import Workout

from schemas.notification import NotificationUpdate

from routers.users import get_current_user

router = APIRouter(prefix="/notifications",tags=["Notifications"])

# Daily Workout Reminder
@router.post("/reminders/daily")
def create_daily_reminder(db: Session = Depends(get_db),current_user: User = Depends(get_current_user)):
    
    today = date.today()

    workout_today = (db.query(Workout).filter(Workout.user_id == current_user.id,Workout.workout_date == today).first())

    if workout_today:
        return {"message": "You have already completed a workout today."}

    existing_reminder = (db.query(Notification).filter(Notification.user_id == current_user.id,Notification.title == "Daily Workout Reminder",
            func.date(Notification.created_at) == today.isoformat()).first())

    if existing_reminder:
        return {"message": "Today's workout reminder already exists."}

    reminder = Notification(user_id=current_user.id,
        title="Daily Workout Reminder",
        message="Stay active! Don't forget to complete your workout today.",
        is_read=False)

    db.add(reminder)
    db.commit()
    db.refresh(reminder)

    return {"message": "Daily workout reminder created successfully.","notification": reminder}

# Get all notifications for the logged-in user
@router.get("/")
def get_notifications(db: Session = Depends(get_db),current_user: User = Depends(get_current_user)):
    
    notifications = (db.query(Notification).filter(Notification.user_id == current_user.id).order_by(Notification.created_at.desc()).all())

    return notifications

# Get unread notification count
@router.get("/unread-count")
def get_unread_count(db: Session = Depends(get_db),current_user: User = Depends(get_current_user)):
    
    count = (db.query(Notification).filter(Notification.user_id == current_user.id,Notification.is_read == False).count())

    return {"unread_count": count}

# Mark a notification as read or unread
@router.put("/{notification_id}/read")
def update_notification(notification_id: int,notification_data: NotificationUpdate,db: Session = Depends(get_db),current_user: User = Depends(get_current_user)):
    
    notification = (db.query(Notification).filter(Notification.id == notification_id,Notification.user_id == current_user.id).first())

    if notification is None:
        raise HTTPException(status_code=404,detail="Notification not found")

    notification.is_read = notification_data.is_read

    db.commit()
    db.refresh(notification)

    return notification

# Delete a notification
@router.delete("/{notification_id}")
def delete_notification(notification_id: int,db: Session = Depends(get_db),current_user: User = Depends(get_current_user)):
    
    notification = (db.query(Notification).filter(Notification.id == notification_id,Notification.user_id == current_user.id).first())

    if notification is None:
        raise HTTPException(status_code=404,detail="Notification not found")

    db.delete(notification)
    db.commit()

    return {"message": "Notification deleted successfully"}