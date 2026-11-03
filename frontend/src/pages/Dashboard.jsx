import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import NotificationBell from "../components/NotificationBell";

const Dashboard = () => {
    const { logout } = useAuth();

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

            <main className="dashboard-content">
                <h2>Welcome to FitTrack!</h2>

                <p>
                    Your fitness journey starts here. Track your workouts,
                    monitor your progress, and achieve your fitness goals.
                </p>

                <div className="dashboard-actions">
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
                    
                    <Link to="/reports" className="dashboard-button">
                        Reports & Analytics
                    </Link>
                </div>

                <div className="dashboard-cards">
                    <div className="dashboard-card">
                        <h3>Workout Tracking</h3>
                        <p>Track your daily workouts.</p>
                    </div>

                    <div className="dashboard-card">
                        <h3>Fitness Progress</h3>
                        <p>Monitor your fitness journey.</p>
                    </div>

                    <div className="dashboard-card">
                        <h3>Personal Goals</h3>
                        <p>Set and achieve your fitness goals.</p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;