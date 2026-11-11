from pydantic import BaseModel, EmailStr, Field, ConfigDict
from datetime import datetime

# User Registration Schema
class UserCreate(BaseModel):
    username: str = Field(min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(min_length=8, max_length=72)

# User Login Schema
class UserLogin(BaseModel):
    email: EmailStr
    password: str

# User Response Schema
class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

# JWT Token Response Schema
class TokenResponse(BaseModel):
    access_token: str
    token_type: str
