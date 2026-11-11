import os
import requests

from dotenv import load_dotenv

from google_health_security import decrypt_token

from datetime import date, timedelta

load_dotenv()

GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"


def get_google_access_token(connection):

    refresh_token = decrypt_token(connection.encrypted_refresh_token)

    response = requests.post(
        GOOGLE_TOKEN_URL,
        data={"client_id": os.getenv("GOOGLE_HEALTH_CLIENT_ID"),
            "client_secret": os.getenv("GOOGLE_HEALTH_CLIENT_SECRET"),
            "refresh_token": refresh_token,
            "grant_type": "refresh_token"},timeout=20)

    if not response.ok:
        raise ValueError("Unable to refresh Google Health access token")

    token_data = response.json()

    access_token = token_data.get("access_token")

    if not access_token:
        raise ValueError("Google did not return an access token")

    return access_token

def get_daily_steps(access_token: str, target_date: date):

    next_date = target_date + timedelta(days=1)

    url = (
        "https://health.googleapis.com/v4/users/me/"
        "dataTypes/steps/dataPoints:dailyRollUp"
    )

    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }

    request_body = {"range": {"start": {"date": {"year": target_date.year,
                    "month": target_date.month,
                    "day": target_date.day},"time": {"hours": 0,
                    "minutes": 0,
                    "seconds": 0,
                    "nanos": 0}},"end": {"date": {"year": next_date.year,
                    "month": next_date.month,
                    "day": next_date.day},
                "time": {"hours": 0,"minutes": 0,"seconds": 0,"nanos": 0}}},"windowSizeDays": 1}

    response = requests.post(url,headers=headers,json=request_body,timeout=20)

    if not response.ok:
        raise ValueError(f"Google Health steps API failed: {response.status_code}")

    data = response.json()

    points = data.get("rollupDataPoints", [])

    if not points:
        return 0

    return int(points[0].get("steps", {}).get("countSum", 0))

def get_daily_activity(access_token: str, target_date: date):
    """
    Fetch daily active minutes and active calories burned
    from Google Health.
    """

    next_date = target_date + timedelta(days=1)

    headers = {"Authorization": f"Bearer {access_token}","Content-Type": "application/json"}

    request_body = {
        "range": {
            "start": {
                "date": {
                    "year": target_date.year,
                    "month": target_date.month,
                    "day": target_date.day
                },
                "time": {
                    "hours": 0,
                    "minutes": 0,
                    "seconds": 0,
                    "nanos": 0
                }
            },
            "end": {
                "date": {
                    "year": next_date.year,
                    "month": next_date.month,
                    "day": next_date.day
                },
                "time": {
                    "hours": 0,
                    "minutes": 0,
                    "seconds": 0,
                    "nanos": 0
                }
            }
        },
        "windowSizeDays": 1
    }

    activity_url = ("https://health.googleapis.com/v4/users/me/dataTypes/"
        "active-minutes/dataPoints:dailyRollUp")

    calories_url = ("https://health.googleapis.com/v4/users/me/dataTypes/"
        "active-energy-burned/dataPoints:dailyRollUp")

    # Fetch active minutes
    activity_response = requests.post(activity_url,headers=headers,json=request_body,timeout=20)

    if not activity_response.ok:
        raise ValueError(f"Google Health active minutes API failed: "f"{activity_response.status_code}")

    activity_data = activity_response.json()

    active_minutes = 0

    activity_points = activity_data.get("rollupDataPoints", [])

    if activity_points:
        minute_data = activity_points[0].get("activeMinutes", {})

        activity_levels = minute_data.get("activeMinutesRollupByActivityLevel", [])

        active_minutes = sum(int(level.get("activeMinutesSum", 0))
            for level in activity_levels)

    # Fetch active calories burned
    calories_response = requests.post(calories_url,headers=headers,json=request_body,timeout=20)

    if not calories_response.ok:
        raise ValueError(f"Google Health calories API failed: "f"{calories_response.status_code}")

    calories_data = calories_response.json()

    active_calories = 0

    calories_points = calories_data.get("rollupDataPoints", [])

    if calories_points:
        energy_data = calories_points[0].get("activeEnergyBurned", {})

        active_calories = energy_data.get("kcalSum", 0)

    return {"active_minutes": active_minutes,"active_calories": round(float(active_calories), 2)}