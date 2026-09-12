import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const Login = () => {
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    setFormError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setFormError("Please fill in all fields.");
      return;
    }

    try {
      const result = await login(
        formData.email,
        formData.password
      );

      const loggedUser = result?.user;

      if (loggedUser?.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/student");
      }
    } catch (err) {
      setFormError(
        err.message || "Invalid email or password."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 text-slate-900 flex items-center justify-center px-4 py-10 overflow-hidden relative">

      {/* Background */}

      <div className="absolute inset-0 pointer-events-none overflow-hidden">

        <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-300/20 rounded-full blur-3xl animate-pulse" />

        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-green-300/20 rounded-full blur-3xl animate-pulse [animation-duration:5s]" />

        <div className="absolute top-20 right-[15%] w-3 h-3 bg-emerald-500 rounded-full animate-bounce" />

        <div className="absolute bottom-32 left-[15%] w-2 h-2 bg-green-500 rounded-full animate-ping" />

      </div>

      <div className="relative w-full max-w-5xl grid lg:grid-cols-2 rounded-[2rem] overflow-hidden border border-emerald-100 bg-white/85 backdrop-blur-2xl shadow-[0_30px_100px_rgba(16,185,129,0.14)] animate-[fadeIn_0.7s_ease-out]">

        {/* Left Section */}

        <div className="hidden lg:flex flex-col justify-center p-12 bg-gradient-to-br from-emerald-50 via-green-50 to-white relative overflow-hidden">

          <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-emerald-400/10 blur-3xl" />

          <div className="relative z-10">

            <div className="mb-8">

              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-2xl shadow-lg shadow-emerald-500/20 animate-[float_3s_ease-in-out_infinite]">
                🎓
              </div>

            </div>

            <h1 className="text-5xl font-black leading-tight text-slate-800">
              Learn.
              <br />
              Build.
              <br />
              <span className="bg-gradient-to-r from-emerald-500 to-green-600 bg-clip-text text-transparent">
                Grow.
              </span>
            </h1>

            <p className="mt-6 text-slate-500 leading-7 max-w-md">
              Welcome back to your learning platform.
              Continue your courses, submit assignments
              and track your learning journey.
            </p>

            <div className="mt-10 flex gap-3">
              {["Courses", "Assignments", "Progress"].map(
                (item, index) => (
                  <span
                    key={item}
                    className="px-4 py-2 rounded-full bg-white border border-emerald-100 text-sm text-slate-600 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:text-emerald-600"
                    style={{
                      animationDelay: `${index * 100}ms`,
                    }}
                  >
                    {item}
                  </span>
                )
              )}
            </div>

          </div>
        </div>

        {/* Login Form */}

        <div className="p-7 sm:p-10 lg:p-12 bg-white/70">

          <div className="mb-8">

            <p className="text-emerald-600 text-sm font-semibold uppercase tracking-widest">
              Welcome back
            </p>

            <h2 className="text-3xl font-bold mt-2 text-slate-800">
              Sign in to your account
            </h2>

            <p className="text-slate-500 mt-2">
              Enter your credentials to continue.
            </p>

          </div>

          {(formError || error) && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 animate-[shake_0.4s_ease-in-out]">
              {formError || error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* Email */}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email address
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-emerald-100 bg-white px-4 py-3.5 text-slate-800 outline-none transition-all duration-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:shadow-lg focus:shadow-emerald-500/10 placeholder:text-slate-400"
              />
            </div>

            {/* Password */}

            <div>

              <div className="flex justify-between items-center mb-2">

                <label className="text-sm font-medium text-slate-700">
                  Password
                </label>

                <Link
                  to="/forgot-password"
                  className="text-xs text-emerald-600 hover:text-green-700 transition font-semibold"
                >
                  Forgot password?
                </Link>

              </div>

              <div className="relative">

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-emerald-100 bg-white px-4 py-3.5 pr-14 text-slate-800 outline-none transition-all duration-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:shadow-lg focus:shadow-emerald-500/10 placeholder:text-slate-400"
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
                  {showPassword ? "🙈" : "👁️"}
                </button>

              </div>
            </div>

            {/* Submit */}

            <button
              type="submit"
              disabled={loading}
              className="group w-full rounded-xl bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 py-3.5 font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                <>
                  Sign In
                  <span className="inline-block ml-1 transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </>
              )}
            </button>

          </form>

          <div className="relative my-7">

            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-emerald-100" />
            </div>

            <div className="relative flex justify-center">
              <span className="bg-white px-4 text-xs text-slate-400 font-medium">
                NEW TO THE PLATFORM?
              </span>
            </div>

          </div>

          <Link
            to="/register"
            className="block w-full rounded-xl border border-emerald-200 bg-white py-3.5 text-center font-semibold text-slate-700 transition-all duration-300 hover:bg-emerald-50 hover:border-emerald-400 hover:text-emerald-700 hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-500/10"
          >
            Create an account
          </Link>

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

          @keyframes float {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-7px);
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

export default Login;