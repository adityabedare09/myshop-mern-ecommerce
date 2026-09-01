import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  // Stores email entered by the user
  const [email, setEmail] = useState("");

  // Stores password entered by the user
  const [password, setPassword] = useState("");

  // Stores error message
  const [error, setError] = useState("");

  // Stores success message
  const [success, setSuccess] = useState("");


  // Runs when the login form is submitted
  async function handleSubmit(e) {

    // Prevent page refresh
    e.preventDefault();

    // Clear previous messages
    setError("");
    setSuccess("");


    // =============================
    // FRONTEND VALIDATION
    // =============================

    if (email.trim() === "") {
      setError("Please enter your email.");
      return;
    }

    if (password.trim() === "") {
      setError("Please enter your password.");
      return;
    }


    try {

      // =============================
      // SEND LOGIN REQUEST
      // =============================

      const response = await fetch(
        "http://localhost:5000/api/users/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            email,
            password
          })
        }
      );


      // Read backend response
      const data = await response.json();


      // If backend returns an error
      if (!response.ok) {
        throw new Error(
          data.message || "Login failed"
        );
      }


      // =============================
      // SAVE LOGIN INFORMATION
      // =============================

      // Save JWT token
      localStorage.setItem(
        "token",
        data.token
      );

      // Save user information
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );


      // ⭐ Tell Navbar that login happened
      window.dispatchEvent(
        new Event("authChange")
      );


      // =============================
      // SUCCESS
      // =============================

      setSuccess("Login successful!");

      console.log(
        "Logged in user:",
        data.user
      );


      // =============================
      // REDIRECT
      // =============================

      setTimeout(() => {

        // Admin → Admin Dashboard
        if (data.user.role === "admin") {

          navigate("/admin");

        } else {

          // Normal user → Home
          navigate("/");

        }

      }, 500);


    } catch (error) {

      console.error(
        "Login error:",
        error
      );

      setError(error.message);

    }
  }


  return (
    <div className="login-page">

      <div className="login-card">

        {/* =============================
            HEADER
        ============================== */}

        <div className="login-header">

          <div className="login-icon">
            🛒
          </div>

          <h1>Welcome Back</h1>

          <p>
            Login to continue shopping at MyShop
          </p>

        </div>


        {/* =============================
            LOGIN FORM
        ============================== */}

        <form onSubmit={handleSubmit}>

          {/* Email */}
          <div className="input-group">

            <label>Email</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />

          </div>


          {/* Password */}
          <div className="input-group">

            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />

          </div>


          {/* Error */}
          {error && (
            <p className="error-message">
              {error}
            </p>
          )}


          {/* Success */}
          {success && (
            <p className="success-message">
              {success}
            </p>
          )}


          {/* Login button */}
          <button
            type="submit"
            className="login-button"
          >
            Login
          </button>

        </form>


        {/* =============================
            REGISTER LINK
        ============================== */}

        <div className="login-footer">

          <p>
            Don't have an account?
          </p>

          <Link
            to="/register"
            className="signup-button"
          >
            Sign Up
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Login;