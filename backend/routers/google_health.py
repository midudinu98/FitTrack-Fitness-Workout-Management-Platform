import os
import time
import hmac
import hashlib
import base64
import secrets
from urllib.parse import urlencode

import requests

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from dotenv import load_dotenv
from datetime import date

from database import get_db

from models.user import User
from models.google_health_connection import GoogleHealthConnection
from models.google_health_steps import GoogleHealthSteps
from models.google_health_activity import GoogleHealthActivity

from routers.users import get_current_user

from google_health_security import encrypt_token

from google_health_api import get_google_access_token,get_daily_steps,get_daily_activity

load_dotenv()

router = APIRouter(prefix="/google-health",tags=["Google Health Integration"])

GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"

GOOGLE_SCOPE = ("https://www.googleapis.com/auth/"
    "googlehealth.activity_and_fitness.readonly")

def create_oauth_state(user_id: int) -> str:
    secret = os.getenv("SECRET_KEY")

    if not secret:
        raise ValueError("SECRET_KEY is missing")

    payload = f"{user_id}:{int(time.time())}:{secrets.token_urlsafe(16)}"

    signature = hmac.new(
        secret.encode(),
        payload.encode(),
        hashlib.sha256
    ).hexdigest()

    state_data = f"{payload}:{signature}"

    return base64.urlsafe_b64encode(
        state_data.encode()
    ).decode()

def verify_oauth_state(state: str) -> int:
    try:
        secret = os.getenv("SECRET_KEY")

        if not secret:
            raise ValueError("SECRET_KEY is missing")

        decoded = base64.urlsafe_b64decode(state.encode()).decode()

        user_id, timestamp, nonce, signature = decoded.split(":")

        payload = f"{user_id}:{timestamp}:{nonce}"

        expected_signature = hmac.new(secret.encode(),payload.encode(),hashlib.sha256).hexdigest()

        if not hmac.compare_digest(signature, expected_signature):
            raise ValueError("Invalid OAuth state")

        if time.time() - int(timestamp) > 600:
            raise ValueError("OAuth state expired")

        return int(user_id)

    except Exception:
        raise HTTPException(status_code=400,detail="Invalid or expired Google OAuth state")

# Start Google Health authorization
@router.get("/connect")
def connect_google_health(current_user: User = Depends(get_current_user)):

    client_id = os.getenv("GOOGLE_HEALTH_CLIENT_ID")
    redirect_uri = os.getenv("GOOGLE_HEALTH_REDIRECT_URI")

    if not client_id or not redirect_uri:
        raise HTTPException(status_code=500,detail="Google OAuth configuration is missing")

    state = create_oauth_state(current_user.id)

    params = {"client_id": client_id,
        "redirect_uri": redirect_uri,
        "response_type": "code",
        "scope": GOOGLE_SCOPE,
        "access_type": "offline",
        "prompt": "consent",
        "state": state}

    authorization_url = (GOOGLE_AUTH_URL + "?" + urlencode(params))

    return {"authorization_url": authorization_url}

# Google OAuth callback
@router.get("/callback")
def google_health_callback(code: str = None,state: str = None,error: str = None,db: Session = Depends(get_db)):

    frontend_url = "http://localhost:5173/google-health"

    if error:
        return RedirectResponse(url=f"{frontend_url}?error=authorization_denied")

    if not code or not state:
        raise HTTPException(status_code=400,detail="Authorization code or state is missing")

    user_id = verify_oauth_state(state)

    client_id = os.getenv("GOOGLE_HEALTH_CLIENT_ID")
    client_secret = os.getenv("GOOGLE_HEALTH_CLIENT_SECRET")
    redirect_uri = os.getenv("GOOGLE_HEALTH_REDIRECT_URI")

    if not client_id or not client_secret or not redirect_uri:
        raise HTTPException(status_code=500,detail="Google OAuth configuration is incomplete")

    token_response = requests.post(
        GOOGLE_TOKEN_URL,
        data={"code": code,
            "client_id": client_id,
            "client_secret": client_secret,
            "redirect_uri": redirect_uri,
            "grant_type": "authorization_code"},timeout=20)

    if not token_response.ok:
        raise HTTPException(status_code=400,detail="Google token exchange failed")

    token_data = token_response.json()

    access_token = token_data.get("access_token")

    identity_response = requests.get("https://health.googleapis.com/v4/users/me/identity",
    headers={"Authorization": f"Bearer {access_token}"},timeout=20)

    if not identity_response.ok:
        raise HTTPException(status_code=400,detail="Google account is not linked to Google Health. Please set up Google Health first.")

    refresh_token = token_data.get("refresh_token")

    connection = (db.query(GoogleHealthConnection).filter(GoogleHealthConnection.user_id == user_id).first())

    if not refresh_token and not connection:
        raise HTTPException(status_code=400,detail="Google did not return a refresh token. Please authorize again.")

    if connection:
        if refresh_token:
            connection.encrypted_refresh_token = encrypt_token(refresh_token)
    else:
        connection = GoogleHealthConnection(user_id=user_id,encrypted_refresh_token=encrypt_token(refresh_token))

        db.add(connection)

    db.commit()

    return RedirectResponse(url=f"{frontend_url}?connected=true")

