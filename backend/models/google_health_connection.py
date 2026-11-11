from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, UniqueConstraint
from sqlalchemy.sql import func

from database import Base

class GoogleHealthConnection(Base):

    __tablename__ = "google_health_connections"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer,ForeignKey("users.id"),nullable=False,unique=True,index=True)
    encrypted_refresh_token = Column(Text, nullable=False)
    connected_at = Column(DateTime(timezone=True),server_default=func.now(),nullable=False)
    updated_at = Column(DateTime(timezone=True),server_default=func.now(),onupdate=func.now(),nullable=False)