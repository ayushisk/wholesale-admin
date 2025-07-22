"use client";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { checkAuthStatus } from "../../features/actions/authAction.js";

const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch();
  const { isAdminLoggedIn, isInitialized } = useSelector((state) => state.auth);
  const location = useLocation();

  useEffect(() => {
    if (!isInitialized) {
      dispatch(checkAuthStatus());
    }
  }, [dispatch, isInitialized]);

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!isAdminLoggedIn) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
};

export default ProtectedRoute;
