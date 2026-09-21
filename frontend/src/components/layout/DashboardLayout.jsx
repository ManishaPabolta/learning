import React, { useState } from "react";
import { Outlet } from "react-router-dom";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import MobileSidebar from "./MobileSidebar";

const DashboardLayout = ({ role = "user", children }) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const handleOpenMobileSidebar = () => {
    setMobileSidebarOpen(true);
  };

  const handleCloseMobileSidebar = () => {
    setMobileSidebarOpen(false);
  };

  return (
    <div
      className="
        min-h-screen
        bg-gradient-to-br
        from-emerald-50/40
        via-white
        to-green-50/30
      "
    >
      {/* =====================================================
          COMMON NAVBAR
      ===================================================== */}

      <Navbar onMenuClick={handleOpenMobileSidebar} />

      <div className="relative flex">
        {/* =====================================================
            DESKTOP SIDEBAR
        ===================================================== */}

        <Sidebar role={role} />

        {/* =====================================================
            MOBILE SIDEBAR
        ===================================================== */}

        <MobileSidebar
          role={role}
          isOpen={mobileSidebarOpen}
          onClose={handleCloseMobileSidebar}
        />

        {/* =====================================================
            MAIN CONTENT
        ===================================================== */}

        <main
          className="
            min-h-[calc(100vh-5rem)]
            min-w-0
            flex-1
            overflow-x-hidden
            transition-all
            duration-300
            lg:ml-80
          "
        >
          <div
            className="
              mx-auto
              w-full
              max-w-[1600px]
              p-4
              sm:p-6
              lg:p-8
            "
          >
           {children || <Outlet />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;