import React from "react";
import { Navigate, Outlet } from "react-router-dom";

import useAuth from "../hooks/useAuth";

const AdminRoute = () => {
  const auth = useAuth();

  const user = auth?.user;

  const authLoading =
    typeof auth?.isLoading === "boolean"
      ? auth.isLoading
      : auth?.loading;

  // =====================================================
  // LOADING
  // =====================================================

  if (authLoading) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-green-50">
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-emerald-200/30 blur-3xl" />

        <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-green-200/30 blur-3xl" />

        <div className="relative z-10 text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-600" />

          <p className="mt-4 text-sm font-semibold text-slate-600">
            Checking administrator access...
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // NOT LOGGED IN
  // =====================================================

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // =====================================================
  // NOT ADMIN
  // =====================================================

  if (user.role !== "admin") {
    return <Navigate to="/student" replace />;
  }

  // =====================================================
  // ADMIN
  // =====================================================

  return <Outlet />;
};

export default AdminRoute;