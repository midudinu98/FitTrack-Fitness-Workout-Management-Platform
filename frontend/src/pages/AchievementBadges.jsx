import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

function AchievementBadges() {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [popupBadge, setPopupBadge] = useState(null);

  useEffect(() => {
    fetchBadges();
  }, []);

  const fetchBadges = async () => {
    try {
      const response = await API.get("/badges/");
      const badgeData = response.data;

      setBadges(badgeData);

      // Check for newly earned badges
      const seenBadges = JSON.parse(
        localStorage.getItem("seenBadges") || "[]"
      );

      const newBadge = badgeData.find(
        (item) =>
          item.earned && !seenBadges.includes(item.badge.id)
      );

      if (newBadge) {
        setPopupBadge(newBadge.badge);
      }

      // Store earned badge IDs
      const earnedIds = badgeData
        .filter((item) => item.earned)
        .map((item) => item.badge.id);

      localStorage.setItem(
        "seenBadges",
        JSON.stringify([...new Set([...seenBadges, ...earnedIds])])
      );
    } catch (err) {
      setError("Unable to load achievement badges.");
    } finally {
      setLoading(false);
    }
  };

  const closePopup = () => {
    setPopupBadge(null);
  };

  const earnedCount = badges.filter(
    (item) => item.earned
  ).length;

  if (loading) {
    return <div className="badge-page">Loading badges...</div>;
  }

  if (error) {
    return <div className="badge-page">{error}</div>;
  }

  return (
    <div className="badge-page">

      <div className="badge-header">
        <h1>🏆 Achievement Badges</h1>
        <p>Celebrate your fitness milestones!</p>
      </div>

      <div className="badge-summary">
        <h2>{earnedCount} / {badges.length}</h2>
        <p>Badges Earned</p>
      </div>

      <div className="badge-grid">
        {badges.map((item) => (
          <div
            key={item.badge.id}
            className={`badge-card ${
              item.earned ? "badge-earned" : "badge-locked"
            }`}
          >
            <div className="badge-icon">
              {item.badge.icon}
            </div>

            <h3>{item.badge.name}</h3>

            <p>{item.badge.description}</p>

            {item.earned ? (
              <>
                <span className="badge-status">
                  ✓ Earned
                </span>

                <small>
                  {item.earned_at
                    ? new Date(item.earned_at).toLocaleDateString()
                    : ""}
                </small>
              </>
            ) : (
              <span className="badge-status">
                🔒 Locked
              </span>
            )}
          </div>
        ))}
      </div>

      <Link to="/dashboard" className="dashboard-button">
        Back to Dashboard
      </Link>

      {popupBadge && (
        <div className="badge-popup-overlay">
          <div className="badge-popup">
            <button
              className="badge-popup-close"
              onClick={closePopup}
            >
              ×
            </button>

            <h2>🎉 Congratulations!</h2>

            <div className="badge-popup-icon">
              {popupBadge.icon}
            </div>

            <h3>{popupBadge.name}</h3>

            <p>{popupBadge.description}</p>

            <button
              className="badge-popup-button"
              onClick={closePopup}
            >
              Awesome!
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default AchievementBadges;