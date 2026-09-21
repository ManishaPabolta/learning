import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  Filter,
  Loader2,
  GraduationCap,
  FileText,
  FolderKanban,
  UserPlus,
  X,
  Clock,
  Inbox,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";
import useAuth from "../../hooks/useAuth";

const Notifications = () => {
  const navigate = useNavigate();
  const auth = useAuth();

  const user = auth?.user;

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [filter, setFilter] = useState("all");

  // =====================================================
  // FETCH NOTIFICATIONS
  // =====================================================

  const fetchNotifications = async () => {
    try {
      setLoading(true);

      const response = await api.get("/notifications");

      const data = response?.data;

      if (Array.isArray(data)) {
        setNotifications(data);
      } else if (Array.isArray(data?.notifications)) {
        setNotifications(data.notifications);
      } else {
        setNotifications([]);
      }
    } catch (error) {
      console.error(
        "Failed to fetch notifications:",
        error?.response?.data || error
      );
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  // =====================================================
  // HELPERS
  // =====================================================

  const getNotificationIcon = (type) => {
    switch (type) {
      case "course_created":
      case "course_updated":
      case "course_deleted":
      case "course_enrolled":
        return <GraduationCap size={20} />;

      case "assignment_created":
      case "assignment_updated":
      case "assignment_deleted":
      case "assignment_submitted":
      case "assignment_resubmitted":
        return <FileText size={20} />;

      case "assignment_approved":
      case "project_approved":
      case "project_invitation_accepted":
        return <Check size={20} />;

      case "assignment_rejected":
      case "project_rejected":
      case "project_invitation_declined":
        return <AlertCircle size={20} />;

      case "project_created":
      case "project_updated":
      case "project_deleted":
        return <FolderKanban size={20} />;

      case "project_invitation":
        return <UserPlus size={20} />;

      case "user_registered":
        return <UserPlus size={20} />;

      default:
        return <Bell size={20} />;
    }
  };

  const getNotificationIconStyle = (type) => {
    switch (type) {
      case "assignment_approved":
      case "project_approved":
      case "project_invitation_accepted":
        return "bg-emerald-100 text-emerald-600";

      case "assignment_rejected":
      case "project_rejected":
      case "project_invitation_declined":
        return "bg-red-100 text-red-600";

      case "project_invitation":
        return "bg-amber-100 text-amber-600";

      case "course_created":
      case "course_updated":
      case "course_deleted":
      case "course_enrolled":
        return "bg-green-100 text-green-600";

      case "assignment_created":
      case "assignment_updated":
      case "assignment_deleted":
      case "assignment_submitted":
      case "assignment_resubmitted":
        return "bg-emerald-100 text-emerald-600";

      case "project_created":
      case "project_updated":
      case "project_deleted":
        return "bg-lime-100 text-lime-700";

      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  const timeAgo = (date) => {
    if (!date) return "";

    const now = new Date();
    const created = new Date(date);

    const seconds = Math.floor((now - created) / 1000);

    if (seconds < 60) return "Just now";

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      return `${minutes} min${minutes === 1 ? "" : "s"} ago`;
    }

    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `${hours} hour${hours === 1 ? "" : "s"} ago`;
    }

    const days = Math.floor(hours / 24);
    if (days < 7) {
      return `${days} day${days === 1 ? "" : "s"} ago`;
    }

    return created.toLocaleDateString();
  };

  // =====================================================
  // FILTERS
  // =====================================================

  const filteredNotifications = useMemo(() => {
    if (filter === "unread") {
      return notifications.filter((notification) => !notification.isRead);
    }

    if (filter === "read") {
      return notifications.filter((notification) => notification.isRead);
    }

    if (filter === "courses") {
      return notifications.filter((notification) =>
        notification.type?.startsWith("course_")
      );
    }

    if (filter === "assignments") {
      return notifications.filter((notification) =>
        notification.type?.startsWith("assignment_")
      );
    }

    if (filter === "projects") {
      return notifications.filter((notification) =>
        notification.type?.startsWith("project_")
      );
    }

    return notifications;
  }, [notifications, filter]);

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  // =====================================================
  // MARK READ
  // =====================================================

  const handleMarkRead = async (notification) => {
    if (!notification?._id || notification.isRead) {
      return;
    }

    try {
      await api.patch(`/notifications/${notification._id}/read`);

      setNotifications((previous) =>
        previous.map((item) =>
          item._id === notification._id
            ? {
                ...item,
                isRead: true,
                readAt: new Date().toISOString(),
              }
            : item
        )
      );
    } catch (error) {
      console.error(
        "Failed to mark notification as read:",
        error?.response?.data || error
      );
    }
  };

  // =====================================================
  // MARK ALL READ
  // =====================================================

  const handleMarkAllRead = async () => {
    if (!unreadCount) return;

    try {
      setActionLoading("mark-all");

      await api.patch("/notifications/read-all");

      setNotifications((previous) =>
        previous.map((notification) => ({
          ...notification,
          isRead: true,
          readAt: notification.readAt || new Date().toISOString(),
        }))
      );
    } catch (error) {
      console.error(
        "Failed to mark all notifications as read:",
        error?.response?.data || error
      );
    } finally {
      setActionLoading(null);
    }
  };

  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = async (notificationId) => {
    if (!notificationId) return;

    try {
      setActionLoading(`delete-${notificationId}`);

      await api.delete(`/notifications/${notificationId}`);

      setNotifications((previous) =>
        previous.filter((notification) => notification._id !== notificationId)
      );
    } catch (error) {
      console.error(
        "Failed to delete notification:",
        error?.response?.data || error
      );
    } finally {
      setActionLoading(null);
    }
  };

  // =====================================================
  // OPEN NORMAL NOTIFICATION
  // =====================================================

  const handleOpenNotification = async (notification) => {
    await handleMarkRead(notification);

    if (notification?.link) {
      navigate(notification.link);
    }
  };

  // =====================================================
  // PROJECT INVITATION
  // =====================================================

  const handleInvitation = async (notification, action) => {
    const invitationId =
      notification?.invitation ||
      notification?.metadata?.invitationId ||
      notification?.metadata?.invitation;

    if (!invitationId) {
      console.error("Invitation ID missing:", notification);
      return;
    }

    try {
      setActionLoading(`${action}-${notification._id}`);

      const endpoint =
        action === "accept"
          ? `/project-invitations/${invitationId}/accept`
          : `/project-invitations/${invitationId}/decline`;

      await api.patch(endpoint);

      setNotifications((previous) =>
        previous.map((item) =>
          item._id === notification._id
            ? {
                ...item,
                isRead: true,
                readAt: new Date().toISOString(),
                metadata: {
                  ...(item.metadata || {}),
                  invitationResponded: action,
                },
              }
            : item
        )
      );

      if (action === "accept") {
        if (notification.project) {
          const projectId =
            typeof notification.project === "object"
              ? notification.project._id
              : notification.project;

          if (projectId) {
            navigate(`/projects/${projectId}`);
          }
        } else if (notification.link) {
          navigate(notification.link);
        }
      }
    } catch (error) {
      console.error(
        `Failed to ${action} invitation:`,
        error?.response?.data || error
      );
    } finally {
      setActionLoading(null);
    }
  };

  // =====================================================
  // INVITATION CHECK
  // =====================================================

  const isInvitation = (notification) => {
    return notification?.type === "project_invitation";
  };

  const invitationAlreadyResponded = (notification) => {
    return Boolean(notification?.metadata?.invitationResponded);
  };

  // =====================================================
  // EMPTY STATE
  // =====================================================

  const renderEmptyState = () => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="py-20 text-center"
      >
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-500">
          <Inbox size={30} />
        </div>

        <h3 className="text-lg font-bold text-slate-800">
          No notifications found
        </h3>

        <p className="mt-2 text-sm text-slate-500">
          You’re all caught up. New notifications will appear here.
        </p>
      </motion.div>
    );
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto flex min-h-[70vh] max-w-6xl items-center justify-center px-4">
          <div className="flex flex-col items-center gap-3 text-slate-500">
            <Loader2 className="animate-spin text-emerald-600" size={34} />

            <p className="text-sm font-medium">
              Loading notifications...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-6 overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm">
          <div className="bg-gradient-to-r from-emerald-600 to-green-600 px-5 py-6 sm:px-7">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur">
                  <Bell size={25} />
                </div>

                <div>
                  <h1 className="text-2xl font-bold text-white">
                    Notifications
                  </h1>

                  <p className="mt-1 text-sm text-emerald-50">
                    Stay updated with everything happening in your account.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="rounded-xl bg-white/15 px-3 py-2 text-sm font-semibold text-white backdrop-blur">
                  {unreadCount} unread
                </div>

                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={handleMarkAllRead}
                    disabled={actionLoading === "mark-all"}
                    className="inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {actionLoading === "mark-all" ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <CheckCheck size={16} />
                    )}

                    Mark all read
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* =================================================
              FILTERS
          ================================================= */}

          <div className="flex gap-2 overflow-x-auto border-t border-slate-100 p-4">
            <div className="mr-1 flex shrink-0 items-center gap-2 text-slate-500">
              <Filter size={16} />
              <span className="text-sm font-medium">Filter:</span>
            </div>

            {[
              ["all", "All"],
              ["unread", "Unread"],
              ["read", "Read"],
              ["courses", "Courses"],
              ["assignments", "Assignments"],
              ["projects", "Projects"],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setFilter(value)}
                className={`shrink-0 rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  filter === value
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* =================================================
            NOTIFICATION LIST
        ================================================= */}

        {filteredNotifications.length === 0 ? (
          renderEmptyState()
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {filteredNotifications.map((notification) => {
                const invitation = isInvitation(notification);
                const responded = invitationAlreadyResponded(notification);

                return (
                  <motion.div
                    key={notification._id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className={`group rounded-2xl border bg-white p-4 shadow-sm transition sm:p-5 ${
                      notification.isRead
                        ? "border-slate-200"
                        : "border-emerald-200 bg-emerald-50/30 shadow-emerald-100/40"
                    }`}
                  >
                    <div className="flex gap-4">
                      {/* ICON */}

                      <button
                        type="button"
                        onClick={() => handleOpenNotification(notification)}
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${getNotificationIconStyle(
                          notification.type
                        )}`}
                      >
                        {getNotificationIcon(notification.type)}
                      </button>

                      {/* CONTENT */}

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <h3
                                className={`text-sm font-bold ${
                                  notification.isRead
                                    ? "text-slate-700"
                                    : "text-slate-900"
                                }`}
                              >
                                {notification.title}
                              </h3>

                              {!notification.isRead && (
                                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                              )}
                            </div>

                            <p className="mt-1 text-sm leading-6 text-slate-600">
                              {notification.message}
                            </p>
                          </div>

                          <div className="flex shrink-0 items-center gap-1.5 text-xs text-slate-400">
                            <Clock size={13} />
                            {timeAgo(notification.createdAt)}
                          </div>
                        </div>

                        {/* =================================================
                            INVITATION ACTIONS
                        ================================================= */}

                        {invitation && !responded && (
                          <div className="mt-4 flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                handleInvitation(notification, "accept")
                              }
                              disabled={
                                actionLoading ===
                                  `accept-${notification._id}` ||
                                actionLoading ===
                                  `decline-${notification._id}`
                              }
                              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {actionLoading ===
                              `accept-${notification._id}` ? (
                                <Loader2
                                  size={16}
                                  className="animate-spin"
                                />
                              ) : (
                                <Check size={16} />
                              )}

                              Accept
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleInvitation(notification, "decline")
                              }
                              disabled={
                                actionLoading ===
                                  `accept-${notification._id}` ||
                                actionLoading ===
                                  `decline-${notification._id}`
                              }
                              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {actionLoading ===
                              `decline-${notification._id}` ? (
                                <Loader2
                                  size={16}
                                  className="animate-spin"
                                />
                              ) : (
                                <X size={16} />
                              )}

                              Decline
                            </button>
                          </div>
                        )}

                        {invitation && responded && (
                          <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-500">
                            {notification.metadata?.invitationResponded ===
                            "accept" ? (
                              <>
                                <Check size={14} />
                                Invitation accepted
                              </>
                            ) : (
                              <>
                                <X size={14} />
                                Invitation declined
                              </>
                            )}
                          </div>
                        )}

                        {/* =================================================
                            ACTIONS
                        ================================================= */}

                        <div className="mt-4 flex items-center gap-2">
                          {!notification.isRead && (
                            <button
                              type="button"
                              onClick={() => handleMarkRead(notification)}
                              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-50"
                            >
                              <Check size={14} />
                              Mark read
                            </button>
                          )}

                          {notification.link && (
                            <button
                              type="button"
                              onClick={() =>
                                handleOpenNotification(notification)
                              }
                              className="rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                            >
                              Open
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(notification._id)
                            }
                            disabled={
                              actionLoading ===
                              `delete-${notification._id}`
                            }
                            className="ml-auto inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-60"
                          >
                            {actionLoading ===
                            `delete-${notification._id}` ? (
                              <Loader2
                                size={14}
                                className="animate-spin"
                              />
                            ) : (
                              <Trash2 size={14} />
                            )}

                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;