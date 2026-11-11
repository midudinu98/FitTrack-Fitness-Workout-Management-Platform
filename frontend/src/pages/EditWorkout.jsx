import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import API from "../services/api";

const EditWorkout = () => {
    const { workoutId } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        workout_name: "",
        category: "Cardio",
        duration: "",
        calories_burned: "",
        workout_date: "",
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchWorkout = async () => {
            try {
                const response = await API.get("/workouts/");
                const workout = response.data.find(
                    (item) => item.id === Number(workoutId)
                );

                if (!workout) {
                    setError("Workout not found.");
                    return;
                }

                setFormData({
                    workout_name: workout.workout_name,
                    category: workout.category,
                    duration: workout.duration,
                    calories_burned: workout.calories_burned,
                    workout_date: workout.workout_date,
                });
            } catch (err) {
                setError("Unable to load workout details.");
            } finally {
                setLoading(false);
            }
        };

        fetchWorkout();
    }, [workoutId]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSaving(true);

        try {
            await API.put(`/workouts/${workoutId}`, {
                ...formData,
                duration: Number(formData.duration),
                calories_burned: Number(formData.calories_burned),
            });

            navigate("/workouts");
        } catch (err) {
            const detail = err.response?.data?.detail;

            setError(
                Array.isArray(detail)
                    ? detail.map((item) => item.msg).join(", ")
                    : detail || "Unable to update workout."
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <p>Loading workout details...</p>;
    }

    return (
        <div className="workout-form-container">
            <div className="workout-form-card">
                <h2>Edit Workout</h2>
                <p>Update your workout information.</p>

                {error && <div className="error-message">{error}</div>}

                {!error.includes("not found") && (
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Workout Name</label>
                            <input
                                type="text"
                                name="workout_name"
                                value={formData.workout_name}
                                onChange={handleChange}
                                minLength={2}
                                maxLength={100}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                            >
                                <option value="Cardio">Cardio</option>
                                <option value="Strength">Strength</option>
                                <option value="Yoga">Yoga</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Duration (Minutes)</label>
                            <input
                                type="number"
                                name="duration"
                                value={formData.duration}
                                onChange={handleChange}
                                min="1"
                                max="1440"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Calories Burned</label>
                            <input
                                type="number"
                                name="calories_burned"
                                value={formData.calories_burned}
                                onChange={handleChange}
                                min="0"
                                max="10000"
                                step="0.1"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Workout Date</label>
                            <input
                                type="date"
                                name="workout_date"
                                value={formData.workout_date}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <button type="submit" disabled={saving}>
                            {saving ? "Updating..." : "Update Workout"}
                        </button>
                    </form>
                )}

                <p className="auth-link">
                    <Link to="/workouts">Back to Workouts</Link>
                </p>
            </div>
        </div>
    );
};

export default EditWorkout;