
import { useEffect, useState } from "react";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    PieChart,
    Pie,
    Cell,
    Legend
} from "recharts";

import API from "../services/api";
import { Link } from "react-router-dom";

const COLORS = ["#2563eb", "#16a34a", "#f59e0b", "#9333ea"];

const Reports = () => {
    const today = new Date();

    const [weekly, setWeekly] = useState(null);
    const [monthly, setMonthly] = useState(null);
    const [calories, setCalories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [selectedMonth, setSelectedMonth] = useState(
        today.getMonth() + 1
    );

    const [selectedYear, setSelectedYear] = useState(
        today.getFullYear()
    );

    const fetchReports = async () => {
        setLoading(true);
        setError("");

        try {
            const [weeklyResponse, monthlyResponse, caloriesResponse] =
                await Promise.all([
                    API.get("/reports/weekly"),
                    API.get("/reports/monthly", {
                        params: {
                            year: selectedYear,
                            month: selectedMonth
                        }
                    }),
                    API.get("/reports/calories")
                ]);

            setWeekly(weeklyResponse.data);
            setMonthly(monthlyResponse.data);
            setCalories(caloriesResponse.data.calories_tracking);
        } catch (err) {
            setError("Unable to load reports. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, [selectedMonth, selectedYear]);

    const categoryData = monthly
        ? Object.entries(monthly.workouts_by_category).map(
            ([name, value]) => ({
                name,
                value
            })
        )
        : [];

    const dailyCalories = weekly?.workouts
        ? Object.values(
            weekly.workouts.reduce((result, workout) => {
                const date = workout.date;

                if (!result[date]) {
                    result[date] = {
                        date,
                        calories: 0
                    };
                }

                result[date].calories += workout.calories_burned;

                return result;
            }, {})
        )
        : [];

    if (loading) {
        return <div className="reports-container">Loading reports...</div>;
    }

    return (
        <div className="reports-container">
            <header className="reports-header">
                <div>
                    <h1>Reports & Analytics</h1>
                    <p>Monitor your fitness performance and achievements.</p>
                </div>

                <Link to="/dashboard">Back to Dashboard</Link>
            </header>

            {error && <div className="reports-error">{error}</div>}

            {weekly && monthly && (
                <>
                    <section className="report-summary">
                        <div className="report-card">
                            <h3>Weekly Workouts</h3>
                            <h2>{weekly.total_workouts}</h2>
                            <p>Last 7 days</p>
                        </div>

                        <div className="report-card">
                            <h3>Weekly Duration</h3>
                            <h2>{weekly.total_duration}</h2>
                            <p>Minutes</p>
                        </div>

                        <div className="report-card">
                            <h3>Weekly Calories</h3>
                            <h2>{weekly.total_calories}</h2>
                            <p>Calories burned</p>
                        </div>

                        <div className="report-card">
                            <h3>Monthly Workouts</h3>
                            <h2>{monthly.total_workouts}</h2>
                            <p>Selected month</p>
                        </div>
                    </section>

                    <section className="monthly-filter">
                        <h2>Monthly Report</h2>

                        <select
                            value={selectedMonth}
                            onChange={(e) =>
                                setSelectedMonth(Number(e.target.value))
                            }
                        >
                            {Array.from({ length: 12 }, (_, index) => (
                                <option key={index + 1} value={index + 1}>
                                    {new Date(2000, index).toLocaleString(
                                        "default",
                                        { month: "long" }
                                    )}
                                </option>
                            ))}
                        </select>

                        <input
                            type="number"
                            value={selectedYear}
                            min="2000"
                            max="2100"
                            onChange={(e) =>
                                setSelectedYear(Number(e.target.value))
                            }
                        />
                    </section>

                    <section className="reports-charts">
                        <div className="report-chart-card">
                            <h2>Weekly Calories Burned</h2>

                            {dailyCalories.length > 0 ? (
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={dailyCalories}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar
                                            dataKey="calories"
                                            fill="#2563eb"
                                            radius={[6, 6, 0, 0]}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <p>No workout data available this week.</p>
                            )}
                        </div>

                        <div className="report-chart-card">
                            <h2>Monthly Workout Categories</h2>

                            {categoryData.length > 0 ? (
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={categoryData}
                                            dataKey="value"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={95}
                                            label
                                        >
                                            {categoryData.map((entry, index) => (
                                                <Cell
                                                    key={entry.name}
                                                    fill={COLORS[index % COLORS.length]}
                                                />
                                            ))}
                                        </Pie>

                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <p>No category data available this month.</p>
                            )}
                        </div>
                    </section>

                    <section className="monthly-summary">
                        <h2>Monthly Performance Summary</h2>

                        <p>
                            Total workouts: <strong>{monthly.total_workouts}</strong>
                        </p>

                        <p>
                            Total duration: <strong>{monthly.total_duration} minutes</strong>
                        </p>

                        <p>
                            Total calories burned: <strong>{monthly.total_calories} kcal</strong>
                        </p>
                    </section>
                </>
            )}
        </div>
    );
};

export default Reports;