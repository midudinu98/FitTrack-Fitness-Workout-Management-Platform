from sqlalchemy import Column, Integer, Float, Date, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.sql import func

from database import Base

class Progress(Base):
    
    __tablename__ = "progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer,ForeignKey("users.id"),nullable=False,index=True)
    total_workouts = Column(Integer, nullable=False, default=0)
    total_calories = Column(Float, nullable=False, default=0)
    date = Column(Date, nullable=False)
    created_at = Column(DateTime(timezone=True),server_default=func.now(),nullable=False)

    __table_args__ = (UniqueConstraint("user_id","date",name="unique_user_daily_progress"),)