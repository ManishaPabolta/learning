import React from "react";
import { ArrowRight, PlayCircle } from "lucide-react";
import { Link } from "react-router-dom";

const WelcomeCard = ({ name = "Learner" }) => {
  return (
    <div className="
      group relative overflow-hidden
      rounded-[2rem]
      border border-emerald-200
      bg-gradient-to-br
      from-emerald-50
      via-white
      to-green-50
      p-6
      shadow-[0_15px_45px_rgba(16,185,129,0.10)]
      transition-all duration-500
      hover:shadow-[0_22px_55px_rgba(16,185,129,0.15)]
      sm:p-8
    ">

      {/* Main glow */}
      <div className="
        pointer-events-none absolute
        -right-24 -top-24
        h-72 w-72
        rounded-full
        bg-emerald-200/50
        blur-3xl
        transition-transform duration-1000
        group-hover:scale-125
      " />

      {/* Secondary glow */}
      <div className="
        pointer-events-none absolute
        -bottom-24 -left-20
        h-56 w-56
        rounded-full
        bg-green-100/70
        blur-3xl
      " />

      {/* Decorative circles */}
      <div className="
        pointer-events-none absolute
        right-12 top-12
        h-2 w-2
        animate-ping
        rounded-full
        bg-emerald-400
      " />

      <div className="
        pointer-events-none absolute
        right-24 top-28
        h-1.5 w-1.5
        rounded-full
        bg-green-400
      " />

      <div className="relative max-w-2xl">

        {/* Badge */}
        <span className="
          inline-flex items-center
          rounded-full
          border border-emerald-200
          bg-white/80
          px-3 py-1.5
          text-xs font-bold
          text-emerald-700
          shadow-sm
          backdrop-blur-sm
          transition-all duration-300
          hover:border-emerald-300
          hover:bg-emerald-50
        ">
          Keep learning 🚀
        </span>

        {/* Heading */}
        <h2 className="
          mt-5 text-2xl
          font-black leading-tight
          tracking-tight text-slate-800
          sm:text-3xl
        ">
          Your skills are your
          <span className="ml-2 text-emerald-600">
            superpower.
          </span>
        </h2>

        <p className="
          mt-3 max-w-xl
          text-sm leading-7
          font-medium text-slate-500
        ">
          Welcome back, {name}. Explore your enrolled courses,
          submit assignments and keep improving your skills.
        </p>

        {/* Buttons */}
        <div className="mt-6 flex flex-wrap gap-3">

          <Link
            to="/courses"
            className="
              group/primary flex items-center gap-2
              rounded-xl
              bg-gradient-to-r
              from-emerald-500
              to-green-600
              px-5 py-3
              text-sm font-bold text-white
              shadow-lg shadow-emerald-500/20
              transition-all duration-300
              hover:-translate-y-0.5
              hover:scale-[1.02]
              hover:shadow-xl
              hover:shadow-emerald-500/25
            "
          >
            Explore Courses

            <ArrowRight
              size={17}
              className="
                transition-transform duration-300
                group-hover/primary:translate-x-1
              "
            />
          </Link>

          <Link
            to="/assignments"
            className="
              group/secondary flex items-center gap-2
              rounded-xl
              border border-emerald-200
              bg-white/80
              px-5 py-3
              text-sm font-bold
              text-slate-600
              shadow-sm
              backdrop-blur-sm
              transition-all duration-300
              hover:-translate-y-0.5
              hover:border-emerald-300
              hover:bg-emerald-50
              hover:text-emerald-700
            "
          >
            <PlayCircle
              size={17}
              className="transition-transform duration-300 group-hover/secondary:scale-110"
            />

            My Assignments
          </Link>

        </div>

      </div>

      {/* Bottom animated accent */}
      <div className="
        absolute bottom-0 left-8 right-8
        h-[3px] overflow-hidden
        rounded-full bg-emerald-100
      ">
        <div className="
          h-full w-1/4
          animate-[welcomeLine_4s_ease-in-out_infinite]
          rounded-full
          bg-gradient-to-r
          from-transparent
          via-emerald-500
          to-transparent
        " />
      </div>

      <style>{`
        @keyframes welcomeLine {
          0% {
            transform: translateX(-150%);
          }
          50% {
            transform: translateX(500%);
          }
          100% {
            transform: translateX(500%);
          }
        }
      `}</style>

    </div>
  );
};

export default WelcomeCard;