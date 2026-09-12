import { useState } from "react";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email) return;

    /*
      Backend mein abhi forgot-password
      endpoint available nahi hai.

      Future API:
      POST /api/auth/forgot-password
    */

    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 text-slate-900 flex items-center justify-center px-4 relative overflow-hidden">

      {/* Background */}

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-emerald-300/20 blur-3xl animate-pulse" />

        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-green-300/20 blur-3xl animate-pulse [animation-duration:5s]" />

        <div className="absolute top-[20%] left-[15%] w-2 h-2 rounded-full bg-emerald-500 animate-ping" />

        <div className="absolute bottom-[25%] right-[15%] w-3 h-3 rounded-full bg-green-500 animate-bounce" />
      </div>

      {/* Card */}

      <div className="relative w-full max-w-md animate-[fadeIn_0.7s_ease-out]">

        <div className="relative rounded-[2rem] border border-emerald-100 bg-white/85 backdrop-blur-2xl p-8 sm:p-10 shadow-[0_25px_80px_rgba(16,185,129,0.13)] overflow-hidden">

          {/* Top Accent */}

          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-1 bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-400 rounded-b-full" />

          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-56 h-56 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">

            <div className="text-center">

              <div className="relative mx-auto w-16 h-16">

                <div className="absolute inset-0 rounded-2xl bg-emerald-400/10 animate-ping [animation-duration:2.5s]" />

                <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-50 to-green-100 border border-emerald-200 flex items-center justify-center text-3xl shadow-lg shadow-emerald-500/10 transition duration-500 hover:scale-110 hover:rotate-3">
                  🔐
                </div>

              </div>

              <h1 className="text-3xl font-bold mt-7 text-slate-800">
                Forgot password?
              </h1>

              <p className="text-slate-500 mt-3 leading-6">
                Enter your email and we'll help you
                reset your password.
              </p>
            </div>

            {submitted ? (
              <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-center animate-[fadeIn_0.5s_ease-out]">

                <div className="mx-auto w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl mb-3 animate-bounce">
                  ✓
                </div>

                <p className="text-emerald-700 font-semibold">
                  Request received
                </p>

                <p className="text-sm text-slate-500 mt-2">
                  Password reset functionality will
                  work once the backend endpoint is
                  added.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="mt-8 space-y-5"
              >
                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Email address
                  </label>

                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    placeholder="you@example.com"
                    className="mt-2 w-full rounded-xl bg-white border border-emerald-100 px-4 py-3.5 text-slate-800 outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:shadow-lg focus:shadow-emerald-500/10"
                  />
                </div>

                <button
                  type="submit"
                  className="group w-full rounded-xl bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 py-3.5 font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/25 active:scale-[0.98]"
                >
                  Send Reset Link
                  <span className="inline-block ml-1 transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </button>
              </form>
            )}

            <div className="text-center mt-7">
              <Link
                to="/login"
                className="group text-sm text-slate-500 hover:text-emerald-600 transition"
              >
                <span className="inline-block transition-transform duration-300 group-hover:-translate-x-1">
                  ←
                </span>{" "}
                Back to login
              </Link>
            </div>

          </div>
        </div>

      </div>

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

export default ForgotPassword;