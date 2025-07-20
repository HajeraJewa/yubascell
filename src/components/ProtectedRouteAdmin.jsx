import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRouteAdmin = ({ children }) => {
  const { user, role } = useAuth();

  if (!user) {
    // 🚫 Belum login → redirect ke login
    return <Navigate to="/login" replace />;
  }

  if (role !== "admin") {
    // 🚫 Bukan admin → redirect ke home
    return <Navigate to="/" replace />;
  }

  // ✅ Admin → boleh masuk
  return children;
};

export default ProtectedRouteAdmin;
