from sqlalchemy import Column, Integer, String, Float, Date, DateTime, ForeignKey
from sqlalchemy.sql import func

from database import Base

class Goal(Base):
    
    __tablename__ = "goals"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer,ForeignKey("users.id"),nullable=False,index=True)
    goal_type = Column(String(30), nullable=False)
    target_value = Column(Float, nullable=False)
    current_value = Column(Float, nullable=False, default=0)
    deadline = Column(Date, nullable=False)
    created_at = Column(DateTime(timezone=True),server_default=func.now(),nullable=False)