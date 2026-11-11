import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

const Recommendations = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchRecommendations();
    }, []);

    const fetchRecommendations = async () => {
        try {
            const response = await API.get("/recommendations/");
            setData(response.data);
        } catch (err) {
            console.error("Recommendations error:", err);
            setError(
                err.response?.data?.detail ||
                "Unable to load workout recommendations."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="recommendations-container">
            <header className="recommendations-header">
                <div>
                    <h1>AI Workout Suggestions</h1>
                    <p>Personalized workout recommendations based on your fitness activity.</p>
                </div>
                <Link to="/dashboard" className="recommendations-back-button">
                    Back to Dashboard
                </Link>
            </header>

            {loading ? (
                <p className="recommendations-status">Loading recommendations...</p>
            ) : error ? (
                <div className="recommendations-error">{error}</div>
            ) : (
                <>
                    <section className="recommendations-summary">
                        <div className="recommendation-summary-card">
                            <h3>🎯 Fitness Goal</h3>
                            <p>{data.goal_summary || "General Fitness"}</p>
                        </div>

                        <div className="recommendation-summary-card">
                            <h3>🔥 Current Streak</h3>
                            <p>{data.current_streak} Days</p>
                        </div>
                    </section>

                    <section className="recommendations-message">
                        <h3>Personalized Insights</h3>
                        <p>{data.message}</p>
                    </section>

                    <section className="recommendations-list">
                        <h2>Recommended Workouts</h2>

                        {data.recommendations.length === 0 ? (
                            <div className="recommendations-empty">
                                <h3>No recommendations available</h3>
                                <p>
                                    Add exercises to your Exercise Library to receive
                                    workout suggestions.
                                </p>
                                <Link to="/exercise-library">
                                    Go to Exercise Library
                                </Link>
                            </div>
                        ) : (
                            <div className="recommendations-grid">
                                {data.recommendations.map((recommendation, index) => (
                                    <article
                                        className="recommendation-card"
                                        key={`${recommendation.category}-${index}`}
                                    >
                                        <div className="recommendation-card-heading">
                                            <h3>{recommendation.title}</h3>
                                            <span>{recommendation.intensity}</span>
                                        </div>

                                        <div className="recommendation-details">
                                            <p>
                                                <strong>Category:</strong>{" "}
                                                {recommendation.category}
                                            </p>
                                            <p>
                                                <strong>Duration:</strong>{" "}
                                                {recommendation.recommended_duration} minutes
                                            </p>
                                        </div>

                                        <p className="recommendation-reason">
                                            {recommendation.reason}
                                        </p>

                                        <h4>Suggested Exercises</h4>

                                        {recommendation.exercises.length === 0 ? (
                                            <p>No exercises available.</p>
                                        ) : (
                                            <div className="suggested-exercises">
                                                {recommendation.exercises.map(exercise => (
                                                    <div
                                                        className="suggested-exercise"
                                                        key={exercise.id}
                                                    >
                                                        <h5>{exercise.name}</h5>
                                                        <p>
                                                            <strong>Category:</strong>{" "}
                                                            {exercise.category}
                                                        </p>
                                                        <p>
                                                            <strong>Duration:</strong>{" "}
                                                            {exercise.duration} minutes
                                                        </p>
                                                        {exercise.description && (
                                                            <p>{exercise.description}</p>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </article>
                                ))}
                            </div>
                        )}
                    </section>
                </>
            )}
        </div>
    );
};

export default Recommendations;