import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  Users,
  Settings,
  X,
  GraduationCap,
} from "lucide-react";

const MobileSidebar = ({
  open,
  onClose,
}) => {

  const items = [
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
    <>
      {/* Overlay */}
      {open && (
        <div
          onClick={onClose}
          className="
            fixed inset-0 z-40
            bg-slate-900/40
            backdrop-blur-md
            transition-opacity
          "
        />
      )}

      <aside
        className={`
          fixed left-0 top-0 z-50
          h-screen w-72
          overflow-hidden
          border-r border-emerald-100
          bg-white
          shadow-2xl shadow-emerald-900/10
          transition-transform duration-500
          ${
            open
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >

        {/* Decorative glow */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-emerald-100 blur-3xl" />

        {/* Header */}
        <div className="relative flex h-20 items-center justify-between border-b border-emerald-100 px-5">

          <div className="flex items-center gap-3">

            <div
              className="
                flex h-10 w-10
                items-center justify-center
                rounded-xl
                bg-gradient-to-br
                from-emerald-500
                to-green-600
                text-white
                shadow-lg shadow-emerald-500/20
              "
            >
              <GraduationCap size={21} />
            </div>

            <div>
              <span className="font-black text-slate-800">
                NGSkill
                <span className="text-emerald-600">Forge</span>
              </span>

              <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">
                Learning Platform
              </p>
            </div>

          </div>

          <button
            onClick={onClose}
            className="
              group rounded-xl
              border border-emerald-100
              bg-white p-2
              text-slate-400
              transition-all duration-300
              hover:border-emerald-200
              hover:bg-emerald-50
              hover:text-emerald-600
            "
          >
            <X
              size={19}
              className="transition-transform duration-300 group-hover:rotate-90"
            />
          </button>

        </div>

        {/* Links */}
        <nav className="relative space-y-2 overflow-y-auto p-4">

          <p className="mb-4 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
            Main Menu
          </p>

          {items.map((item, index) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                style={{
                  animationDelay: `${index * 70}ms`,
                }}
                className={({ isActive }) =>
                  `
                  group relative flex items-center gap-3
                  overflow-hidden rounded-2xl
                  px-4 py-3.5
                  text-sm font-semibold
                  transition-all duration-300
                  animate-[mobileNav_0.45s_ease-out_both]
                  ${
                    isActive
                      ? "bg-emerald-50 text-emerald-700 shadow-sm"
                      : "text-slate-500 hover:bg-emerald-50/70 hover:text-emerald-700"
                  }
                  `
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="absolute left-0 h-8 w-1 rounded-r-full bg-emerald-500" />
                    )}

                    <Icon
                      size={18}
                      className={`
                        transition-all duration-300
                        ${
                          isActive
                            ? "scale-110 text-emerald-600"
                            : "group-hover:scale-110 group-hover:text-emerald-600"
                        }
                      `}
                    />

                    <span>{item.name}</span>

                    {isActive && (
                      <span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}

        </nav>

        {/* Bottom learning card */}
        <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-green-50 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
              <GraduationCap size={18} />
            </div>

            <div>
              <p className="text-xs font-bold text-slate-700">
                Keep Learning
              </p>

              <p className="text-[10px] text-slate-400">
                Build your skills every day
              </p>
            </div>
          </div>

          <div className="mt-3 h-1 overflow-hidden rounded-full bg-white">
            <div className="h-full w-2/3 animate-[progressGlow_2s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-emerald-400 to-green-600" />
          </div>
        </div>

        <style>{`
          @keyframes mobileNav {
            from {
              opacity: 0;
              transform: translateX(-15px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes progressGlow {
            0%, 100% {
              opacity: 0.7;
            }
            50% {
              opacity: 1;
            }
          }
        `}</style>

      </aside>
    </>
  );
};

export default MobileSidebar;