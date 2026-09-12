import React, { useState } from "react";

const Input = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder = "",
  error,
  helperText,
  required = false,
  disabled = false,
  icon,
  className = "",
  ...props
}) => {
  const [showPassword, setShowPassword] =
    useState(false);

  const isPassword = type === "password";

  const inputType =
    isPassword && showPassword
      ? "text"
      : type;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className="
            mb-2
            block
            text-sm
            font-bold
            tracking-tight
            text-slate-700
          "
        >
          {label}

          {required && (
            <span className="ml-1 text-red-500">
              *
            </span>
          )}
        </label>
      )}

      <div className="group relative">
        {icon && (
          <div
            className="
              pointer-events-none
              absolute
              left-4
              top-1/2
              z-10
              -translate-y-1/2
              text-slate-400
              transition-all
              duration-300
              group-focus-within:text-emerald-600
              group-focus-within:scale-110
            "
          >
            {icon}
          </div>
        )}

        <input
          id={name}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          {...props}
          className={`
            w-full
            rounded-xl
            border
            bg-white
            px-4
            py-3
            text-sm
            text-slate-800
            outline-none
            transition-all
            duration-300

            placeholder:text-slate-400

            hover:border-emerald-200

            focus:border-emerald-500
            focus:ring-4
            focus:ring-emerald-500/10
            focus:shadow-md
            focus:shadow-emerald-500/5

            disabled:cursor-not-allowed
            disabled:bg-slate-50
            disabled:text-slate-400

            ${icon ? "pl-11" : ""}

            ${isPassword ? "pr-12" : ""}

            ${
              error
                ? "border-red-400 focus:border-red-500 focus:ring-red-500/10 focus:shadow-red-500/5"
                : "border-slate-200"
            }
          `}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() =>
              setShowPassword(
                (previous) => !previous
              )
            }
            className="
              absolute
              right-3
              top-1/2
              -translate-y-1/2
              rounded-lg
              p-2
              text-slate-400
              transition-all
              duration-300
              hover:bg-emerald-50
              hover:text-emerald-600
              hover:scale-105
              active:scale-90
            "
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        )}
      </div>

      {error && (
        <p
          className="
            mt-1.5
            text-xs
            font-semibold
            text-red-500
            animate-[inputMessage_250ms_ease-out]
          "
        >
          {error}
        </p>
      )}

      {!error && helperText && (
        <p className="mt-1.5 text-xs text-slate-400">
          {helperText}
        </p>
      )}

      <style>{`
        @keyframes inputMessage {
          0% {
            opacity: 0;
            transform: translateY(-3px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Input;