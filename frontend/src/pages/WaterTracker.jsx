import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

const WaterTracker = () => {
    const [quantity, setQuantity] = useState(250);
    const [summary, setSummary] = useState({
        total_quantity: 0,
        daily_goal: 2000,
        remaining_quantity: 2000,
        progress_percentage: 0
    });

    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const fetchWaterData = async () => {
        try {
            const [summaryResponse, entriesResponse] = await Promise.all([
                API.get("/water/summary"),
                API.get("/water/")
            ]);

            setSummary(summaryResponse.data);
            setEntries(entriesResponse.data);
            setError("");
        } catch (err) {
            setError("Failed to load water tracking data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWaterData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!quantity || Number(quantity) <= 0) {
            setError("Please enter a valid water quantity.");
            return;
        }

        try {
            setSubmitting(true);
            setError("");
            setSuccess("");

            await API.post("/water/", {
                quantity: Number(quantity)
            });

            setSuccess("Water intake logged successfully!");
            setQuantity(250);

            await fetchWaterData();
        } catch (err) {
            setError(
                err.response?.data?.detail ||
                "Failed to log water intake."
            );
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="water-container">
                <p>Loading water tracker...</p>
            </div>
        );
    }

    return (
        <div className="water-container">

            <header className="water-header">
                <div>
                    <h1>Water Intake Tracker</h1>
                    <p>Stay hydrated and maintain your daily water goal.</p>
                </div>

                <Link to="/dashboard" className="water-back-button">
                    Back to Dashboard
                </Link>
            </header>

            {error && <div className="water-error">{error}</div>}
            {success && <div className="water-success">{success}</div>}

            <section className="water-summary-card">
                <h2>Today's Water Intake</h2>

                <div className="water-total">
                    {(summary.total_quantity / 1000).toFixed(2)}
                    <span> Litres</span>
                </div>

                <p>
                    Daily Goal: {(summary.daily_goal / 1000).toFixed(1)} Litres
                </p>

                <div className="water-progress-track">
                    <div
                        className="water-progress-fill"
                        style={{
                            width: `${summary.progress_percentage}%`
                        }}
                    ></div>
                </div>

                <div className="water-progress-info">
                    <span>{summary.progress_percentage}% completed</span>
                    <span>
                        {summary.remaining_quantity} ml remaining
                    </span>
                </div>
            </section>

            <section className="water-form-section">
                <h2>Log Water Intake</h2>

                <form onSubmit={handleSubmit}>
                    <label htmlFor="water-quantity">
                        Water Quantity (ml)
                    </label>

                    <input
                        id="water-quantity"
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        required
                    />

                    <div className="water-quick-buttons">
                        <button
                            type="button"
                            onClick={() => setQuantity(250)}
                        >
                            +250 ml
                        </button>

                        <button
                            type="button"
                            onClick={() => setQuantity(500)}
                        >
                            +500 ml
                        </button>

                        <button
                            type="button"
                            onClick={() => setQuantity(750)}
                        >
                            +750 ml
                        </button>
                    </div>

                    <button
                        type="submit"
                        className="water-submit-button"
                        disabled={submitting}
                    >
                        {submitting ? "Saving..." : "Log Water Intake"}
                    </button>
                </form>
            </section>

            <section className="water-history-section">
                <h2>Today's Intake History</h2>

                {entries.length === 0 ? (
                    <p className="water-empty">
                        No water intake recorded today.
                    </p>
                ) : (
                    <div className="water-history-list">
                        {entries.map((entry) => (
                            <div
                                className="water-history-item"
                                key={entry.id}
                            >
                                <div>
                                    <strong>{entry.quantity} ml</strong>
                                    <p>
                                        {new Date(
                                            entry.date + "T00:00:00"
                                        ).toLocaleDateString()}
                                    </p>
                                </div>

                                <span>
                                    {(entry.quantity / 1000).toFixed(2)} L
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </section>

        </div>
    );
};

export default WaterTracker;