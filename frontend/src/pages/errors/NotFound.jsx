import { Link, useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 text-slate-900 flex items-center justify-center px-6 relative overflow-hidden">

      {/* ================= BACKGROUND ================= */}

      <div className="absolute inset-0 pointer-events-none overflow-hidden">

        <div className="absolute top-[-150px] left-[-150px] w-[450px] h-[450px] rounded-full bg-emerald-300/20 blur-3xl animate-pulse" />

        <div className="absolute bottom-[-150px] right-[-150px] w-[450px] h-[450px] rounded-full bg-green-300/20 blur-3xl animate-pulse [animation-duration:5s]" />

        <div className="absolute top-[25%] right-[15%] w-3 h-3 rounded-full bg-emerald-500 animate-ping" />

        <div className="absolute bottom-[25%] left-[15%] w-2 h-2 rounded-full bg-green-500 animate-pulse" />

        <div className="absolute top-[18%] left-[30%] w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" />

        <div className="absolute bottom-[18%] right-[30%] w-2 h-2 rounded-full bg-green-400 animate-ping [animation-duration:3s]" />

      </div>

      {/* ================= CONTENT ================= */}

      <div className="relative z-10 w-full max-w-2xl text-center animate-[fadeIn_0.8s_ease-out]">

        {/* 404 */}

        <div className="relative">

          <h1 className="text-[120px] sm:text-[180px] md:text-[220px] leading-none font-black tracking-tighter bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-700 bg-clip-text text-transparent animate-pulse">
            404
          </h1>

          {/* Decorative rings */}

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 sm:w-56 sm:h-56 border border-emerald-400/20 rounded-full animate-spin [animation-duration:12s]" />

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 sm:w-40 sm:h-40 border border-green-400/20 rounded-full animate-spin [animation-duration:8s] [animation-direction:reverse]" />

          {/* Small orbit dot */}

          <div className="absolute top-1/2 left-1/2 w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/40 animate-pulse" />

        </div>

        {/* Icon */}

        <div className="mx-auto -mt-4 w-16 h-16 rounded-2xl bg-white/80 border border-emerald-100 backdrop-blur-xl flex items-center justify-center text-3xl shadow-xl shadow-emerald-500/10 animate-bounce transition-transform duration-300 hover:scale-110">
          🧭
        </div>

        <h2 className="mt-7 text-3xl sm:text-4xl font-bold text-slate-800">
          Page not found
        </h2>

        <p className="mt-4 text-slate-500 max-w-lg mx-auto leading-7">
          The page you're looking for doesn't exist,
          has been moved, or the URL might be incorrect.
        </p>

        {/* Buttons */}

        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">

          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3.5 rounded-xl border border-emerald-100 bg-white text-slate-700 font-semibold transition-all duration-300 hover:bg-emerald-50 hover:border-emerald-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-500/10"
          >
            ← Go Back
          </button>

          <Link
            to="/"
            className="group px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 text-white font-bold transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/25"
          >
            Go to Homepage
            <span className="inline-block ml-1 transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>

        </div>

        {/* Footer */}

        <p className="mt-10 text-xs text-slate-400">
          Learning Management System
        </p>

      </div>

      {/* Animation */}

      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(24px) scale(0.98);
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

export default NotFound;