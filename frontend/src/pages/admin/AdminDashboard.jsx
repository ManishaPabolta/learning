import { motion } from "framer-motion";
import {
  BookOpen,
  FileText,
  Users,
  Plus,
  ArrowRight,
  GraduationCap,
  Sparkles,
  Activity,
} from "lucide-react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const stats = [
    {
      title: "Total Courses",
      value: "—",
      icon: BookOpen,
      color: "emerald",
    },
    {
      title: "Assignments",
      value: "—",
      icon: FileText,
      color: "green",
    },
    {
      title: "Students",
      value: "—",
      icon: Users,
      color: "lime",
    },
    {
      title: "Learning Platform",
      value: "Active",
      icon: GraduationCap,
      color: "emerald",
    },
  ];

  const actions = [
    {
      title: "Create Course",
      description: "Add a new course to your LMS.",
      link: "/admin/courses/add",
      icon: Plus,
    },
    {
      title: "Manage Courses",
      description: "Edit or remove existing courses.",
      link: "/admin/courses",
      icon: BookOpen,
    },
    {
      title: "Assignments",
      description: "View submitted student assignments.",
      link: "/admin/assignments",
      icon: FileText,
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-green-50 px-5 py-8 text-slate-900 sm:px-6 lg:px-8">
      {/* =========================
          AMBIENT BACKGROUND
      ========================= */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 40, 0],
            y: [0, -30, 0],
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-emerald-400/15 blur-3xl"
        />

        <motion.div
          animate={{
            x: [0, -40, 0],
            y: [0, 30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -bottom-40 -right-32 h-[28rem] w-[28rem] rounded-full bg-green-400/15 blur-3xl"
        />

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
          className="absolute left-[18%] top-[25%] h-2 w-2 rounded-full bg-emerald-500"
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
          className="absolute right-[22%] top-[20%] h-1.5 w-1.5 rounded-full bg-green-500"
        />

        <div className="absolute bottom-[25%] left-[12%] h-1.5 w-1.5 rounded-full bg-lime-500/50" />
        <div className="absolute bottom-[18%] right-[15%] h-2 w-2 rounded-full bg-emerald-400/50" />

        <div className="absolute inset-x-0 top-1/4 h-px bg-gradient-to-r from-transparent via-emerald-200/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-1/4 h-px bg-gradient-to-r from-transparent via-green-200/30 to-transparent" />
      </div>

      {/* =========================
          MAIN CONTENT
      ========================= */}

      <div className="relative mx-auto max-w-7xl">
        {/* =========================
            HEADER
        ========================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: 25,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
          }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-emerald-700 shadow-sm backdrop-blur-xl">
            <Sparkles className="h-3.5 w-3.5" />
            Administration
          </div>

          <div className="mt-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
                Admin{" "}
                <span className="bg-gradient-to-r from-emerald-600 via-green-500 to-lime-500 bg-clip-text text-transparent">
                  Dashboard
                </span>
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                Manage your learning platform from one
                place.
              </p>
            </div>

            <div className="hidden items-center gap-2 rounded-2xl border border-emerald-100 bg-white/80 px-4 py-3 text-sm font-semibold text-slate-600 shadow-sm backdrop-blur-xl sm:flex">
              <Activity className="h-4 w-4 text-emerald-500" />
              Platform Active
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
            </div>
          </div>
        </motion.div>

        {/* =========================
            STATS
        ========================= */}

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
                  delay: index * 0.08,
                  duration: 0.5,
                }}
                whileHover={{
                  y: -6,
                  scale: 1.01,
                }}
                className="group relative overflow-hidden rounded-3xl border border-emerald-100 bg-white/90 p-6 shadow-lg shadow-emerald-900/5 backdrop-blur-xl transition-shadow duration-300 hover:shadow-xl hover:shadow-emerald-900/10"
              >
                {/* Card glow */}

                <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-emerald-400/10 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />

                {/* Top accent */}

                <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-emerald-500 via-green-500 to-lime-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="relative flex items-center justify-between">
                  <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-100 to-green-50 text-emerald-600 shadow-inner shadow-emerald-200/50">
                    <Icon className="h-6 w-6" />
                  </div>

                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                    LMS
                  </span>
                </div>

                <div className="relative mt-6">
                  <p className="text-3xl font-black tracking-tight text-slate-900">
                    {stat.value}
                  </p>

                  <p className="mt-1 text-sm font-medium text-slate-500">
                    {stat.title}
                  </p>
                </div>

                {/* Bottom line */}

                <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-emerald-200 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </motion.div>
            );
          })}
        </div>

        {/* =========================
            QUICK ACTIONS
        ========================= */}

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
            delay: 0.35,
            duration: 0.5,
          }}
          className="mt-12"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-slate-900">
                Quick Actions
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Quickly manage your LMS resources.
              </p>
            </div>

            <div className="hidden h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 sm:flex">
              <ArrowRight className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {actions.map((action, index) => {
              const Icon = action.icon;

              return (
                <motion.div
                  key={action.title}
                  initial={{
                    opacity: 0,
                    y: 25,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: 0.4 + index * 0.1,
                    duration: 0.5,
                  }}
                  whileHover={{
                    y: -7,
                  }}
                >
                  <Link
                    to={action.link}
                    className="group relative block h-full overflow-hidden rounded-3xl border border-emerald-100 bg-white/90 p-6 shadow-lg shadow-emerald-900/5 backdrop-blur-xl transition-all duration-300 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-900/10"
                  >
                    {/* Hover glow */}

                    <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-emerald-400/10 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                    {/* Top accent */}

                    <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-emerald-600 via-green-500 to-lime-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                    <div className="relative flex items-center justify-between">
                      <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-100 to-green-50 text-emerald-600 shadow-inner shadow-emerald-200/50 transition-transform duration-300 group-hover:scale-110">
                        <Icon className="h-6 w-6" />
                      </div>

                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition-all duration-300 group-hover:bg-emerald-100 group-hover:text-emerald-600">
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </div>
                    </div>

                    <div className="relative">
                      <h3 className="mt-6 text-xl font-black text-slate-900 transition-colors duration-300 group-hover:text-emerald-700">
                        {action.title}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        {action.description}
                      </p>
                    </div>

                    {/* Bottom indicator */}

                    <div className="mt-6 flex items-center gap-2 text-xs font-bold text-emerald-600 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      Open Management
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* =========================
            FOOTER ACCENT
        ========================= */}

        <motion.div
          initial={{
            opacity: 0,
            scaleX: 0,
          }}
          animate={{
            opacity: 1,
            scaleX: 1,
          }}
          transition={{
            delay: 0.8,
            duration: 0.7,
          }}
          className="mx-auto mt-12 h-px max-w-3xl origin-center bg-gradient-to-r from-transparent via-emerald-200 to-transparent"
        />
      </div>
    </div>
  );
};

export default AdminDashboard;