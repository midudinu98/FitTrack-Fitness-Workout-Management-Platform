from sqlalchemy import Column,Integer,Date,DateTime,ForeignKey,UniqueConstraint
from sqlalchemy.sql import func

from database import Base

class GoogleHealthSteps(Base):

    __tablename__ = "google_health_steps"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer,ForeignKey("users.id"),nullable=False,index=True)
    steps_count = Column(Integer, nullable=False, default=0)
    date = Column(Date, nullable=False)
    synced_at = Column(DateTime(timezone=True),server_default=func.now(),onupdate=func.now(),nullable=False)

    __table_args__ = (UniqueConstraint("user_id","date",name="unique_user_google_health_daily_steps"),)