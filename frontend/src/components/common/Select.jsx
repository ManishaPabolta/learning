import React from "react";

const Select = ({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = "Select an option",
  error,
  required = false,
  disabled = false,
  className = "",
}) => {
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
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`
            w-full
            appearance-none
            rounded-xl
            border
            bg-white
            px-4
            py-3
            pr-11
            text-sm
            text-slate-700
            outline-none
            shadow-sm
            transition-all
            duration-300

            hover:border-emerald-200
            hover:shadow-md
            hover:shadow-emerald-500/5

            focus:border-emerald-500
            focus:ring-4
            focus:ring-emerald-500/10
            focus:shadow-md
            focus:shadow-emerald-500/5

            disabled:cursor-not-allowed
            disabled:bg-slate-50
            disabled:text-slate-400

            ${
              error
                ? "border-red-400 focus:border-red-500 focus:ring-red-500/10"
                : "border-slate-200"
            }
          `}
        >
          <option value="">
            {placeholder}
          </option>

          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>

        {/* Custom Arrow */}
        <div
          className="
            pointer-events-none
            absolute
            right-4
            top-1/2
            -translate-y-1/2
            text-slate-400
            transition-all
            duration-300
            group-focus-within:text-emerald-600
            group-focus-within:translate-y-[-35%]
          "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m19 9-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {error && (
        <p
          className="
            mt-1.5
            text-xs
            font-semibold
            text-red-500
            animate-[selectError_250ms_ease-out]
          "
        >
          {error}
        </p>
      )}

      <style>{`
        @keyframes selectError {
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

export default Select;