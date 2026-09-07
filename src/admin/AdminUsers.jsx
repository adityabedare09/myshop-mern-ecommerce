import { useEffect, useState } from "react";
import "./AdminUsers.css";
import API_URL from "../config";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // ========================================
  // LOAD USERS
  // ========================================

  useEffect(() => {
    async function loadUsers() {
      try {
        setLoading(true);
        setError("");

        const token =
          localStorage.getItem("token");

        if (!token) {
          throw new Error(
            "Please login as an admin."
          );
        }

        const response = await fetch(
          `${API_URL}/api/admin/users`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const text = await response.text();

        let data;

        try {
          data = JSON.parse(text);
        } catch {
          throw new Error(
            "Backend returned an invalid response."
          );
        }

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to fetch users"
          );
        }

        setUsers(
          Array.isArray(data) ? data : []
        );
      } catch (error) {
        console.error(
          "Users error:",
          error
        );

        setError(
          error.message ||
            "Failed to fetch users"
        );
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, []);

  // ========================================
  // DELETE USER
  // ========================================

  async function handleDelete(userId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setMessage("");

      const token =
        localStorage.getItem("token");

      if (!token) {
        throw new Error(
          "Please login as an admin."
        );
      }

      const response = await fetch(
        `${API_URL}/api/admin/users/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const text = await response.text();

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        data = {};
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to delete user"
        );
      }

      setMessage(
        "User deleted successfully!"
      );

      // Remove from current UI
      setUsers((previousUsers) =>
        previousUsers.filter(
          (user) => user._id !== userId
        )
      );
    } catch (error) {
      console.error(
        "Delete user error:",
        error
      );

      setError(
        error.message ||
          "Failed to delete user"
      );
    }
  }

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <div className="admin-users-page">
        <div className="admin-users-container">
          <p className="admin-users-loading">
            Loading users...
          </p>
        </div>
      </div>
    );
  }

  // ========================================
  // PAGE
  // ========================================

  return (
    <div className="admin-users-page">
      <div className="admin-users-container">

        {/* Header */}

        <div className="admin-users-header">
          <span className="admin-label">
            ADMIN PANEL
          </span>

          <h1>User Management</h1>

          <p>
            View and manage registered users.
          </p>
        </div>

        {/* Messages */}

        {message && (
          <div className="admin-users-success">
            {message}
          </div>
        )}

        {error && (
          <div className="admin-users-error">
            {error}
          </div>
        )}

        {/* User count */}

        <div className="users-count-card">
          <strong>
            {users.length}
          </strong>

          <span>
            Registered Users
          </span>
        </div>

        {/* Users */}

        {users.length === 0 ? (
          <div className="no-users">
            <div>👥</div>

            <h2>
              No users found
            </h2>

            <p>
              Registered users will appear
              here.
            </p>
          </div>
        ) : (
          <div className="users-list">
            {users.map((user) => (
              <div
                className="user-card"
                key={user._id}
              >

                <div className="user-avatar">
                  {user.username
                    ?.charAt(0)
                    .toUpperCase()}
                </div>

                <div className="user-info">
                  <h2>
                    {user.username}
                  </h2>

                  <p>
                    {user.email}
                  </p>

                  <span
                    className={
                      user.role === "admin"
                        ? "user-role admin-role"
                        : "user-role"
                    }
                  >
                    {user.role}
                  </span>
                </div>

                <div className="user-actions">
                  <span className="user-date">
                    Joined{" "}
                    {user.createdAt
                      ? new Date(
                          user.createdAt
                        ).toLocaleDateString(
                          "en-IN"
                        )
                      : "N/A"}
                  </span>

                  {user.role !== "admin" && (
                    <button
                      type="button"
                      className="delete-user-button"
                      onClick={() =>
                        handleDelete(
                          user._id
                        )
                      }
                    >
                      Delete
                    </button>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default AdminUsers;