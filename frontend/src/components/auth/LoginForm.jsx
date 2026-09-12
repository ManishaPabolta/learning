
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

import AuthLayout from "./AuthLayout";
import useAuth from "../../components/hooks/useAuth";

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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setFormError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setFormError("");

    if (!formData.email || !formData.password) {
      setFormError("Please enter your email and password.");
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
        err?.response?.data?.message ||
          err?.message ||
          "Invalid email or password."
      );
    }
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Login to continue your learning journey"
    >
      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >

        {/* ================= ERROR ================= */}

        {(formError || error) && (
          <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 animate-[fadeIn_0.3s_ease-out]">

            <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-red-500" />

            <span>
              {formError || error}
            </span>

          </div>
        )}

        {/* ================= EMAIL ================= */}

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Email Address
          </label>

          <div className="relative">

            <Mail
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors"
            />

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              autoComplete="email"
              className="
                w-full
                rounded-xl
                border border-slate-200
                bg-slate-50
                py-3.5
                pl-11
                pr-4
                text-slate-800
                placeholder:text-slate-400
                outline-none
                transition-all
                duration-300

                hover:border-emerald-300

                focus:border-emerald-500
                focus:bg-white
                focus:ring-4
                focus:ring-emerald-500/10
              "
            />

          </div>
        </div>

        {/* ================= PASSWORD ================= */}

        <div>
          <div className="mb-2 flex items-center justify-between">

            <label className="text-sm font-semibold text-slate-700">
              Password
            </label>

            <Link
              to="/forgot-password"
              className="text-xs font-bold text-emerald-600 transition hover:text-emerald-700 hover:underline"
            >
              Forgot password?
            </Link>

          </div>

          <div className="relative">

            <Lock
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              autoComplete="current-password"
              className="
                w-full
                rounded-xl
                border border-slate-200
                bg-slate-50
                py-3.5
                pl-11
                pr-12
                text-slate-800
                placeholder:text-slate-400
                outline-none
                transition-all
                duration-300

                hover:border-emerald-300

                focus:border-emerald-500
                focus:bg-white
                focus:ring-4
                focus:ring-emerald-500/10
              "
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(!showPassword)
              }
              className="
                absolute
                right-4
                top-1/2
                -translate-y-1/2
                text-slate-400
                transition-all
                duration-200
                hover:scale-110
                hover:text-emerald-600
              "
              aria-label={
                showPassword
                  ? "Hide password"
                  : "Show password"
              }
            >
              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>

          </div>
        </div>

        {/* ================= REMEMBER / SECURITY ================= */}

        <div className="flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50/60 px-3 py-2.5">

          <ShieldCheck
            size={17}
            className="shrink-0 text-emerald-600"
          />

          <p className="text-xs font-medium text-emerald-700">
            Your account is protected with secure authentication.
          </p>

        </div>

        {/* ================= LOGIN BUTTON ================= */}

        <button
          type="submit"
          disabled={loading}
          className="
            group
            flex
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-gradient-to-r
            from-emerald-600
            via-green-500
            to-lime-400
            py-3.5
            font-bold
            text-white

            shadow-lg
            shadow-emerald-500/20

            transition-all
            duration-300

            hover:-translate-y-0.5
            hover:shadow-xl
            hover:shadow-emerald-500/30

            active:translate-y-0

            disabled:cursor-not-allowed
            disabled:opacity-60
            disabled:hover:translate-y-0
          "
        >

          {loading ? (
            <>
              <span className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />

              Signing in...
            </>
          ) : (
            <>
              Sign In

              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </>
          )}

        </button>

      </form>

      {/* ================= REGISTER ================= */}

      <div className="mt-7 text-center">

        <p className="text-sm text-slate-500">
          Don't have an account?{" "}

          <Link
            to="/register"
            className="
              font-bold
              text-emerald-600
              transition-colors
              hover:text-emerald-700
              hover:underline
            "
          >
            Create account
          </Link>
        </p>

      </div>

    </AuthLayout>
  );
};

export default Login;

