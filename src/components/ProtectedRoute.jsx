import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute({ adminOnly = false }) {

  const token = localStorage.getItem("token");
  const savedUser = localStorage.getItem("user");

  // Not logged in
  if (!token || !savedUser) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }


  // Parse user
  let user;

  try {
    user = JSON.parse(savedUser);
  } catch {
    // Invalid user data
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }


  // Admin-only route
  if (
    adminOnly &&
    user.role !== "admin"
  ) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }


  // Access allowed
  return <Outlet />;
}

export default ProtectedRoute;