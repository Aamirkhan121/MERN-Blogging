// src/components/ProtectedRoute.jsx

import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";


export default function ProtectedRoute({ children }) {
  const location = useLocation();

  // ❌ User not logged in
  if (!isAuthenticated()) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }} // after login redirect
      />
    );
  }

  // ✅ User logged in
  return children;
}
