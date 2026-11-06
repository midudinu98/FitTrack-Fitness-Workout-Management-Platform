from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer,OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from database import get_db

from models.user import User

from schemas.user import UserCreate, UserLogin, UserResponse, TokenResponse

from auth import hash_password, verify_password, create_access_token,verify_access_token

router = APIRouter(prefix="/users",tags=["Users"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/users/login")

def get_current_user(token: str = Depends(oauth2_scheme),db: Session = Depends(get_db)):
    
    email = verify_access_token(token)

    if email is None:
        raise HTTPException(status_code=401,detail="Invalid or expired token",headers={"WWW-Authenticate": "Bearer"})

    user = db.query(User).filter(User.email == email).first()

    if user is None:
        raise HTTPException(status_code=401,detail="User not found")

    return user

# User Registration API
@router.post("/register",response_model=UserResponse,status_code=status.HTTP_201_CREATED)
def register_user(user: UserCreate,db: Session = Depends(get_db)):

    # Check existing email
    existing_email = db.query(User).filter(User.email == user.email).first()

    if existing_email:
        raise HTTPException(status_code=400,detail="Email already registered")

    # Check existing username
    existing_username = db.query(User).filter(User.username == user.username).first()

    if existing_username:
        raise HTTPException(status_code=400,detail="Username already taken")

    # Hash password
    hashed_password = hash_password(user.password)

    # Create new user
    new_user = User(username=user.username,email=user.email,hashed_password=hashed_password)

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user

# User Login API
@router.post("/login", response_model=TokenResponse)
def login_user(form_data: OAuth2PasswordRequestForm = Depends(),db: Session = Depends(get_db)):
    
    user = db.query(User).filter(User.email == form_data.username).first()

    if not user or not verify_password(form_data.password,user.hashed_password):
        raise HTTPException(status_code=401,detail="Invalid email or password")

    access_token = create_access_token(data={"sub": user.email})

    return {"access_token": access_token,"token_type": "bearer"}

@router.get("/me", response_model=UserResponse)
def get_my_profile(current_user: User = Depends(get_current_user)):
    
    return current_user