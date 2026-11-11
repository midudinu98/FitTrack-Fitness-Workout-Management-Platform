import { useEffect, useState } from "react";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend
} from "recharts";

import API from "../services/api";

const AdvancedAnalytics = () => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await API.get(
                "/analytics/dashboard"
            );

            setAnalytics(response.data);

        } catch (err) {
            console.error("Analytics error:", err);

            setError(
                err.response?.data?.detail ||
                "Unable to load advanced analytics."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics();
    }, []);

    if (loading) {
        return (
            <div className="advanced-analytics-container">
                <p>Loading advanced analytics...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="advanced-analytics-container">
                <div className="analytics-error">
                    {error}
                </div>

                <button onClick={fetchAnalytics}>
                    Retry
                </button>
            </div>
        );
    }

    if (!analytics) {
        return null;
    }

    const {
        weekly_performance,
        monthly_performance,
        goal_analytics,
        consistency,
        performance_insights
    } = analytics;

    return (
        <div className="advanced-analytics-container">

            <div className="analytics-header">
                <div>
                    <h1>Advanced Analytics Dashboard</h1>

                    <p>
                        Track your fitness performance,
                        workout consistency and achievements.
                    </p>
                </div>

                <button
                    className="analytics-refresh-btn"
                    onClick={fetchAnalytics}
                >
                    Refresh Analytics
                </button>
            </div>

            {/* Performance summary */}
            <div className="analytics-summary-grid">

                <div className="analytics-summary-card">
                    <h3>Total Workouts</h3>
                    <h2>{performance_insights.total_workouts}</h2>
                    <p>Last 30 days</p>
                </div>

                <div className="analytics-summary-card">
                    <h3>Total Duration</h3>
                    <h2>{performance_insights.total_duration}</h2>
                    <p>Minutes · Last 30 days</p>
                </div>

                <div className="analytics-summary-card">
                    <h3>Calories Burned</h3>
                    <h2>
                        {performance_insights.total_calories.toLocaleString()}
                    </h2>
                    <p>Last 30 days</p>
                </div>

                <div className="analytics-summary-card">
                    <h3>Average Duration</h3>
                    <h2>
                        {performance_insights.average_duration}
                    </h2>
                    <p>Minutes per workout</p>
                </div>

            </div>

            {/* Weekly performance chart */}
            <div className="analytics-chart-card">

                <h2>Weekly Performance Trends</h2>

                <p>
                    Workout count across the last seven weeks.
                </p>

                <ResponsiveContainer width="100%" height={320}>
                    <BarChart data={weekly_performance}>
                        <CartesianGrid strokeDasharray="3 3" />

                        <XAxis dataKey="week" />

                        <YAxis allowDecimals={false} />

                        <Tooltip />

                        <Legend />

                        <Bar
                            dataKey="workouts"
                            name="Workouts"
                            fill="#16a34a"
                        />

                    </BarChart>
                </ResponsiveContainer>

            </div>

            {/* Monthly performance chart */}
            <div className="analytics-chart-card">

                <h2>Monthly Performance Trends</h2>

                <p>
                    Compare workouts, duration and calories.
                </p>

                <ResponsiveContainer width="100%" height={320}>
                    <LineChart data={monthly_performance}>
                        <CartesianGrid strokeDasharray="3 3" />

                        <XAxis dataKey="month" />

                        <YAxis />

                        <Tooltip />

                        <Legend />

                        <Line
                            type="monotone"
                            dataKey="workouts"
                            name="Workouts"
                            stroke="#2563eb"
                            strokeWidth={3}
                        />

                        <Line
                            type="monotone"
                            dataKey="duration"
                            name="Duration (min)"
                            stroke="#16a34a"
                            strokeWidth={3}
                        />

                        <Line
                            type="monotone"
                            dataKey="calories"
                            name="Calories"
                            stroke="#f59e0b"
                            strokeWidth={3}
                        />

                    </LineChart>
                </ResponsiveContainer>

            </div>

            {/* Goal completion */}
            <div className="analytics-two-column">

                <div className="analytics-chart-card">

                    <h2>Goal Completion Rate</h2>

                    <div className="goal-completion-value">
                        {goal_analytics.completion_rate}%
                    </div>

                    <div className="goal-progress-track">
                        <div
                            className="goal-progress-fill"
                            style={{
                                width: `${goal_analytics.completion_rate}%`
                            }}
                        />
                    </div>

                    <p>
                        {goal_analytics.completed_goals} completed out of{" "}
                        {goal_analytics.total_goals} goals.
                    </p>

                </div>

                {/* Workout consistency */}
                <div className="analytics-chart-card">

                    <h2>Workout Consistency</h2>

                    <div className="goal-completion-value">
                        {consistency.consistency_rate}%
                    </div>

                    <div className="goal-progress-track">
                        <div
                            className="goal-progress-fill consistency-fill"
                            style={{
                                width: `${consistency.consistency_rate}%`
                            }}
                        />
                    </div>

                    <p>
                        {consistency.total_workout_days} workout days
                        out of {consistency.total_days} days.
                    </p>

                    <div className="consistency-stats">
                        <div>
                            <strong>
                                {consistency.current_streak}
                            </strong>
                            <span>Current Streak</span>
                        </div>

                        <div>
                            <strong>
                                {consistency.longest_streak}
                            </strong>
                            <span>Longest Streak</span>
                        </div>
                    </div>

                </div>

            </div>

            {/* Performance insights */}
            <div className="analytics-insights-card">

                <h2>Performance Insights</h2>

                <div className="analytics-insights-list">

                    {performance_insights.insights.map(
                        (insight, index) => (
                            <div
                                className="analytics-insight-item"
                                key={index}
                            >
                                <span>✓</span>
                                <p>{insight}</p>
                            </div>
                        )
                    )}

                </div>

                <div className="analytics-category">

                    <strong>Most Frequent Workout Category</strong>

                    <span>
                        {performance_insights.most_frequent_category}
                    </span>

                </div>

                <div className="analytics-average-stats">
                    <p>
                        Average Calories per Workout:{" "}
                        <strong>
                            {performance_insights.average_calories}
                        </strong>
                    </p>
                </div>

            </div>

        </div>
    );
};

export default AdvancedAnalytics;