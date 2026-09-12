import React from "react";
import { Sparkles } from "lucide-react";

const DashboardHeader = ({
  name = "Learner",
  subtitle = "Continue your learning journey and build new skills.",
}) => {
  return (
    <div
      className="
        group
        relative
        mb-8
        overflow-hidden
        rounded-3xl
        border
        border-emerald-100
        bg-gradient-to-br
        from-emerald-50
        via-white
        to-green-50/50
        p-6
        shadow-sm
        shadow-emerald-500/5
        transition-all
        duration-500
        hover:border-emerald-200
        hover:shadow-xl
        hover:shadow-emerald-500/10
        sm:p-8
      "
    >
      {/* Background Glows */}
      <div
        className="
          pointer-events-none
          absolute
          -right-20
          -top-20
          h-64
          w-64
          rounded-full
          bg-emerald-200/40
          blur-3xl
          transition-transform
          duration-1000
          group-hover:scale-125
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -bottom-24
          -left-20
          h-48
          w-48
          rounded-full
          bg-green-100/50
          blur-3xl
        "
      />

      <div className="relative flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          {/* Welcome */}
          <div
            className="
              mb-3
              flex
              items-center
              gap-2
              text-sm
              font-semibold
              text-emerald-600
            "
          >
            <span className="relative flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-100">
              <Sparkles
                size={14}
                className="animate-pulse"
              />
            </span>

            Welcome back
          </div>

          {/* Title */}
          <h1
            className="
              text-2xl
              font-black
              tracking-tight
              text-slate-900
              transition-colors
              duration-300
              group-hover:text-emerald-800
              sm:text-3xl
            "
          >
            Hello, {name} 👋
          </h1>

          {/* Subtitle */}
          <p
            className="
              mt-2
              max-w-xl
              text-sm
              leading-6
              text-slate-500
            "
          >
            {subtitle}
          </p>
        </div>

        {/* Education Icon */}
        <div
          className="
            hidden
            h-20
            w-20
            items-center
            justify-center
            rounded-3xl
            border
            border-emerald-100
            bg-white
            shadow-lg
            shadow-emerald-500/10
            ring-4
            ring-emerald-50
            transition-all
            duration-500
            group-hover:scale-110
            group-hover:-rotate-3
            sm:flex
          "
        >
          <span className="text-4xl animate-[dashboardIcon_3s_ease-in-out_infinite]">
            🎓
          </span>
        </div>
      </div>

      {/* Bottom Accent */}
      <div
        className="
          absolute
          bottom-0
          left-8
          h-1
          w-20
          rounded-t-full
          bg-gradient-to-r
          from-emerald-400
          to-green-600
          transition-all
          duration-500
          group-hover:w-36
        "
      />

      <style>{`
        @keyframes dashboardIcon {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-5px) rotate(3deg);
          }
        }
      `}</style>
    </div>
  );
};

export default DashboardHeader;