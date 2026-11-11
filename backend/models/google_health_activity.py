from sqlalchemy import Column,Integer,Float,Date,DateTime,ForeignKey,UniqueConstraint
from sqlalchemy.sql import func

from database import Base

class GoogleHealthActivity(Base):

    __tablename__ = "google_health_activities"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer,ForeignKey("users.id"),nullable=False,index=True)
    date = Column(Date, nullable=False)
    active_minutes = Column(Integer,nullable=False,default=0)
    active_calories = Column(Float,nullable=False,default=0)
    synced_at = Column(DateTime(timezone=True),server_default=func.now(),onupdate=func.now(),nullable=False)

    __table_args__ = (UniqueConstraint("user_id","date",name="unique_user_google_health_activity"),)