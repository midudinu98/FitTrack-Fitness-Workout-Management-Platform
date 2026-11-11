import os
from cryptography.fernet import Fernet
from dotenv import load_dotenv

load_dotenv()

def get_fernet():
    key = os.getenv("GOOGLE_HEALTH_ENCRYPTION_KEY")

    if not key:
        raise ValueError("Google Health encryption key is missing")

    return Fernet(key.encode())

def encrypt_token(token: str) -> str:
    return get_fernet().encrypt(token.encode()).decode()

def decrypt_token(encrypted_token: str) -> str:
    return get_fernet().decrypt(encrypted_token.encode()).decode()