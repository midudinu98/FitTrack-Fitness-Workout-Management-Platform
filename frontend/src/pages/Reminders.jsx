import { useEffect, useState } from "react";
import API from "../services/api";

const Reminders = () => {
    const [reminders, setReminders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        reminder_type: "workout",
        title: "",
        message: "",
        reminder_time: "07:00",
        is_enabled: true
    });

    useEffect(() => {
        fetchReminders();
    }, []);

    const fetchReminders = async () => {
        try {
            setLoading(true);
            const response = await API.get("/reminders/");
            setReminders(response.data);
            setError("");
        } catch (err) {
            setError("Unable to load reminders.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setForm({
            ...form,
            [name]: type === "checkbox" ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);
            setError("");

            await API.post("/reminders/", form);

            setForm({
                reminder_type: "workout",
                title: "",
                message: "",
                reminder_time: "07:00",
                is_enabled: true
            });

            await fetchReminders();
        } catch (err) {
            setError(
                err.response?.data?.detail ||
                "Unable to create reminder."
            );
        } finally {
            setSaving(false);
        }
    };

    const toggleReminder = async (reminder) => {
        try {
            await API.put(`/reminders/${reminder.id}`, {
                is_enabled: !reminder.is_enabled
            });

            await fetchReminders();
        } catch (err) {
            setError("Unable to update reminder.");
        }
    };

    const deleteReminder = async (id) => {
        if (!window.confirm("Are you sure you want to delete this reminder?")) {
            return;
        }

        try {
            await API.delete(`/reminders/${id}`);
            await fetchReminders();
        } catch (err) {
            setError("Unable to delete reminder.");
        }
    };

    const formatType = (type) => {
        const types = {
            workout: "Workout",
            meal: "Meal",
            water: "Water Intake"
        };

        return types[type] || type;
    };

    return (
        <div className="reminders-container">

            <header className="reminders-header">
                <h1>Reminder Settings</h1>
                <p>Stay consistent with your fitness routine.</p>
            </header>

            {error && (
                <div className="reminder-error">
                    {error}
                </div>
            )}

            <section className="reminder-form-section">
                <h2>Create New Reminder</h2>

                <form onSubmit={handleSubmit}>

                    <div className="reminder-form-group">
                        <label>Reminder Type</label>

                        <select
                            name="reminder_type"
                            value={form.reminder_type}
                            onChange={handleChange}
                            required
                        >
                            <option value="workout">Workout Reminder</option>
                            <option value="meal">Meal Reminder</option>
                            <option value="water">Water Intake Reminder</option>
                        </select>
                    </div>

                    <div className="reminder-form-group">
                        <label>Title</label>

                        <input
                            type="text"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            placeholder="Example: Morning Workout"
                            minLength={2}
                            maxLength={150}
                            required
                        />
                    </div>

                    <div className="reminder-form-group">
                        <label>Message</label>

                        <textarea
                            name="message"
                            value={form.message}
                            onChange={handleChange}
                            placeholder="Enter your reminder message"
                            minLength={2}
                            maxLength={500}
                            required
                        />
                    </div>

                    <div className="reminder-form-group">
                        <label>Reminder Time</label>

                        <input
                            type="time"
                            name="reminder_time"
                            value={form.reminder_time}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="reminder-checkbox">
                        <input
                            type="checkbox"
                            name="is_enabled"
                            checked={form.is_enabled}
                            onChange={handleChange}
                        />

                        <label>Enable this reminder</label>
                    </div>

                    <button type="submit" disabled={saving}>
                        {saving ? "Saving..." : "Create Reminder"}
                    </button>

                </form>
            </section>

            <section className="reminder-list-section">
                <h2>My Reminders</h2>

                {loading ? (
                    <p>Loading reminders...</p>
                ) : reminders.length === 0 ? (
                    <p>No reminders created yet.</p>
                ) : (
                    <div className="reminder-list">

                        {reminders.map(reminder => (
                            <div
                                className="reminder-card"
                                key={reminder.id}
                            >
                                <div>
                                    <span className="reminder-type">
                                        {formatType(reminder.reminder_type)}
                                    </span>

                                    <h3>{reminder.title}</h3>

                                    <p>{reminder.message}</p>

                                    <strong>
                                        {reminder.reminder_time.slice(0, 5)}
                                    </strong>

                                    <p>
                                        Status: {reminder.is_enabled ? "Enabled" : "Disabled"}
                                    </p>
                                </div>

                                <div className="reminder-card-actions">
                                    <button
                                        type="button"
                                        onClick={() => toggleReminder(reminder)}
                                    >
                                        {reminder.is_enabled ? "Disable" : "Enable"}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => deleteReminder(reminder.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}

                    </div>
                )}
            </section>

        </div>
    );
};

export default Reminders;