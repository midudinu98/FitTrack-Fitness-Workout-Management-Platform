# FitTrack-Fitness-Workout-Management-Platform

## Project Overview

FitTrack is a web-based Fitness and Workout Management Platform designed to help users manage workout activities, track daily fitness progress, set personal fitness goals, monitor performance, analyze fitness reports, and receive notifications.

The application provides secure user authentication and personalized fitness tracking features through an interactive web interface.

## Technologies Used

* **Backend:** Python, FastAPI
* **Frontend:** React, Vite, JavaScript
* **Database:** SQLite
* **ORM:** SQLAlchemy
* **Authentication:** JWT (JSON Web Tokens)
* **Password Security:** Passlib, Bcrypt
* **API Documentation:** Swagger UI
* **HTTP Client:** Axios
* **Routing:** React Router
* **Charts & Analytics:** Recharts

## Key Features

1. **Authentication & Authorization:** User registration, login, JWT authentication, and protected routes.
2. **Workout Management:** Create, view, update, and delete workout records.
3. **Workout Categories:** Organize workouts into Cardio, Strength, and Yoga categories.
4. **Daily Progress Tracking:** Track daily workouts, workout duration, and calories burned.
4. **Fitness Goal Management:** Create and manage personal fitness goals.
6. **Goal Progress Tracking:** Monitor current progress, target values, deadlines, and completion status.
7. **Reports & Analytics:** Generate weekly and monthly fitness reports.
8. **Calories Tracking:** Monitor calories burned through workout activities.
9. **Data Visualization:** Display fitness statistics and workout analytics using charts.
10. **Notification System:** Display notifications and unread notification counts.
11. **Daily Workout Reminders:** Generate reminders when users access the dashboard.
12. **Goal Completion Notifications:** Notify users when they achieve their fitness goals.

## Installation and Setup

### 1. Start the Backend 
Open a terminal and navigate to the backend folder: <br>
**cd backend**

Create a virtual environment: <br>
**python -m venv venv**

Activate the virtual environment on Windows: <br>
**venv\Scripts\activate**

Install dependencies: <br>
**pip install -r requirements.txt**

Create a .env file inside the backend folder and configure: <br>
**SECRET_KEY=your_secret_key <br>
ALGORITHM=HS256 <br>
ACCESS_TOKEN_EXPIRE_MINUTES=30**

Start the backend server: <br>
**uvicorn main:app --reload**

### 2.  Start the Frontend

Open a new terminal and navigate to the frontend folder: <br>
**cd frontend**

Install dependencies: <br>
**npm install**

Start the frontend server: <br>
**npm run dev**

### 3. Access the Application

Frontend: <br>
**http://localhost:5173/**

Backend: <br>
**http://127.0.0.1:8000/**

Swagger UI: <br>
**http://127.0.0.1:8000/docs**

## Modules and Features

### Module 1: User Authentication
* User registration and login.
* Secure password hashing using Bcrypt.
* JWT-based authentication.
* Generate and validate access tokens.
* Protected frontend routes.
* Retrieve authenticated user profile.
* Support logout functionality.
* Maintain authentication state.

### Module 2: Workout Management System
* Create new workout records.
* View workout history.
* Update existing workout records.
* Delete workout records.
* Categorize workouts into Cardio, Strength, and Yoga.
* Record workout duration.
* Track calories burned.
* Associate workouts with authenticated users.
* Validate workout information.

### Module 3: Daily Progress Tracking
* Track daily workout activities.
* Calculate total workouts completed.
* Calculate total calories burned.
* Retrieve progress for a selected date.
* Maintain user-specific daily progress records.
* Display daily workout statistics in the frontend.
* Automatically calculate progress using workout records.

### Module 4: Goal Setting System
* Create personal fitness goals.
* Support Weight Loss, Muscle Gain, and Steps goals.
* Set target values and deadlines.
* Track current goal progress.
* Update goal progress.
* Calculate goal completion status.
* Identify active, completed, and overdue goals.
* Delete existing fitness goals.
* Display goal progress in the frontend.

### Module 5: Reports and Analytics
* Generate weekly fitness reports.
* Generate monthly fitness reports.
* Calculate total workouts and workout duration.
* Analyze calories burned.
* Display workout statistics.
* Generate workout category summaries.
* Filter reports by month and year.
* Visualize fitness information using Recharts.
* Display weekly and monthly analytics in the frontend.

### Module 6: Notifications System
* Generate notifications for fitness-related activities.
* Display a notification bell in the dashboard.
* Retrieve user-specific notifications.
* Display unread notification count.
* Mark notifications as read or unread.
* Delete notifications.
* Generate daily workout reminders when the dashboard loads.
* Prevent duplicate daily reminders.
* Generate notifications when fitness goals are completed.
* Display notifications through a frontend dropdown.

## API Documentation

FastAPI automatically provides interactive API documentation through Swagger UI.

Start the backend server and access: <br>
**http://127.0.0.1:8000/docs**

The API documentation provides access to authentication, workout management, daily progress, fitness goals, reports, and notification endpoints.

## Security

* JWT-based authentication.
* Secure password hashing using Bcrypt.
* Protected API endpoints.
* User-specific data access.
* Authentication validation for protected operations.
* Environment-based secret key configuration.
* Input validation using Pydantic.
* User ownership validation for workout, goal, and notification operations.

## Testing and Validation

* User registration and login validation.
* Duplicate user registration validation.
* Password verification.
* JWT token authentication.
* Protected route validation.
* Workout creation, retrieval, updating, and deletion.
* Daily progress calculation.
* Fitness goal creation and updating.
* Goal completion and overdue status validation.
* Weekly and monthly report validation.
* Calories tracking validation.
* Notification creation and retrieval.
* Notification read/unread functionality.
* Notification deletion.
* Daily workout reminder validation.
* Goal completion notification validation.
* Frontend and backend integration testing.
