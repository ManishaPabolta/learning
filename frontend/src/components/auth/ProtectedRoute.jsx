import React from "react";
import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

import useAuth from "../../components/hooks/useAuth";
import Loader from "../common/Loader";

const ProtectedRoute = ({
  allowedRoles,
}) => {
  const {
    user,
    loading,
    isAuthenticated,
  } = useAuth();

  const location = useLocation();

  // Checking authentication
  if (loading) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-green-50">

        <div className="pointer-events-none absolute inset-0 overflow-hidden">

          <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-emerald-400/15 blur-3xl animate-pulse" />

          <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-green-400/15 blur-3xl animate-pulse [animation-delay:1s]" />

        </div>

        <div className="relative z-10 rounded-3xl border border-emerald-100 bg-white/85 px-10 py-9 shadow-2xl shadow-emerald-900/10 backdrop-blur-xl">

          <Loader />

          <p className="mt-5 text-center text-sm font-semibold text-slate-700">
            Checking authentication...
          </p>

          <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />

        </div>

      </div>
    );
  }

  // User not logged in
  if (!isAuthenticated && !user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location,
        }}
      />
    );
  }

  // Role protection
  if (
    allowedRoles &&
    allowedRoles.length > 0 &&
    !allowedRoles.includes(user?.role)
  ) {
    if (user?.role === "admin") {
      return (
        <Navigate
          to="/admin/dashboard"
          replace
        />
      );
    }

    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;