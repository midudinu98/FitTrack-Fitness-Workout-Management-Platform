from pydantic import BaseModel, Field, ConfigDict
from datetime import time, datetime
from typing import Literal

class ReminderCreate(BaseModel):
    reminder_type: Literal["workout", "meal", "water"]
    title: str = Field(min_length=2, max_length=150)
    message: str = Field(min_length=2, max_length=500)
    reminder_time: time
    is_enabled: bool = True

class ReminderUpdate(BaseModel):
    reminder_type: Literal["workout", "meal", "water"] | None = None
    title: str | None = Field(default=None, min_length=2, max_length=150)
    message: str | None = Field(default=None, min_length=2, max_length=500)
    reminder_time: time | None = None
    is_enabled: bool | None = None

class ReminderResponse(BaseModel):
    id: int
    reminder_type: str
    title: str
    message: str
    reminder_time: time
    is_enabled: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)