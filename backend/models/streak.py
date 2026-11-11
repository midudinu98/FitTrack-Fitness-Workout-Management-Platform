from sqlalchemy import Column, Integer, Date, ForeignKey, UniqueConstraint

from database import Base

class Streak(Base):
    
    __tablename__ = "streaks"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer,ForeignKey("users.id"),nullable=False,unique=True,index=True)
    current_streak = Column(Integer, default=0, nullable=False)
    longest_streak = Column(Integer, default=0, nullable=False)
    last_workout_date = Column(Date, nullable=True)

    __table_args__ = (UniqueConstraint("user_id", name="unique_user_streak"),)