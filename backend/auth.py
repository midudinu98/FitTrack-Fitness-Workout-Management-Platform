from datetime import datetime, timedelta, timezone

from jose import JWTError, jwt
from passlib.context import CryptContext

# JWT Configuration
SECRET_KEY = "RD4hG7hcZ-qCvTPI4Yl4EywLm3icqmw0LeBberTfA5pWbBhiweoKj0ePr681bjm9"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Password hashing configuration
pwd_context = CryptContext(schemes=["bcrypt"],deprecated="auto")

# Hash password
def hash_password(password: str) -> str:
    
    return pwd_context.hash(password)

# Verify password
def verify_password(plain_password: str,hashed_password: str) -> bool:
    
    return pwd_context.verify(plain_password,hashed_password)

# Create JWT access token
def create_access_token(data: dict) -> str:
    
    to_encode = data.copy()

    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({"exp": expire})

    return jwt.encode(to_encode,SECRET_KEY,algorithm=ALGORITHM)

# Verify JWT access token
def verify_access_token(token: str):
    try:
        payload = jwt.decode(token,SECRET_KEY,algorithms=[ALGORITHM])

        email = payload.get("sub")

        if email is None:
            return None

        return email

    except JWTError:
        return None