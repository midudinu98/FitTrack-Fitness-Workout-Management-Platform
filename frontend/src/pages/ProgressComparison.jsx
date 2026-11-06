import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";
import API from "../services/api";

const ProgressComparison = () => {
    const [weekly, setWeekly] = useState(null);
    const [monthly, setMonthly] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchComparisons = async () => {
            try {
                setLoading(true);
                setError("");

                const [weeklyResponse, monthlyResponse] =
                    await Promise.all([
                        API.get("/progress/weekly-comparison"),
                        API.get("/progress/monthly-comparison")
                    ]);

                setWeekly(weeklyResponse.data);
                setMonthly(monthlyResponse.data);
            } catch (err) {
                setError(
                    err.response?.data?.detail ||
                    "Unable to load progress comparisons."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchComparisons();
    }, []);

    const createChartData = (comparison) => {
        if (!comparison) return [];

        return [
            {
                metric: "Workouts",
                Current: comparison.current.total_workouts,
                Previous: comparison.previous.total_workouts
            },
            {
                metric: "Duration (min)",
                Current: comparison.current.total_duration,
                Previous: comparison.previous.total_duration
            },
            {
                metric: "Calories",
                Current: comparison.current.total_calories,
                Previous: comparison.previous.total_calories
            }
        ];
    };

    const formatChange = (value) => {
        if (value === null || value === undefined) {
            return "No previous data";
        }

        if (value > 0) return `+${value}%`;
        return `${value}%`;
    };

    const getChangeClass = (value) => {
        if (value === null || value === undefined) {
            return "comparison-neutral";
        }

        if (value > 0) return "comparison-positive";
        if (value < 0) return "comparison-negative";

        return "comparison-neutral";
    };

    const renderComparison = (title, comparison) => {
        if (!comparison) return null;

        const chartData = createChartData(comparison);

        return (
            <section className="comparison-section">
                <div className="comparison-heading">
                    <div>
                        <h2>{title}</h2>
                        <p>
                            {comparison.current_period.start} to{" "}
                            {comparison.current_period.end}
                        </p>
                    </div>
                </div>

                <div className="comparison-chart">
                    <ResponsiveContainer width="100%" height={320}>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="metric" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar
                                dataKey="Current"
                                fill="#2563eb"
                                radius={[6, 6, 0, 0]}
                            />
                            <Bar
                                dataKey="Previous"
                                fill="#94a3b8"
                                radius={[6, 6, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="comparison-stats">
                    <div className="comparison-stat-card">
                        <h3>Workout Change</h3>
                        <h2 className={getChangeClass(
                            comparison.changes.workouts
                        )}>
                            {formatChange(comparison.changes.workouts)}
                        </h2>
                    </div>

                    <div className="comparison-stat-card">
                        <h3>Duration Change</h3>
                        <h2 className={getChangeClass(
                            comparison.changes.duration
                        )}>
                            {formatChange(comparison.changes.duration)}
                        </h2>
                    </div>

                    <div className="comparison-stat-card">
                        <h3>Calories Change</h3>
                        <h2 className={getChangeClass(
                            comparison.changes.calories
                        )}>
                            {formatChange(comparison.changes.calories)}
                        </h2>
                    </div>
                </div>

                <div className="comparison-insights">
                    <h3>Progress Insights</h3>

                    {comparison.insights.map((insight, index) => (
                        <p key={index}>• {insight}</p>
                    ))}
                </div>
            </section>
        );
    };

    return (
        <div className="progress-comparison-container">

            <header className="progress-comparison-header">
                <div>
                    <h1>Progress Comparison</h1>
                    <p>
                        Compare your fitness performance over time.
                    </p>
                </div>

                <Link to="/dashboard">
                    Back to Dashboard
                </Link>
            </header>

            {loading && <p>Loading progress comparisons...</p>}

            {error && (
                <div className="comparison-error">
                    {error}
                </div>
            )}

            {!loading && !error && (
                <>
                    {renderComparison("Weekly Comparison", weekly)}
                    {renderComparison("Monthly Comparison", monthly)}
                </>
            )}

        </div>
    );
};

export default ProgressComparison;