# Synchronize daily steps from Google Health
@router.post("/sync-steps")
def sync_google_health_steps(target_date: date = None,db: Session = Depends(get_db),current_user: User = Depends(get_current_user)):

    if target_date is None:
        target_date = date.today()

    connection = (db.query(GoogleHealthConnection).filter(GoogleHealthConnection.user_id == current_user.id).first())

    if not connection:
        raise HTTPException(status_code=404,detail="Google Health is not connected")

    try:
        access_token = get_google_access_token(connection)

        steps_count = get_daily_steps(access_token,target_date)

    except (ValueError, requests.RequestException):
        raise HTTPException(status_code=502,detail="Unable to synchronize steps from Google Health")

    existing_record = (db.query(GoogleHealthSteps).filter(GoogleHealthSteps.user_id == current_user.id,GoogleHealthSteps.date == target_date).first())

    if existing_record:
        existing_record.steps_count = steps_count
    else:
        new_record = GoogleHealthSteps(user_id=current_user.id,steps_count=steps_count,date=target_date)

        db.add(new_record)

    db.commit()

    return {"message": "Google Health steps synchronized successfully",
        "date": target_date,
        "steps_count": steps_count}

# Check Google Health connection status
@router.get("/status")
def google_health_status(db: Session = Depends(get_db),current_user: User = Depends(get_current_user)):

    connection = (db.query(GoogleHealthConnection).filter(GoogleHealthConnection.user_id == current_user.id).first())

    return {"connected": connection is not None,
        "message": ("Google Health connected"
            if connection
            else "Google Health not connected")}

@router.post("/sync-activity")
def sync_google_health_activity(target_date: date = None,db: Session = Depends(get_db),current_user: User = Depends(get_current_user)):
    
    if target_date is None:
        target_date = date.today()

    # Find the user's Google Health connection
    connection = db.query(GoogleHealthConnection).filter(GoogleHealthConnection.user_id == current_user.id).first()

    if not connection:
        raise HTTPException(status_code=404,detail="Google Health account is not connected.")

    try:
        # Generate Google access token
        access_token = get_google_access_token(connection)

        # Fetch daily activity data
        activity_data = get_daily_activity(access_token,target_date)

    except (ValueError, requests.RequestException) as exc:
        raise HTTPException(status_code=502,detail=str(exc))

    # Find existing activity record
    existing_activity = db.query(GoogleHealthActivity).filter(GoogleHealthActivity.user_id == current_user.id,GoogleHealthActivity.date == target_date).first()

    if existing_activity:
        existing_activity.active_minutes = activity_data["active_minutes"]

        existing_activity.active_calories = activity_data["active_calories"]

    else:
        new_activity = GoogleHealthActivity(user_id=current_user.id,
            date=target_date,
            active_minutes=activity_data["active_minutes"],
            active_calories=activity_data["active_calories"])

        db.add(new_activity)

    db.commit()

    return {"message": "Google Health activity synchronized successfully",
        "date": target_date,
        "active_minutes": activity_data["active_minutes"],
        "active_calories": activity_data["active_calories"]}