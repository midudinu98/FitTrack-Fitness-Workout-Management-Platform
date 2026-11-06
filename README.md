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
13. **Workout Plans & Scheduling:** Schedule future workouts and manage plans using a calendar.
14. **Exercise Library:** Create, search, categorize, and associate exercises with workouts.
15. **Progress Comparison:** Compare weekly and monthly workout performance.
16. **Streak Tracking:** Monitor current and longest consecutive workout streaks.
17. **Achievement Badges:** Earn fitness badges through workouts, streaks, and goal completion.
18. **Personalized Dashboard:** View daily summaries, upcoming workouts, goal progress, and streak statistics.

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

### Module 7: Workout Plans and Scheduling

- Create personalized workout plans.
- Schedule workouts for future dates.
- Store workout plan details, descriptions, and scheduled dates.
- Retrieve user-specific workout plans.
- Display upcoming scheduled workouts.
- View scheduled workouts through a calendar interface.
- Navigate between calendar months.
- Prevent scheduling workouts for past dates.
- Validate workout plan information.
- Maintain user-specific workout scheduling.

### Module 8: Exercise Library and Workout Association

- Create and manage exercise records.
- Store exercise names, categories, descriptions, and durations.
- Retrieve available exercises from the exercise library.
- Search exercises by name.
- Filter exercises by category.
- Associate exercises with existing workout records.
- Retrieve exercises associated with a particular workout.
- Validate workout ownership before associating exercises.
- Prevent duplicate exercise associations.
- Display the exercise library through a dedicated frontend page.

### Module 9: Progress Comparison and Performance Analysis

- Generate weekly fitness progress comparisons.
- Generate monthly fitness progress comparisons.
- Compare workout counts across different periods.
- Compare workout duration and calories burned.
- Calculate numerical changes in fitness statistics.
- Identify performance trends.
- Generate progress insights based on workout activities.
- Visualize weekly and monthly comparisons using charts.
- Display fitness comparisons through a dedicated frontend page.

### Module 10: Streak Tracking System

- Track consecutive days of workout activity.
- Calculate the current workout streak.
- Maintain the longest workout streak.
- Store the last workout date.
- Update streak information based on workout activity.
- Reset the current streak when the consecutive-day condition is broken.
- Retrieve user-specific streak statistics.
- Display current and longest streak information.
- Highlight workout consistency and milestone achievements.
- Display streak information through a dedicated frontend page.

### Module 11: Achievement Badges System

- Create and manage fitness achievement badges.
- Support achievements based on workout completion.
- Award badges for workout milestones.
- Award streak-based achievement badges.
- Support goal completion achievements.
- Track badges earned by individual users.
- Prevent duplicate badge awards.
- Retrieve earned and locked badges.
- Display achievement progress.
- Highlight newly earned badges through frontend notifications.
- Display achievements through a dedicated frontend page.

### Module 12: Personalized Dashboard

- Display a personalized dashboard for authenticated users.
- Show daily workout summaries.
- Display total workouts completed today.
- Display daily calories burned.
- Display total workout duration.
- Retrieve and display upcoming scheduled workouts.
- Display active fitness goals and their progress.
- Show current and longest workout streaks.
- Display goal progress using progress bars.
- Integrate navigation links to all major FitTrack modules.
- Provide access to notifications and logout functionality.
- Dynamically retrieve and display user-specific fitness information.
- Maintain a responsive dashboard layout for different screen sizes.

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
* Workout plan creation and retrieval.
* Upcoming workout scheduling and calendar validation.
* Past-date scheduling prevention.
* Exercise creation, search, and category filtering.
* Workout-exercise association and duplicate validation.
* Weekly and monthly progress comparison.
* Workout performance trend and insight validation.
* Current and longest streak calculation.
* Streak reset validation.
* Achievement badge creation and awarding.
* Earned and locked badge retrieval.
* Personalized dashboard data retrieval.
* Dashboard navigation and responsive layout testing.
