import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NotificationBell from "../components/NotificationBell";
import API from "../services/api";

const Dashboard = () => {
    const { logout } = useAuth();

    const [workouts, setWorkouts] = useState([]);
    const [upcomingWorkouts, setUpcomingWorkouts] = useState([]);
    const [goals, setGoals] = useState([]);
    const [streak, setStreak] = useState(null);
    const [loading, setLoading] = useState(true);

    const today = new Date();
    const todayString = [
        today.getFullYear(),
        String(today.getMonth() + 1).padStart(2, "0"),
        String(today.getDate()).padStart(2, "0")
    ].join("-");

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const results = await Promise.allSettled([
                API.get("/workouts/"),
                API.get("/workout-plans/upcoming"),
                API.get("/goals/"),
                API.get("/streaks/")
            ]);

            if (results[0].status === "fulfilled") {
                setWorkouts(results[0].value.data);
            }

            if (results[1].status === "fulfilled") {
                setUpcomingWorkouts(results[1].value.data);
            }

            if (results[2].status === "fulfilled") {
                setGoals(results[2].value.data);
            }

            if (results[3].status === "fulfilled") {
                setStreak(results[3].value.data);
            }
        } catch (error) {
            console.error("Dashboard loading error:", error);
        } finally {
            setLoading(false);
        }
    };

    const todayWorkouts = workouts.filter(
        workout => workout.workout_date === todayString
    );

    const totalWorkouts = todayWorkouts.length;

    const totalCalories = todayWorkouts.reduce(
        (total, workout) =>
            total + Number(workout.calories_burned || 0),
        0
    );

    const totalDuration = todayWorkouts.reduce(
        (total, workout) =>
            total + Number(workout.duration || 0),
        0
    );

    const getGoalProgress = (goal) => {
        const target = Number(goal.target_value);
        const current = Number(goal.current_value);

        if (!target || target <= 0) return 0;

        let percentage;

        if (goal.goal_type === "Weight Loss") {
            percentage = (target / current) * 100;
        } else {
            percentage = (current / target) * 100;
        }

        return Math.min(100, Math.max(0, Math.round(percentage)));
    };

    const activeGoals = goals.filter(
        goal => goal.status !== "Completed"
    );

    const handleLogout = () => {
        logout();
    };

    return (
        <div className="dashboard-container">

            <header className="dashboard-header">
                <h1>FitTrack</h1>

                <div className="dashboard-header-actions">
                    <NotificationBell />
                    <button onClick={handleLogout}>Logout</button>
                </div>
            </header>

            {/* Navigation at the top */}
            <nav className="dashboard-actions">
                <Link to="/workouts" className="dashboard-button">
                    View Workouts
                </Link>

                <Link to="/workouts/add" className="dashboard-button">
                    Add Workout
                </Link>

                <Link to="/progress" className="dashboard-button">
                    Daily Progress
                </Link>

                <Link to="/goals" className="dashboard-button">
                    Fitness Goals
                </Link>

                <Link to="/workout-plans" className="dashboard-button">
                    Workout Plans & Scheduling
                </Link>

                <Link to="/exercise-library" className="dashboard-button">
                    Exercise Library
                </Link>

                <Link to="/add-exercises-to-workout" className="dashboard-button">
                    Add Exercises to Workout
                </Link>

                <Link to="/reports" className="dashboard-button">
                    Reports & Analytics
                </Link>

                <Link to="/progress-comparison" className="dashboard-button">
                    Progress Comparison
                </Link>

                <Link to="/streak-tracking" className="dashboard-button">
                    Streak Tracking
                </Link>

                <Link to="/achievement-badges" className="dashboard-button">
                    Achievement Badges
                </Link>
            </nav>

            <main className="dashboard-content">

                <h2>Welcome to FitTrack!</h2>

                <p>
                    Your personalized fitness dashboard.
                    Track your daily activity and achieve your goals.
                </p>

                {loading ? (
                    <p>Loading your dashboard...</p>
                ) : (
                    <>
                        {/* Daily Summary */}
                        <section className="personalized-section">
                            <h2>📊 Today's Summary</h2>

                            <div className="personalized-grid">
                                <div className="personalized-card">
                                    <h3>🏋️ {totalWorkouts}</h3>
                                    <p>Workouts Today</p>
                                </div>

                                <div className="personalized-card">
                                    <h3>🔥 {totalCalories}</h3>
                                    <p>Calories Burned</p>
                                </div>

                                <div className="personalized-card">
                                    <h3>⏱️ {totalDuration}</h3>
                                    <p>Duration (Minutes)</p>
                                </div>
                            </div>
                        </section>

                        {/* Upcoming Workouts */}
                        <section className="personalized-section">
                            <h2>📅 Upcoming Workouts</h2>

                            {upcomingWorkouts.length === 0 ? (
                                <p>No upcoming workouts scheduled.</p>
                            ) : (
                                <div className="personalized-list">
                                    {upcomingWorkouts.slice(0, 5).map(workout => (
                                        <div
                                            className="personalized-list-item"
                                            key={workout.id}
                                        >
                                            <h3>{workout.title}</h3>
                                            <p>{workout.scheduled_date}</p>

                                            {workout.description && (
                                                <p>{workout.description}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            <Link to="/workout-plans">
                                View Workout Schedule
                            </Link>
                        </section>

                        {/* Goal Progress */}
                        <section className="personalized-section">
                            <h2>🎯 Goal Progress</h2>

                            {activeGoals.length === 0 ? (
                                <p>No active fitness goals.</p>
                            ) : (
                                activeGoals.map(goal => (
                                    <div
                                        className="goal-progress-item"
                                        key={goal.id}
                                    >
                                        <div className="goal-progress-heading">
                                            <strong>{goal.goal_type}</strong>
                                            <span>
                                                {getGoalProgress(goal)}%
                                            </span>
                                        </div>

                                        <div className="goal-progress-track">
                                            <div
                                                className="goal-progress-fill"
                                                style={{
                                                    width: `${getGoalProgress(goal)}%`
                                                }}
                                            />
                                        </div>

                                        <p>
                                            Current: {goal.current_value}
                                            {" | "}
                                            Target: {goal.target_value}
                                        </p>
                                    </div>
                                ))
                            )}

                            <Link to="/goals">
                                View Fitness Goals
                            </Link>
                        </section>

                        {/* Streak Status */}
                        <section className="personalized-section">
                            <h2>🔥 Workout Streak</h2>

                            {streak ? (
                                <div className="personalized-grid">
                                    <div className="personalized-card">
                                        <h3>{streak.current_streak} Days</h3>
                                        <p>Current Streak</p>
                                    </div>

                                    <div className="personalized-card">
                                        <h3>{streak.longest_streak} Days</h3>
                                        <p>Longest Streak</p>
                                    </div>
                                </div>
                            ) : (
                                <p>No streak information available.</p>
                            )}

                            <Link to="/streak-tracking">
                                View Streak Details
                            </Link>
                        </section>
                    </>
                )}

            </main>
        </div>
    );
};

export default Dashboard;