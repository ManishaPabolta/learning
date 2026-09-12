import React from "react";

const ErrorMessage = ({
  message = "Something went wrong.",
  onRetry,
}) => {
  return (
    <div
      className="
        group
        relative
        flex
        items-start
        gap-4
        overflow-hidden
        rounded-2xl
        border
        border-red-100
        bg-gradient-to-br
        from-red-50
        via-white
        to-red-50/60
        p-5
        shadow-sm
        shadow-red-500/5
        transition-all
        duration-500
        hover:-translate-y-0.5
        hover:border-red-200
        hover:shadow-lg
        hover:shadow-red-500/10
        animate-[errorEnter_400ms_ease-out]
      "
    >
      {/* Decorative Glow */}
      <div
        className="
          pointer-events-none
          absolute
          -right-10
          -top-10
          h-24
          w-24
          rounded-full
          bg-red-200/40
          blur-3xl
          transition-transform
          duration-700
          group-hover:scale-150
        "
      />

      {/* Icon */}
      <div
        className="
          relative
          z-10
          flex
          h-11
          w-11
          shrink-0
          items-center
          justify-center
          rounded-xl
          border
          border-red-100
          bg-white
          text-lg
          shadow-md
          shadow-red-500/10
          ring-4
          ring-red-50
          transition-all
          duration-500
          group-hover:scale-110
          group-hover:-rotate-3
        "
      >
        <span className="animate-[errorIcon_2.5s_ease-in-out_infinite]">
          ⚠️
        </span>
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1">
        <h3
          className="
            font-bold
            tracking-tight
            text-red-800
            transition-colors
            duration-300
          "
        >
          Something went wrong
        </h3>

        <p className="mt-1 text-sm leading-6 text-red-600">
          {message}
        </p>

        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="
              mt-3
              inline-flex
              items-center
              rounded-lg
              px-2
              py-1
              text-sm
              font-bold
              text-red-700
              underline
              underline-offset-4
              transition-all
              duration-300
              hover:bg-red-100
              hover:text-red-900
              hover:no-underline
              active:scale-95
            "
          >
            Try again
          </button>
        )}
      </div>

      <style>{`
        @keyframes errorEnter {
          0% {
            opacity: 0;
            transform: translateY(-8px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes errorIcon {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-3px) rotate(-4deg);
          }
        }
      `}</style>
    </div>
  );
};

export default ErrorMessage;