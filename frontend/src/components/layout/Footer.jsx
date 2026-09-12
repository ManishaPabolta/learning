import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer
      className="
        relative
        overflow-hidden
        border-t
        border-emerald-100
        bg-white
      "
    >
      {/* Decorative background glow */}
      <div
        className="
          pointer-events-none
          absolute
          -left-20
          -top-24
          h-56
          w-56
          rounded-full
          bg-emerald-100/40
          blur-3xl
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -bottom-28
          -right-20
          h-64
          w-64
          rounded-full
          bg-green-100/40
          blur-3xl
        "
      />

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Main Footer */}
        <div
          className="
            flex
            flex-col
            gap-7
            md:flex-row
            md:items-center
            md:justify-between
          "
        >
          {/* Brand */}
          <div>
            <Link
              to="/"
              className="
                group
                flex
                items-center
                gap-3
              "
            >
              {/* Logo */}
              <div
                className="
                  relative
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  overflow-hidden
                  rounded-2xl
                  bg-gradient-to-br
                  from-emerald-400
                  via-green-500
                  to-emerald-700
                  text-lg
                  text-white
                  shadow-lg
                  shadow-emerald-500/20
                  transition-all
                  duration-500
                  group-hover:scale-110
                  group-hover:rotate-3
                  group-hover:shadow-xl
                  group-hover:shadow-emerald-500/30
                "
              >
                <span
                  className="
                    absolute
                    inset-0
                    bg-white/10
                    opacity-0
                    transition-opacity
                    duration-500
                    group-hover:opacity-100
                  "
                />

                <span
                  className="
                    relative
                    z-10
                    transition-transform
                    duration-500
                    group-hover:-translate-y-0.5
                  "
                >
                  🎓
                </span>
              </div>

              <div>
                <p
                  className="
                    text-base
                    font-extrabold
                    tracking-tight
                    text-slate-900
                  "
                >
                  Skill
                  <span
                    className="
                      bg-gradient-to-r
                      from-emerald-500
                      to-green-600
                      bg-clip-text
                      text-transparent
                    "
                  >
                    Forge
                  </span>
                </p>

                <p
                  className="
                    mt-0.5
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.16em]
                    text-emerald-600/60
                  "
                >
                  Learn. Build. Grow.
                </p>
              </div>
            </Link>
          </div>

          {/* Links */}
          <div
            className="
              flex
              flex-wrap
              items-center
              gap-x-6
              gap-y-3
              text-sm
              font-semibold
              text-slate-500
            "
          >
            <Link
              to="/courses"
              className="
                group
                relative
                py-1
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:text-emerald-600
              "
            >
              Courses

              <span
                className="
                  absolute
                  bottom-0
                  left-0
                  h-0.5
                  w-0
                  rounded-full
                  bg-emerald-500
                  transition-all
                  duration-300
                  group-hover:w-full
                "
              />
            </Link>

            <Link
              to="/profile"
              className="
                group
                relative
                py-1
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:text-emerald-600
              "
            >
              Profile

              <span
                className="
                  absolute
                  bottom-0
                  left-0
                  h-0.5
                  w-0
                  rounded-full
                  bg-emerald-500
                  transition-all
                  duration-300
                  group-hover:w-full
                "
              />
            </Link>

            <a
              href="mailto:support@skillforge.com"
              className="
                group
                relative
                py-1
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:text-emerald-600
              "
            >
              Support

              <span
                className="
                  absolute
                  bottom-0
                  left-0
                  h-0.5
                  w-0
                  rounded-full
                  bg-emerald-500
                  transition-all
                  duration-300
                  group-hover:w-full
                "
              />
            </a>
          </div>
        </div>

        {/* Bottom Divider */}
        <div
          className="
            relative
            mt-7
            h-px
            overflow-hidden
            bg-gradient-to-r
            from-transparent
            via-emerald-100
            to-transparent
          "
        >
          <div
            className="
              absolute
              left-0
              top-0
              h-px
              w-28
              bg-gradient-to-r
              from-emerald-500
              to-transparent
              animate-[footerLine_4s_ease-in-out_infinite]
            "
          />
        </div>

        {/* Bottom */}
        <div
          className="
            mt-6
            flex
            flex-col
            gap-3
            text-xs
            text-slate-400
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <p className="transition-colors duration-300 hover:text-slate-500">
            © {new Date().getFullYear()} SkillForge.
            All rights reserved.
          </p>

          <p
            className="
              flex
              items-center
              gap-1.5
              font-medium
              text-slate-400
            "
          >
            Built with
            <span
              className="
                font-bold
                text-emerald-600
                transition-transform
                duration-300
                hover:scale-110
              "
            >
              React
            </span>
            &
            <span
              className="
                font-bold
                text-emerald-600
                transition-transform
                duration-300
                hover:scale-110
              "
            >
              Tailwind CSS
            </span>
          </p>
        </div>
      </div>

      <style>
        {`
          @keyframes footerLine {
            0% {
              transform: translateX(-150%);
              opacity: 0;
            }

            20% {
              opacity: 1;
            }

            50% {
              transform: translateX(500%);
              opacity: 1;
            }

            80% {
              opacity: 0;
            }

            100% {
              transform: translateX(500%);
              opacity: 0;
            }
          }
        `}
      </style>
    </footer>
  );
};

export default Footer;