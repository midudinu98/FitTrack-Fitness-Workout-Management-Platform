import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

const WorkoutTimer = () => {
    const [workoutName, setWorkoutName] = useState("");
    const [category, setCategory] = useState("Cardio");
    const [isRunning, setIsRunning] = useState(false);
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const startTimeRef = useRef(null);
    const savedSecondsRef = useRef(0);

    const calorieRates = {
        Cardio: 8,
        Strength: 6,
        Yoga: 3
    };

    useEffect(() => {
        if (!isRunning) return;

        const interval = setInterval(() => {
            const elapsed = Math.floor(
                (Date.now() - startTimeRef.current) / 1000
            );

            setElapsedSeconds(savedSecondsRef.current + elapsed);
        }, 1000);

        return () => clearInterval(interval);
    }, [isRunning]);

    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;

        return [
            String(hours).padStart(2, "0"),
            String(minutes).padStart(2, "0"),
            String(remainingSeconds).padStart(2, "0")
        ].join(":");
    };

    const estimatedCalories = Math.round(
        (elapsedSeconds / 3600) * calorieRates[category]
    );

    const progress = Math.min(
        100,
        (elapsedSeconds / 1800) * 100
    );

    const handleStart = () => {
        setError("");
        setMessage("");

        if (!workoutName.trim()) {
            setError("Please enter a workout name before starting.");
            return;
        }

        if (isRunning) return;

        startTimeRef.current = Date.now();
        setIsRunning(true);
    };

    const handleStop = () => {
        if (!isRunning) return;

        const elapsed = Math.floor(
            (Date.now() - startTimeRef.current) / 1000
        );

        savedSecondsRef.current += elapsed;
        setElapsedSeconds(savedSecondsRef.current);
        setIsRunning(false);
        startTimeRef.current = null;
    };

    const handleReset = () => {
        setIsRunning(false);
        setElapsedSeconds(0);
        savedSecondsRef.current = 0;
        startTimeRef.current = null;
        setMessage("");
        setError("");
    };

    const handleSaveWorkout = async () => {
        const duration = Math.round(elapsedSeconds / 60);

        if (isRunning) {
            setError("Please stop the timer before saving.");
            return;
        }

        if (elapsedSeconds < 60 || duration <= 0) {
            setError("Complete at least one minute of workout before saving.");
            return;
        }

        if (!workoutName.trim()) {
            setError("Please enter a workout name.");
            return;
        }

        try {
            setSaving(true);
            setError("");
            setMessage("");

            await API.post("/workouts/", {
                workout_name: workoutName.trim(),
                category,
                duration,
                calories_burned: estimatedCalories,
                workout_date: new Date().toLocaleDateString("en-CA")
            });

            setMessage("Workout saved successfully!");

            setIsRunning(false);
            setElapsedSeconds(0);
            savedSecondsRef.current = 0;
            startTimeRef.current = null;
            setWorkoutName("");
        } catch (err) {
            console.error("Workout save error:", err);

            setError(
                err.response?.data?.detail ||
                "Unable to save workout. Please try again."
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="workout-timer-container">
            <header className="workout-timer-header">
                <div>
                    <h1>Workout Timer</h1>
                    <p>Track your workout duration and estimated calories.</p>
                </div>

                <Link to="/dashboard" className="timer-back-button">
                    Back to Dashboard
                </Link>
            </header>

            <div className="workout-timer-card">
                <div className="timer-form">
                    <label>Workout Name</label>
                    <input
                        type="text"
                        placeholder="Enter workout name"
                        value={workoutName}
                        onChange={(e) => setWorkoutName(e.target.value)}
                        disabled={isRunning || saving}
                    />

                    <label>Workout Category</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        disabled={isRunning || saving}
                    >
                        <option value="Cardio">Cardio</option>
                        <option value="Strength">Strength</option>
                        <option value="Yoga">Yoga</option>
                    </select>
                </div>

                <div className="timer-display">
                    <p>Elapsed Time</p>
                    <h2>{formatTime(elapsedSeconds)}</h2>
                    <span>
                        {isRunning ? "Workout in progress" : "Timer stopped"}
                    </span>
                </div>

                <div className="timer-progress-section">
                    <div className="timer-progress-heading">
                        <span>30-minute workout target</span>
                        <strong>{Math.round(progress)}%</strong>
                    </div>

                    <div className="timer-progress-track">
                        <div
                            className="timer-progress-fill"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                <div className="timer-stats">
                    <div className="timer-stat-card">
                        <h3>⏱️ {Math.floor(elapsedSeconds / 60)}</h3>
                        <p>Minutes</p>
                    </div>

                    <div className="timer-stat-card">
                        <h3>🔥 {estimatedCalories}</h3>
                        <p>Estimated Calories</p>
                    </div>
                </div>

                <div className="timer-controls">
                    {!isRunning ? (
                        <button
                            className="timer-start-button"
                            onClick={handleStart}
                            disabled={saving}
                        >
                            Start Workout
                        </button>
                    ) : (
                        <button
                            className="timer-stop-button"
                            onClick={handleStop}
                        >
                            Stop Workout
                        </button>
                    )}

                    <button
                        className="timer-reset-button"
                        onClick={handleReset}
                        disabled={isRunning || saving || elapsedSeconds === 0}
                    >
                        Reset
                    </button>

                    <button
                        className="timer-save-button"
                        onClick={handleSaveWorkout}
                        disabled={
                            isRunning ||
                            saving ||
                            elapsedSeconds < 60
                        }
                    >
                        {saving ? "Saving..." : "Save Workout"}
                    </button>
                </div>

                {message && (
                    <div className="timer-success-message">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="timer-error-message">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
};

export default WorkoutTimer;