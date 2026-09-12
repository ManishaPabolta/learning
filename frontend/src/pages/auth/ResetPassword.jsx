import { useState } from "react";
import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

const ResetPassword = () => {
  const navigate = useNavigate();

  const [searchParams] =
    useSearchParams();

  const token =
    searchParams.get("token");

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    setError("");

    if (!password || !confirmPassword) {
      setError(
        "Please fill in both password fields."
      );
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must contain at least 6 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError(
        "Passwords do not match."
      );
      return;
    }

    /*
      Future backend API:

      POST /api/auth/reset-password

      {
        token,
        password
      }
    */

    console.log("Reset token:", token);

    setSuccess(true);

    setTimeout(() => {
      navigate("/login");
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 text-slate-900 flex items-center justify-center px-4 relative overflow-hidden">

      {/* Background */}

      <div className="absolute inset-0 pointer-events-none">

        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-emerald-300/20 rounded-full blur-3xl animate-pulse" />

        <div className="absolute bottom-0 -right-32 w-96 h-96 bg-green-300/20 rounded-full blur-3xl animate-pulse [animation-duration:5s]" />

        <div className="absolute top-[20%] right-[15%] w-2 h-2 bg-emerald-500 rounded-full animate-ping" />

        <div className="absolute bottom-[20%] left-[15%] w-3 h-3 bg-green-500 rounded-full animate-bounce" />

      </div>

      <div className="relative w-full max-w-md rounded-[2rem] border border-emerald-100 bg-white/85 backdrop-blur-2xl p-8 sm:p-10 shadow-[0_25px_80px_rgba(16,185,129,0.13)] animate-[fadeIn_0.7s_ease-out] overflow-hidden">

        {/* Accent */}

        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-1 bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-400 rounded-b-full" />

        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-56 h-56 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">

          <div className="text-center">

            <div className="relative mx-auto w-16 h-16">

              <div className="absolute inset-0 rounded-2xl bg-emerald-400/10 animate-ping [animation-duration:2.5s]" />

              <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-50 to-green-100 border border-emerald-200 flex items-center justify-center text-3xl shadow-lg shadow-emerald-500/10 transition duration-500 hover:scale-110 hover:-rotate-3">
                🔑
              </div>

            </div>

            <h1 className="text-3xl font-bold mt-7 text-slate-800">
              Create new password
            </h1>

            <p className="text-slate-500 mt-3">
              Choose a strong password for your
              account.
            </p>

          </div>

          {error && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 animate-[shake_0.4s_ease-in-out]">
              {error}
            </div>
          )}

          {success ? (
            <div className="mt-8 text-center rounded-2xl bg-emerald-50 border border-emerald-200 p-6 animate-[fadeIn_0.5s_ease-out]">

              <div className="mx-auto w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl animate-bounce">
                ✓
              </div>

              <p className="text-emerald-700 font-semibold mt-3">
                Password updated successfully
              </p>

              <p className="text-sm text-slate-500 mt-2">
                Redirecting to login...
              </p>

            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-5"
            >

              <div>
                <label className="text-sm font-medium text-slate-700">
                  New password
                </label>

                <div className="relative mt-2">

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={password}
                    onChange={(e) =>
                      setPassword(
                        e.target.value
                      )
                    }
                    placeholder="Minimum 6 characters"
                    className="w-full rounded-xl bg-white border border-emerald-100 px-4 py-3.5 pr-14 text-slate-800 outline-none transition-all duration-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:shadow-lg focus:shadow-emerald-500/10 placeholder:text-slate-400"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (prev) => !prev
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition-transform duration-300 hover:scale-110"
                  >
                    {showPassword
                      ? "🙈"
                      : "👁️"}
                  </button>

                </div>
              </div>

              <div>

                <label className="text-sm font-medium text-slate-700">
                  Confirm password
                </label>

                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(
                      e.target.value
                    )
                  }
                  placeholder="Repeat new password"
                  className="mt-2 w-full rounded-xl bg-white border border-emerald-100 px-4 py-3.5 text-slate-800 outline-none transition-all duration-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:shadow-lg focus:shadow-emerald-500/10 placeholder:text-slate-400"
                />

              </div>

              <button
                type="submit"
                className="group w-full rounded-xl bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 py-3.5 font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/25 active:scale-[0.98]"
              >
                Update Password
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

          @keyframes shake {
            0%, 100% {
              transform: translateX(0);
            }
            25% {
              transform: translateX(-5px);
            }
            75% {
              transform: translateX(5px);
            }
          }
        `}
      </style>

    </div>
  );
};

export default ResetPassword;