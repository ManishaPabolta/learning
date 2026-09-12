import React from "react";
import {
  BookOpen,
  Upload,
  Search,
  UserRound,
} from "lucide-react";
import { Link } from "react-router-dom";

const QuickActions = () => {
  const actions = [
    {
      title: "Browse Courses",
      description: "Find a new course",
      icon: Search,
      path: "/courses",
      className: "text-emerald-600 bg-emerald-50",
    },
    {
      title: "My Courses",
      description: "View enrolled courses",
      icon: BookOpen,
      path: "/courses",
      className: "text-green-600 bg-green-50",
    },
    {
      title: "Upload Assignment",
      description: "Submit your work",
      icon: Upload,
      path: "/assignments",
      className: "text-teal-600 bg-teal-50",
    },
    {
      title: "My Profile",
      description: "Manage your account",
      icon: UserRound,
      path: "/profile",
      className: "text-lime-600 bg-lime-50",
    },
  ];

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-emerald-100 bg-white p-5 shadow-[0_10px_35px_rgba(16,185,129,0.07)] transition-all duration-500 hover:shadow-[0_18px_45px_rgba(16,185,129,0.12)] sm:p-6">

      {/* Decorative glow */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-emerald-100/70 blur-3xl transition-transform duration-700 group-hover:scale-125" />

      <div className="relative">

        <h2 className="font-black text-slate-800">
          Quick Actions
        </h2>

        <p className="mt-1 text-xs font-medium text-slate-400">
          Frequently used actions
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3">

          {actions.map((action, index) => {
            const Icon = action.icon;

            return (
              <Link
                key={action.title}
                to={action.path}
                style={{
                  animationDelay: `${index * 80}ms`,
                }}
                className="
                  group/action relative overflow-hidden
                  rounded-2xl border border-emerald-100
                  bg-emerald-50/30 p-4
                  transition-all duration-400
                  animate-[quickAction_0.5s_ease-out_both]
                  hover:-translate-y-1
                  hover:border-emerald-200
                  hover:bg-white
                  hover:shadow-[0_10px_25px_rgba(16,185,129,0.10)]
                "
              >

                {/* Hover glow */}
                <div className="absolute -right-6 -top-6 h-16 w-16 rounded-full bg-emerald-100/60 opacity-0 blur-2xl transition-opacity duration-500 group-hover/action:opacity-100" />

                <div
                  className={`
                    relative flex h-10 w-10
                    items-center justify-center
                    rounded-xl
                    shadow-sm
                    transition-all duration-300
                    group-hover/action:scale-110
                    group-hover/action:rotate-3
                    ${action.className}
                  `}
                >
                  <Icon size={18} />
                </div>

                <h3 className="relative mt-3 text-xs font-bold text-slate-700 transition-colors group-hover/action:text-emerald-700">
                  {action.title}
                </h3>

                <p className="relative mt-1 text-[10px] font-medium text-slate-400">
                  {action.description}
                </p>

              </Link>
            );
          })}

        </div>

      </div>

      <div className="absolute bottom-0 left-6 right-6 h-[2px] overflow-hidden rounded-full bg-emerald-50">
        <div className="h-full w-1/3 animate-[quickLine_3s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
      </div>

      <style>{`
        @keyframes quickAction {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes quickLine {
          0% {
            transform: translateX(-120%);
          }
          50% {
            transform: translateX(320%);
          }
          100% {
            transform: translateX(320%);
          }
        }
      `}</style>

    </div>
  );
};

export default QuickActions;