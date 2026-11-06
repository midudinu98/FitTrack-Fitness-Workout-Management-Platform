from pydantic import BaseModel, ConfigDict
from datetime import datetime

class BadgeResponse(BaseModel):
    id: int
    name: str
    description: str
    icon: str

    model_config = ConfigDict(from_attributes=True)

class UserBadgeResponse(BaseModel):
    id: int
    user_id: int
    badge_id: int
    earned_at: datetime

    model_config = ConfigDict(from_attributes=True)

class BadgeStatusResponse(BaseModel):
    badge: BadgeResponse
    earned: bool
    earned_at: datetime | None = None
