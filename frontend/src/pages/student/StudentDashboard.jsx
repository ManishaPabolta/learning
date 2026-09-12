
import { motion } from "framer-motion";
import {
  BookOpen,
  FileText,
  User,
  ArrowRight,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const StudentDashboard = () => {
  const { user } = useAuth();

  const stats = [
    {
      title: "My Courses",
      value: user?.enrolledCourses?.length || 0,
      icon: BookOpen,
      link: "/student/courses",
    },
    {
      title: "Assignments",
      value: "View",
      icon: FileText,
      link: "/student/assignments",
    },
    {
      title: "Profile",
      value: "Open",
      icon: User,
      link: "/student/profile",
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-green-50 px-5 py-10 text-slate-900 sm:px-6 lg:px-8">
      {/* Ambient Background Glows */}
      <div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />
      <div className="pointer-events-none absolute right-[-120px] top-1/4 h-[28rem] w-[28rem] rounded-full bg-green-400/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-150px] left-1/3 h-96 w-96 rounded-full bg-lime-300/10 blur-3xl" />

      {/* Floating Particles */}
      <motion.div
        animate={{
          y: [0, -15, 0],
          opacity: [0.25, 0.7, 0.25],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute left-[8%] top-28 h-2 w-2 rounded-full bg-emerald-400"
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
        className="pointer-events-none absolute right-[13%] top-40 h-3 w-3 rounded-full bg-green-400"
      />

      <motion.div
        animate={{
          x: [0, 10, 0],
          y: [0, -10, 0],
        }}
        transition={{
          duration: 4.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute bottom-36 left-[14%] h-2 w-2 rounded-full bg-lime-400"
      />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-emerald-700 shadow-sm backdrop-blur-xl">
            <Sparkles className="h-4 w-4" />
            Student Portal
          </div>

          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
            <span className="text-slate-800">
              Welcome back,
            </span>

            <span className="block bg-gradient-to-r from-emerald-700 via-green-600 to-lime-500 bg-clip-text text-transparent">
              {user?.name || "Student"}
            </span>
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Continue your learning journey and keep building your skills.
          </p>
        </motion.div>

        {/* Stats */}
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {stats.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <motion.div
                key={stat.title}
                initial={{
                  opacity: 0,
                  y: 25,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: index * 0.1,
                  duration: 0.5,
                }}
                whileHover={{
                  y: -7,
                }}
              >
                <Link
                  to={stat.link}
                  className="group relative block overflow-hidden rounded-[1.5rem] border border-emerald-100 bg-white/90 p-6 shadow-lg shadow-emerald-900/5 backdrop-blur-xl transition-all duration-300 hover:border-emerald-300 hover:shadow-2xl hover:shadow-emerald-900/10"
                >
                  {/* Top Accent */}
                  <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-emerald-500 via-green-500 to-lime-400 opacity-60 transition-opacity duration-300 group-hover:opacity-100" />

                  <div className="flex items-center justify-between">
                    <motion.div
                      whileHover={{
                        scale: 1.08,
                        rotate: 3,
                      }}
                      className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-50 to-green-100"
                    >
                      <Icon className="h-6 w-6 text-emerald-600" />
                    </motion.div>

                    <ArrowRight className="h-5 w-5 text-slate-300 transition-all duration-300 group-hover:translate-x-1 group-hover:text-emerald-600" />
                  </div>

                  <p className="mt-6 text-3xl font-black text-slate-800">
                    {stat.value}
                  </p>

                  <p className="mt-1 text-sm font-medium text-slate-500">
                    {stat.title}
                  </p>

                  {/* Bottom Hover Line */}
                  <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-emerald-500 to-lime-400 transition-all duration-500 group-hover:w-full" />
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Learning Banner */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.6,
          }}
          className="group relative mt-10 overflow-hidden rounded-[2rem] border border-emerald-200 bg-gradient-to-r from-emerald-600/10 via-white/90 to-green-500/10 p-8 shadow-xl shadow-emerald-900/5 backdrop-blur-xl"
        >
          {/* Decorative Glow */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-emerald-400/10 blur-3xl transition-transform duration-700 group-hover:scale-125" />

          {/* Top Accent */}
          <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-emerald-500 via-green-500 to-lime-400" />

          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-5">
              <motion.div
                whileHover={{
                  scale: 1.08,
                  rotate: 4,
                }}
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-50 to-green-100 shadow-sm"
              >
                <GraduationCap className="h-7 w-7 text-emerald-600" />
              </motion.div>

              <div>
                <h2 className="text-xl font-black text-slate-800">
                  Keep learning
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Explore new courses and continue growing.
                </p>
              </div>
            </div>

            <Link
              to="/courses"
              className="group/button relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-emerald-600 via-green-600 to-lime-500 px-5 py-3 font-bold text-white shadow-lg shadow-emerald-600/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-600/30"
            >
              <span className="relative z-10">
                Explore Courses
              </span>

              <ArrowRight className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover/button:translate-x-1" />

              {/* Shine */}
              <span className="absolute inset-0 -translate-x-full bg-white/15 transition-transform duration-500 group-hover/button:translate-x-full" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StudentDashboard;
