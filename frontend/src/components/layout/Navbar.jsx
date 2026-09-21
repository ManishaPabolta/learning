import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  Bell,
  Check,
  CheckCheck,
  FileText,
  GraduationCap,
  Info,
  Loader2,
  X,
} from "lucide-react";

import useAuth from "../../hooks/useAuth";
import api from "../../services/api";


const Navbar = ({ onMenuClick }) => {
  const [profileOpen, setProfileOpen] =
    useState(false);

  const [notificationOpen, setNotificationOpen] =
    useState(false);

  const [notifications, setNotifications] =
    useState([]);

  const [unreadCount, setUnreadCount] =
    useState(0);

  const [notificationLoading, setNotificationLoading] =
    useState(false);

  const navigate = useNavigate();

  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  const {
    user,
    logout,
    loading: authLoading,
  } = useAuth();


  // ==========================================
  // GET NOTIFICATIONS
  // ==========================================

  const fetchNotifications = async () => {
    try {
      setNotificationLoading(true);

      const response =
        await api.get("/notifications");

      if (response.data?.success) {
        setNotifications(
          response.data.notifications || []
        );

        setUnreadCount(
          response.data.unreadCount || 0
        );
      }
    } catch (error) {
      console.error(
        "GET NOTIFICATIONS ERROR:",
        error
      );
    } finally {
      setNotificationLoading(false);
    }
  };


  // ==========================================
  // LOAD NOTIFICATIONS
  // ==========================================

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);


  // ==========================================
  // CLOSE DROPDOWNS OUTSIDE CLICK
  // ==========================================

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(
          event.target
        )
      ) {
        setNotificationOpen(false);
      }

      if (
        profileRef.current &&
        !profileRef.current.contains(
          event.target
        )
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);


  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = async () => {
    try {
      await logout();

      navigate("/login");
    } catch (error) {
      console.error(
        "Logout error:",
        error
      );
    }
  };


  // ==========================================
  // INITIALS
  // ==========================================

  const getInitials = () => {
    if (!user?.name) return "U";

    return user.name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };


  // ==========================================
  // NOTIFICATION ICON
  // ==========================================

  const getNotificationIcon = (type) => {
    switch (type) {

      // ========================================
      // COURSE CREATED
      // ========================================

      case "course_created":
        return (
          <div
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-green-50
              text-green-600
              transition-all
              duration-300
              group-hover:scale-110
              group-hover:-rotate-3
              group-hover:bg-green-100
            "
          >
            <GraduationCap className="h-5 w-5" />
          </div>
        );


      // ========================================
      // COURSE UPDATED
      // ========================================

      case "course_updated":
        return (
          <div
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-green-50
              text-green-600
              transition-all
              duration-300
              group-hover:scale-110
              group-hover:-rotate-3
              group-hover:bg-green-100
            "
          >
            <GraduationCap className="h-5 w-5" />
          </div>
        );


      // ========================================
      // COURSE DELETED
      // ========================================

      case "course_deleted":
        return (
          <div
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-red-50
              text-red-500
              transition-all
              duration-300
              group-hover:scale-110
              group-hover:-rotate-3
              group-hover:bg-red-100
            "
          >
            <GraduationCap className="h-5 w-5" />
          </div>
        );


      // ========================================
      // COURSE ENROLLED
      // ========================================

      case "course_enrolled":
        return (
          <div
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-lime-50
              text-lime-600
              transition-all
              duration-300
              group-hover:scale-110
              group-hover:rotate-3
              group-hover:bg-lime-100
            "
          >
            <Check className="h-5 w-5" />
          </div>
        );


      // ========================================
      // ASSIGNMENT CREATED
      // ========================================

      case "assignment_created":
        return (
          <div
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-emerald-50
              text-emerald-600
              transition-all
              duration-300
              group-hover:scale-110
              group-hover:rotate-3
              group-hover:bg-emerald-100
            "
          >
            <FileText className="h-5 w-5" />
          </div>
        );


      // ========================================
      // ASSIGNMENT UPDATED
      // ========================================

      case "assignment_updated":
        return (
          <div
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-green-50
              text-green-600
              transition-all
              duration-300
              group-hover:scale-110
              group-hover:rotate-3
              group-hover:bg-green-100
            "
          >
            <FileText className="h-5 w-5" />
          </div>
        );


      // ========================================
      // ASSIGNMENT DELETED
      // ========================================

      case "assignment_deleted":
        return (
          <div
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-red-50
              text-red-500
              transition-all
              duration-300
              group-hover:scale-110
              group-hover:rotate-3
              group-hover:bg-red-100
            "
          >
            <FileText className="h-5 w-5" />
          </div>
        );


      // ========================================
      // ASSIGNMENT SUBMITTED
      // ========================================

      case "assignment_submitted":
        return (
          <div
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-blue-50
              text-blue-600
              transition-all
              duration-300
              group-hover:scale-110
              group-hover:-rotate-3
              group-hover:bg-blue-100
            "
          >
            <FileText className="h-5 w-5" />
          </div>
        );


      // ========================================
      // ASSIGNMENT RESUBMITTED
      // ========================================

      case "assignment_resubmitted":
        return (
          <div
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-indigo-50
              text-indigo-600
              transition-all
              duration-300
              group-hover:scale-110
              group-hover:rotate-3
              group-hover:bg-indigo-100
            "
          >
            <FileText className="h-5 w-5" />
          </div>
        );


      // ========================================
      // ASSIGNMENT APPROVED
      // ========================================

      case "assignment_approved":
        return (
          <div
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-lime-50
              text-lime-600
              transition-all
              duration-300
              group-hover:scale-110
              group-hover:rotate-3
              group-hover:bg-lime-100
            "
          >
            <Check className="h-5 w-5" />
          </div>
        );


      // ========================================
      // ASSIGNMENT REJECTED
      // ========================================

      case "assignment_rejected":
        return (
          <div
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-red-50
              text-red-500
              transition-all
              duration-300
              group-hover:scale-110
              group-hover:-rotate-3
              group-hover:bg-red-100
            "
          >
            <X className="h-5 w-5" />
          </div>
        );


      // ========================================
      // PROJECT CREATED
      // ========================================

      case "project_created":
        return (
          <div
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-emerald-50
              text-emerald-600
              transition-all
              duration-300
              group-hover:scale-110
              group-hover:rotate-3
              group-hover:bg-emerald-100
            "
          >
            <Info className="h-5 w-5" />
          </div>
        );


      // ========================================
      // PROJECT UPDATED
      // ========================================

      case "project_updated":
        return (
          <div
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-green-50
              text-green-600
              transition-all
              duration-300
              group-hover:scale-110
              group-hover:-rotate-3
              group-hover:bg-green-100
            "
          >
            <Info className="h-5 w-5" />
          </div>
        );


      // ========================================
      // PROJECT DELETED
      // ========================================

      case "project_deleted":
        return (
          <div
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-red-50
              text-red-500
              transition-all
              duration-300
              group-hover:scale-110
              group-hover:rotate-3
              group-hover:bg-red-100
            "
          >
            <X className="h-5 w-5" />
          </div>
        );


      // ========================================
      // PROJECT APPROVED
      // ========================================

      case "project_approved":
        return (
          <div
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-lime-50
              text-lime-600
              transition-all
              duration-300
              group-hover:scale-110
              group-hover:rotate-3
              group-hover:bg-lime-100
            "
          >
            <Check className="h-5 w-5" />
          </div>
        );


      // ========================================
      // PROJECT REJECTED
      // ========================================

      case "project_rejected":
        return (
          <div
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-red-50
              text-red-500
              transition-all
              duration-300
              group-hover:scale-110
              group-hover:-rotate-3
              group-hover:bg-red-100
            "
          >
            <X className="h-5 w-5" />
          </div>
        );


      // ========================================
      // PROJECT INVITATION
      // ========================================

      case "project_invitation":
        return (
          <div
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-amber-50
              text-amber-600
              transition-all
              duration-300
              group-hover:scale-110
              group-hover:rotate-3
              group-hover:bg-amber-100
            "
          >
            <Bell className="h-5 w-5" />
          </div>
        );


      // ========================================
      // PROJECT INVITATION ACCEPTED
      // ========================================

      case "project_invitation_accepted":
        return (
          <div
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-green-50
              text-green-600
              transition-all
              duration-300
              group-hover:scale-110
              group-hover:rotate-3
              group-hover:bg-green-100
            "
          >
            <Check className="h-5 w-5" />
          </div>
        );


      // ========================================
      // PROJECT INVITATION DECLINED
      // ========================================

      case "project_invitation_declined":
        return (
          <div
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-red-50
              text-red-500
              transition-all
              duration-300
              group-hover:scale-110
              group-hover:-rotate-3
              group-hover:bg-red-100
            "
          >
            <X className="h-5 w-5" />
          </div>
        );


      // ========================================
      // USER REGISTERED
      // ========================================

      case "user_registered":
        return (
          <div
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-blue-50
              text-blue-600
              transition-all
              duration-300
              group-hover:scale-110
              group-hover:rotate-3
              group-hover:bg-blue-100
            "
          >
            <Info className="h-5 w-5" />
          </div>
        );


      // ========================================
      // OLD TYPES
      // ========================================
      // Ye fallback compatibility ke liye rakhe hain.
      // Agar database me purane notifications hain
      // to unke icons bhi properly show honge.

      case "assignment":
        return (
          <div
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-emerald-50
              text-emerald-600
              transition-all
              duration-300
              group-hover:scale-110
              group-hover:rotate-3
              group-hover:bg-emerald-100
            "
          >
            <FileText className="h-5 w-5" />
          </div>
        );


      case "course":
        return (
          <div
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-green-50
              text-green-600
              transition-all
              duration-300
              group-hover:scale-110
              group-hover:-rotate-3
              group-hover:bg-green-100
            "
          >
            <GraduationCap className="h-5 w-5" />
          </div>
        );


      case "success":
        return (
          <div
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-lime-50
              text-lime-600
              transition-all
              duration-300
              group-hover:scale-110
              group-hover:rotate-3
              group-hover:bg-lime-100
            "
          >
            <Check className="h-5 w-5" />
          </div>
        );


      case "warning":
        return (
          <div
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-amber-50
              text-amber-600
              transition-all
              duration-300
              group-hover:scale-110
              group-hover:-rotate-3
              group-hover:bg-amber-100
            "
          >
            <Info className="h-5 w-5" />
          </div>
        );


      // ========================================
      // DEFAULT
      // ========================================

      default:
        return (
          <div
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-slate-100
              text-slate-600
              transition-all
              duration-300
              group-hover:scale-110
              group-hover:rotate-3
            "
          >
            <Bell className="h-5 w-5" />
          </div>
        );
    }
  };


  // ==========================================
  // TIME AGO
  // ==========================================

  const timeAgo = (date) => {
    if (!date) return "";

    const now = new Date();

    const created = new Date(date);

    const seconds = Math.floor(
      (now - created) / 1000
    );

    if (seconds < 60) {
      return "Just now";
    }

    const minutes = Math.floor(
      seconds / 60
    );

    if (minutes < 60) {
      return `${minutes}m ago`;
    }

    const hours = Math.floor(
      minutes / 60
    );

    if (hours < 24) {
      return `${hours}h ago`;
    }

    const days = Math.floor(
      hours / 24
    );

    if (days < 7) {
      return `${days}d ago`;
    }

    return created.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
      }
    );
  };


  // ==========================================
  // MARK ONE READ
  // ==========================================

  const handleNotificationClick = async (
    notification
  ) => {
    try {
      if (!notification.isRead) {
        await api.patch(
          `/notifications/${notification._id}/read`
        );

        setNotifications((previous) =>
          previous.map((item) =>
            item._id === notification._id
              ? {
                  ...item,
                  isRead: true,
                }
              : item
          )
        );

        setUnreadCount((previous) =>
          Math.max(previous - 1, 0)
        );
      }

      setNotificationOpen(false);

      if (notification.link) {
        navigate(notification.link);
      }
    } catch (error) {
      console.error(
        "MARK NOTIFICATION READ ERROR:",
        error
      );
    }
  };


  // ==========================================
  // MARK ALL READ
  // ==========================================

  const handleMarkAllRead = async () => {
    try {
      await api.patch(
        "/notifications/read-all"
      );

      setNotifications((previous) =>
        previous.map((item) => ({
          ...item,
          isRead: true,
        }))
      );

      setUnreadCount(0);
    } catch (error) {
      console.error(
        "MARK ALL READ ERROR:",
        error
      );
    }
  };


  // ==========================================
  // DELETE NOTIFICATION
  // ==========================================

  const handleDeleteNotification = async (
    event,
    notificationId
  ) => {
    event.stopPropagation();

    try {
      await api.delete(
        `/notifications/${notificationId}`
      );

      setNotifications((previous) =>
        previous.filter(
          (item) =>
            item._id !== notificationId
        )
      );

      const deleted =
        notifications.find(
          (item) =>
            item._id === notificationId
        );

      if (deleted && !deleted.isRead) {
        setUnreadCount((previous) =>
          Math.max(previous - 1, 0)
        );
      }
    } catch (error) {
      console.error(
        "DELETE NOTIFICATION ERROR:",
        error
      );
    }
  };


  return (
    <header
      className="
        sticky
        top-0
        z-40
        h-20
        border-b
        border-emerald-100/80
        bg-white/90
        backdrop-blur-2xl
        shadow-[0_4px_25px_rgba(16,185,129,0.06)]
      "
    >

      {/* TOP GREEN GLOW */}

      <div
        className="
          pointer-events-none
          absolute
          left-0
          right-0
          top-0
          h-[2px]
          overflow-hidden
          bg-gradient-to-r
          from-transparent
          via-emerald-400
          to-transparent
        "
      >
        <div
          className="
            h-full
            w-1/3
            animate-[navbarGlow_4s_ease-in-out_infinite]
            bg-emerald-500
            blur-sm
          "
        />
      </div>


      <div
        className="
          flex
          h-full
          items-center
          justify-between
          px-4
          sm:px-6
          lg:px-8
        "
      >

        {/* ======================================
            LEFT
        ====================================== */}

        <div className="flex items-center gap-4">

          {/* MOBILE MENU */}

          <button
            type="button"
            onClick={onMenuClick}
            className="
              group
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              border
              border-emerald-100
              bg-white
              text-slate-600
              shadow-sm
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:border-emerald-300
              hover:bg-emerald-50
              hover:text-emerald-600
              hover:shadow-lg
              hover:shadow-emerald-500/10
              active:scale-95
              lg:hidden
            "
          >
            <svg
              className="
                h-5
                w-5
                transition-transform
                duration-300
                group-hover:scale-110
              "
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>


          {/* LOGO */}

          <Link
            to="/"
            className="
              group
              flex
              items-center
              gap-3
            "
          >

            {/* LOGO ICON */}

            <div
              className="
                relative
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-2xl
                bg-gradient-to-br
                from-emerald-500
                via-green-500
                to-emerald-700
                text-xl
                text-white
                shadow-lg
                shadow-emerald-500/25
                transition-all
                duration-500
                group-hover:scale-110
                group-hover:rotate-3
                group-hover:shadow-xl
                group-hover:shadow-emerald-500/35
              "
            >

              {/* GLOW */}

              <div
                className="
                  absolute
                  inset-0
                  rounded-2xl
                  bg-emerald-400
                  opacity-0
                  blur-xl
                  transition-opacity
                  duration-500
                  group-hover:opacity-40
                "
              />

              <span
                className="
                  relative
                  z-10
                  transition-transform
                  duration-500
                  group-hover:-translate-y-0.5
                "
              >
                🎓
              </span>
            </div>


            {/* BRAND */}

            <div className="hidden sm:block">

              <h1
                className="
                  text-lg
                  font-extrabold
                  tracking-tight
                  text-slate-900
                "
              >
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
              </h1>

              <p
                className="
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.2em]
                  text-emerald-600/60
                "
              >
                Learning Platform
              </p>

            </div>
          </Link>
        </div>


        {/* ======================================
            RIGHT
        ====================================== */}

        <div
          className="
            flex
            items-center
            gap-2
            sm:gap-4
          "
        >

          {/* ====================================
              NOTIFICATION
          ==================================== */}

          <div
            ref={notificationRef}
            className="relative"
          >

            <button
              type="button"
              onClick={() => {
                setNotificationOpen(
                  (previous) => !previous
                );

                setProfileOpen(false);

                if (!notificationOpen) {
                  fetchNotifications();
                }
              }}
              className="
                group
                relative
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                text-slate-500
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:bg-emerald-50
                hover:text-emerald-600
                hover:shadow-md
                hover:shadow-emerald-500/10
                active:scale-90
              "
            >

              <Bell
                className="
                  h-5
                  w-5
                  transition-all
                  duration-300
                  group-hover:rotate-12
                  group-hover:scale-110
                "
              />

              {/* UNREAD BADGE */}

              {unreadCount > 0 && (
                <span
                  className="
                    absolute
                    -right-1
                    -top-1
                    flex
                    min-h-[18px]
                    min-w-[18px]
                    items-center
                    justify-center
                    rounded-full
                    bg-emerald-500
                    px-1
                    text-[9px]
                    font-bold
                    text-white
                    ring-2
                    ring-white
                    shadow-lg
                    shadow-emerald-500/30
                    animate-[notificationPulse_2s_ease-in-out_infinite]
                  "
                >
                  {unreadCount > 99
                    ? "99+"
                    : unreadCount}
                </span>
              )}

            </button>


            {/* ==================================
                NOTIFICATION DROPDOWN
            ================================== */}

            {notificationOpen && (
              <div
                className="
                  absolute
                  right-0
                  top-14
                  z-50
                  w-[360px]
                  max-w-[calc(100vw-2rem)]
                  origin-top-right
                  overflow-hidden
                  rounded-2xl
                  border
                  border-emerald-100
                  bg-white
                  shadow-2xl
                  shadow-emerald-900/10
                  animate-[dropdownIn_220ms_ease-out]
                "
              >

                {/* HEADER */}

                <div
                  className="
                    relative
                    flex
                    items-center
                    justify-between
                    border-b
                    border-emerald-50
                    bg-gradient-to-r
                    from-emerald-50/80
                    via-white
                    to-white
                    px-4
                    py-4
                  "
                >

                  {/* DECORATIVE DOT */}

                  <div
                    className="
                      absolute
                      left-0
                      top-0
                      h-full
                      w-1
                      bg-gradient-to-b
                      from-emerald-400
                      to-green-600
                    "
                  />

                  <div>

                    <h3
                      className="
                        text-sm
                        font-extrabold
                        text-slate-900
                      "
                    >
                      Notifications
                    </h3>

                    <p
                      className="
                        mt-0.5
                        text-xs
                        text-slate-400
                      "
                    >
                      {unreadCount > 0
                        ? `${unreadCount} unread notification${
                            unreadCount > 1
                              ? "s"
                              : ""
                          }`
                        : "You're all caught up"}
                    </p>

                  </div>


                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={
                        handleMarkAllRead
                      }
                      className="
                        group
                        inline-flex
                        items-center
                        gap-1.5
                        rounded-lg
                        px-2.5
                        py-1.5
                        text-xs
                        font-semibold
                        text-emerald-600
                        transition-all
                        duration-300
                        hover:-translate-y-0.5
                        hover:bg-emerald-100
                        hover:shadow-sm
                        active:scale-95
                      "
                    >
                      <CheckCheck
                        className="
                          h-3.5
                          w-3.5
                          transition-transform
                          duration-300
                          group-hover:scale-110
                        "
                      />

                      Mark all read
                    </button>
                  )}

                </div>


                {/* BODY */}

                <div
                  className="
                    max-h-[420px]
                    overflow-y-auto
                    scrollbar-thin
                    scrollbar-thumb-emerald-200
                    scrollbar-track-transparent
                  "
                >

                  {notificationLoading ? (

                    <div
                      className="
                        flex
                        flex-col
                        items-center
                        justify-center
                        px-6
                        py-12
                      "
                    >

                      <div
                        className="
                          flex
                          h-12
                          w-12
                          items-center
                          justify-center
                          rounded-2xl
                          bg-emerald-50
                        "
                      >
                        <Loader2
                          className="
                            h-6
                            w-6
                            animate-spin
                            text-emerald-600
                          "
                        />
                      </div>

                      <p
                        className="
                          mt-3
                          text-xs
                          font-medium
                          text-slate-400
                        "
                      >
                        Loading notifications...
                      </p>

                    </div>

                  ) : notifications.length === 0 ? (

                    <div
                      className="
                        flex
                        flex-col
                        items-center
                        justify-center
                        px-6
                        py-12
                        text-center
                        animate-[fadeUp_300ms_ease-out]
                      "
                    >

                      <div
                        className="
                          flex
                          h-14
                          w-14
                          items-center
                          justify-center
                          rounded-2xl
                          bg-emerald-50
                          text-emerald-500
                        "
                      >
                        <Bell className="h-6 w-6" />
                      </div>

                      <h4
                        className="
                          mt-4
                          text-sm
                          font-bold
                          text-slate-800
                        "
                      >
                        No notifications
                      </h4>

                      <p
                        className="
                          mt-1
                          max-w-[230px]
                          text-xs
                          leading-5
                          text-slate-400
                        "
                      >
                        New updates and activity will
                        appear here.
                      </p>

                    </div>

                  ) : (

                    notifications.map(
                      (
                        notification,
                        index
                      ) => (

                        <div
                          key={notification._id}
                          onClick={() =>
                            handleNotificationClick(
                              notification
                            )
                          }
                          style={{
                            animationDelay: `${index * 45}ms`,
                          }}
                          className={`
                            group
                            relative
                            flex
                            cursor-pointer
                            gap-3
                            border-b
                            border-emerald-50
                            px-4
                            py-4
                            transition-all
                            duration-300
                            hover:translate-x-1
                            hover:bg-emerald-50/60
                            animate-[notificationItem_350ms_ease-out_both]
                            ${
                              !notification.isRead
                                ? "bg-emerald-50/40"
                                : "bg-white"
                            }
                          `}
                        >

                          {getNotificationIcon(
                            notification.type
                          )}


                          <div
                            className="
                              min-w-0
                              flex-1
                              pr-5
                            "
                          >

                            <div
                              className="
                                flex
                                items-start
                                justify-between
                                gap-2
                              "
                            >

                              <h4
                                className={`
                                  text-sm
                                  leading-5
                                  ${
                                    notification.isRead
                                      ? "font-semibold text-slate-700"
                                      : "font-bold text-slate-900"
                                  }
                                `}
                              >
                                {notification.title}
                              </h4>


                              {!notification.isRead && (
                                <span
                                  className="
                                    mt-1
                                    h-2
                                    w-2
                                    shrink-0
                                    rounded-full
                                    bg-emerald-500
                                    shadow-sm
                                    shadow-emerald-500/50
                                    animate-pulse
                                  "
                                />
                              )}

                            </div>


                            <p
                              className="
                                mt-1
                                line-clamp-2
                                text-xs
                                leading-5
                                text-slate-500
                              "
                            >
                              {notification.message}
                            </p>


                            <p
                              className="
                                mt-2
                                text-[10px]
                                font-medium
                                text-emerald-600/60
                              "
                            >
                              {timeAgo(
                                notification.createdAt
                              )}
                            </p>

                          </div>


                          {/* DELETE */}

                          <button
                            type="button"
                            onClick={(event) =>
                              handleDeleteNotification(
                                event,
                                notification._id
                              )
                            }
                            className="
                              absolute
                              right-2
                              top-2
                              flex
                              h-7
                              w-7
                              items-center
                              justify-center
                              rounded-lg
                              text-slate-300
                              opacity-0
                              transition-all
                              duration-200
                              group-hover:opacity-100
                              hover:scale-110
                              hover:bg-red-50
                              hover:text-red-500
                              active:scale-90
                            "
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>

                        </div>
                      )
                    )
                  )}

                </div>


                {/* FOOTER */}

                {notifications.length > 0 && (
                  <div
                    className="
                      border-t
                      border-emerald-50
                      bg-gradient-to-r
                      from-emerald-50/70
                      to-white
                      px-4
                      py-3
                    "
                  >

                    <button
                      type="button"
                      onClick={() => {
                        setNotificationOpen(
                          false
                        );

                        navigate(
                          "/notifications"
                        );
                      }}
                      className="
                        group
                        w-full
                        rounded-xl
                        py-2
                        text-center
                        text-xs
                        font-bold
                        text-emerald-600
                        transition-all
                        duration-300
                        hover:-translate-y-0.5
                        hover:bg-emerald-100
                        hover:shadow-sm
                        active:scale-[0.98]
                      "
                    >
                      View all notifications
                    </button>

                  </div>
                )}

              </div>
            )}

          </div>


          {/* DIVIDER */}

          <div
            className="
              hidden
              h-8
              w-px
              bg-gradient-to-b
              from-transparent
              via-emerald-200
              to-transparent
              sm:block
            "
          />


          {/* ====================================
              PROFILE
          ==================================== */}

          <div
            ref={profileRef}
            className="relative"
          >

            <button
              type="button"
              onClick={() => {
                setProfileOpen(
                  (previous) => !previous
                );

                setNotificationOpen(false);
              }}
              className="
                group
                flex
                items-center
                gap-3
                rounded-xl
                p-1.5
                transition-all
                duration-300
                hover:bg-emerald-50
                hover:shadow-sm
                hover:shadow-emerald-500/10
                active:scale-[0.98]
              "
            >

              {/* PROFILE IMAGE */}

              <div
                className="
                  relative
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  overflow-hidden
                  rounded-xl
                  bg-gradient-to-br
                  from-emerald-400
                  via-green-500
                  to-emerald-700
                  text-sm
                  font-bold
                  text-white
                  shadow-md
                  shadow-emerald-500/20
                  transition-all
                  duration-500
                  group-hover:scale-110
                  group-hover:rotate-2
                  group-hover:shadow-lg
                  group-hover:shadow-emerald-500/30
                "
              >

                {/* ONLINE DOT */}

                <span
                  className="
                    absolute
                    right-0.5
                    top-0.5
                    z-20
                    h-2.5
                    w-2.5
                    rounded-full
                    border-2
                    border-white
                    bg-green-400
                    shadow-sm
                  "
                />

                {user?.profileImage ? (

                  <img
                    src={user.profileImage}
                    alt={
                      user?.name || "User"
                    }
                    className="
                      h-full
                      w-full
                      object-cover
                      transition-transform
                      duration-500
                      group-hover:scale-110
                    "
                  />

                ) : (

                  <span
                    className="
                      transition-transform
                      duration-500
                      group-hover:scale-110
                    "
                  >
                    {getInitials()}
                  </span>

                )}

              </div>


              {/* USER INFO */}

              <div
                className="
                  hidden
                  text-left
                  md:block
                "
              >

                <p
                  className="
                    max-w-[120px]
                    truncate
                    text-sm
                    font-semibold
                    text-slate-800
                    transition-colors
                    duration-300
                    group-hover:text-emerald-700
                  "
                >
                  {user?.name || "User"}
                </p>

                <p
                  className="
                    text-xs
                    capitalize
                    text-emerald-600/60
                  "
                >
                  {user?.role || "student"}
                </p>

              </div>


              {/* ARROW */}

              <svg
                className={`
                  hidden
                  h-4
                  w-4
                  text-slate-400
                  transition-all
                  duration-300
                  md:block
                  ${
                    profileOpen
                      ? "rotate-180 text-emerald-600"
                      : "group-hover:text-emerald-500"
                  }
                `}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m6 9 6 6 6-6"
                />
              </svg>

            </button>


            {/* PROFILE DROPDOWN */}

            {profileOpen && (
              <div
                className="
                  absolute
                  right-0
                  top-14
                  z-50
                  w-64
                  origin-top-right
                  overflow-hidden
                  rounded-2xl
                  border
                  border-emerald-100
                  bg-white
                  shadow-2xl
                  shadow-emerald-900/10
                  animate-[dropdownIn_220ms_ease-out]
                "
              >

                {/* USER INFO */}

                <div
                  className="
                    relative
                    border-b
                    border-emerald-50
                    bg-gradient-to-br
                    from-emerald-50
                    via-white
                    to-white
                    p-4
                  "
                >

                  {/* GREEN ACCENT */}

                  <div
                    className="
                      absolute
                      left-0
                      top-0
                      h-full
                      w-1
                      bg-gradient-to-b
                      from-emerald-400
                      to-green-600
                    "
                  />

                  <p
                    className="
                      truncate
                      text-sm
                      font-bold
                      text-slate-800
                    "
                  >
                    {user?.name || "User"}
                  </p>

                  <p
                    className="
                      mt-1
                      truncate
                      text-xs
                      text-slate-400
                    "
                  >
                    {user?.email || ""}
                  </p>

                  <span
                    className="
                      mt-3
                      inline-flex
                      rounded-full
                      border
                      border-emerald-200
                      bg-emerald-100
                      px-2.5
                      py-1
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-wide
                      text-emerald-700
                    "
                  >
                    {user?.role || "student"}
                  </span>

                </div>


                {/* PROFILE */}

                <Link
                  to={
                    user?.role === "admin"
                      ? "/admin/profile"
                      : "/student/profile"
                  }
                  onClick={() => setProfileOpen(false)}
                  className="
                    group
                    flex
                    items-center
                    gap-3
                    px-4
                    py-3
                    text-sm
                    font-medium
                    text-slate-600
                    transition-all
                    duration-300
                    hover:translate-x-1
                    hover:bg-emerald-50
                    hover:text-emerald-700
                  "
                >
                  <span
                    className="
                      flex
                      h-8
                      w-8
                      items-center
                      justify-center
                      rounded-lg
                      bg-emerald-50
                      text-base
                      transition-all
                      duration-300
                      group-hover:scale-110
                      group-hover:bg-emerald-100
                    "
                  >
                    👤
                  </span>

                  <span>
                    My Profile
                  </span>
                </Link>


                {/* LOGOUT */}

                <button
                  type="button"
                  disabled={authLoading}
                  onClick={handleLogout}
                  className="
                    group
                    flex
                    w-full
                    items-center
                    gap-3
                    border-t
                    border-emerald-50
                    px-4
                    py-3
                    text-left
                    text-sm
                    font-medium
                    text-red-500
                    transition-all
                    duration-300
                    hover:translate-x-1
                    hover:bg-red-50
                  "
                >

                  <span
                    className="
                      flex
                      h-8
                      w-8
                      items-center
                      justify-center
                      rounded-lg
                      bg-red-50
                      transition-all
                      duration-300
                      group-hover:scale-110
                      group-hover:bg-red-100
                    "
                  >
                    🚪
                  </span>

                  <span>
                    {authLoading
                      ? "Logging out..."
                      : "Logout"}
                  </span>

                </button>

              </div>
            )}

          </div>

        </div>
      </div>


      {/* ==========================================
          NAVBAR ANIMATIONS
      ========================================== */}

      <style>
        {`
          @keyframes navbarGlow {
            0% {
              transform: translateX(-120%);
              opacity: 0;
            }

            20% {
              opacity: 1;
            }

            50% {
              transform: translateX(300%);
              opacity: 1;
            }

            80% {
              opacity: 0;
            }

            100% {
              transform: translateX(300%);
              opacity: 0;
            }
          }


          @keyframes notificationPulse {
            0%,
            100% {
              transform: scale(1);
              box-shadow:
                0 0 0 0 rgba(16, 185, 129, 0.35);
            }

            50% {
              transform: scale(1.08);
              box-shadow:
                0 0 0 5px rgba(16, 185, 129, 0);
            }
          }


          @keyframes dropdownIn {
            0% {
              opacity: 0;
              transform:
                translateY(-8px)
                scale(0.96);
            }

            100% {
              opacity: 1;
              transform:
                translateY(0)
                scale(1);
            }
          }


          @keyframes fadeUp {
            0% {
              opacity: 0;
              transform: translateY(10px);
            }

            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }


          @keyframes notificationItem {
            0% {
              opacity: 0;
              transform:
                translateX(12px)
                translateY(4px);
            }

            100% {
              opacity: 1;
              transform:
                translateX(0)
                translateY(0);
            }
          }
        `}
      </style>

    </header>
  );
};

export default Navbar;