import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Search,
  RefreshCw,
  Loader2,
  Trash2,
  ShieldCheck,
  User,
  AlertCircle,
  Mail,
  Calendar,
} from "lucide-react";

import api from "../../services/api";

const ManageUsers = () => {
  // =====================================
  // STATES
  // =====================================

  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [deletingId, setDeletingId] = useState(null);

  const [search, setSearch] = useState("");

  const [error, setError] = useState("");

  // =====================================
  // FETCH USERS
  // =====================================

  const fetchUsers = useCallback(
    async (showRefreshLoader = false) => {
      try {
        if (showRefreshLoader) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError("");

        console.log("Fetching users...");

        const response = await api.get("/users");

        console.log(
          "Users API Response:",
          response.data
        );

        const userList =
          response.data?.users || [];

        setUsers(userList);
      } catch (err) {
        console.error(
          "Fetch users error:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Unable to load users."
        );

        setUsers([]);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  // =====================================
  // INITIAL FETCH
  // =====================================

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // =====================================
  // DELETE USER
  // =====================================

  const handleDelete = async (userId) => {
    if (!userId) {
      setError("User ID is missing.");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setDeletingId(userId);
      setError("");

      console.log(
        "Deleting User:",
        userId
      );

      const response = await api.delete(
        `/users/${userId}`
      );

      console.log(
        "Delete User Response:",
        response.data
      );

      // Remove user immediately from UI
      setUsers((prevUsers) =>
        prevUsers.filter(
          (user) =>
            (user._id || user.id) !== userId
        )
      );
    } catch (err) {
      console.error(
        "Delete user error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to delete user."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // =====================================
  // REFRESH
  // =====================================

  const handleRefresh = () => {
    fetchUsers(true);
  };

  // =====================================
  // SEARCH
  // =====================================

  const filteredUsers = users.filter(
    (user) => {
      const searchText =
        search.toLowerCase().trim();

      if (!searchText) {
        return true;
      }

      return (
        user.name
          ?.toLowerCase()
          .includes(searchText) ||
        user.email
          ?.toLowerCase()
          .includes(searchText) ||
        user.role
          ?.toLowerCase()
          .includes(searchText)
      );
    }
  );

  // =====================================
  // DATE FORMAT
  // =====================================

  const formatDate = (date) => {
    if (!date) {
      return "N/A";
    }

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =====================================
  // LOADING
  // =====================================

  if (loading) {
    return (
      <div className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-green-50">

        {/* Ambient Glow */}

        <div className="pointer-events-none absolute -left-32 -top-32 h-72 w-72 rounded-full bg-emerald-400/15 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-green-400/15 blur-3xl" />

        <div className="relative flex flex-col items-center gap-4">

          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-100 bg-white shadow-xl shadow-emerald-900/10">

            <div className="absolute inset-0 rounded-2xl bg-emerald-400/10 blur-md" />

            <Loader2 className="relative h-9 w-9 animate-spin text-emerald-600" />

          </div>

          <p className="text-sm font-semibold text-slate-500">
            Loading users...
          </p>

        </div>
      </div>
    );
  }

  // =====================================
  // UI
  // =====================================

  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-green-50 px-1 py-2 text-slate-900 sm:px-2">

      {/* =====================================
          AMBIENT BACKGROUND
      ====================================== */}

      <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />

      <div className="pointer-events-none absolute right-[-120px] top-[35%] h-80 w-80 rounded-full bg-green-400/10 blur-3xl" />

      <div className="pointer-events-none absolute bottom-[-150px] left-[35%] h-96 w-96 rounded-full bg-lime-300/10 blur-3xl" />

      {/* Floating dots */}

      <motion.div
        animate={{
          y: [0, -12, 0],
          opacity: [0.25, 0.55, 0.25],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute left-[12%] top-32 h-2 w-2 rounded-full bg-emerald-500"
      />

      <motion.div
        animate={{
          y: [0, 14, 0],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute right-[18%] top-48 h-2.5 w-2.5 rounded-full bg-green-400"
      />

      <motion.div
        animate={{
          y: [0, -10, 0],
          opacity: [0.2, 0.45, 0.2],
        }}
        transition={{
          duration: 4.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute bottom-32 left-[20%] h-2 w-2 rounded-full bg-lime-400"
      />

      {/* =====================================
          HEADER
      ====================================== */}

      <motion.div
        initial={{
          opacity: 0,
          y: -20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.5,
        }}
        className="relative mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between"
      >

        <div>

          {/* Badge */}

          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-3 py-1.5 text-xs font-bold text-emerald-700 shadow-sm backdrop-blur">

            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />

            Administration

          </div>

          <h1 className="bg-gradient-to-r from-emerald-700 via-green-600 to-lime-500 bg-clip-text text-3xl font-black tracking-tight text-transparent sm:text-4xl">

            Manage Users

          </h1>

          <p className="mt-2 text-sm text-slate-500 sm:text-base">

            View and manage all registered users.

          </p>

        </div>

        {/* REFRESH */}

        <motion.button
          type="button"
          onClick={handleRefresh}
          disabled={refreshing}
          whileHover={{
            y: -2,
          }}
          whileTap={{
            scale: 0.97,
          }}
          className="group inline-flex items-center justify-center gap-2 self-start rounded-xl border border-emerald-200 bg-white px-5 py-3 text-sm font-bold text-emerald-700 shadow-sm shadow-emerald-900/5 transition hover:border-emerald-300 hover:bg-emerald-50 hover:shadow-lg hover:shadow-emerald-900/10 disabled:cursor-not-allowed disabled:opacity-60 lg:self-auto"
        >

          <RefreshCw
            className={`h-4 w-4 transition ${
              refreshing
                ? "animate-spin"
                : "group-hover:rotate-180"
            }`}
          />

          {refreshing
            ? "Refreshing..."
            : "Refresh"}

        </motion.button>

      </motion.div>


      {/* =====================================
          ERROR
      ====================================== */}

      {error && (
        <motion.div
          initial={{
            opacity: 0,
            y: -10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="relative mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-600 shadow-sm"
        >

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-100">

            <AlertCircle className="h-5 w-5" />

          </div>

          <div>

            <p className="font-bold">
              Something went wrong
            </p>

            <p className="mt-1 text-sm text-red-500">
              {error}
            </p>

          </div>

        </motion.div>
      )}


      {/* =====================================
          SEARCH + COUNT
      ====================================== */}

      <motion.div
        initial={{
          opacity: 0,
          y: 15,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          delay: 0.1,
        }}
        className="relative mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
      >

        {/* SEARCH */}

        <div className="group relative w-full md:max-w-md">

          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 transition group-focus-within:text-emerald-600" />

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search by name, email or role..."
            className="w-full rounded-2xl border border-emerald-100 bg-white py-3.5 pl-12 pr-4 text-sm font-medium text-slate-800 shadow-sm outline-none transition duration-300 placeholder:text-slate-400 hover:border-emerald-200 focus:border-emerald-400 focus:shadow-lg focus:shadow-emerald-900/10"
          />

          <div className="pointer-events-none absolute bottom-0 left-4 right-4 h-0.5 origin-left scale-x-0 rounded-full bg-gradient-to-r from-emerald-500 to-lime-400 transition-transform duration-300 group-focus-within:scale-x-100" />

        </div>


        {/* COUNT */}

        <div className="inline-flex w-fit items-center rounded-xl border border-emerald-100 bg-white px-4 py-3 text-sm font-medium text-slate-500 shadow-sm">

          Total Users:

          <span className="ml-2 rounded-lg bg-emerald-50 px-2 py-1 font-black text-emerald-700">

            {filteredUsers.length}

          </span>

        </div>

      </motion.div>


      {/* =====================================
          EMPTY STATE
      ====================================== */}

      {filteredUsers.length === 0 ? (

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-white/85 px-6 py-16 text-center shadow-xl shadow-emerald-900/5 backdrop-blur-xl"
        >

          {/* Decorative glow */}

          <div className="pointer-events-none absolute left-1/2 top-0 h-32 w-64 -translate-x-1/2 rounded-full bg-emerald-400/10 blur-3xl" />

          <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 shadow-inner">

            <Users className="h-8 w-8 text-emerald-600" />

          </div>

          <h2 className="relative mt-5 text-xl font-black text-slate-800">

            No users found

          </h2>

          <p className="relative mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">

            {search
              ? "No user matches your search."
              : "There are no registered users yet."}

          </p>

        </motion.div>

      ) : (

        /* =====================================
           USER TABLE
        ====================================== */

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.15,
          }}
          className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-white/90 shadow-xl shadow-emerald-900/10 backdrop-blur-xl"
        >

          {/* Top accent */}

          <div className="h-1 w-full bg-gradient-to-r from-emerald-600 via-green-500 to-lime-400" />

          <div className="overflow-x-auto">

            <table className="w-full min-w-[900px]">

              {/* TABLE HEAD */}

              <thead className="border-b border-emerald-100 bg-emerald-50/60">

                <tr>

                  <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider text-emerald-700">
                    User
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider text-emerald-700">
                    Email
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider text-emerald-700">
                    Role
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider text-emerald-700">
                    Verification
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider text-emerald-700">
                    Joined
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-black uppercase tracking-wider text-emerald-700">
                    Action
                  </th>

                </tr>

              </thead>


              {/* TABLE BODY */}

              <tbody className="divide-y divide-emerald-50">

                {filteredUsers.map(
                  (user, index) => {

                    const userId =
                      user?._id ||
                      user?.id;

                    const isAdmin =
                      user?.role === "admin";

                    return (
                      <motion.tr
                        key={userId}
                        initial={{
                          opacity: 0,
                          y: 8,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        transition={{
                          delay:
                            index * 0.03,
                        }}
                        className="group transition duration-300 hover:bg-emerald-50/60"
                      >

                        {/* USER */}

                        <td className="px-6 py-5">

                          <div className="flex items-center gap-3">

                            <motion.div
                              whileHover={{
                                scale: 1.08,
                                rotate: 2,
                              }}
                              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${
                                isAdmin
                                  ? "border-emerald-200 bg-gradient-to-br from-emerald-100 to-green-50"
                                  : "border-slate-200 bg-slate-50"
                              }`}
                            >

                              {isAdmin ? (
                                <ShieldCheck className="h-5 w-5 text-emerald-600" />
                              ) : (
                                <User className="h-5 w-5 text-slate-500" />
                              )}

                            </motion.div>

                            <div>

                              <p className="font-bold text-slate-800 transition group-hover:text-emerald-700">

                                {user.name ||
                                  "Unknown User"}

                              </p>

                              <p className="mt-1 text-xs text-slate-400">

                                ID:{" "}
                                {userId
                                  ? userId.slice(
                                      -8
                                    )
                                  : "N/A"}

                              </p>

                            </div>

                          </div>

                        </td>


                        {/* EMAIL */}

                        <td className="px-6 py-5">

                          <div className="flex items-center gap-2 text-sm font-medium text-slate-600">

                            <Mail className="h-4 w-4 text-emerald-500" />

                            {user.email ||
                              "No email"}

                          </div>

                        </td>


                        {/* ROLE */}

                        <td className="px-6 py-5">

                          {isAdmin ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-700">

                              <ShieldCheck className="h-3.5 w-3.5" />

                              Admin

                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-600">

                              <User className="h-3.5 w-3.5" />

                              Student

                            </span>
                          )}

                        </td>


                        {/* VERIFIED */}

                        <td className="px-6 py-5">

                          {user.isVerified ? (
                            <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-700">

                              Verified

                            </span>
                          ) : (
                            <span className="inline-flex rounded-full border border-yellow-200 bg-yellow-50 px-3 py-1.5 text-xs font-black text-yellow-700">

                              Not Verified

                            </span>
                          )}

                        </td>


                        {/* JOINED */}

                        <td className="px-6 py-5">

                          <div className="flex items-center gap-2 text-sm font-medium text-slate-500">

                            <Calendar className="h-4 w-4 text-emerald-500" />

                            {formatDate(
                              user.createdAt
                            )}

                          </div>

                        </td>


                        {/* ACTION */}

                        <td className="px-6 py-5 text-right">

                          {isAdmin ? (
                            <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-400">

                              Protected

                            </span>
                          ) : (
                            <motion.button
                              type="button"
                              onClick={() =>
                                handleDelete(
                                  userId
                                )
                              }
                              disabled={
                                deletingId ===
                                userId
                              }
                              whileHover={{
                                y: -2,
                              }}
                              whileTap={{
                                scale: 0.97,
                              }}
                              className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-bold text-red-600 transition hover:border-red-300 hover:bg-red-100 hover:shadow-md hover:shadow-red-900/10 disabled:cursor-not-allowed disabled:opacity-50"
                            >

                              {deletingId ===
                              userId ? (
                                <>
                                  <Loader2 className="h-4 w-4 animate-spin" />

                                  Deleting...
                                </>
                              ) : (
                                <>
                                  <Trash2 className="h-4 w-4" />

                                  Delete
                                </>
                              )}

                            </motion.button>
                          )}

                        </td>

                      </motion.tr>
                    );
                  }
                )}

              </tbody>

            </table>

          </div>

        </motion.div>
      )}

    </div>
  );
};

export default ManageUsers;