import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  Lock,
} from "lucide-react";

const PasswordInput = ({
  label = "Password",
  name = "password",
  value,
  onChange,
  placeholder = "Enter your password",
  error,
}) => {
  const [showPassword, setShowPassword] =
    useState(false);

  return (
    <div className="w-full">

      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
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
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`
            w-full
            rounded-xl
            border
            bg-slate-50
            py-3.5
            pl-11
            pr-12
            text-slate-800
            placeholder:text-slate-400
            outline-none
            transition-all
            duration-300

            focus:bg-white
            focus:ring-4

            ${
              error
                ? "border-red-400 focus:border-red-500 focus:ring-red-500/10"
                : "border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/10"
            }
          `}
        />

        <button
          type="button"
          onClick={() =>
            setShowPassword(!showPassword)
          }
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-emerald-600"
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

      {error && (
        <p className="mt-2 text-xs font-medium text-red-500">
          {error}
        </p>
      )}

    </div>
  );
};

export default PasswordInput;