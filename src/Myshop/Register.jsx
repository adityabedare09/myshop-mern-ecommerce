import { useState } from "react";
import { Link } from "react-router-dom";
import "./Register.css";

function Register() {

  // Stores username
  const [username, setUsername] = useState("");

  // Stores email
  const [email, setEmail] = useState("");

  // Stores password
  const [password, setPassword] = useState("");

  // Stores confirm password
  const [confirmPassword, setConfirmPassword] = useState("");

  // Stores error message
  const [error, setError] = useState("");

  // Stores success message
  const [success, setSuccess] = useState("");


  // Runs when registration form is submitted
  async function handleRegister(e) {
    e.preventDefault();

    setError("");
    setSuccess("");

    // Frontend validation
    if (
      username.trim() === "" ||
      email.trim() === "" ||
      password.trim() === "" ||
      confirmPassword.trim() === ""
    ) {
      setError("Please fill all fields.");
      return;
    }

    // Check password match
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/users/register",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            username,
            email,
            password,
          }),
        }
      );

      // Read response as text first
      const text = await response.text();

      console.log("Status:", response.status);
      console.log("Response:", text);

      // Convert response to JSON only if possible
      let data;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(
          "Backend returned HTML instead of JSON. Check the backend route."
        );
      }

      // Backend returned an error
      if (!response.ok) {
        throw new Error(
          data.message || "Registration failed"
        );
      }

      // Success
      setSuccess("Registration successful!");

      // Clear form
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

    } catch (error) {
      console.error("Registration error:", error);
      setError(error.message);
    }
  }

  return (
    <div className="register-page">

      <div className="register-card">

        {/* Header */}
        <div className="register-header">

          <div className="register-icon">
            🛒
          </div>

          <h1>Create Account</h1>

          <p>
            Join MyShop and start shopping
          </p>

        </div>


        {/* Registration Form */}
        <form onSubmit={handleRegister}>

          {/* Username */}
          <div className="input-group">

            <label>Username</label>

            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
            />

          </div>


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


          {/* Confirm Password */}
          <div className="input-group">

            <label>Confirm Password</label>

            <input
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
            />

          </div>


          {/* Error message */}
          {error && (
            <p className="error-message">
              {error}
            </p>
          )}


          {/* Success message */}
          {success && (
            <p className="success-message">
              {success}
            </p>
          )}


          {/* Register button */}
          <button
            type="submit"
            className="register-button"
          >
            Create Account
          </button>

        </form>


        {/* Login link */}
        <div className="register-footer">

          <p>Already have an account?</p>

          <Link
            to="/login"
            className="login-link-button"
          >
            Login
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Register;