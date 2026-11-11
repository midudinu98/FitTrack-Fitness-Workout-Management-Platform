import { useEffect, useState } from "react";
import API from "../services/api";

const GoogleHealth = () => {
    const [connected, setConnected] = useState(false);

    const [steps, setSteps] = useState(null);
    const [activeMinutes, setActiveMinutes] = useState(null);
    const [activeCalories, setActiveCalories] = useState(null);

    const [loading, setLoading] = useState(true);
    const [connecting, setConnecting] = useState(false);
    const [syncingSteps, setSyncingSteps] = useState(false);
    const [syncingActivity, setSyncingActivity] = useState(false);

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    // Check connection status
    const checkStatus = async () => {
        try {
            const response = await API.get("/google-health/status");
            setConnected(response.data.connected);
        } catch (err) {
            console.error("Status error:", err);
            setError(
                err.response?.data?.detail ||
                "Unable to check Google Health connection."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const initializePage = async () => {
            const params = new URLSearchParams(window.location.search);

            if (params.get("connected") === "true") {
                setMessage("Google Health connected successfully!");
            }

            if (params.get("error")) {
                setError("Google Health authorization was unsuccessful.");
            }

            if (params.has("connected") || params.has("error")) {
                window.history.replaceState(
                    {},
                    document.title,
                    "/google-health"
                );
            }

            await checkStatus();
        };

        initializePage();
    }, []);

    // Connect Google Health
    const connectGoogleHealth = async () => {
        try {
            setConnecting(true);
            setError("");
            setMessage("");

            const response = await API.get("/google-health/connect");

            if (!response.data.authorization_url) {
                throw new Error("Authorization URL was not returned.");
            }

            window.location.href = response.data.authorization_url;

        } catch (err) {
            console.error("Connection error:", err);

            setError(
                err.response?.data?.detail ||
                err.message ||
                "Unable to start Google Health authorization."
            );

            setConnecting(false);
        }
    };

    // Synchronize daily steps
    const syncSteps = async () => {
        try {
            setSyncingSteps(true);
            setError("");
            setMessage("");

            const response = await API.post(
                "/google-health/sync-steps"
            );

            setSteps(response.data.steps_count);
            setMessage("Daily steps synchronized successfully!");

        } catch (err) {
            console.error("Steps sync error:", err);

            setError(
                err.response?.data?.detail ||
                "Unable to synchronize daily steps."
            );
        } finally {
            setSyncingSteps(false);
        }
    };

    // Synchronize daily activity
    const syncActivity = async () => {
        try {
            setSyncingActivity(true);
            setError("");
            setMessage("");

            const response = await API.post(
                "/google-health/sync-activity"
            );

            setActiveMinutes(response.data.active_minutes);
            setActiveCalories(response.data.active_calories);

            setMessage("Activity data synchronized successfully!");

        } catch (err) {
            console.error("Activity sync error:", err);

            setError(
                err.response?.data?.detail ||
                "Unable to synchronize activity data."
            );
        } finally {
            setSyncingActivity(false);
        }
    };

    if (loading) {
        return (
            <div className="google-health-container">
                <p>Loading Google Health information...</p>
            </div>
        );
    }

    return (
        <div className="google-health-container">
            <div className="google-health-card">

                <h1>Google Health Integration</h1>

                <p>
                    Connect your Google Health account to synchronize
                    your daily fitness data with FitTrack.
                </p>

                {error && (
                    <div className="google-health-error">
                        {error}
                    </div>
                )}

                {message && (
                    <div className="google-health-success">
                        {message}
                    </div>
                )}

                <div className="google-health-status">
                    <h3>Connection Status</h3>

                    <span className={connected ? "connected" : "disconnected"}>
                        {connected ? "Connected" : "Not Connected"}
                    </span>
                </div>

                {!connected ? (
                    <button
                        className="google-health-connect-btn"
                        onClick={connectGoogleHealth}
                        disabled={connecting}
                    >
                        {connecting
                            ? "Connecting..."
                            : "Connect Google Health"}
                    </button>
                ) : (
                    <>
                        <div className="google-health-sync">
                            <button
                                className="google-health-sync-btn"
                                onClick={syncSteps}
                                disabled={syncingSteps}
                            >
                                {syncingSteps
                                    ? "Synchronizing Steps..."
                                    : "Sync Daily Steps"}
                            </button>

                            <button
                                className="google-health-sync-btn"
                                onClick={syncActivity}
                                disabled={syncingActivity}
                            >
                                {syncingActivity
                                    ? "Synchronizing Activity..."
                                    : "Sync Activity Data"}
                            </button>
                        </div>

                        <div className="google-health-results">

                            {steps !== null && (
                                <div className="google-health-steps">
                                    <h2>{steps.toLocaleString()}</h2>
                                    <p>Daily Steps</p>
                                </div>
                            )}

                            {activeMinutes !== null && (
                                <div className="google-health-steps">
                                    <h2>{activeMinutes}</h2>
                                    <p>Active Minutes</p>
                                </div>
                            )}

                            {activeCalories !== null && (
                                <div className="google-health-steps">
                                    <h2>{Number(activeCalories).toLocaleString()}</h2>
                                    <p>Active Calories Burned (kcal)</p>
                                </div>
                            )}

                        </div>
                    </>
                )}

            </div>
        </div>
    );
};

export default GoogleHealth;