import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const Register = () => {
  const navigate = useNavigate();
  const { sendOTP, loading, error } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [formError, setFormError] =
    useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    setFormError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.password
    ) {
      setFormError(
        "Please fill in all required fields."
      );
      return;
    }

    if (formData.password.length < 6) {
      setFormError(
        "Password must contain at least 6 characters."
      );
      return;
    }

    if (
      formData.password !== confirmPassword
    ) {
      setFormError(
        "Passwords do not match."
      );
      return;
    }

    try {
      await sendOTP(formData);

      navigate("/verify-otp", {
        state: {
          email: formData.email,
        },
      });
    } catch (err) {
      setFormError(
        err.message ||
          "Unable to create account."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 text-slate-900 flex items-center justify-center px-4 py-10 relative overflow-hidden">

      {/* Background */}

      <div className="absolute inset-0 pointer-events-none">

        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-300/20 blur-3xl rounded-full animate-pulse" />

        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-green-300/20 blur-3xl rounded-full animate-pulse [animation-duration:5s]" />

        <div className="absolute top-[20%] right-[12%] w-3 h-3 bg-emerald-500 rounded-full animate-bounce" />

        <div className="absolute bottom-[20%] left-[12%] w-2 h-2 bg-green-500 rounded-full animate-ping" />

      </div>

      <div className="relative w-full max-w-6xl grid lg:grid-cols-2 rounded-[2rem] overflow-hidden border border-emerald-100 bg-white/85 backdrop-blur-2xl shadow-[0_30px_100px_rgba(16,185,129,0.14)] animate-[fadeIn_0.7s_ease-out]">

        {/* Welcome Panel */}

        <div className="hidden lg:flex flex-col justify-center p-14 bg-gradient-to-br from-emerald-50 via-green-50 to-white relative overflow-hidden">

          <div className="absolute -top-28 -right-28 w-72 h-72 bg-emerald-400/10 rounded-full blur-3xl" />

          <div className="relative z-10">

            <div className="text-6xl mb-7 animate-[float_3s_ease-in-out_infinite]">
              🚀
            </div>

            <h1 className="text-5xl font-black leading-tight text-slate-800">
              Start your
              <br />
              <span className="bg-gradient-to-r from-emerald-500 to-green-600 bg-clip-text text-transparent">
                learning journey.
              </span>
            </h1>

            <p className="mt-6 text-slate-500 max-w-md leading-7">
              Create your account and get access to
              courses, assignments and a personalized
              learning dashboard.
            </p>

            <div className="mt-10 space-y-4">

              {[
                "Explore professional courses",
                "Track your learning progress",
                "Upload assignments",
                "Build your skills",
              ].map((feature, index) => (
                <div
                  key={feature}
                  className="flex items-center gap-3 text-slate-600 transition-all duration-300 hover:translate-x-2"
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <span className="w-7 h-7 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-600 flex items-center justify-center font-bold">
                    ✓
                  </span>

                  {feature}
                </div>
              ))}

            </div>

          </div>
        </div>

        {/* Form */}

        <div className="p-7 sm:p-10 lg:p-12 bg-white/70">

          <div className="mb-7">

            <p className="text-emerald-600 text-sm uppercase tracking-widest font-semibold">
              Get started
            </p>

            <h2 className="text-3xl font-bold mt-2 text-slate-800">
              Create your account
            </h2>

            <p className="text-slate-500 mt-2">
              We'll send an OTP to verify your email.
            </p>

          </div>

          {(formError || error) && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 animate-[shake_0.4s_ease-in-out]">
              {formError || error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >

            {/* Name */}

            <div>
              <label className="text-sm font-medium text-slate-700">
                Full name
              </label>

              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your full name"
                className="mt-2 w-full rounded-xl bg-white border border-emerald-100 px-4 py-3.5 text-slate-800 outline-none transition-all duration-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:shadow-lg focus:shadow-emerald-500/10 placeholder:text-slate-400"
              />
            </div>

            {/* Email */}

            <div>
              <label className="text-sm font-medium text-slate-700">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="mt-2 w-full rounded-xl bg-white border border-emerald-100 px-4 py-3.5 text-slate-800 outline-none transition-all duration-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:shadow-lg focus:shadow-emerald-500/10 placeholder:text-slate-400"
              />
            </div>

            {/* Password */}

            <div>
              <label className="text-sm font-medium text-slate-700">
                Password
              </label>

              <div className="relative mt-2">

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
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
                  {showPassword ? "🙈" : "👁️"}
                </button>

              </div>
            </div>

            {/* Confirm Password */}

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
                placeholder="Repeat your password"
                className="mt-2 w-full rounded-xl bg-white border border-emerald-100 px-4 py-3.5 text-slate-800 outline-none transition-all duration-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:shadow-lg focus:shadow-emerald-500/10 placeholder:text-slate-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group w-full mt-3 rounded-xl bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 py-3.5 font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/25 disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {loading
                ? "Sending OTP..."
                : (
                  <>
                    Create Account
                    <span className="inline-block ml-1 transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </>
                )}
            </button>

          </form>

          <p className="text-center text-sm text-slate-500 mt-7">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-emerald-600 hover:text-green-700 font-semibold transition"
            >
              Sign in
            </Link>
          </p>

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
              transform: translateY(-8px);
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

export default Register;