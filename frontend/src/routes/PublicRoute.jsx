import { Navigate, Outlet } from "react-router-dom";

import useAuth from "../hooks/useAuth";

const PublicRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-green-50">
        {/* Ambient background */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-emerald-400/15 blur-3xl animate-pulse" />

          <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-green-400/15 blur-3xl animate-pulse [animation-delay:1s]" />

          <div className="absolute left-[20%] top-[28%] h-2 w-2 rounded-full bg-emerald-400 animate-ping" />

          <div className="absolute right-[22%] top-[35%] h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse [animation-delay:600ms]" />

          <div className="absolute bottom-[25%] left-[28%] h-1.5 w-1.5 rounded-full bg-lime-400 animate-pulse [animation-delay:1.2s]" />
        </div>

        <div className="relative z-10 rounded-3xl border border-emerald-100 bg-white/80 px-10 py-9 text-center shadow-2xl shadow-emerald-900/10 backdrop-blur-xl animate-[fadeIn_0.5s_ease-out]">
          <div className="relative mx-auto h-12 w-12">
            <div className="absolute inset-0 rounded-full border-4 border-emerald-100" />

            <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-emerald-500 border-r-green-500" />

            <div className="absolute inset-2 rounded-full bg-gradient-to-br from-emerald-500 to-green-500 opacity-10 animate-pulse" />
          </div>

          <p className="mt-5 text-sm font-semibold tracking-wide text-slate-700">
            Loading SkillForge...
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Preparing your experience
          </p>

          <div className="mx-auto mt-6 h-1 w-20 rounded-full bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
        </div>
      </div>
    );
  }

  if (user) {
    if (user.role === "admin") {
      return <Navigate to="/admin" replace />;
    }

    return <Navigate to="/student" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;