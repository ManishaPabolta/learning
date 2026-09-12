import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const Unauthorized = () => {
  const navigate = useNavigate();

  const { user } = useAuth();

  const isLoggedIn = !!user;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 text-slate-900 flex items-center justify-center px-6 relative overflow-hidden">

      {/* ================= BACKGROUND ================= */}

      <div className="absolute inset-0 pointer-events-none overflow-hidden">

        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-emerald-300/20 blur-3xl animate-pulse" />

        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-green-300/20 blur-3xl animate-pulse [animation-duration:5s]" />

        <div className="absolute top-[20%] left-[18%] w-2 h-2 bg-emerald-500 rounded-full animate-ping" />

        <div className="absolute bottom-[25%] right-[20%] w-3 h-3 bg-green-500 rounded-full animate-pulse" />

        <div className="absolute top-[35%] right-[12%] w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" />

        <div className="absolute bottom-[18%] left-[28%] w-2 h-2 bg-green-400 rounded-full animate-ping [animation-duration:3s]" />

      </div>

      {/* ================= CARD ================= */}

      <div className="relative z-10 w-full max-w-xl animate-[fadeIn_0.7s_ease-out]">

        <div className="relative rounded-[2rem] border border-emerald-100 bg-white/80 backdrop-blur-2xl p-8 sm:p-12 text-center shadow-[0_25px_80px_rgba(16,185,129,0.12)] overflow-hidden">

          {/* Top Accent */}

          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-1 bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-400 rounded-b-full" />

          {/* Card Glow */}

          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-56 h-56 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">

            {/* Icon */}

            <div className="relative mx-auto w-20 h-20">

              <div className="absolute inset-0 rounded-3xl bg-emerald-400/10 animate-ping [animation-duration:2.5s]" />

              <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-50 to-green-100 border border-emerald-200 flex items-center justify-center text-4xl shadow-lg shadow-emerald-500/10 transition-transform duration-500 hover:scale-110 hover:rotate-3">
                🔒
              </div>

            </div>

            {/* Status */}

            <p className="mt-7 text-emerald-600 text-sm font-bold uppercase tracking-[0.2em]">
              Access denied
            </p>

            <h1 className="mt-3 text-5xl sm:text-6xl font-black tracking-tight bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-700 bg-clip-text text-transparent">
              403
            </h1>

            <h2 className="mt-3 text-2xl font-bold text-slate-800">
              You don't have permission
            </h2>

            <p className="mt-4 text-slate-500 leading-7 max-w-md mx-auto">
              This area is restricted and your current
              account doesn't have the required
              permissions to access it.
            </p>

            {/* User info */}

            {isLoggedIn && (
              <div className="mt-7 flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-100 px-5 py-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-500/10">

                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center font-bold text-white shadow-md shadow-emerald-500/20">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>

                <div className="text-left">

                  <p className="text-sm font-semibold text-slate-800">
                    {user?.name || "User"}
                  </p>

                  <p className="text-xs text-slate-500">
                    Role: {user?.role || "user"}
                  </p>

                </div>

              </div>
            )}

            {/* Actions */}

            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">

              <button
                onClick={() => navigate(-1)}
                className="px-6 py-3.5 rounded-xl border border-emerald-100 bg-white text-slate-700 font-semibold transition-all duration-300 hover:bg-emerald-50 hover:border-emerald-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-500/10"
              >
                ← Go Back
              </button>

              <Link
                to={user?.role === "admin" ? "/admin" : "/student"}
                className="group px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 text-white font-bold transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/25"
              >
                My Dashboard
                <span className="inline-block ml-1 transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>

            </div>

          </div>

        </div>

      </div>

      {/* Animation */}

      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(20px) scale(0.98);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
        `}
      </style>

    </div>
  );
};

export default Unauthorized;