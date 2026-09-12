import { Navigate, Outlet, useLocation } from "react-router-dom";

import useAuth from "../hooks/useAuth";

const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-green-50">
        {/* Ambient background */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-emerald-400/15 blur-3xl animate-pulse" />

          <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-green-400/15 blur-3xl animate-pulse [animation-delay:1s]" />

          <div className="absolute left-[18%] top-[30%] h-2 w-2 rounded-full bg-emerald-400 animate-ping" />

          <div className="absolute right-[18%] bottom-[30%] h-1.5 w-1.5 rounded-full bg-lime-400 animate-pulse [animation-delay:800ms]" />
        </div>

        <div className="relative z-10 rounded-3xl border border-emerald-100 bg-white/80 px-10 py-9 shadow-2xl shadow-emerald-900/10 backdrop-blur-xl animate-[fadeIn_0.5s_ease-out]">
          <div className="relative mx-auto h-12 w-12">
            <div className="absolute inset-0 rounded-full border-4 border-emerald-100" />

            <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-emerald-500 border-r-green-500" />

            <div className="absolute inset-2 rounded-full bg-emerald-500/10 animate-pulse" />
          </div>

          <p className="mt-5 text-center text-sm font-semibold tracking-wide text-slate-700">
            Checking authentication...
          </p>

          <p className="mt-1 text-center text-xs text-slate-400">
            Securing your session
          </p>

          <div className="mx-auto mt-6 h-1 w-20 rounded-full bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;