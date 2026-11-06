from sqlalchemy import Column, Integer, String, Text
from database import Base

class Exercise(Base):
   
    __tablename__ = "exercises"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False, index=True)
    category = Column(String(50), nullable=False, index=True)
    description = Column(Text, nullable=True)
    duration = Column(Integer, nullable=False)