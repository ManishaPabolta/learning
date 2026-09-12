import React, { useState } from "react";
import DashboardSidebar from "./DashboardSidebar";
import DashboardNavbar from "./DashboardNavbar";

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div
      className="
        min-h-screen
        bg-gradient-to-br
        from-emerald-50/30
        via-white
        to-green-50/20
        text-slate-900
      "
    >
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className="
            absolute
            -left-40
            -top-40
            h-96
            w-96
            rounded-full
            bg-emerald-400/10
            blur-[120px]
          "
        />

        <div
          className="
            absolute
            -bottom-40
            -right-40
            h-96
            w-96
            rounded-full
            bg-green-400/10
            blur-[120px]
          "
        />

        <div
          className="
            absolute
            left-1/2
            top-1/2
            h-72
            w-72
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-emerald-100/20
            blur-[100px]
          "
        />
      </div>

      <div className="relative flex min-h-screen">
        {/* Desktop Sidebar */}
        <DashboardSidebar />

        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="
              fixed
              inset-0
              z-40
              bg-slate-950/50
              backdrop-blur-sm
              animate-[overlayFade_250ms_ease-out]
              lg:hidden
            "
          />
        )}

        {/* Mobile Sidebar */}
        <div
          className={`
            fixed
            inset-y-0
            left-0
            z-50
            w-72
            transform
            transition-transform
            duration-300
            lg:hidden

            ${
              sidebarOpen
                ? "translate-x-0"
                : "-translate-x-full"
            }
          `}
        >
          <DashboardSidebar mobile />
        </div>

        {/* Main */}
        <div className="flex min-w-0 flex-1 flex-col lg:ml-72">
          <DashboardNavbar
            onMenuClick={() =>
              setSidebarOpen(true)
            }
          />

          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl">
              {children}
            </div>
          </main>
        </div>
      </div>

      <style>{`
        @keyframes overlayFade {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default DashboardLayout;