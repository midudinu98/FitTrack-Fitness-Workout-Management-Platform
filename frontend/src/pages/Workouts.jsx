import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

const Workouts = () => {
    const [workouts, setWorkouts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchWorkouts = async () => {
        try {
            const response = await API.get("/workouts/");
            setWorkouts(response.data);
            setError("");
        } catch (err) {
            setError("Unable to load workouts. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWorkouts();
    }, []);

    const handleDelete = async (workoutId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this workout?"
        );

        if (!confirmed) return;

        try {
            await API.delete(`/workouts/${workoutId}`);

            setWorkouts((previousWorkouts) =>
                previousWorkouts.filter(
                    (workout) => workout.id !== workoutId
                )
            );
        } catch (err) {
            setError("Unable to delete workout.");
        }
    };

    return (
        <div className="workouts-container">
            <header className="workouts-header">
                <div>
                    <h1>My Workouts</h1>
                    <p>Track and manage your fitness activities.</p>
                </div>

                <Link to="/workouts/add" className="add-workout-button">
                    + Add Workout
                </Link>
            </header>

            {loading && <p>Loading workouts...</p>}

            {error && <div className="error-message">{error}</div>}

            {!loading && workouts.length === 0 && (
                <div className="empty-workouts">
                    <h3>No workouts found</h3>
                    <p>Start tracking your fitness journey today.</p>
                    <Link to="/workouts/add">Add Your First Workout</Link>
                </div>
            )}

            <div className="workout-list">
                {workouts.map((workout) => (
                    <div className="workout-card" key={workout.id}>
                        <div>
                            <h3>{workout.workout_name}</h3>
                            <p>Category: {workout.category}</p>
                            <p>Duration: {workout.duration} minutes</p>
                            <p>
                                Calories: {workout.calories_burned} kcal
                            </p>
                            <p>
                                Date: {workout.workout_date}
                            </p>
                        </div>

                        <div className="workout-actions">
                            <Link to={`/workouts/edit/${workout.id}`}>
                                Edit
                            </Link>

                            <button
                                onClick={() => handleDelete(workout.id)}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <Link to="/dashboard" className="back-link">
                Back to Dashboard
            </Link>
        </div>
    );
};

export default Workouts;