
import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Edit,
  Trash2,
  Search,
  RefreshCw,
  Loader2,
  Plus,
  Users,
  Tag,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import api from "../../services/api";

const ManageCourses = () => {
  const navigate = useNavigate();

  // =========================
  // STATES
  // =========================

  const [courses, setCourses] = useState([]);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  // =========================
  // FETCH COURSES
  // =========================

  const fetchCourses = useCallback(
    async (showRefreshLoader = false) => {
      try {
        if (showRefreshLoader) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError("");

        console.log("Fetching all courses...");

        const response = await api.get("/courses", {
          params: {
            page: 1,
            limit: 100,
            ...(search.trim()
              ? {
                  search: search.trim(),
                }
              : {}),
          },
        });

        console.log(
          "Courses API Response:",
          response.data
        );

        const courseList =
          response.data?.courses || [];

        setCourses(courseList);
      } catch (err) {
        console.error(
          "Fetch courses error:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Unable to load courses."
        );

        setCourses([]);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [search]
  );

  // =========================
  // INITIAL FETCH
  // =========================

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // =========================
  // DELETE COURSE
  // =========================

  const handleDelete = async (courseId) => {
    if (!courseId) {
      setError("Course ID is missing.");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this course?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setDeletingId(courseId);
      setError("");

      console.log(
        "Deleting Course ID:",
        courseId
      );

      const response = await api.delete(
        `/courses/${courseId}`
      );

      console.log(
        "Delete Response:",
        response.data
      );

      // Remove deleted course immediately
      setCourses((prevCourses) =>
        prevCourses.filter(
          (course) =>
            (course._id || course.id) !==
            courseId
        )
      );
    } catch (err) {
      console.error(
        "Delete course error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to delete course."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // =========================
  // EDIT COURSE
  // =========================

  const handleEdit = (courseId) => {
    if (!courseId) {
      setError("Course ID is missing.");
      return;
    }

    console.log(
      "Editing Course ID:",
      courseId
    );

    navigate(
      `/admin/courses/edit/${courseId}`
    );
  };

  // =========================
  // REFRESH
  // =========================

  const handleRefresh = () => {
    fetchCourses(true);
  };

  // =========================
  // LOADING UI
  // =========================

  if (loading) {
    return (
      <div className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-green-50">
        {/* Ambient background */}

        <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl" />

        <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-lime-400/20 blur-3xl" />

        <motion.div
          initial={{
            opacity: 0,
            scale: 0.85,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          className="relative flex flex-col items-center gap-4"
        >
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-200 bg-white shadow-xl shadow-emerald-900/10">
            <Loader2 className="h-9 w-9 animate-spin text-emerald-600" />

            <span className="absolute inset-0 rounded-2xl border border-emerald-400/30 animate-ping" />
          </div>

          <p className="text-sm font-semibold text-slate-600">
            Loading courses...
          </p>
        </motion.div>
      </div>
    );
  }

  // =========================
  // MAIN UI
  // =========================

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-green-50 px-1 py-2 text-slate-900 sm:px-2">

      {/* =========================================
          AMBIENT BACKGROUND
      ========================================== */}

      <div className="pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full bg-emerald-400/15 blur-3xl" />

      <div className="pointer-events-none absolute -right-32 top-1/4 h-96 w-96 rounded-full bg-green-400/15 blur-3xl" />

      <div className="pointer-events-none absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-lime-400/10 blur-3xl" />

      {/* Floating particles */}

      <motion.div
        animate={{
          y: [0, -18, 0],
          opacity: [0.25, 0.7, 0.25],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute left-[8%] top-[14%] h-2 w-2 rounded-full bg-emerald-500"
      />

      <motion.div
        animate={{
          y: [0, 15, 0],
          opacity: [0.2, 0.6, 0.2],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute right-[12%] top-[20%] h-3 w-3 rounded-full bg-green-400"
      />

      <motion.div
        animate={{
          x: [0, 8, 0],
          y: [0, -12, 0],
          opacity: [0.2, 0.55, 0.2],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute bottom-[15%] right-[25%] h-2 w-2 rounded-full bg-lime-500"
      />

      {/* Decorative lines */}

      <div className="pointer-events-none absolute left-0 top-32 h-px w-full bg-gradient-to-r from-transparent via-emerald-200/60 to-transparent" />

      <div className="pointer-events-none absolute bottom-28 left-0 h-px w-full bg-gradient-to-r from-transparent via-green-200/50 to-transparent" />

      <div className="relative">

        {/* =========================================
            HEADER
        ========================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: -15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.4,
          }}
          className="mb-8"
        >
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white/80 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 shadow-sm backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5" />
                Course Management
              </div>

              <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                Manage{" "}
                <span className="bg-gradient-to-r from-emerald-600 via-green-500 to-lime-500 bg-clip-text text-transparent">
                  Courses
                </span>
              </h1>

              <p className="mt-2 text-sm text-slate-500 sm:text-base">
                Create, edit and manage all courses.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">

              {/* REFRESH */}

              <motion.button
                type="button"
                onClick={handleRefresh}
                disabled={refreshing}
                whileHover={
                  !refreshing
                    ? { y: -2 }
                    : {}
                }
                whileTap={
                  !refreshing
                    ? { scale: 0.97 }
                    : {}
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-white/80 px-4 py-3 text-sm font-semibold text-slate-600 shadow-sm backdrop-blur-md transition-all hover:border-emerald-300 hover:bg-white hover:text-emerald-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
              >
                <RefreshCw
                  className={`h-4 w-4 ${
                    refreshing
                      ? "animate-spin"
                      : ""
                  }`}
                />

                {refreshing
                  ? "Refreshing..."
                  : "Refresh"}
              </motion.button>

              {/* ADD COURSE */}

              <motion.div
                whileHover={{
                  y: -2,
                }}
                whileTap={{
                  scale: 0.97,
                }}
              >
                <Link
                  to="/admin/courses/add"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 via-green-500 to-lime-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition-all hover:shadow-xl hover:shadow-emerald-600/30"
                >
                  <Plus className="h-5 w-5 transition-transform duration-300 group-hover:rotate-90" />

                  Add Course
                </Link>
              </motion.div>

            </div>
          </div>
        </motion.div>

        {/* =========================================
            ERROR
        ========================================== */}

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
            className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-600 shadow-sm"
          >
            <div className="flex items-start gap-3">

              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

              <div className="flex-1">
                <p className="font-bold">
                  Something went wrong
                </p>

                <p className="mt-1 text-sm">
                  {error}
                </p>
              </div>

              <button
                onClick={handleRefresh}
                className="rounded-lg bg-red-100 px-3 py-2 text-xs font-bold transition hover:bg-red-200"
              >
                Retry
              </button>

            </div>
          </motion.div>
        )}

        {/* =========================================
            SEARCH + COUNT
        ========================================== */}

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
          className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
        >

          {/* SEARCH */}

          <div className="group relative w-full md:max-w-md">

            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-emerald-600" />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search courses..."
              className="w-full rounded-2xl border border-emerald-100 bg-white/85 py-3.5 pl-12 pr-4 text-sm text-slate-900 shadow-sm outline-none backdrop-blur-md transition-all duration-300 placeholder:text-slate-400 hover:border-emerald-200 hover:bg-white focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
            />

            <div className="pointer-events-none absolute bottom-0 left-4 right-4 h-0.5 origin-left scale-x-0 rounded-full bg-gradient-to-r from-emerald-500 to-lime-400 transition-transform duration-300 group-focus-within:scale-x-100" />

          </div>

          {/* COUNT */}

          <div className="w-fit rounded-xl border border-emerald-100 bg-white/80 px-4 py-3 text-sm text-slate-500 shadow-sm backdrop-blur-md">
            Total Courses:

            <span className="ml-2 font-bold text-emerald-700">
              {courses.length}
            </span>
          </div>

        </motion.div>

        {/* =========================================
            EMPTY STATE
        ========================================== */}

        {courses.length === 0 ? (
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="relative overflow-hidden rounded-[2rem] border border-emerald-100 bg-white/90 px-6 py-16 text-center shadow-xl shadow-emerald-900/5 backdrop-blur-xl"
          >

            <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-emerald-600 via-green-500 to-lime-400" />

            <motion.div
              animate={{
                y: [0, -5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50"
            >
              <BookOpen className="h-8 w-8 text-emerald-500" />
            </motion.div>

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              No courses found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              {search
                ? "No course matches your search."
                : "You haven't created any courses yet."}
            </p>

            {!search && (
              <motion.div
                whileHover={{
                  scale: 1.02,
                }}
                whileTap={{
                  scale: 0.98,
                }}
              >
                <Link
                  to="/admin/courses/add"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 px-5 py-3 font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:shadow-xl"
                >
                  <Plus className="h-5 w-5" />

                  Create Your First Course
                </Link>
              </motion.div>
            )}

          </motion.div>
        ) : (

          /* =========================================
             COURSE GRID
          ========================================== */

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">

            {courses.map((course, index) => {

              const courseId =
                course?._id || course?.id;

              return (
                <motion.div
                  key={courseId}
                  initial={{
                    opacity: 0,
                    y: 25,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: index * 0.06,
                    duration: 0.4,
                  }}
                  whileHover={{
                    y: -5,
                  }}
                  className="group relative overflow-hidden rounded-[1.75rem] border border-emerald-100 bg-white/90 shadow-lg shadow-emerald-900/5 backdrop-blur-xl transition-all duration-300 hover:border-emerald-200 hover:shadow-2xl hover:shadow-emerald-900/10"
                >

                  {/* =================================
                      COURSE TOP
                  ================================= */}

                  <div className="relative flex h-40 items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-100 via-green-50 to-lime-100">

                    {/* Decorative circles */}

                    <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-emerald-400/20 blur-2xl transition-transform duration-500 group-hover:scale-125" />

                    <div className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-lime-400/20 blur-2xl transition-transform duration-500 group-hover:scale-125" />

                    <motion.div
                      whileHover={{
                        scale: 1.12,
                        rotate: 3,
                      }}
                      className="relative flex h-20 w-20 items-center justify-center rounded-3xl border border-white/70 bg-white/70 shadow-lg backdrop-blur-md"
                    >
                      <BookOpen className="h-10 w-10 text-emerald-600 transition-colors duration-300 group-hover:text-green-600" />
                    </motion.div>

                    {/* CATEGORY */}

                    {course.category && (
                      <div className="absolute left-4 top-4 inline-flex max-w-[80%] items-center gap-1.5 rounded-full border border-white/70 bg-white/85 px-3 py-1.5 text-xs font-semibold text-emerald-700 shadow-sm backdrop-blur-md">
                        <Tag className="h-3.5 w-3.5 shrink-0" />

                        <span className="truncate">
                          {course.category}
                        </span>
                      </div>
                    )}

                    {/* Top hover line */}

                    <div className="absolute bottom-0 left-0 right-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-emerald-600 via-green-500 to-lime-400 transition-transform duration-500 group-hover:scale-x-100" />

                  </div>

                  {/* =================================
                      COURSE CONTENT
                  ================================= */}

                  <div className="p-5">

                    {/* TITLE */}

                    <h2 className="line-clamp-2 text-xl font-bold text-slate-900 transition-colors duration-300 group-hover:text-emerald-700">
                      {course.title ||
                        "Untitled Course"}
                    </h2>

                    {/* DESCRIPTION */}

                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">
                      {course.description ||
                        "No description available."}
                    </p>

                    {/* STUDENTS */}

                    <div className="mt-5 flex items-center gap-2 text-sm text-slate-500">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50">
                        <Users className="h-4 w-4 text-emerald-600" />
                      </div>

                      <span>
                        {Array.isArray(
                          course.students
                        )
                          ? course.students.length
                          : 0}{" "}
                        Students
                      </span>
                    </div>

                    {/* =================================
                        ACTIONS
                    ================================= */}

                    <div className="mt-6 flex gap-3">

                      {/* EDIT */}

                      <motion.button
                        type="button"
                        onClick={() =>
                          handleEdit(
                            courseId
                          )
                        }
                        disabled={!courseId}
                        whileHover={
                          courseId
                            ? { scale: 1.02 }
                            : {}
                        }
                        whileTap={
                          courseId
                            ? { scale: 0.97 }
                            : {}
                        }
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700 transition-all hover:border-emerald-300 hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Edit className="h-4 w-4" />

                        Edit
                      </motion.button>

                      {/* DELETE */}

                      <motion.button
                        type="button"
                        onClick={() =>
                          handleDelete(
                            courseId
                          )
                        }
                        disabled={
                          !courseId ||
                          deletingId ===
                            courseId
                        }
                        whileHover={
                          courseId &&
                          deletingId !==
                            courseId
                            ? { scale: 1.02 }
                            : {}
                        }
                        whileTap={
                          courseId &&
                          deletingId !==
                            courseId
                            ? { scale: 0.97 }
                            : {}
                        }
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-600 transition-all hover:border-red-300 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                      >

                        {deletingId ===
                        courseId ? (
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

                    </div>

                  </div>
                </motion.div>
              );
            })}

          </div>
        )}
      </div>
    </div>
  );
};

export default ManageCourses;
