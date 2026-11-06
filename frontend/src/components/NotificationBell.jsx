import { useEffect, useState } from "react";
import API from "../services/api";

const NotificationBell = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [error, setError] = useState("");

    const fetchNotifications = async () => {
        try {
            const [notificationResponse, countResponse] =
                await Promise.all([
                    API.get("/notifications/"),
                    API.get("/notifications/unread-count")
                ]);

            setNotifications(notificationResponse.data);
            setUnreadCount(countResponse.data.unread_count);
            setError("");
        } catch (err) {
            setError("Unable to load notifications.");
        }
    };

    useEffect(() => {
    const initializeNotifications = async () => {
        try {
            await API.post("/notifications/reminders/daily");
        } catch (err) {
            console.error("Unable to generate daily reminder:", err);
        }

        await fetchNotifications();
    };

    initializeNotifications();
    }, []);
    
    const markAsRead = async (notification) => {
        try {
            await API.put(
                `/notifications/${notification.id}/read`,
                { is_read: !notification.is_read }
            );

            fetchNotifications();
        } catch (err) {
            setError("Unable to update notification.");
        }
    };

    const deleteNotification = async (id) => {
        try {
            await API.delete(`/notifications/${id}`);
            fetchNotifications();
        } catch (err) {
            setError("Unable to delete notification.");
        }
    };

    return (
        <div className="notification-wrapper">
            <button
                className="notification-bell"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Notifications"
            >
                🔔
                {unreadCount > 0 && (
                    <span className="notification-count">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="notification-dropdown">
                    <div className="notification-heading">
                        <h3>Notifications</h3>
                        <span>{unreadCount} unread</span>
                    </div>

                    {error && <p className="notification-error">{error}</p>}

                    {notifications.length === 0 ? (
                        <p className="no-notifications">
                            No notifications yet.
                        </p>
                    ) : (
                        <div className="notification-list">
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`notification-item ${
                                        notification.is_read ? "read" : "unread"
                                    }`}
                                >
                                    <h4>{notification.title}</h4>

                                    <p>{notification.message}</p>

                                    <div className="notification-actions">
                                        <button
                                            onClick={() => markAsRead(notification)}
                                        >
                                            {notification.is_read
                                                ? "Mark Unread"
                                                : "Mark Read"}
                                        </button>

                                        <button
                                            className="notification-delete"
                                            onClick={() =>
                                                deleteNotification(notification.id)
                                            }
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
