import React, { useState } from "react";
import { Outlet } from "react-router-dom";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import MobileSidebar from "./MobileSidebar";

const DashboardLayout = ({ role = "user" }) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] =
    useState(false);

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
      {/* Navbar */}
      <Navbar
        onMenuClick={() =>
          setMobileSidebarOpen(true)
        }
      />

      <div className="relative flex">

        {/* Desktop Sidebar */}
        <Sidebar role={role} />

        {/* Mobile Sidebar */}
        <MobileSidebar
          role={role}
          isOpen={mobileSidebarOpen}
          onClose={() =>
            setMobileSidebarOpen(false)
          }
        />

        {/* Main Content */}
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
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;