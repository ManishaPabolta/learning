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

    if (formData.password !== confirmPassword) {
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

        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Full Name
          </label>

          <div className="relative">

            <User
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            />

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your full name"
              className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pl-11 pr-4 text-white placeholder:text-slate-600 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition"
            />

          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Email Address
          </label>

          <div className="relative">

            <Mail
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            />

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pl-11 pr-4 text-white placeholder:text-slate-600 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition"
            />

          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Password
          </label>

          <div className="relative">

            <Lock
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
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
              className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pl-11 pr-12 text-white placeholder:text-slate-600 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition"
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(!showPassword)
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
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
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Confirm Password
          </label>

          <div className="relative">

            <Lock
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
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
              className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pl-11 pr-12 text-white placeholder:text-slate-600 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition"
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(
                  !showConfirmPassword
                )
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
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
          className="group w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 py-3.5 font-semibold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60"
        >

          {loading ? (
            <>
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Sending OTP...
            </>
          ) : (
            <>
              Continue
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition"
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
            className="font-semibold text-indigo-400 hover:text-indigo-300"
          >
            Login
          </Link>

        </p>

      </div>

    </AuthLayout>
  );
};

export default SignupForm;