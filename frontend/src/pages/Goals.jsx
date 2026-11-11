import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

const Goals = () => {
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const [formData, setFormData] = useState({
        goal_type: "Weight Loss",
        target_value: "",
        current_value: "0",
        deadline: ""
    });

    const [editingGoal, setEditingGoal] = useState(null);
    const [updatedValue, setUpdatedValue] = useState("");

    const fetchGoals = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await API.get("/goals/");
            setGoals(response.data);
        } catch (err) {
            setError(
                err.response?.data?.detail || "Unable to load goals."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGoals();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleCreateGoal = async (e) => {
        e.preventDefault();

        try {
            setError("");
            setMessage("");

            await API.post("/goals/", {
                goal_type: formData.goal_type,
                target_value: Number(formData.target_value),
                current_value: Number(formData.current_value),
                deadline: formData.deadline
            });

            setMessage("Goal created successfully!");

            setFormData({
                goal_type: "Weight Loss",
                target_value: "",
                current_value: "0",
                deadline: ""
            });

            await fetchGoals();
        } catch (err) {
            setError(
                err.response?.data?.detail || "Unable to create goal."
            );
        }
    };

    const handleUpdateGoal = async (goalId) => {
        try {
            setError("");
            setMessage("");

            await API.put(`/goals/${goalId}`, {
                current_value: Number(updatedValue)
            });

            setMessage("Goal progress updated successfully!");
            setEditingGoal(null);
            setUpdatedValue("");

            await fetchGoals();
        } catch (err) {
            setError(
                err.response?.data?.detail || "Unable to update goal."
            );
        }
    };

    const handleDeleteGoal = async (goalId) => {
        if (!window.confirm("Are you sure you want to delete this goal?")) {
            return;
        }

        try {
            setError("");
            setMessage("");

            await API.delete(`/goals/${goalId}`);

            setMessage("Goal deleted successfully!");
            await fetchGoals();
        } catch (err) {
            setError(
                err.response?.data?.detail || "Unable to delete goal."
            );
        }
    };

    const getProgressPercentage = (goal) => {
        let percentage;

        if (goal.goal_type === "Weight Loss") {
            const totalToLose = goal.target_value;
            const achieved = Math.max(
                0,
                goal.target_value - goal.current_value
            );

            percentage = totalToLose > 0
                ? (achieved / totalToLose) * 100
                : 0;
        } else {
            percentage =
                (goal.current_value / goal.target_value) * 100;
        }

        return Math.min(100, Math.max(0, percentage));
    };

    return (
        <div className="goals-container">
            <header className="goals-header">
                <h1>Fitness Goals</h1>
                <Link to="/dashboard">Back to Dashboard</Link>
            </header>

            <section className="goal-form-card">
                <h2>Set a New Goal</h2>

                <form onSubmit={handleCreateGoal}>
                    <div className="goal-form-group">
                        <label>Goal Type</label>
                        <select
                            name="goal_type"
                            value={formData.goal_type}
                            onChange={handleChange}
                        >
                            <option value="Weight Loss">Weight Loss</option>
                            <option value="Muscle Gain">Muscle Gain</option>
                            <option value="Steps">Steps</option>
                        </select>
                    </div>

                    <div className="goal-form-group">
                        <label>
                            Target Value
                            {formData.goal_type === "Steps"
                                ? " (steps)"
                                : " (kg)"}
                        </label>
                        <input
                            type="number"
                            name="target_value"
                            value={formData.target_value}
                            onChange={handleChange}
                            min="0.01"
                            step="any"
                            required
                        />
                    </div>

                    <div className="goal-form-group">
                        <label>
                            Current Value
                            {formData.goal_type === "Steps"
                                ? " (steps)"
                                : " (kg)"}
                        </label>
                        <input
                            type="number"
                            name="current_value"
                            value={formData.current_value}
                            onChange={handleChange}
                            min="0"
                            step="any"
                            required
                        />
                    </div>

                    <div className="goal-form-group">
                        <label>Deadline</label>
                        <input
                            type="date"
                            name="deadline"
                            value={formData.deadline}
                            onChange={handleChange}
                            min={new Date().toLocaleDateString("en-CA")}
                            required
                        />
                    </div>

                    <button type="submit">Create Goal</button>
                </form>
            </section>

            {message && <p className="goal-success">{message}</p>}
            {error && <p className="goal-error">{error}</p>}

            <section className="goals-list-section">
                <h2>My Fitness Goals</h2>

                {loading && <p>Loading goals...</p>}

                {!loading && !error && goals.length === 0 && (
                    <p>No goals created yet. Set your first fitness goal!</p>
                )}

                <div className="goals-list">
                    {goals.map((goal) => {
                        const percentage = getProgressPercentage(goal);

                        return (
                            <div className="goal-card" key={goal.id}>
                                <h3>{goal.goal_type}</h3>

                                <p>
                                    Target: {goal.target_value}
                                    {goal.goal_type === "Steps" ? " steps" : " kg"}
                                </p>

                                <p>
                                    Current: {goal.current_value}
                                    {goal.goal_type === "Steps" ? " steps" : " kg"}
                                </p>

                                <p>Deadline: {goal.deadline}</p>

                                <p>
                                    Status: <strong>{goal.status}</strong>
                                </p>

                                <div className="goal-progress-track">
                                    <div
                                        className="goal-progress-fill"
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>

                                <p>{percentage.toFixed(1)}% completed</p>

                                {editingGoal === goal.id ? (
                                    <div className="goal-update-form">
                                        <input
                                            type="number"
                                            min="0"
                                            step="any"
                                            value={updatedValue}
                                            onChange={(e) =>
                                                setUpdatedValue(e.target.value)
                                            }
                                            placeholder="Enter current value"
                                        />

                                        <button
                                            onClick={() =>
                                                handleUpdateGoal(goal.id)
                                            }
                                            disabled={updatedValue.trim() === ""}
                                        >
                                            Save Progress
                                        </button>

                                        <button
                                            onClick={() => setEditingGoal(null)}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => {
                                            setEditingGoal(goal.id);
                                            setUpdatedValue(
                                                String(goal.current_value)
                                            );
                                        }}
                                    >
                                        Update Progress
                                    </button>
                                )}

                                <button
                                    className="goal-delete-button"
                                    onClick={() => handleDeleteGoal(goal.id)}
                                >
                                    Delete Goal
                                </button>
                            </div>
                        );
                    })}
                </div>
            </section>
        </div>
    );
};

export default Goals;