import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

const Progress = () => {
    const [progress, setProgress] = useState(null);
    const [selectedDate, setSelectedDate] = useState(
        new Date().toLocaleDateString("en-CA")
    );
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchProgress = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await API.get("/progress/daily", {
                params: {
                    progress_date: selectedDate
                }
            });

            setProgress(response.data);
        } catch (err) {
            setError(
                err.response?.data?.detail ||
                "Unable to load daily progress."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProgress();
    }, [selectedDate]);

    return (
        <div className="progress-container">
            <header className="progress-header">
                <h1>Daily Progress</h1>
                <Link to="/dashboard">Back to Dashboard</Link>
            </header>

            <div className="progress-date">
                <label>Select Date:</label>
                <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                />
            </div>

            {loading && <p>Loading progress...</p>}

            {error && <p>{error}</p>}

            {!loading && !error && progress && (
                <>
                    <div className="progress-cards">
                        <div className="progress-card">
                            <h3>Total Workouts</h3>
                            <h2>{progress.total_workouts}</h2>
                        </div>

                        <div className="progress-card">
                            <h3>Calories Burned</h3>
                            <h2>{progress.total_calories} kcal</h2>
                        </div>

                        <div className="progress-card">
                            <h3>Progress Date</h3>
                            <h2>{progress.date}</h2>
                        </div>
                    </div>

                    <div className="progress-summary">
                        <h2>Daily Workout Summary</h2>
                        <p>
                            You completed {progress.total_workouts} workout(s)
                            and burned {progress.total_calories} calories.
                        </p>
                    </div>
                </>
            )}
        </div>
    );
};

export default Progress;