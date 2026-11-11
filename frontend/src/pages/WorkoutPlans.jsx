import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

const getLocalDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

const WorkoutPlans = () => {
    const [plans, setPlans] = useState([]);
    const [upcomingPlans, setUpcomingPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        scheduled_date: ""
    });

    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(getLocalDate());

    const fetchPlans = async () => {
        try {
            setLoading(true);
            setError("");

            const [allResponse, upcomingResponse] = await Promise.all([
                API.get("/workout-plans/"),
                API.get("/workout-plans/upcoming")
            ]);

            setPlans(allResponse.data);
            setUpcomingPlans(upcomingResponse.data);
        } catch (err) {
            setError(
                err.response?.data?.detail ||
                "Unable to load workout plans."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlans();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleCreatePlan = async (e) => {
        e.preventDefault();

        try {
            setError("");
            setMessage("");

            await API.post("/workout-plans/", {
                title: formData.title.trim(),
                description: formData.description.trim() || null,
                scheduled_date: formData.scheduled_date
            });

            setMessage("Workout plan scheduled successfully!");

            setSelectedDate(formData.scheduled_date);
            setCurrentMonth(
                new Date(`${formData.scheduled_date}T12:00:00`)
            );

            setFormData({
                title: "",
                description: "",
                scheduled_date: ""
            });

            await fetchPlans();
        } catch (err) {
            setError(
                err.response?.data?.detail ||
                "Unable to create workout plan."
            );
        }
    };

    const changeMonth = (amount) => {
        setCurrentMonth((previous) => {
            return new Date(
                previous.getFullYear(),
                previous.getMonth() + amount,
                1
            );
        });
    };

    const getDateString = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };

    const getCalendarDays = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        const startingDay = (firstDay.getDay() + 6) % 7;

        const days = [];

        for (let i = 0; i < startingDay; i++) {
            days.push(null);
        }

        for (let day = 1; day <= lastDay.getDate(); day++) {
            days.push(new Date(year, month, day));
        }

        while (days.length % 7 !== 0) {
            days.push(null);
        }

        return days;
    };

    const selectedDatePlans = plans.filter(
        (plan) => plan.scheduled_date === selectedDate
    );

    const today = getLocalDate();

    return (
        <div className="workout-plans-container">

            <header className="workout-plans-header">
                <div>
                    <h1>Workout Plans</h1>
                    <p>Plan your workouts and stay consistent with your fitness journey.</p>
                </div>

                <Link to="/dashboard">
                    Back to Dashboard
                </Link>
            </header>

            {message && (
                <p className="plan-success">{message}</p>
            )}

            {error && (
                <p className="plan-error">{error}</p>
            )}

            <section className="plan-summary">

                <div className="plan-summary-card">
                    <h3>Total Workout Plans</h3>
                    <h2>{plans.length}</h2>
                </div>

                <div className="plan-summary-card">
                    <h3>Upcoming Workouts</h3>
                    <h2>{upcomingPlans.length}</h2>
                </div>

            </section>

            <section className="plan-form-card">

                <h2>Schedule a New Workout</h2>

                <form onSubmit={handleCreatePlan}>

                    <div className="plan-form-group">
                        <label>Workout Title</label>

                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Example: Chest and Triceps"
                            maxLength="150"
                            required
                        />
                    </div>

                    <div className="plan-form-group">
                        <label>Description</label>

                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Describe your planned workout..."
                            rows="3"
                        />
                    </div>

                    <div className="plan-form-group">
                        <label>Scheduled Date</label>

                        <input
                            type="date"
                            name="scheduled_date"
                            value={formData.scheduled_date}
                            onChange={handleChange}
                            min={today}
                            required
                        />
                    </div>

                    <button type="submit">
                        Schedule Workout
                    </button>

                </form>

            </section>

            <section className="plan-calendar-section">

                <div className="plan-section-heading">
                    <h2>Workout Calendar</h2>
                </div>

                <div className="plan-calendar">

                    <div className="calendar-header">

                        <button
                            type="button"
                            onClick={() => changeMonth(-1)}
                        >
                            &#10094;
                        </button>

                        <h3>
                            {currentMonth.toLocaleDateString("en-US", {
                                month: "long",
                                year: "numeric"
                            })}
                        </h3>

                        <button
                            type="button"
                            onClick={() => changeMonth(1)}
                        >
                            &#10095;
                        </button>

                    </div>

                    <div className="calendar-grid">

                        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                            (day) => (
                                <div className="calendar-weekday" key={day}>
                                    {day}
                                </div>
                            )
                        )}

                        {getCalendarDays().map((date, index) => {

                            if (!date) {
                                return (
                                    <div
                                        className="calendar-empty"
                                        key={`empty-${index}`}
                                    />
                                );
                            }

                            const dateString = getDateString(date);

                            const hasWorkout = plans.some(
                                (plan) => plan.scheduled_date === dateString
                            );

                            const isSelected = selectedDate === dateString;
                            const isToday = today === dateString;

                            return (
                                <button
                                    type="button"
                                    key={dateString}
                                    className={`calendar-day
                                        ${hasWorkout ? "has-workout" : ""}
                                        ${isSelected ? "selected-day" : ""}
                                        ${isToday ? "today-day" : ""}`}
                                    onClick={() => setSelectedDate(dateString)}
                                >
                                    <span>{date.getDate()}</span>

                                    {hasWorkout && (
                                        <span className="calendar-dot" />
                                    )}
                                </button>
                            );
                        })}

                    </div>

                    <p className="calendar-legend">
                        <span className="calendar-dot" />
                        Scheduled workout
                    </p>

                </div>

                <div className="selected-date-plans">

                    <h3>
                        Workouts on{" "}
                        {new Date(`${selectedDate}T12:00:00`).toLocaleDateString(
                            "en-US",
                            {
                                day: "numeric",
                                month: "long",
                                year: "numeric"
                            }
                        )}
                    </h3>

                    {selectedDatePlans.length === 0 ? (
                        <p>No workouts scheduled for this date.</p>
                    ) : (
                        selectedDatePlans.map((plan) => (
                            <div className="scheduled-plan-card" key={plan.id}>
                                <h4>{plan.title}</h4>
                                <p>
                                    {plan.description || "No description provided."}
                                </p>
                            </div>
                        ))
                    )}

                </div>

            </section>

            <section className="upcoming-plans-section">

                <h2>Upcoming Workouts</h2>

                {loading && <p>Loading workout plans...</p>}

                {!loading && upcomingPlans.length === 0 && (
                    <p>No upcoming workouts. Schedule your first workout!</p>
                )}

                <div className="upcoming-plans-list">

                    {upcomingPlans.map((plan) => (
                        <div className="upcoming-plan-card" key={plan.id}>

                            <div>
                                <h3>{plan.title}</h3>

                                <p>
                                    {plan.description || "No description provided."}
                                </p>
                            </div>

                            <span>
                                {new Date(
                                    `${plan.scheduled_date}T12:00:00`
                                ).toLocaleDateString("en-US", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric"
                                })}
                            </span>

                        </div>
                    ))}

                </div>

            </section>

        </div>
    );
};

export default WorkoutPlans;