import { Link, useNavigate } from "react-router-dom";

const ServerError = () => {
  const navigate = useNavigate();

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 text-slate-900 flex items-center justify-center px-6 relative overflow-hidden">

      {/* ================= BACKGROUND ================= */}

      <div className="absolute inset-0 pointer-events-none overflow-hidden">

        <div className="absolute top-[-180px] left-[-180px] w-[500px] h-[500px] rounded-full bg-emerald-300/20 blur-3xl animate-pulse" />

        <div className="absolute bottom-[-180px] right-[-180px] w-[500px] h-[500px] rounded-full bg-green-300/20 blur-3xl animate-pulse [animation-duration:5s]" />

        <div className="absolute top-[20%] right-[20%] w-2 h-2 rounded-full bg-emerald-500 animate-bounce" />

        <div className="absolute bottom-[25%] left-[20%] w-3 h-3 rounded-full bg-green-500 animate-ping" />

        <div className="absolute top-[65%] right-[12%] w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />

        <div className="absolute top-[18%] left-[12%] w-2 h-2 rounded-full bg-green-400 animate-ping [animation-duration:3s]" />

      </div>

      {/* ================= MAIN CARD ================= */}

      <div className="relative z-10 w-full max-w-xl animate-[fadeIn_0.7s_ease-out]">

        <div className="relative rounded-[2rem] border border-emerald-100 bg-white/80 backdrop-blur-2xl p-8 sm:p-12 text-center shadow-[0_25px_80px_rgba(16,185,129,0.12)] overflow-hidden">

          {/* Top Accent */}

          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-1 bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-400 rounded-b-full" />

          {/* Ambient Glow */}

          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">

            {/* Server Icon */}

            <div className="relative mx-auto w-24 h-24">

              <div className="absolute inset-0 rounded-3xl bg-emerald-400/10 animate-ping [animation-duration:2.5s]" />

              <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-50 to-green-100 border border-emerald-200 flex items-center justify-center text-5xl shadow-lg shadow-emerald-500/10 transition-all duration-500 hover:scale-110 hover:-rotate-3">
                ⚠️
              </div>

            </div>

            {/* Error */}

            <p className="mt-8 text-emerald-600 text-sm font-bold uppercase tracking-[0.2em]">
              Server error
            </p>

            <h1 className="mt-3 text-5xl sm:text-6xl font-black tracking-tight bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-700 bg-clip-text text-transparent">
              500
            </h1>

            <h2 className="mt-4 text-2xl font-bold text-slate-800">
              Something went wrong
            </h2>

            <p className="mt-4 text-slate-500 leading-7 max-w-md mx-auto">
              We couldn't complete your request right now.
              The server may be temporarily unavailable.
              Please try again in a moment.
            </p>

            {/* Status box */}

            <div className="mt-7 rounded-2xl border border-emerald-100 bg-emerald-50/70 px-5 py-4 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:shadow-emerald-500/10">

              <div className="flex items-start gap-3">

                <span className="text-emerald-500 mt-0.5 animate-pulse">
                  ●
                </span>

                <div>

                  <p className="text-sm font-semibold text-slate-700">
                    Don't worry
                  </p>

                  <p className="text-xs text-slate-500 mt-1 leading-5">
                    Your account and data are safe.
                    Try refreshing the page or return
                    to the homepage.
                  </p>

                </div>

              </div>

            </div>

            {/* Buttons */}

            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">

              <button
                onClick={handleRetry}
                className="group px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 text-white font-bold transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/25"
              >
                <span className="inline-block mr-1 transition-transform duration-500 group-hover:rotate-180">
                  ↻
                </span>
                Try Again
              </button>

              <button
                onClick={() => navigate(-1)}
                className="px-6 py-3.5 rounded-xl border border-emerald-100 bg-white text-slate-700 font-semibold transition-all duration-300 hover:bg-emerald-50 hover:border-emerald-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-500/10"
              >
                ← Go Back
              </button>

              <Link
                to="/"
                className="px-6 py-3.5 rounded-xl border border-emerald-100 bg-white text-slate-700 font-semibold transition-all duration-300 hover:bg-emerald-50 hover:border-emerald-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-500/10"
              >
                Home
              </Link>

            </div>

          </div>

        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          LMS • Learning Management System
        </p>

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

export default ServerError;