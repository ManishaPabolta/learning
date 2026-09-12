import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";

import AuthLayout from "./AuthLayout";
import useAuth from "../../components/hooks/useAuth";

const SignupForm = () => {
  const navigate = useNavigate();

  const { sendOTP, loading } = useAuth();

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

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !confirmPassword
    ) {
      setError("Please fill all fields.");
      return;
    }

    if (formData.password.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }

    if (
      formData.password !== confirmPassword
    ) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await sendOTP(formData);

      navigate("/verify-otp", {
        state: {
          email: formData.email,
          name: formData.name,
        },
      });

    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Unable to send OTP."
      );
    }
  };

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Start your learning journey with us"
    >

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >

        {/* Error */}
        {error && (
          <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 animate-[fadeIn_0.3s_ease-out]">
            <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-red-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Name */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Full Name
          </label>

          <div className="relative">

            <User
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your full name"
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
                focus:border-emerald-500
                focus:bg-white
                focus:ring-4
                focus:ring-emerald-500/10
              "
            />

          </div>
        </div>

        {/* Email */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Email Address
          </label>

          <div className="relative">

            <Mail
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
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
                focus:border-emerald-500
                focus:bg-white
                focus:ring-4
                focus:ring-emerald-500/10
              "
            />

          </div>
        </div>

        {/* Password */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Password
          </label>

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
              placeholder="Create password"
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
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-emerald-600"
            >
              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>

          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Confirm Password
          </label>

          <div className="relative">

            <Lock
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type={
                showConfirmPassword
                  ? "text"
                  : "password"
              }
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(
                  e.target.value
                )
              }
              placeholder="Confirm password"
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
                focus:border-emerald-500
                focus:bg-white
                focus:ring-4
                focus:ring-emerald-500/10
              "
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(
                  !showConfirmPassword
                )
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-emerald-600"
            >
              {showConfirmPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>

          </div>
        </div>

        {/* Role */}
        <input
          type="hidden"
          name="role"
          value="user"
        />

        {/* Submit */}
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
          "
        >

          {loading ? (
            <>
              <span className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              Sending OTP...
            </>
          ) : (
            <>
              Continue

              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </>
          )}

        </button>

      </form>

      <div className="mt-7 text-center">

        <p className="text-sm text-slate-500">
          Already have an account?{" "}

          <Link
            to="/login"
            className="font-bold text-emerald-600 transition hover:text-emerald-700 hover:underline"
          >
            Login
          </Link>

        </p>

      </div>

    </AuthLayout>
  );
};

export default SignupForm;