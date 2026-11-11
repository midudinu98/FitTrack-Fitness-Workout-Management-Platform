import { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";

function StreakTracking() {
  const [streak, setStreak] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStreak();
  }, []);

  const fetchStreak = async () => {
    try {
      const response = await API.get("/streaks/");
      setStreak(response.data);
    } catch (err) {
      setError("Unable to load streak information.");
    } finally {
      setLoading(false);
    }
  };

  const milestones = [
    { days: 3, title: "Getting Started", emoji: "🌱" },
    { days: 7, title: "One Week Strong", emoji: "🔥" },
    { days: 14, title: "Two Week Champion", emoji: "🏅" },
    { days: 30, title: "Monthly Legend", emoji: "🏆" },
  ];

  if (loading) {
    return <div className="streak-page">Loading streak...</div>;
  }

  if (error) {
    return <div className="streak-page">{error}</div>;
  }

  return (
    <div className="streak-page">
      <div className="streak-header">
        <h1>🔥 Workout Streak Tracking</h1>
        <p>Stay consistent. Build your fitness habit.</p>
      </div>

      <div className="streak-stats">
        <div className="streak-card current">
          <h2>🔥</h2>
          <h3>{streak.current_streak}</h3>
          <p>Current Streak</p>
          <span>Consecutive workout days</span>
        </div>

        <div className="streak-card longest">
          <h2>🏆</h2>
          <h3>{streak.longest_streak}</h3>
          <p>Longest Streak</p>
          <span>Your personal record</span>
        </div>
      </div>

      <div className="streak-last-workout">
        <h3>Last Workout Date</h3>
        <p>
          {streak.last_workout_date
            ? new Date(streak.last_workout_date + "T00:00:00").toLocaleDateString()
            : "No workouts recorded yet"}
        </p>
      </div>

      <div className="streak-achievements">
        <h2>🏅 Streak Achievements</h2>
        <p>Complete consecutive workout days to unlock achievements.</p>

        <div className="achievement-grid">
          {milestones.map((milestone) => {
            const achieved =
              streak.longest_streak >= milestone.days;

            return (
              <div
                className={`achievement-card ${
                  achieved ? "achieved" : "locked"
                }`}
                key={milestone.days}
              >
                <h2>{milestone.emoji}</h2>
                <h3>{milestone.title}</h3>
                <p>{milestone.days} Days</p>
                <span>
                  {achieved ? "✓ Unlocked" : "🔒 Locked"}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <Link to="/dashboard" className="dashboard-button">
        Back to Dashboard
      </Link>
    </div>
  );
}

export default StreakTracking;