import React from "react";
import { Target, TrendingUp } from "lucide-react";

const ProgressCard = ({
  progress = 0,
  completed = 0,
  total = 0,
}) => {
  const safeProgress = Math.min(
    100,
    Math.max(0, Number(progress) || 0)
  );

  return (
    <div
      className="
        group relative overflow-hidden
        rounded-3xl
        border border-emerald-100
        bg-white
        p-6
        shadow-[0_10px_35px_rgba(16,185,129,0.08)]
        transition-all duration-500
        hover:-translate-y-1
        hover:border-emerald-200
        hover:shadow-[0_18px_45px_rgba(16,185,129,0.14)]
      "
    >

      {/* Background glow */}
      <div
        className="
          absolute -right-12 -top-12
          h-40 w-40
          rounded-full
          bg-emerald-100/70
          blur-3xl
          transition-all duration-700
          group-hover:scale-125
        "
      />

      <div
        className="
          absolute -bottom-16 -left-16
          h-32 w-32
          rounded-full
          bg-green-100/50
          blur-3xl
        "
      />

      <div className="relative">

        {/* Header */}
        <div className="flex items-start justify-between">

          <div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />

              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Learning Progress
              </p>
            </div>

            <h2 className="mt-2 text-3xl font-black text-slate-800">
              {safeProgress}
              <span className="text-xl text-emerald-600">%</span>
            </h2>
          </div>

          {/* Icon */}
          <div
            className="
              flex h-12 w-12
              items-center justify-center
              rounded-2xl
              border border-emerald-100
              bg-emerald-50
              text-emerald-600
              shadow-sm
              transition-all duration-500
              group-hover:rotate-6
              group-hover:scale-110
              group-hover:bg-emerald-100
            "
          >
            <Target size={21} />
          </div>

        </div>

        {/* Progress */}
        <div className="mt-7">

          {/* Progress background */}
          <div className="relative h-3 overflow-hidden rounded-full bg-emerald-50">

            {/* Progress */}
            <div
              className="
                relative h-full
                overflow-hidden
                rounded-full
                bg-gradient-to-r
                from-emerald-400
                via-green-500
                to-emerald-600
                shadow-[0_0_14px_rgba(16,185,129,0.35)]
                transition-all duration-1000
              "
              style={{
                width: `${safeProgress}%`,
              }}
            >
              {/* Moving shine */}
              <span className="absolute inset-y-0 -left-10 w-10 animate-[progressShine_2s_linear_infinite] bg-white/30 blur-sm" />
            </div>

          </div>

          {/* Footer */}
          <div className="mt-4 flex items-center justify-between text-xs">

            <span className="font-medium text-slate-400">
              {completed} completed
            </span>

            <span className="flex items-center gap-1.5 font-semibold text-emerald-600">
              <TrendingUp
                size={14}
                className="animate-bounce"
              />

              Keep going
            </span>

          </div>

          {/* Course count */}
          {total > 0 && (
            <p className="mt-2 text-[11px] text-slate-400">
              {completed} of {total} completed
            </p>
          )}

        </div>

      </div>

      {/* Bottom accent */}
      <div className="absolute bottom-0 left-6 right-6 h-[2px] overflow-hidden rounded-full bg-emerald-50">
        <div className="h-full w-1/2 animate-[cardAccent_3s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
      </div>

      <style>{`
        @keyframes progressShine {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(450px);
          }
        }

        @keyframes cardAccent {
          0% {
            transform: translateX(-120%);
          }
          50% {
            transform: translateX(220%);
          }
          100% {
            transform: translateX(220%);
          }
        }
      `}</style>

    </div>
  );
};

export default ProgressCard;