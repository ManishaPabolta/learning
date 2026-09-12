import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  BookOpen,
  Users,
  ArrowRight,
  Loader2,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const API_URL = import.meta.env.VITE_API_URL;

const MyCourses = () => {
  const { user } = useAuth();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/courses`,
          {
            params: {
              page: 1,
              limit: 100,
            },
          }
        );

        const allCourses =
          response.data.courses || [];

        const enrolledIds =
          (user?.enrolledCourses || []).map((item) =>
            typeof item === "string"
              ? item
              : item?._id
          );

        const myCourses = allCourses.filter(
          (course) =>
            enrolledIds.includes(course._id)
        );

        setCourses(myCourses);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [user]);

  if (loading) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-green-50">
        {/* Ambient Glow */}
        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-emerald-400/15 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-lime-400/15 blur-3xl" />

        <motion.div
          animate={{
            scale: [1, 1.08, 1],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative flex h-20 w-20 items-center justify-center rounded-3xl border border-emerald-100 bg-white shadow-xl shadow-emerald-900/10"
        >
          <Loader2 className="h-9 w-9 animate-spin text-emerald-600" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-green-50 px-5 py-10 text-slate-900">
      {/* Background Glows */}
      <div className="pointer-events-none absolute -left-32 top-20 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
      <div className="pointer-events-none absolute right-[-100px] top-1/3 h-96 w-96 rounded-full bg-green-400/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-120px] left-1/3 h-80 w-80 rounded-full bg-lime-300/10 blur-3xl" />

      {/* Floating Particles */}
      <motion.div
        animate={{
          y: [0, -15, 0],
          opacity: [0.3, 0.7, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute left-[8%] top-24 h-2 w-2 rounded-full bg-emerald-400"
      />

      <motion.div
        animate={{
          y: [0, 18, 0],
          opacity: [0.2, 0.6, 0.2],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute right-[12%] top-40 h-3 w-3 rounded-full bg-green-400"
      />

      <motion.div
        animate={{
          y: [0, -12, 0],
          x: [0, 8, 0],
        }}
        transition={{
          duration: 4.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute bottom-32 left-[15%] h-2 w-2 rounded-full bg-lime-400"
      />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-emerald-700 shadow-sm backdrop-blur-xl">
            <Sparkles className="h-4 w-4" />
            Student Workspace
          </div>

          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
            <span className="bg-gradient-to-r from-emerald-700 via-green-600 to-lime-500 bg-clip-text text-transparent">
              My Courses
            </span>
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
            Courses you are currently enrolled in.
          </p>
        </motion.div>

        {courses.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="group relative mt-10 overflow-hidden rounded-[2rem] border border-emerald-100 bg-white/85 px-6 py-20 text-center shadow-xl shadow-emerald-900/5 backdrop-blur-xl"
          >
            {/* Top Accent */}
            <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-emerald-500 via-green-500 to-lime-400" />

            <motion.div
              whileHover={{
                rotate: 5,
                scale: 1.08,
              }}
              className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-50 to-green-100"
            >
              <BookOpen className="h-14 w-14 text-emerald-500" />
            </motion.div>

            <h2 className="mt-6 text-xl font-black text-slate-800">
              No enrolled courses
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Start learning by exploring available courses.
            </p>

            <Link
              to="/courses"
              className="group/button relative mt-7 inline-flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-emerald-600 via-green-600 to-lime-500 px-6 py-3 font-bold text-white shadow-lg shadow-emerald-600/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-600/30"
            >
              <span className="relative z-10">
                Explore Courses
              </span>

              <ArrowRight className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover/button:translate-x-1" />

              <span className="absolute inset-0 -translate-x-full bg-white/15 transition-transform duration-500 group-hover/button:translate-x-full" />
            </Link>
          </motion.div>
        ) : (
          <div className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course, index) => (
              <motion.div
                key={course._id}
                initial={{
                  opacity: 0,
                  y: 30,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: index * 0.08,
                  duration: 0.5,
                }}
                whileHover={{
                  y: -8,
                }}
                className="group relative overflow-hidden rounded-[1.5rem] border border-emerald-100 bg-white/90 shadow-lg shadow-emerald-900/5 backdrop-blur-xl transition-shadow duration-300 hover:shadow-2xl hover:shadow-emerald-900/10"
              >
                {/* Top Accent */}
                <div className="absolute left-0 top-0 z-20 h-1 w-full bg-gradient-to-r from-emerald-500 via-green-500 to-lime-400 opacity-70 transition-opacity duration-300 group-hover:opacity-100" />

                {/* Course Image */}
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-emerald-50 via-green-50 to-lime-50">
                  {course.thumbnail ? (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <motion.div
                        animate={{
                          y: [0, -6, 0],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white shadow-lg shadow-emerald-900/10"
                      >
                        <BookOpen className="h-12 w-12 text-emerald-400" />
                      </motion.div>
                    </div>
                  )}

                  {/* Image Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/30 via-transparent to-transparent opacity-60" />
                </div>

                {/* Course Content */}
                <div className="p-6">
                  <h2 className="line-clamp-2 text-xl font-black leading-7 text-slate-800 transition-colors duration-300 group-hover:text-emerald-700">
                    {course.title}
                  </h2>

                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">
                    {course.description ||
                      "No description available."}
                  </p>

                  {/* Students */}
                  <div className="mt-5 inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
                    <Users className="h-4 w-4" />
                    {course.students?.length || 0} students
                  </div>

                  {/* Continue */}
                  <Link
                    to={`/courses/${course._id}`}
                    className="group/continue relative mt-5 flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-emerald-600 via-green-600 to-lime-500 py-3 text-sm font-bold text-white shadow-md shadow-emerald-600/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-600/30"
                  >
                    <span className="relative z-10">
                      Continue
                    </span>

                    <ArrowRight className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover/continue:translate-x-1" />

                    <span className="absolute inset-0 -translate-x-full bg-white/15 transition-transform duration-500 group-hover/continue:translate-x-full" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCourses;