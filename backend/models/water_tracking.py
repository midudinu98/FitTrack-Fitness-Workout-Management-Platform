from sqlalchemy import Column, Integer, Date, ForeignKey
from sqlalchemy.sql import func
from datetime import date

from database import Base

class WaterTracking(Base):
    
    __tablename__ = "water_tracking"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer,ForeignKey("users.id"),nullable=False)
    quantity = Column(Integer, nullable=False)
    date = Column(Date, nullable=False, default=date.today)
