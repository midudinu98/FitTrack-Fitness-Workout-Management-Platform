import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

const AddWorkout = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        workout_name: "",
        category: "Cardio",
        duration: "",
        calories_burned: "",
        workout_date: new Date().toLocaleDateString("en-CA"),
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");
        setLoading(true);

        try {
            await API.post("/workouts/", {
                ...formData,
                duration: Number(formData.duration),
                calories_burned: Number(formData.calories_burned),
            });

            setSuccess("Workout added successfully!");

            setTimeout(() => {
                navigate("/workouts");
            }, 1000);
        } catch (err) {
            const detail = err.response?.data?.detail;

            setError(
                Array.isArray(detail)
                    ? detail.map((item) => item.msg).join(", ")
                    : detail || "Unable to add workout."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="workout-form-container">
            <div className="workout-form-card">
                <h2>Add New Workout</h2>
                <p>Record your fitness activity.</p>

                {error && <div className="error-message">{error}</div>}
                {success && (
                    <div className="success-message">{success}</div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Workout Name</label>
                        <input
                            type="text"
                            name="workout_name"
                            placeholder="Example: Morning Running"
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
                            placeholder="Enter duration"
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
                            placeholder="Enter calories"
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

                    <button type="submit" disabled={loading}>
                        {loading ? "Saving..." : "Add Workout"}
                    </button>
                </form>

                <p className="auth-link">
                    <Link to="/dashboard">Back to Dashboard</Link>
                </p>
            </div>
        </div>
    );
};

export default AddWorkout;