import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

import useAuth from "../../hooks/useAuth";

const Sidebar = ({ role = "user" }) => {
  const navigate = useNavigate();

  const { logoutUser, logout } = useAuth();

  // =====================================================
  // STUDENT LINKS
  // =====================================================

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

    // PROJECTS

    {
      label: "My Projects",
      path: "/projects",
      icon: "🚀",
    },
    {
      label: "Create Project",
      path: "/projects/create",
      icon: "➕",
    },

    // AI

    {
      label: "AI Learning Assistant",
      path: "/student/ai-chatbot",
      icon: "🤖",
    },
    {
      label: "AI Recommendations",
      path: "/student/ai-recommendations",
      icon: "✨",
    },
    {
      label: "AI Search",
      path: "/student/ai-search",
      icon: "🔎",
    },

    // PROFILE

    {
      label: "Profile",
      path: "/student/profile",
      icon: "👤",
    },
  ];

  // =====================================================
  // ADMIN LINKS
  // =====================================================

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

    // ===================================================
    // COLLABSPHERE
    // ===================================================

    {
      label: "Projects",
      path: "/projects",
      icon: "🚀",
    },

    // AI

    {
      label: "AI Course Generator",
      path: "/admin/ai-content-generator",
      icon: "✨",
    },
    {
      label: "AI Assignment Generator",
      path: "/admin/ai-assignment-generator",
      icon: "🤖",
    },
    {
      label: "AI Feedback",
      path: "/admin/ai-feedback",
      icon: "💡",
    },

    // PROFILE

    {
      label: "Profile",
      path: "/admin/profile",
      icon: "👤",
    },
  ];

  const links =
    role === "admin"
      ? adminLinks
      : studentLinks;

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = async () => {
    try {
      if (typeof logoutUser === "function") {
        await logoutUser();
      } else if (typeof logout === "function") {
        await logout();
      }

      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);

      navigate("/login", { replace: true });
    }
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <aside
      className="
        fixed
        left-0
        top-20
        bottom-0
        z-40
        hidden
        w-80
        lg:flex
        flex-col
        overflow-hidden
        border-r
        border-emerald-100
        bg-white
        shadow-xl
      "
    >
      {/* BACKGROUND */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="
            absolute
            -right-20
            -top-20
            h-60
            w-60
            rounded-full
            bg-emerald-100/40
            blur-3xl
          "
        />

        <div
          className="
            absolute
            -bottom-20
            -left-20
            h-60
            w-60
            rounded-full
            bg-green-100/40
            blur-3xl
          "
        />
      </div>

      {/* SIDEBAR HEADER */}

      <div
        className="
          relative
          border-b
          border-emerald-100
          px-6
          py-6
        "
      >
        <div className="flex items-center gap-4">
          <div
            className="
              flex
              h-12
              w-12
              shrink-0
              items-center
              justify-center
              rounded-2xl
              bg-gradient-to-br
              from-emerald-500
              to-green-600
              text-xl
              text-white
              shadow-lg
              shadow-emerald-200
            "
          >
            {role === "admin" ? "👑" : "🎓"}
          </div>

          <div className="min-w-0">
            <p
              className="
                text-xs
                font-semibold
                uppercase
                tracking-wider
                text-emerald-600
              "
            >
              {role === "admin"
                ? "Administrator"
                : "Student"}
            </p>

            <div className="mt-1 flex items-center gap-2">
              <span
                className="
                  h-2
                  w-2
                  rounded-full
                  bg-emerald-500
                  shadow-sm
                  shadow-emerald-300
                "
              />

              <span className="text-sm font-medium text-slate-600">
                {role === "admin"
                  ? "Control Center"
                  : "Learning Dashboard"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* NAVIGATION */}

      <nav
        className="
          relative
          flex-1
          overflow-y-auto
          px-4
          py-5
          scrollbar-thin
          scrollbar-thumb-emerald-200
          scrollbar-track-transparent
        "
      >
        <div className="space-y-2">
          {links.map((link) => {
            const isExactRoute =
              link.path === "/student" ||
              link.path === "/admin" ||
              link.path === "/projects";

            return (
              <NavLink
                key={`${role}-${link.path}`}
                to={link.path}
                end={isExactRoute}
                className={({ isActive }) =>
                  `
                  group
                  relative
                  flex
                  items-center
                  gap-4
                  overflow-hidden
                  rounded-2xl
                  px-4
                  py-3.5
                  transition-all
                  duration-300

                  ${
                    isActive
                      ? `
                        bg-gradient-to-r
                        from-emerald-500
                        to-green-600
                        text-white
                        shadow-lg
                        shadow-emerald-200
                      `
                      : `
                        text-slate-600
                        hover:bg-emerald-50
                        hover:text-emerald-700
                      `
                  }
                  `
                }
              >
                {({ isActive }) => (
                  <>
                    {/* ACTIVE INDICATOR */}

                    {isActive && (
                      <span
                        className="
                          absolute
                          left-0
                          top-1/2
                          h-8
                          w-1
                          -translate-y-1/2
                          rounded-r-full
                          bg-white
                        "
                      />
                    )}

                    {/* ICON */}

                    <div
                      className={`
                        flex
                        h-10
                        w-10
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        text-lg
                        transition-all
                        duration-300

                        ${
                          isActive
                            ? "bg-white/20 shadow-inner"
                            : "bg-emerald-50 group-hover:bg-white group-hover:shadow-md"
                        }
                      `}
                    >
                      {link.icon}
                    </div>

                    {/* LABEL */}

                    <span
                      className={`
                        flex-1
                        text-sm
                        font-semibold

                        ${
                          isActive
                            ? "text-white"
                            : "text-slate-600 group-hover:text-emerald-700"
                        }
                      `}
                    >
                      {link.label}
                    </span>

                    {/* ARROW */}

                    <span
                      className={`
                        text-lg
                        transition-all
                        duration-300

                        ${
                          isActive
                            ? "translate-x-0 text-white opacity-100"
                            : "-translate-x-1 text-emerald-400 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                        }
                      `}
                    >
                      →
                    </span>

                    {/* HOVER GLOW */}

                    {!isActive && (
                      <span
                        className="
                          pointer-events-none
                          absolute
                          inset-0
                          -z-10
                          rounded-2xl
                          bg-gradient-to-r
                          from-emerald-100/0
                          via-emerald-100/30
                          to-green-100/0
                          opacity-0
                          transition-opacity
                          duration-300
                          group-hover:opacity-100
                        "
                      />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* LOGOUT */}

      <div
        className="
          relative
          border-t
          border-emerald-100
          bg-white/80
          px-4
          py-4
          backdrop-blur-sm
        "
      >
        <button
          type="button"
          onClick={handleLogout}
          className="
            group
            flex
            w-full
            items-center
            gap-4
            rounded-2xl
            border
            border-red-100
            bg-red-50
            px-4
            py-3.5
            text-left
            transition-all
            duration-300
            hover:border-red-200
            hover:bg-red-100
            hover:shadow-md
            hover:shadow-red-100
          "
        >
          <div
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-white
              text-lg
              shadow-sm
              transition-transform
              duration-300
              group-hover:scale-105
            "
          >
            🚪
          </div>

          <div className="flex-1">
            <p className="text-sm font-semibold text-red-600">
              Logout
            </p>

            <p className="text-xs text-red-400">
              Sign out of your account
            </p>
          </div>

          <span
            className="
              text-lg
              text-red-400
              transition-transform
              duration-300
              group-hover:translate-x-1
            "
          >
            →
          </span>
        </button>

        <p
          className="
            mt-4
            text-center
            text-[11px]
            font-medium
            tracking-wide
            text-slate-400
          "
        >
          SkillForge • Learning Platform
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;