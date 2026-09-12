import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import { motion, AnimatePresence } from "framer-motion";

import {
  Search,
  BookOpen,
  Users,
  ArrowRight,
  RefreshCw,
  GraduationCap,
} from "lucide-react";

import api from "../../services/api";

const Courses = () => {
  const [courses, setCourses] = useState([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // =====================================================
  // FETCH COURSES
  // =====================================================

  const fetchCourses = async (searchValue = "") => {
    try {
      setLoading(true);

      setError("");

      const response = await api.get("/courses", {
        params: {
          page: 1,
          limit: 50,
          search: searchValue,
        },
      });

      console.log("Courses API Response:", response.data);

      const courseList = response.data?.courses || [];

      setCourses(courseList);
    } catch (err) {
      console.error(
        "Fetch courses error:",
        err.response?.data || err
      );

      setError(
        err.response?.data?.message ||
          "Unable to load courses. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // SEARCH COURSES
  // =====================================================

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCourses(search);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-green-50 text-slate-900">
      {/* =================================================
          BACKGROUND
      ================================================= */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute left-[-180px] top-20 h-96 w-96 rounded-full bg-emerald-300/20 blur-3xl"
        />

        <motion.div
          animate={{
            x: [0, -30, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute right-[-180px] top-[40%] h-96 w-96 rounded-full bg-green-300/20 blur-3xl"
        />

        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-lime-200/20 blur-3xl" />
      </div>

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="relative mx-auto max-w-7xl px-5 py-12 sm:px-6 lg:px-8">
        {/* =================================================
            HEADER
        ================================================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
          }}
          className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between"
        >
          {/* TITLE */}

          <div>
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.9,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              transition={{
                duration: 0.5,
                delay: 0.1,
              }}
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 shadow-sm shadow-emerald-100"
            >
              <GraduationCap className="h-4 w-4" />

              Learning Platform
            </motion.div>

            <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
              Explore{" "}
              <span className="bg-gradient-to-r from-emerald-600 via-green-500 to-lime-500 bg-clip-text text-transparent">
                Courses
              </span>
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              Discover courses designed to help you build practical skills
              and move forward in your learning journey.
            </p>
          </div>

          {/* SEARCH */}

          <div className="w-full lg:max-w-md">
            <motion.div
              whileFocus={{ scale: 1.01 }}
              className="relative"
            >
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-emerald-500" />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search courses..."
                className="w-full rounded-2xl border border-emerald-100 bg-white/90 py-4 pl-12 pr-5 text-sm font-medium text-slate-900 shadow-lg shadow-emerald-100/40 outline-none backdrop-blur-xl transition duration-300 placeholder:text-slate-400 hover:border-emerald-200 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
              />
            </motion.div>
          </div>
        </motion.div>

        {/* =================================================
            COURSE COUNT
        ================================================= */}

        {!loading && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-10 flex items-center justify-between border-b border-emerald-100 pb-5"
          >
            <p className="text-sm font-medium text-slate-500">
              {courses.length}{" "}
              {courses.length === 1 ? "course" : "courses"} available
            </p>

            {search && (
              <button
                onClick={() => setSearch("")}
                className="text-sm font-semibold text-emerald-600 transition hover:text-emerald-800"
              >
                Clear search
              </button>
            )}
          </motion.div>
        )}

        {/* =================================================
            LOADING
        ================================================= */}

        {loading && (
          <div className="flex min-h-[400px] flex-col items-center justify-center">
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="h-16 w-16 rounded-full border-4 border-emerald-100 border-t-emerald-600"
              />

              <BookOpen className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 text-emerald-600" />
            </div>

            <p className="mt-5 text-sm font-medium text-slate-500">
              Loading courses...
            </p>
          </div>
        )}

        {/* =================================================
            ERROR
        ================================================= */}

        {!loading && error && (
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.95,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            className="mx-auto mt-16 max-w-lg rounded-3xl border border-red-200 bg-white p-8 text-center shadow-xl shadow-red-100/40"
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50">
              <RefreshCw className="h-6 w-6 text-red-500" />
            </div>

            <h3 className="mt-5 text-xl font-bold text-slate-900">
              Something went wrong
            </h3>

            <p className="mt-2 text-sm text-slate-600">
              {error}
            </p>

            <button
              onClick={() => fetchCourses(search)}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-200 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-200"
            >
              <RefreshCw className="h-4 w-4" />

              Try Again
            </button>
          </motion.div>
        )}

        {/* =================================================
            EMPTY
        ================================================= */}

        {!loading && !error && courses.length === 0 && (
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="mt-16 rounded-3xl border border-emerald-100 bg-white/80 px-6 py-20 text-center shadow-lg shadow-emerald-100/30 backdrop-blur-xl"
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50">
              <BookOpen className="h-7 w-7 text-emerald-500" />
            </div>

            <h3 className="mt-6 text-xl font-bold text-slate-900">
              No courses found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Try searching with another course name or keyword.
            </p>

            {search && (
              <button
                onClick={() => setSearch("")}
                className="mt-6 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-200 transition hover:-translate-y-1 hover:bg-emerald-700"
              >
                Show All Courses
              </button>
            )}
          </motion.div>
        )}

        {/* =================================================
            COURSES GRID
        ================================================= */}

        {!loading && !error && courses.length > 0 && (
          <motion.div
            layout
            className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            <AnimatePresence mode="popLayout">
              {courses.map((course, index) => {
                // -------------------------------------
                // COURSE ID
                // -------------------------------------

                const courseId = course?._id || course?.id;

                // -------------------------------------
                // SAFETY CHECK
                // -------------------------------------

                if (!courseId) {
                  console.error("Course ID is missing:", course);

                  return null;
                }

                return (
                  <motion.article
                    layout
                    key={courseId}
                    initial={{
                      opacity: 0,
                      y: 30,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.95,
                    }}
                    transition={{
                      duration: 0.4,
                      delay: index * 0.05,
                    }}
                    whileHover={{
                      y: -8,
                    }}
                    className="group overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-xl shadow-emerald-100/40 transition duration-300 hover:border-emerald-300 hover:shadow-2xl hover:shadow-emerald-200/50"
                  >
                    {/* COURSE VISUAL */}

                    <div className="relative h-56 overflow-hidden bg-gradient-to-br from-emerald-100 via-green-50 to-lime-50">
                      <motion.div
                        animate={{
                          rotate: [0, 5, 0, -5, 0],
                          scale: [1, 1.03, 1],
                        }}
                        transition={{
                          duration: 7,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-emerald-300/30 blur-2xl"
                      />

                      <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-green-300/30 blur-2xl" />

                      <div className="relative flex h-full items-center justify-center">
                        <motion.div
                          whileHover={{
                            scale: 1.15,
                            rotate: 5,
                          }}
                          className="flex h-28 w-28 items-center justify-center rounded-3xl border border-white/80 bg-white/70 shadow-xl shadow-emerald-200/50 backdrop-blur-md"
                        >
                          <BookOpen className="h-16 w-16 text-emerald-500/70" />
                        </motion.div>
                      </div>

                      {/* Category */}

                      <span className="absolute left-4 top-4 rounded-full border border-white/80 bg-white/90 px-3 py-1.5 text-xs font-bold text-emerald-700 shadow-sm backdrop-blur-md">
                        {course.category || "Course"}
                      </span>
                    </div>

                    {/* CONTENT */}

                    <div className="p-6">
                      {/* TITLE */}

                      <h2 className="line-clamp-2 min-h-[56px] text-xl font-bold text-slate-900 transition duration-300 group-hover:text-emerald-600">
                        {course.title}
                      </h2>

                      {/* DESCRIPTION */}

                      <p className="mt-3 line-clamp-3 min-h-[72px] text-sm leading-6 text-slate-600">
                        {course.description ||
                          "Learn practical skills through this structured course."}
                      </p>

                      {/* META */}

                      <div className="mt-6 flex items-center justify-between border-t border-emerald-100 pt-5 text-xs text-slate-500">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-emerald-500" />

                          <span>
                            {course.students?.length || 0} learners
                          </span>
                        </div>

                        {course.instructor?.name && (
                          <span className="max-w-[130px] truncate font-medium">
                            {course.instructor.name}
                          </span>
                        )}
                      </div>

                      {/* VIEW COURSE BUTTON */}

                      <Link
                        to={`/courses/${courseId}`}
                        onClick={() => {
                          console.log("Opening Course:", courseId);

                          console.log("Course Object:", course);
                        }}
                        className="group/btn mt-6 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-200/60 transition duration-300 hover:-translate-y-1 hover:from-emerald-700 hover:to-green-700 hover:shadow-xl hover:shadow-emerald-200"
                      >
                        View Course

                        <ArrowRight className="h-4 w-4 transition group-hover/btn:translate-x-1" />
                      </Link>
                    </div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Courses;