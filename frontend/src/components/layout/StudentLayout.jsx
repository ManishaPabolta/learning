import React from "react";
import { Navigate, Outlet } from "react-router-dom";

import DashboardLayout from "./DashboardLayout";
import useAuth from "../../hooks/useAuth";

const StudentLayout = () => {
  const { user, isLoading } = useAuth();

  // Loading
  if (isLoading) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-green-50">
        {/* Background decorations */}
        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-emerald-200/30 blur-3xl animate-[float_6s_ease-in-out_infinite]" />

        <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-green-200/30 blur-3xl animate-[floatReverse_7s_ease-in-out_infinite]" />

        <div className="relative z-10 text-center">
          {/* Loader */}
          <div className="relative mx-auto flex h-20 w-20 items-center justify-center">
            <div className="absolute inset-0 rounded-3xl border-4 border-emerald-100" />

            <div className="absolute inset-0 animate-spin rounded-3xl border-4 border-transparent border-t-emerald-500 border-r-green-500" />

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-700 text-xl text-white shadow-lg shadow-emerald-500/25 animate-[loaderPulse_2s_ease-in-out_infinite]">
              🎓
            </div>
          </div>

          {/* Text */}
          <div className="mt-6 animate-[fadeUp_500ms_ease-out]">
            <h2 className="text-lg font-extrabold tracking-tight text-slate-800">
              Preparing your{" "}
              <span className="bg-gradient-to-r from-emerald-500 to-green-600 bg-clip-text text-transparent">
                Learning Hub
              </span>
            </h2>

            <p className="mt-2 text-sm font-medium text-slate-400">
              Loading your dashboard...
            </p>
          </div>

          {/* Loading dots */}
          <div className="mt-5 flex justify-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-[loadingDot_1.2s_ease-in-out_infinite]" />
            <span
              className="h-2 w-2 rounded-full bg-emerald-400 animate-[loadingDot_1.2s_ease-in-out_200ms_infinite]"
            />
            <span
              className="h-2 w-2 rounded-full bg-green-500 animate-[loadingDot_1.2s_ease-in-out_400ms_infinite]"
            />
          </div>
        </div>

        <style>
          {`
            @keyframes float {
              0%,
              100% {
                transform: translate(0, 0);
              }

              50% {
                transform: translate(20px, 20px);
              }
            }

            @keyframes floatReverse {
              0%,
              100% {
                transform: translate(0, 0);
              }

              50% {
                transform: translate(-20px, -15px);
              }
            }

            @keyframes loaderPulse {
              0%,
              100% {
                transform: scale(1);
              }

              50% {
                transform: scale(1.08);
              }
            }

            @keyframes fadeUp {
              0% {
                opacity: 0;
                transform: translateY(10px);
              }

              100% {
                opacity: 1;
                transform: translateY(0);
              }
            }

            @keyframes loadingDot {
              0%,
              100% {
                transform: translateY(0);
                opacity: 0.4;
              }

              50% {
                transform: translateY(-5px);
                opacity: 1;
              }
            }
          `}
        </style>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Admin cannot access student dashboard
  if (user.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  // Student dashboard layout + child pages
  return (
    <DashboardLayout role="user">
      <Outlet />
    </DashboardLayout>
  );
};

export default StudentLayout;