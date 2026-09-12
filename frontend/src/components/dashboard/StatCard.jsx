import React from "react";

const StatCard = ({
  title,
  value,
  icon: Icon,
  description,
  iconClass = "text-emerald-600 bg-emerald-50",
}) => {
  return (
    <div
      className="
        group relative overflow-hidden
        rounded-3xl
        border border-emerald-100
        bg-white
        p-5
        shadow-[0_10px_35px_rgba(16,185,129,0.07)]
        transition-all duration-500
        hover:-translate-y-1
        hover:border-emerald-200
        hover:shadow-[0_18px_45px_rgba(16,185,129,0.13)]
      "
    >

      {/* Glow */}
      <div className="
        absolute -right-8 -top-8
        h-28 w-28 rounded-full
        bg-emerald-100/60
        blur-3xl
        transition-all duration-700
        group-hover:scale-125
        group-hover:bg-emerald-100
      " />

      <div className="relative flex items-start justify-between">

        <div>

          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {title}
          </p>

          <h3 className="
            mt-2 text-3xl
            font-black tracking-tight
            text-slate-800
            transition-colors duration-300
            group-hover:text-emerald-700
          ">
            {value}
          </h3>

          {description && (
            <p className="mt-2 text-xs font-medium text-slate-400">
              {description}
            </p>
          )}

        </div>

        {Icon && (
          <div
            className={`
              flex h-11 w-11
              items-center justify-center
              rounded-2xl
              shadow-sm
              transition-all duration-500
              group-hover:scale-110
              group-hover:rotate-6
              ${iconClass}
            `}
          >
            <Icon size={20} />
          </div>
        )}

      </div>

      {/* Bottom accent */}
      <div className="
        absolute bottom-0 left-5 right-5
        h-[2px] overflow-hidden
        rounded-full bg-emerald-50
      ">
        <div className="
          h-full w-1/3
          animate-[statLine_3s_ease-in-out_infinite]
          rounded-full
          bg-gradient-to-r
          from-transparent via-emerald-500 to-transparent
        " />
      </div>

      <style>{`
        @keyframes statLine {
          0% {
            transform: translateX(-150%);
          }
          50% {
            transform: translateX(350%);
          }
          100% {
            transform: translateX(350%);
          }
        }
      `}</style>

    </div>
  );
};

export default StatCard;