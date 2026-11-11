from sqlalchemy import Column, Integer, Date, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.sql import func

from database import Base

class ReminderLog(Base):

    __tablename__ = "reminder_logs"

    id = Column(Integer, primary_key=True, index=True)
    reminder_id = Column(Integer,ForeignKey("reminders.id", ondelete="CASCADE"),nullable=False)
    user_id = Column(Integer,ForeignKey("users.id"),nullable=False,index=True)
    triggered_date = Column(Date, nullable=False)
    triggered_at = Column(DateTime(timezone=True),server_default=func.now(),nullable=False)

    __table_args__ = (UniqueConstraint("reminder_id","triggered_date",name="unique_reminder_daily_trigger"),)