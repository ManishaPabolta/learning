
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const Sidebar = ({ role = "user" }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const studentLinks = [
    {
      label: "Dashboard",
      path: "/student",
      icon: "▦",
    },
    {
      label: "Browse Courses",
      path: "/courses",
      icon: "📚",
    },
    {
      label: "My Courses",
      path: "/student/courses",
      icon: "🎓",
    },
    {
      label: "Assignments",
      path: "/student/assignments",
      icon: "📝",
    },
    {
      label: "Profile",
      path: "/student/profile",
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
      path: "/admin/courses/add",
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
      path: "/admin/profile",
      icon: "👤",
    },
  ];

  const links = role === "admin" ? adminLinks : studentLinks;

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
      navigate("/login", { replace: true });
    }
  };

  return (
    <>
      <aside
        className="
          fixed
          left-0
          top-20
          z-30
          hidden
          h-[calc(100vh-5rem)]
          w-80
          shrink-0
          overflow-hidden
          border-r
          border-emerald-100
          bg-white
          lg:flex
          lg:flex-col
          shadow-[4px_0_30px_rgba(16,185,129,0.06)]
        "
      >

        {/* ==========================================
            DECORATIVE BACKGROUND
        ========================================== */}

        <div
          className="
            pointer-events-none
            absolute
            -right-20
            -top-20
            h-48
            w-48
            rounded-full
            bg-emerald-100/40
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

        {/* ==========================================
            SIDEBAR HEADER
        ========================================== */}

        <div className="relative px-7 pt-7">

          <div
            className="
              flex
              items-center
              justify-between
              rounded-2xl
              border
              border-emerald-100
              bg-gradient-to-br
              from-emerald-50
              via-white
              to-white
              px-4
              py-4
              shadow-sm
              shadow-emerald-500/5
            "
          >

            <div className="flex items-center gap-3">

              {/* Small animated logo */}

              <div
                className="
                  relative
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  bg-gradient-to-br
                  from-emerald-400
                  to-emerald-700
                  text-lg
                  text-white
                  shadow-md
                  shadow-emerald-500/20
                  animate-[sidebarFloat_3s_ease-in-out_infinite]
                "
              >
                {role === "admin" ? "⚙️" : "🎓"}
              </div>

              <div>
                <p
                  className="
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.18em]
                    text-emerald-600/60
                  "
                >
                  {role === "admin"
                    ? "Admin Panel"
                    : "Student Area"}
                </p>

                <p
                  className="
                    mt-0.5
                    text-sm
                    font-extrabold
                    text-slate-800
                  "
                >
                  {role === "admin"
                    ? "Administration"
                    : "Learning Hub"}
                </p>
              </div>

            </div>

            {/* Green status dot */}

            <span
              className="
                h-2.5
                w-2.5
                rounded-full
                bg-emerald-500
                shadow-[0_0_0_4px_rgba(16,185,129,0.10)]
                animate-pulse
              "
            />

          </div>

        </div>


        {/* ==========================================
            NAVIGATION
        ========================================== */}

        <nav
          className="
            relative
            mt-6
            flex-1
            overflow-hidden
            px-6
          "
        >

          <div className="space-y-2">

            {links.map((link, index) => (
              <NavLink
                key={link.path}
                to={link.path}
                style={{
                  animationDelay: `${index * 50}ms`,
                }}
                className={({ isActive }) =>
                  `
                    group
                    relative
                    flex
                    items-center
                    gap-4
                    overflow-hidden
                    rounded-2xl
                    px-3
                    py-3
                    transition-all
                    duration-300
                    animate-[sidebarItemIn_400ms_ease-out_both]

                    ${
                      isActive
                        ? `
                          bg-gradient-to-r
                          from-emerald-50
                          via-emerald-50/70
                          to-white
                          text-emerald-700
                          shadow-sm
                          shadow-emerald-500/10
                        `
                        : `
                          text-slate-600
                          hover:-translate-y-0.5
                          hover:bg-emerald-50/70
                          hover:text-emerald-700
                          hover:shadow-sm
                        `
                    }
                  `
                }
              >
                {({ isActive }) => (
                  <>

                    {/* ACTIVE SIDE LINE */}

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
                            ? "h-9"
                            : "group-hover:h-5"
                        }
                      `}
                    />


                    {/* ICON */}

                    <span
                      className={`
                        relative
                        flex
                        h-11
                        w-11
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        text-lg
                        transition-all
                        duration-300

                        ${
                          isActive
                            ? `
                              bg-gradient-to-br
                              from-emerald-100
                              to-green-50
                              shadow-sm
                              shadow-emerald-500/10
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

                      {/* ICON GLOW */}

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


                    {/* LABEL */}

                    <span
                      className={`
                        text-sm
                        font-bold
                        transition-all
                        duration-300
                        ${
                          isActive
                            ? "text-emerald-700"
                            : "text-slate-600 group-hover:text-emerald-700"
                        }
                      `}
                    >
                      {link.label}
                    </span>


                    {/* ACTIVE ARROW */}

                    {isActive && (
                      <span
                        className="
                          ml-auto
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
                          animate-[arrowIn_250ms_ease-out]
                        "
                      >
                        →
                      </span>
                    )}

                  </>
                )}
              </NavLink>
            ))}

          </div>

        </nav>


        {/* ==========================================
            BOTTOM SECTION
        ========================================== */}

        <div className="relative px-6 pb-6">

          {/* Decorative divider */}

          <div
            className="
              mb-4
              h-px
              w-full
              bg-gradient-to-r
              from-transparent
              via-emerald-100
              to-transparent
            "
          />


          {/* LOGOUT */}

          <button
            onClick={handleLogout}
            className="
              group
              relative
              flex
              w-full
              items-center
              gap-4
              overflow-hidden
              rounded-2xl
              border
              border-red-100
              bg-white
              px-3
              py-3
              text-red-500
              shadow-sm
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:border-red-200
              hover:bg-red-50
              hover:shadow-md
              hover:shadow-red-500/10
              active:scale-[0.98]
            "
          >

            {/* Hover background animation */}

            <span
              className="
                pointer-events-none
                absolute
                inset-y-0
                left-0
                w-0
                bg-gradient-to-r
                from-red-50
                to-transparent
                transition-all
                duration-500
                group-hover:w-full
              "
            />


            {/* LOGOUT ICON */}

            <span
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
                bg-red-50
                text-lg
                transition-all
                duration-300
                group-hover:scale-110
                group-hover:rotate-3
                group-hover:bg-red-100
              "
            >
              🚪
            </span>


            {/* LABEL */}

            <span
              className="
                relative
                z-10
                text-sm
                font-bold
                transition-transform
                duration-300
                group-hover:translate-x-1
              "
            >
              Logout
            </span>

          </button>


          {/* VERSION / BRAND */}

          <p
            className="
              mt-4
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


        {/* ==========================================
            SIDEBAR ANIMATIONS
        ========================================== */}

        <style>
          {`
            @keyframes sidebarFloat {
              0%,
              100% {
                transform: translateY(0);
              }

              50% {
                transform: translateY(-3px);
              }
            }


            @keyframes sidebarItemIn {
              0% {
                opacity: 0;
                transform: translateX(-12px);
              }

              100% {
                opacity: 1;
                transform: translateX(0);
              }
            }


            @keyframes arrowIn {
              0% {
                opacity: 0;
                transform: translateX(-5px) scale(0.8);
              }

              100% {
                opacity: 1;
                transform: translateX(0) scale(1);
              }
            }
          `}
        </style>

      </aside>
    </>
  );
};

export default Sidebar;

