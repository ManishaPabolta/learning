import React from "react";

const EmptyState = ({
  icon = "📚",
  title = "Nothing here yet",
  description = "There is no data to display.",
  action,
}) => {
  return (
    <div
      className="
        group
        relative
        flex
        flex-col
        items-center
        justify-center
        overflow-hidden
        rounded-2xl
        border
        border-dashed
        border-emerald-200
        bg-gradient-to-br
        from-emerald-50/50
        via-white
        to-green-50/30
        px-6
        py-14
        text-center
        transition-all
        duration-500
        hover:-translate-y-1
        hover:border-emerald-300
        hover:shadow-xl
        hover:shadow-emerald-500/10
      "
    >
      {/* Background decoration */}
      <div
        className="
          pointer-events-none
          absolute
          -left-16
          -top-16
          h-36
          w-36
          rounded-full
          bg-emerald-100/50
          blur-3xl
          transition-transform
          duration-700
          group-hover:scale-125
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -bottom-20
          -right-16
          h-40
          w-40
          rounded-full
          bg-green-100/40
          blur-3xl
          transition-transform
          duration-700
          group-hover:scale-125
        "
      />

      {/* Icon */}
      <div
        className="
          relative
          z-10
          mb-5
          flex
          h-16
          w-16
          items-center
          justify-center
          rounded-2xl
          border
          border-emerald-100
          bg-white
          text-3xl
          shadow-md
          shadow-emerald-500/10
          ring-4
          ring-emerald-50/70
          transition-all
          duration-500
          group-hover:scale-110
          group-hover:-rotate-3
          group-hover:shadow-lg
          group-hover:shadow-emerald-500/15
        "
      >
        <span className="animate-[emptyIcon_3s_ease-in-out_infinite]">
          {icon}
        </span>
      </div>

      {/* Title */}
      <h3
        className="
          relative
          z-10
          text-lg
          font-extrabold
          tracking-tight
          text-slate-800
          transition-colors
          duration-300
          group-hover:text-emerald-700
        "
      >
        {title}
      </h3>

      {/* Description */}
      <p
        className="
          relative
          z-10
          mt-2
          max-w-md
          text-sm
          leading-6
          text-slate-500
        "
      >
        {description}
      </p>

      {/* Action */}
      {action && (
        <div
          className="
            relative
            z-10
            mt-5
            transition-transform
            duration-300
            group-hover:translate-y-[-1px]
          "
        >
          {action}
        </div>
      )}

      {/* Bottom accent */}
      <div
        className="
          absolute
          bottom-0
          left-1/2
          h-1
          w-20
          -translate-x-1/2
          rounded-t-full
          bg-gradient-to-r
          from-emerald-400
          to-green-600
          opacity-60
          transition-all
          duration-500
          group-hover:w-32
          group-hover:opacity-100
        "
      />

      <style>
        {`
          @keyframes emptyIcon {
            0%,
            100% {
              transform: translateY(0);
            }

            50% {
              transform: translateY(-4px);
            }
          }
        `}
      </style>
    </div>
  );
};

export default EmptyState;