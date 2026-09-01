import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Link, useNavigate } from "react-router-dom";

import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  // ========================================
  // LOGIN STATE
  // ========================================

  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );


  // ========================================
  // GET USER
  // ========================================

  function getUser() {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
      return null;
    }

    try {
      return JSON.parse(savedUser);
    } catch {
      return null;
    }
  }

  const [user, setUser] = useState(getUser());

  const isAdmin = user?.role === "admin";


  // ========================================
  // SEARCH
  // ========================================

  const [search, setSearch] = useState("");


  function handleSearch(e) {
    e.preventDefault();

    const searchValue = search.trim();

    if (!searchValue) {
      navigate("/products");
      return;
    }

    navigate(
      `/products?search=${encodeURIComponent(searchValue)}`
    );
  }


  function clearSearch() {
    setSearch("");
    navigate("/products");
  }


  // ========================================
  // NOTIFICATIONS
  // ========================================

  const [notifications, setNotifications] = useState([]);


  // ========================================
  // AUTH CHANGE LISTENER
  // ========================================

  useEffect(() => {
    function updateAuth() {
      setIsLoggedIn(
        !!localStorage.getItem("token")
      );

      setUser(getUser());
    }

    window.addEventListener(
      "authChange",
      updateAuth
    );

    return () => {
      window.removeEventListener(
        "authChange",
        updateAuth
      );
    };
  }, []);


  // ========================================
  // LOAD ADMIN NOTIFICATIONS
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
          "Navbar notification error:",
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


    socket.on("connect", () => {
      console.log(
        "Navbar admin socket connected:",
        socket.id
      );

      const token =
        localStorage.getItem("token");

      socket.emit(
        "joinAdmin",
        token
      );
    });


    socket.on(
      "newOrder",
      (notification) => {

        console.log(
          "Navbar received new order:",
          notification
        );

        setNotifications(
          (previous) => [
            {
              ...notification,
              read: false
            },
            ...previous
          ]
        );
      }
    );


    socket.on("disconnect", () => {
      console.log(
        "Navbar admin socket disconnected"
      );
    });


    return () => {
      socket.disconnect();
    };

  }, [isAdmin]);


  // ========================================
  // UNREAD COUNT
  // ========================================

  const unreadCount =
    notifications.filter(
      (notification) =>
        !notification.read
    ).length;


  // ========================================
  // LOGOUT
  // ========================================

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setIsLoggedIn(false);
    setUser(null);
    setNotifications([]);

    window.dispatchEvent(
      new Event("authChange")
    );

    navigate("/");
  }


  // ========================================
  // NAVBAR
  // ========================================

  return (
    <nav className="navbar">

      {/* ==================================
          LOGO
      =================================== */}

      <Link
        to="/"
        className="logo"
      >
        MyShop 🛒
      </Link>


      {/* ==================================
          SEARCH BAR
      =================================== */}

      <form
        className="navbar-search"
        onSubmit={handleSearch}
      >

        <div className="search-wrapper">

          <span className="search-icon">
            🔍
          </span>

          <input
            type="search"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search products..."
            aria-label="Search products"
          />

          {search && (
            <button
              type="button"
              className="clear-search"
              onClick={clearSearch}
              aria-label="Clear search"
            >
              ×
            </button>
          )}

        </div>


        <button
          type="submit"
          className="search-button"
        >
          Search
        </button>

      </form>


      {/* ==================================
          NAV LINKS
      =================================== */}

      <div className="nav-links">

        <Link to="/">
          Home
        </Link>

        <Link to="/products">
          Products
        </Link>

        <Link to="/cart">
          Cart
        </Link>


        {isLoggedIn ? (
          <>

            {/* Profile */}

            <Link to="/profile">
              Profile
            </Link>


            {/* Admin */}

            {isAdmin && (
              <>

                <Link to="/admin">
                  Admin
                </Link>


                {/* Notification */}

                <Link
                  to="/admin"
                  className="notification-nav-link"
                  title="Admin Notifications"
                  aria-label={
                    `Admin notifications ${unreadCount}`
                  }
                >

                  <span className="notification-bell">
                    🔔
                  </span>

                  {unreadCount > 0 && (
                    <span className="nav-notification-badge">
                      {unreadCount > 99
                        ? "99+"
                        : unreadCount}
                    </span>
                  )}

                </Link>

              </>
            )}


            {/* Logout */}

            <button
              type="button"
              className="logout-button"
              onClick={handleLogout}
            >
              Logout
            </button>

          </>
        ) : (

          <Link to="/login">
            Login
          </Link>

        )}

      </div>

    </nav>
  );
}

export default Navbar;