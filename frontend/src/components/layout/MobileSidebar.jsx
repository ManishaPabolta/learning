import React from "react";
import { NavLink } from "react-router-dom";

const MobileSidebar = ({
  isOpen,
  onClose,
  role = "user",
}) => {
  const studentLinks = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: "▦",
    },
    {
      label: "Browse Courses",
      path: "/courses",
      icon: "📚",
    },
    {
      label: "My Courses",
      path: "/my-courses",
      icon: "🎓",
    },
    {
      label: "Assignments",
      path: "/assignments",
      icon: "📝",
    },
    {
      label: "Profile",
      path: "/profile",
      icon: "👤",
    },
  ];

  const adminLinks = [
    {
      label: "Dashboard",
      path: "/admin",
      icon: "▦",
    },
    {
      label: "All Courses",
      path: "/admin/courses",
      icon: "📚",
    },
    {
      label: "Create Course",
      path: "/admin/courses/create",
      icon: "➕",
    },
    {
      label: "Assignments",
      path: "/admin/assignments",
      icon: "📝",
    },
    {
      label: "Users",
      path: "/admin/users",
      icon: "👥",
    },
    {
      label: "Profile",
      path: "/profile",
      icon: "👤",
    },
  ];

  const links =
    role === "admin"
      ? adminLinks
      : studentLinks;

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="
            fixed
            inset-0
            z-50
            bg-slate-950/45
            backdrop-blur-sm
            lg:hidden
            animate-[overlayIn_250ms_ease-out]
          "
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <aside
        className={`
          fixed
          bottom-0
          left-0
          top-0
          z-[60]
          flex
          w-[290px]
          flex-col
          overflow-hidden
          border-r
          border-emerald-100
          bg-white
          shadow-[12px_0_40px_rgba(16,185,129,0.12)]
          transition-transform
          duration-300
          ease-out
          lg:hidden

          ${
            isOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        {/* Decorative background glow */}
        <div
          className="
            pointer-events-none
            absolute
            -right-20
            -top-20
            h-48
            w-48
            rounded-full
            bg-emerald-100/50
            blur-3xl
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            -bottom-24
            -left-20
            h-52
            w-52
            rounded-full
            bg-green-100/40
            blur-3xl
          "
        />

        {/* Header */}
        <div
          className="
            relative
            flex
            h-20
            shrink-0
            items-center
            justify-between
            border-b
            border-emerald-100
            bg-gradient-to-r
            from-emerald-50/80
            via-white
            to-white
            px-5
          "
        >
          <div className="flex items-center gap-3">
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
                shadow-emerald-500/25
                animate-[mobileLogoFloat_3s_ease-in-out_infinite]
              "
            >
              <span className="relative z-10">
                🎓
              </span>

              <span
                className="
                  absolute
                  inset-0
                  bg-white/10
                  opacity-0
                  transition-opacity
                  duration-300
                  hover:opacity-100
                "
              />
            </div>

            <div>
              <p className="text-base font-extrabold tracking-tight text-slate-900">
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
                  text-[9px]
                  font-bold
                  uppercase
                  tracking-[0.18em]
                  text-emerald-600/60
                "
              >
                Learning Platform
              </p>
            </div>
          </div>

          {/* Close */}
          <button
            type="button"
            onClick={onClose}
            className="
              group
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-xl
              border
              border-emerald-100
              bg-white
              text-xl
              text-slate-400
              shadow-sm
              transition-all
              duration-300
              hover:rotate-90
              hover:border-emerald-200
              hover:bg-emerald-50
              hover:text-emerald-600
              hover:shadow-md
              active:scale-90
            "
            aria-label="Close menu"
          >
            ×
          </button>
        </div>

        {/* Navigation */}
        <div
          className="
            relative
            flex-1
            overflow-y-auto
            overflow-x-hidden
            p-4
            scrollbar-thin
            scrollbar-thumb-emerald-200
            scrollbar-track-transparent
          "
        >
          {/* Section title */}
          <div
            className="
              mb-4
              flex
              items-center
              gap-2
              px-3
            "
          >
            <span
              className="
                h-1.5
                w-1.5
                rounded-full
                bg-emerald-500
                shadow-[0_0_0_4px_rgba(16,185,129,0.10)]
                animate-pulse
              "
            />

            <p
              className="
                text-[10px]
                font-extrabold
                uppercase
                tracking-[0.2em]
                text-emerald-600/70
              "
            >
              {role === "admin"
                ? "Administration"
                : "Learning"}
            </p>
          </div>

          <nav className="space-y-2">
            {links.map((link, index) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={
                  link.path === "/dashboard" ||
                  link.path === "/admin"
                }
                onClick={onClose}
                style={{
                  animationDelay: `${index * 45}ms`,
                }}
                className={({ isActive }) => `
                  group
                  relative
                  flex
                  items-center
                  gap-3
                  overflow-hidden
                  rounded-2xl
                  border
                  px-3
                  py-3
                  text-sm
                  font-semibold
                  transition-all
                  duration-300
                  animate-[mobileNavIn_350ms_ease-out_both]

                  ${
                    isActive
                      ? `
                        border-emerald-100
                        bg-gradient-to-r
                        from-emerald-50
                        via-emerald-50/70
                        to-white
                        text-emerald-700
                        shadow-sm
                        shadow-emerald-500/10
                      `
                      : `
                        border-transparent
                        text-slate-500
                        hover:-translate-y-0.5
                        hover:border-emerald-100
                        hover:bg-emerald-50/60
                        hover:text-emerald-700
                        hover:shadow-sm
                      `
                  }
                `}
              >
                {({ isActive }) => (
                  <>
                    {/* Active indicator */}
                    <span
                      className={`
                        absolute
                        left-0
                        top-1/2
                        h-0
                        w-1
                        -translate-y-1/2
                        rounded-r-full
                        bg-gradient-to-b
                        from-emerald-400
                        to-green-600
                        transition-all
                        duration-300
                        ${
                          isActive
                            ? "h-8"
                            : "group-hover:h-5"
                        }
                      `}
                    />

                    {/* Icon */}
                    <span
                      className={`
                        relative
                        flex
                        h-10
                        w-10
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        text-base
                        transition-all
                        duration-300

                        ${
                          isActive
                            ? `
                              bg-gradient-to-br
                              from-emerald-500
                              to-green-600
                              text-white
                              shadow-md
                              shadow-emerald-500/20
                              scale-105
                            `
                            : `
                              bg-slate-50
                              group-hover:scale-110
                              group-hover:bg-emerald-100
                            `
                        }
                      `}
                    >
                      {isActive && (
                        <span
                          className="
                            absolute
                            inset-0
                            rounded-xl
                            bg-emerald-300/20
                            blur-md
                            animate-pulse
                          "
                        />
                      )}

                      <span
                        className="
                          relative
                          z-10
                          transition-transform
                          duration-300
                          group-hover:scale-110
                          group-hover:-rotate-3
                        "
                      >
                        {link.icon}
                      </span>
                    </span>

                    {/* Label */}
                    <span
                      className={`
                        flex-1
                        transition-all
                        duration-300
                        ${
                          isActive
                            ? "font-bold text-emerald-700"
                            : "group-hover:translate-x-0.5"
                        }
                      `}
                    >
                      {link.label}
                    </span>

                    {/* Active arrow */}
                    {isActive && (
                      <span
                        className="
                          flex
                          h-6
                          w-6
                          items-center
                          justify-center
                          rounded-lg
                          bg-emerald-100
                          text-xs
                          font-bold
                          text-emerald-600
                          animate-[mobileArrowIn_250ms_ease-out]
                        "
                      >
                        →
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Bottom */}
        <div
          className="
            relative
            shrink-0
            border-t
            border-emerald-100
            bg-white
            p-4
          "
        >
          <div
            className="
              relative
              overflow-hidden
              rounded-2xl
              border
              border-emerald-100
              bg-gradient-to-br
              from-emerald-50
              via-green-50/50
              to-white
              p-4
              shadow-sm
              shadow-emerald-500/5
            "
          >
            {/* Decorative glow */}
            <div
              className="
                pointer-events-none
                absolute
                -right-8
                -top-8
                h-20
                w-20
                rounded-full
                bg-emerald-200/40
                blur-2xl
              "
            />

            <div className="relative z-10">
              <div className="flex items-center gap-2">
                <span
                  className="
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-lg
                    bg-white
                    text-sm
                    shadow-sm
                  "
                >
                  🚀
                </span>

                <p className="text-sm font-extrabold text-emerald-800">
                  Keep learning
                </p>
              </div>

              <p className="mt-2 text-xs leading-5 text-emerald-600/80">
                Every lesson brings you closer to your goal.
              </p>

              <div className="mt-3 h-1 overflow-hidden rounded-full bg-emerald-100">
                <div
                  className="
                    h-full
                    w-1/2
                    rounded-full
                    bg-gradient-to-r
                    from-emerald-400
                    to-green-600
                    animate-[progressGlow_2.5s_ease-in-out_infinite]
                  "
                />
              </div>
            </div>
          </div>

          <p
            className="
              mt-3
              text-center
              text-[9px]
              font-semibold
              uppercase
              tracking-[0.18em]
              text-slate-300
            "
          >
            SkillForge • Learning Platform
          </p>
        </div>

        <style>
          {`
            @keyframes overlayIn {
              0% {
                opacity: 0;
              }

              100% {
                opacity: 1;
              }
            }

            @keyframes mobileLogoFloat {
              0%,
              100% {
                transform: translateY(0);
              }

              50% {
                transform: translateY(-3px);
              }
            }

            @keyframes mobileNavIn {
              0% {
                opacity: 0;
                transform: translateX(-12px);
              }

              100% {
                opacity: 1;
                transform: translateX(0);
              }
            }

            @keyframes mobileArrowIn {
              0% {
                opacity: 0;
                transform: translateX(-5px) scale(0.8);
              }

              100% {
                opacity: 1;
                transform: translateX(0) scale(1);
              }
            }

            @keyframes progressGlow {
              0% {
                transform: translateX(-100%);
                opacity: 0.5;
              }

              50% {
                transform: translateX(100%);
                opacity: 1;
              }

              100% {
                transform: translateX(200%);
                opacity: 0.5;
              }
            }
          `}
        </style>
      </aside>
    </>
  );
};

export default MobileSidebar;