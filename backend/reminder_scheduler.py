from datetime import datetime, date
from zoneinfo import ZoneInfo

from apscheduler.schedulers.background import BackgroundScheduler
from sqlalchemy.exc import IntegrityError

from database import SessionLocal

from models.reminder import Reminder
from models.reminder_log import ReminderLog
from models.notification import Notification

TIMEZONE = ZoneInfo("Asia/Kolkata")

scheduler = BackgroundScheduler(timezone=TIMEZONE)

def check_reminders():
    db = SessionLocal()

    try:
        now = datetime.now(TIMEZONE)
        today = now.date()

        current_time = now.time().replace(second=0, microsecond=0)

        reminders = db.query(Reminder).filter(
            Reminder.is_enabled == True,
            Reminder.reminder_time == current_time
        ).all()

        for reminder in reminders:

            existing_log = db.query(ReminderLog).filter(
                ReminderLog.reminder_id == reminder.id,
                ReminderLog.triggered_date == today
            ).first()

            if existing_log:
                continue

            notification = Notification(
                user_id=reminder.user_id,
                title=reminder.title,
                message=reminder.message
            )

            log = ReminderLog(
                reminder_id=reminder.id,
                user_id=reminder.user_id,
                triggered_date=today
            )

            db.add(notification)
            db.add(log)

            try:
                db.commit()
            except IntegrityError:
                db.rollback()

    except Exception as error:
        db.rollback()
        print("Reminder scheduler error:", error)

    finally:
        db.close()

def start_reminder_scheduler():

    if not scheduler.running:
        scheduler.add_job(
            check_reminders,
            trigger="cron",
            second=0,
            id="reminder_checker",
            replace_existing=True,
            max_instances=1,
            coalesce=True
        )

        scheduler.start()

def stop_reminder_scheduler():

    if scheduler.running:
        scheduler.shutdown(wait=False)