import React from "react";
import {
  Menu,
  Bell,
  Search,
  ChevronDown,
} from "lucide-react";

const DashboardNavbar = ({ onMenuClick }) => {
  return (
    <header className="sticky top-0 z-30 border-b border-emerald-100/80 bg-white/85 backdrop-blur-2xl shadow-sm">
      
      {/* Animated top line */}
      <div className="absolute left-0 top-0 h-[2px] w-full overflow-hidden">
        <div className="h-full w-1/3 animate-[navbarLine_4s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
      </div>

      <div className="flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Left */}
        <div className="flex items-center gap-4">

          {/* Mobile Menu */}
          <button
            onClick={onMenuClick}
            className="
              group rounded-xl border border-emerald-100
              bg-white p-2.5 text-emerald-700
              shadow-sm transition-all duration-300
              hover:-translate-y-0.5
              hover:border-emerald-200
              hover:bg-emerald-50
              hover:shadow-md
              lg:hidden
            "
          >
            <Menu
              size={20}
              className="transition-transform duration-300 group-hover:rotate-90"
            />
          </button>

          {/* Search */}
          <div
            className="
              group hidden items-center gap-2.5
              rounded-2xl border border-emerald-100
              bg-emerald-50/40 px-4 py-2.5
              shadow-sm transition-all duration-300
              focus-within:border-emerald-300
              focus-within:bg-white
              focus-within:shadow-[0_8px_30px_rgba(16,185,129,0.12)]
              md:flex
            "
          >
            <Search
              size={17}
              className="
                text-emerald-500
                transition-transform duration-300
                group-focus-within:scale-110
              "
            />

            <input
              type="text"
              placeholder="Search..."
              className="
                w-48 bg-transparent text-sm
                text-slate-700 outline-none
                placeholder:text-slate-400
              "
            />
          </div>

        </div>

        {/* Right */}
        <div className="flex items-center gap-3">

          {/* Notification */}
          <button
            className="
              group relative rounded-xl
              border border-emerald-100
              bg-white p-2.5 text-slate-500
              shadow-sm transition-all duration-300
              hover:-translate-y-0.5
              hover:border-emerald-200
              hover:bg-emerald-50
              hover:text-emerald-600
              hover:shadow-md
            "
          >
            <Bell
              size={19}
              className="
                transition-transform duration-300
                group-hover:rotate-12
              "
            />

            {/* Notification dot */}
            <span className="absolute right-2 top-2">
              <span className="absolute h-2 w-2 animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative block h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white" />
            </span>
          </button>

          {/* Profile */}
          <button
            className="
              group flex items-center gap-3
              rounded-2xl border border-emerald-100
              bg-white p-1.5 pr-3
              shadow-sm transition-all duration-300
              hover:-translate-y-0.5
              hover:border-emerald-200
              hover:bg-emerald-50/60
              hover:shadow-md
            "
          >

            {/* Avatar */}
            <div
              className="
                relative flex h-9 w-9
                items-center justify-center
                overflow-hidden rounded-xl
                bg-gradient-to-br
                from-emerald-500 via-green-500 to-emerald-700
                text-sm font-black text-white
                shadow-md shadow-emerald-500/20
                transition-all duration-300
                group-hover:scale-105
              "
            >
              <span className="absolute inset-0 bg-white/10 opacity-0 transition group-hover:opacity-100" />
              <span className="relative">U</span>
            </div>

            <div className="hidden text-left sm:block">
              <p className="text-xs font-bold text-slate-800">
                User
              </p>

              <p className="text-[10px] font-medium text-emerald-600">
                Student
              </p>
            </div>

            <ChevronDown
              size={15}
              className="
                hidden text-slate-400
                transition-all duration-300
                group-hover:translate-y-0.5
                group-hover:text-emerald-600
                sm:block
              "
            />

          </button>

        </div>

      </div>

      <style>{`
        @keyframes navbarLine {
          0% {
            transform: translateX(-120%);
          }
          50% {
            transform: translateX(250%);
          }
          100% {
            transform: translateX(250%);
          }
        }
      `}</style>
    </header>
  );
};

export default DashboardNavbar;