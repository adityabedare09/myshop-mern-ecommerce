import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Link, useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();

  // ========================================
  // GET LOGGED-IN USER
  // ========================================


  const savedUser = localStorage.getItem("user");

  function getUser() {
    if (!savedUser) {
      return null;
    }

    try {
      return JSON.parse(savedUser);
    } catch (error) {
      console.error("Invalid user data:", error);
      return null;
    }
  }

  const user = getUser();

  const isAdmin = user?.role === "admin";


  // ========================================
  // STATE
  // ========================================

  const [notifications, setNotifications] = useState([]);

  const [stats, setStats] = useState({
    products: 0,
    users: 0,
    orders: 0,
    revenue: 0
  });

  const [statsLoading, setStatsLoading] = useState(true);


  // ========================================
  // UNREAD COUNT
  // ========================================

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;


  // ========================================
  // LOAD DASHBOARD STATS
  // ========================================

  useEffect(() => {
    if (!isAdmin) {
      return;
    }

    async function loadStats() {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:5000/api/admin/stats",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load stats"
          );
        }

        setStats({
          products: data.products ?? 0,
          users: data.users ?? 0,
          orders: data.orders ?? 0,
          revenue: data.revenue ?? 0
        });

      } catch (error) {
        console.error(
          "Dashboard stats error:",
          error
        );
      } finally {
        setStatsLoading(false);
      }
    }

    loadStats();
  }, [isAdmin]);


  // ========================================
  // LOAD SAVED NOTIFICATIONS
  // ========================================

  useEffect(() => {
    if (!isAdmin) {
      return;
    }

    async function loadNotifications() {
      try {
        const token =
          localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:5000/api/admin/notifications",
          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
            "Failed to load notifications"
          );
        }

        setNotifications(data);

      } catch (error) {
        console.error(
          "Notification load error:",
          error
        );
      }
    }

    loadNotifications();
  }, [isAdmin]);


  // ========================================
  // SOCKET.IO
  // ========================================

  useEffect(() => {
    if (!isAdmin) {
      return;
    }

    const socket = io(
      "http://localhost:5000"
    );


    // Connected
    socket.on("connect", () => {
      console.log(
        "Admin Socket connected:",
        socket.id
      );

      const token =
        localStorage.getItem("token");

      // Join admin room
      socket.emit(
        "joinAdmin",
        token
      );
    });


    // New order
    socket.on(
      "newOrder",
      (notification) => {

        console.log(
          "NEW ORDER RECEIVED:",
          notification
        );

        const newNotification = {
          ...notification,
          read: false
        };

        setNotifications(
          (previous) => [
            newNotification,
            ...previous
          ]
        );

        // Update order count
        setStats(
          (previous) => ({
            ...previous,
            orders:
              previous.orders + 1
          })
        );

      }
    );


    // Disconnect
    socket.on(
      "disconnect",
      () => {
        console.log(
          "Admin Socket disconnected"
        );
      }
    );


    // Cleanup
    return () => {
      socket.disconnect();
    };

  }, [isAdmin]);


  // ========================================
  // MARK NOTIFICATION AS READ
  // ========================================

  async function markAsRead(notificationId) {
    try {

      const token =
        localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/admin/notifications/${notificationId}/read`,
        {
          method: "PUT",

          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Failed to mark notification as read"
        );
      }

      setNotifications(
        (previous) =>
          previous.map((notification) =>
            notification._id === notificationId
              ? {
                ...notification,
                read: true
              }
              : notification
          )
      );

    } catch (error) {
      console.error(
        "Mark notification error:",
        error
      );
    }
  }


  // ========================================
  // DELETE NOTIFICATION
  // ========================================

  async function deleteNotification(notificationId) {
    try {

      const token =
        localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/admin/notifications/${notificationId}`,
        {
          method: "DELETE",

          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Failed to delete notification"
        );
      }

      setNotifications(
        (previous) =>
          previous.filter(
            (notification) =>
              notification._id !== notificationId
          )
      );

    } catch (error) {
      console.error(
        "Delete notification error:",
        error
      );
    }
  }


  // ========================================
  // ADMIN CHECK
  // ========================================

  if (!isAdmin) {

    return (
      <div className="admin-page">

        <div className="admin-card">

          <h1>
            Access Denied
          </h1>

          <p>
            You don't have permission to access
            the admin dashboard.
          </p>

          <button
            type="button"
            onClick={() => navigate("/")}
          >
            Go Home
          </button>

        </div>

      </div>
    );
  }


  // ========================================
  // DASHBOARD
  // ========================================

  return (
    <div className="admin-page">

      {/* =====================================
          HEADER
      ====================================== */}

      <div className="admin-header">

        <div>

          <span className="admin-label">
            ADMIN PANEL
          </span>

          <h1>
            Admin Dashboard
          </h1>

          <p>
            Welcome, {user.username}
          </p>

        </div>

      </div>


      {/* =====================================
          STATISTICS
      ====================================== */}

      <div className="stats-grid">

        <div className="stat-card">

          <span>
            📦
          </span>

          <p>
            Total Products
          </p>

          <h2>
            {statsLoading
              ? "..."
              : stats.products}
          </h2>

        </div>


        <div className="stat-card">

          <span>
            👥
          </span>

          <p>
            Total Users
          </p>

          <h2>
            {statsLoading
              ? "..."
              : stats.users}
          </h2>

        </div>


        <div className="stat-card">

          <span>
            🛒
          </span>

          <p>
            Total Orders
          </p>

          <h2>
            {statsLoading
              ? "..."
              : stats.orders}
          </h2>

        </div>


        <div className="stat-card">

          <span>
            💰
          </span>

          <p>
            Total Revenue
          </p>

          <h2>
            {statsLoading
              ? "..."
              : `₹${Number(
                stats.revenue
              ).toLocaleString("en-IN")}`}
          </h2>

        </div>

      </div>


      {/* =====================================
          ADMIN CARDS
      ====================================== */}

      <div className="admin-grid">


        {/* PRODUCTS */}

        <Link
          to="/admin/products"
          className="admin-card"
        >

          <div className="admin-icon">
            📦
          </div>

          <h2>
            Products
          </h2>

          <p>
            Add, update and delete products.
          </p>

        </Link>


        {/* ORDERS */}

        <Link
          to="/admin/orders"
          className="admin-card"
        >

          <div className="admin-icon">
            🛒
          </div>

          <h2>
            Orders
          </h2>

          <p>
            View and manage customer orders.
          </p>

        </Link>


        {/* USERS */}

        <Link
          to="/admin/users"
          className="admin-card"
        >

          <div className="admin-icon">
            👥
          </div>

          <h2>
            Users
          </h2>

          <p>
            View registered users.
          </p>

        </Link>


        {/* =====================================
            NOTIFICATIONS
        ====================================== */}

        <div className="admin-card">

          <div className="admin-icon">
            🔔
          </div>

          <h2>

            Notifications
            {unreadCount > 0 && (
              <button
                type="button"
                className="mark-all-button"
                onClick={async () => {
                  try {
                    const token =
                      localStorage.getItem("token");

                    const response = await fetch(
                      "http://localhost:5000/api/admin/notifications/read-all",
                      {
                        method: "PUT",
                        headers: {
                          Authorization:
                            `Bearer ${token}`
                        }
                      }
                    );

                    const data = await response.json();

                    if (!response.ok) {
                      throw new Error(
                        data.message ||
                        "Failed to mark notifications as read"
                      );
                    }

                    setNotifications(
                      (previous) =>
                        previous.map(
                          (notification) => ({
                            ...notification,
                            read: true
                          })
                        )
                    );

                  } catch (error) {
                    console.error(
                      "Mark all read error:",
                      error
                    );
                  }
                }}
              >
                Mark All Read
              </button>
            )}

            {unreadCount > 0 && (
              <span className="notification-badge">
                {unreadCount}
              </span>
            )}

          </h2>


          {notifications.length === 0 ? (

            <p>
              No new orders.
            </p>

          ) : (

            <div className="notification-list">

              {notifications.map(
                (notification) => (

                  <div
                    className={
                      `notification-item ${notification.read
                        ? "read"
                        : "unread"
                      }`
                    }
                    key={notification._id}
                  >

                    <div className="notification-content">

                      <strong>
                        🔔 New Order
                      </strong>

                      <p>
                        Customer:{" "}
                        {notification.customer}
                      </p>

                      <p>
                        Amount: ₹
                        {Number(
                          notification.totalAmount
                        ).toLocaleString("en-IN")}
                      </p>

                      <p>
                        Order ID:{" "}
                        {notification.orderId ||
                          notification.order?._id ||
                          notification.order}
                      </p>

                    </div>


                    <div className="notification-actions">

                      {!notification.read && (
                        <button
                          type="button"
                          onClick={() =>
                            markAsRead(
                              notification._id
                            )
                          }
                        >
                          Mark Read
                        </button>
                      )}


                      <button
                        type="button"
                        onClick={() =>
                          deleteNotification(
                            notification._id
                          )
                        }
                      >
                        Clear
                      </button>

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default AdminDashboard;