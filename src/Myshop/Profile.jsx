import { Link } from "react-router-dom";
import "./Profile.css";

function Profile() {

  const savedUser = localStorage.getItem("user");

  console.log("Saved user:", savedUser);

  if (!savedUser) {
    return (
      <div className="profile-page">
        <div className="profile-card">
          <h1>You're not logged in</h1>

          <Link to="/login">
            Login
          </Link>
        </div>
      </div>
    );
  }

  const user = JSON.parse(savedUser);

  return (
    <div className="profile-page">

      <div className="profile-card">

        <div className="profile-avatar">
          {user.username?.charAt(0).toUpperCase()}
        </div>

        <h1>{user.username}</h1>

        <p className="profile-email">
          {user.email}
        </p>

        <div className="profile-info">

          <div className="profile-row">
            <span>Username</span>
            <strong>{user.username}</strong>
          </div>

          <div className="profile-row">
            <span>Email</span>
            <strong>{user.email}</strong>
          </div>

        </div>

        <Link
          to="/products"
          className="profile-button"
        >
          Continue Shopping
        </Link>

      </div>

    </div>
  );
}

export default Profile;