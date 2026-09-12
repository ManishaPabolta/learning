import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  Users,
  Settings,
  LogOut,
  GraduationCap,
  X,
} from "lucide-react";

const DashboardSidebar = ({ mobile = false }) => {

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Courses",
      path: "/courses",
      icon: BookOpen,
    },
    {
      name: "Assignments",
      path: "/assignments",
      icon: FileText,
    },
    {
      name: "Students",
      path: "/students",
      icon: Users,
    },
    {
      name: "Settings",
      path: "/settings",
      icon: Settings,
    },
  ];

  return (
    <aside
      className={`
        ${
          mobile
            ? "flex h-full w-full"
            : "hidden lg:flex"
        }
        fixed left-0 top-0 z-50 h-screen w-72
        flex-col overflow-hidden
        border-r border-emerald-100
        bg-white
        shadow-[8px_0_35px_rgba(16,185,129,0.07)]
      `}
    >

      {/* Ambient decorations */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-emerald-100/60 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-28 -left-28 h-64 w-64 rounded-full bg-green-100/50 blur-3xl" />

      {/* Logo */}
      <div className="relative flex h-20 shrink-0 items-center justify-between border-b border-emerald-100 px-6">

        <div className="flex items-center gap-3">

          <div
            className="
              group relative flex h-11 w-11
              items-center justify-center
              overflow-hidden rounded-2xl
              bg-gradient-to-br
              from-emerald-500 via-green-500 to-emerald-700
              text-white
              shadow-lg shadow-emerald-500/20
              transition-all duration-500
              hover:rotate-3 hover:scale-105
            "
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 transition group-hover:opacity-100" />

            <GraduationCap
              size={23}
              className="relative transition-transform duration-500 group-hover:-rotate-6"
            />
          </div>

          <div>
            <h1 className="text-lg font-black tracking-tight text-slate-800">
              NGSkill
              <span className="text-emerald-600">Forge</span>
            </h1>

            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
              Learning Platform
            </p>
          </div>

        </div>

        {mobile && (
          <button
            className="
              group rounded-xl border border-emerald-100
              bg-white p-2 text-slate-400
              transition-all duration-300
              hover:border-emerald-200
              hover:bg-emerald-50
              hover:text-emerald-600
            "
          >
            <X
              size={20}
              className="transition-transform duration-300 group-hover:rotate-90"
            />
          </button>
        )}

      </div>

      {/* Navigation */}
      <nav className="relative flex-1 space-y-2 overflow-y-auto p-4">

        <p className="mb-4 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
          Main Menu
        </p>

        {menuItems.map((item, index) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              style={{
                animationDelay: `${index * 70}ms`,
              }}
              className={({ isActive }) =>
                `
                group relative flex items-center gap-3
                overflow-hidden rounded-2xl px-4 py-3.5
                text-sm font-semibold
                transition-all duration-300
                animate-[sidebarItem_0.5s_ease-out_both]
                ${
                  isActive
                    ? `
                      bg-gradient-to-r
                      from-emerald-50
                      to-green-50
                      text-emerald-700
                      shadow-sm
                    `
                    : `
                      text-slate-500
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
                  {/* Active indicator */}
                  {isActive && (
                    <>
                      <span className="absolute left-0 h-8 w-1 rounded-r-full bg-gradient-to-b from-emerald-400 to-emerald-600" />

                      <span className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-emerald-100/40 to-transparent" />
                    </>
                  )}

                  <Icon
                    size={19}
                    className={`
                      relative z-10
                      transition-all duration-300
                      ${
                        isActive
                          ? "scale-110 text-emerald-600"
                          : "group-hover:scale-110 group-hover:text-emerald-600"
                      }
                    `}
                  />

                  <span className="relative z-10">
                    {item.name}
                  </span>

                  {isActive && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.7)]" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}

      </nav>

      {/* Bottom */}
      <div className="relative shrink-0 border-t border-emerald-100 p-4">

        <button
          className="
            group flex w-full items-center gap-3
            rounded-2xl px-4 py-3.5
            text-sm font-semibold text-slate-500
            transition-all duration-300
            hover:-translate-y-0.5
            hover:bg-red-50
            hover:text-red-500
            hover:shadow-sm
          "
        >
          <LogOut
            size={19}
            className="
              transition-transform duration-300
              group-hover:-translate-x-1
            "
          />

          Logout
        </button>

      </div>

      <style>{`
        @keyframes sidebarItem {
          from {
            opacity: 0;
            transform: translateX(-12px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>

    </aside>
  );
};

export default DashboardSidebar;