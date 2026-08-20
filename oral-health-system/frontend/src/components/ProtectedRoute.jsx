import React from "react";
import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

import {
  getStoredToken,
  getStoredUser,
} from "../api/authStorage";

export default function ProtectedRoute({
  allowedRoles = [],
}) {
  const location = useLocation();

  const token = getStoredToken();
  const user = getStoredUser();

  if (!token || !user) {
    const loginPath = allowedRoles.includes("admin")
      ? "/admin/login"
      : "/login";

    return (
      <Navigate
        to={loginPath}
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  if (
    allowedRoles.length > 0 &&
    !allowedRoles.includes(user.role)
  ) {
    const correctDashboard =
      user.role === "admin"
        ? "/admin/dashboard"
        : "/dashboard";

    return (
      <Navigate
        to={correctDashboard}
        replace
      />
    );
  }

  return <Outlet />;
}