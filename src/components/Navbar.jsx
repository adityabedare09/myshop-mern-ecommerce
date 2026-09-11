import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import "./Navbar.css";
import API_URL from "../config";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  // ========================================
  // LOGIN STATE
  // ========================================

  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  // ========================================
  // MOBILE MENU
  // ========================================

  const [menuOpen, setMenuOpen] = useState(false);

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
      setMenuOpen(false);
      return;
    }

    navigate(
      `/products?search=${encodeURIComponent(
        searchValue
      )}`
    );

    setMenuOpen(false);
  }

  function clearSearch() {
    setSearch("");
    navigate("/products");
    setMenuOpen(false);
  }

  // ========================================
  // NOTIFICATIONS
  // ========================================

  const [notifications, setNotifications] = useState(
    []
  );

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

        if (!token) {
          return;
        }

        const response = await fetch(
          `${API_URL}/api/admin/notifications`,
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
              "Failed to load notifications"
          );
        }

        setNotifications(
          Array.isArray(data) ? data : []
        );
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

    const socket = io(API_URL);

    socket.on("connect", () => {
      console.log(
        "Navbar admin socket connected:",
        socket.id
      );

      const token =
        localStorage.getItem("token");

      if (token) {
        socket.emit(
          "joinAdmin",
          token
        );
      }
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
              read: false,
            },
            ...previous,
          ]
        );
      }
    );

    socket.on("disconnect", () => {
      console.log(
        "Navbar admin socket disconnected"
      );
    });

    socket.on(
      "connect_error",
      (error) => {
        console.error(
          "Navbar socket connection error:",
          error.message
        );
      }
    );

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
    setMenuOpen(false);

    window.dispatchEvent(
      new Event("authChange")
    );

    navigate("/");
  }

  // ========================================
  // ACTIVE LINK
  // ========================================

  function isActive(path) {
    if (path === "/") {
      return location.pathname === "/";
    }

    return location.pathname.startsWith(path);
  }

  // ========================================
  // CLOSE MOBILE MENU
  // ========================================

  function closeMenu() {
    setMenuOpen(false);
  }

  // ========================================
  // NAVBAR
  // ========================================

  return (
    <header className="navbar">
      {/* ==================================
          NAVBAR MAIN
      =================================== */}

      <div className="navbar-inner">
        {/* LOGO */}

        <Link
          to="/"
          className="logo"
          onClick={closeMenu}
        >
          <span className="logo-icon">
            🛒
          </span>

          <span className="logo-text">
            MyShop
          </span>
        </Link>

        {/* DESKTOP SEARCH */}

        <form
          className="navbar-search desktop-search"
          onSubmit={handleSearch}
        >
          <div className="search-wrapper">
            <span
              className="search-icon"
              aria-hidden="true"
            >
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

        {/* DESKTOP NAV */}

        <nav className="nav-links">
          <Link
            to="/"
            className={
              isActive("/")
                ? "nav-link active"
                : "nav-link"
            }
          >
            Home
          </Link>

          <Link
            to="/products"
            className={
              isActive("/products")
                ? "nav-link active"
                : "nav-link"
            }
          >
            Products
          </Link>

          <Link
            to="/cart"
            className={
              isActive("/cart")
                ? "nav-link active"
                : "nav-link"
            }
          >
            Cart
          </Link>

          {isLoggedIn ? (
            <>
              <Link
                to="/profile"
                className={
                  isActive("/profile")
                    ? "nav-link active"
                    : "nav-link"
                }
              >
                Profile
              </Link>

              {isAdmin && (
                <>
                  <Link
                    to="/admin"
                    className={
                      isActive("/admin")
                        ? "nav-link active"
                        : "nav-link"
                    }
                  >
                    Admin
                  </Link>

                  <Link
                    to="/admin"
                    className="notification-nav-link"
                    title="Admin Notifications"
                    aria-label={`Admin notifications ${unreadCount}`}
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

              <button
                type="button"
                className="logout-button"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="login-button"
            >
              Login
            </Link>
          )}
        </nav>

        {/* MOBILE MENU BUTTON */}

        <button
          type="button"
          className={`mobile-menu-button ${
            menuOpen ? "open" : ""
          }`}
          onClick={() =>
            setMenuOpen(
              (previous) => !previous
            )
          }
          aria-label={
            menuOpen
              ? "Close menu"
              : "Open menu"
          }
          aria-expanded={menuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* ==================================
          MOBILE MENU
      =================================== */}

      <div
        className={`mobile-menu ${
          menuOpen ? "show" : ""
        }`}
      >
        {/* Mobile Search */}

        <form
          className="navbar-search mobile-search"
          onSubmit={handleSearch}
        >
          <div className="search-wrapper">
            <span
              className="search-icon"
              aria-hidden="true"
            >
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

        {/* Mobile Navigation */}

        <nav className="mobile-nav-links">
          <Link
            to="/"
            onClick={closeMenu}
          >
            <span>⌂</span>
            Home
          </Link>

          <Link
            to="/products"
            onClick={closeMenu}
          >
            <span>🛍️</span>
            Products
          </Link>

          <Link
            to="/cart"
            onClick={closeMenu}
          >
            <span>🛒</span>
            Cart
          </Link>

          {isLoggedIn ? (
            <>
              <Link
                to="/profile"
                onClick={closeMenu}
              >
                <span>👤</span>
                Profile
              </Link>

              {isAdmin && (
                <>
                  <Link
                    to="/admin"
                    onClick={closeMenu}
                  >
                    <span>⚙️</span>
                    Admin
                  </Link>

                  <Link
                    to="/admin"
                    onClick={closeMenu}
                  >
                    <span className="mobile-notification-icon">
                      🔔

                      {unreadCount > 0 && (
                        <span className="mobile-notification-badge">
                          {unreadCount > 99
                            ? "99+"
                            : unreadCount}
                        </span>
                      )}
                    </span>

                    Notifications
                  </Link>
                </>
              )}

              <button
                type="button"
                className="mobile-logout-button"
                onClick={handleLogout}
              >
                <span>↪</span>
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              onClick={closeMenu}
            >
              <span>🔐</span>
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;