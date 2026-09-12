
import { motion } from "framer-motion";
import {
  User,
  Mail,
  ShieldCheck,
  BookOpen,
  Sparkles,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";

const StudentProfile = () => {
  const { user } = useAuth();

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-green-50 px-5 py-10 text-slate-900">
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
          x: [0, 10, 0],
          y: [0, -10, 0],
        }}
        transition={{
          duration: 4.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute bottom-32 left-[15%] h-2 w-2 rounded-full bg-lime-400"
      />

      <div className="relative z-10 mx-auto max-w-3xl">
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
          className="group relative overflow-hidden rounded-[2rem] border border-emerald-100 bg-white/90 shadow-2xl shadow-emerald-900/10 backdrop-blur-xl"
        >
          {/* Top Accent */}
          <div className="absolute left-0 top-0 z-20 h-1 w-full bg-gradient-to-r from-emerald-500 via-green-500 to-lime-400" />

          {/* Cover */}
          <div className="relative h-36 overflow-hidden bg-gradient-to-r from-emerald-600 via-green-500 to-lime-400">
            {/* Cover Glow */}
            <motion.div
              animate={{
                scale: [1, 1.15, 1],
                opacity: [0.2, 0.35, 0.2],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-white/30 blur-3xl"
            />

            <motion.div
              animate={{
                x: [0, 25, 0],
                opacity: [0.15, 0.3, 0.15],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -left-20 bottom-[-80px] h-56 w-56 rounded-full bg-white/20 blur-3xl"
            />

            {/* Decorative Dots */}
            <div className="absolute right-8 top-7 flex gap-2">
              <span className="h-2 w-2 rounded-full bg-white/50" />
              <span className="h-2 w-2 rounded-full bg-white/30" />
              <span className="h-2 w-2 rounded-full bg-white/20" />
            </div>
          </div>

          <div className="-mt-12 px-6 pb-8 sm:px-9">
            {/* Avatar */}
            <motion.div
              initial={{
                scale: 0.8,
                opacity: 0,
              }}
              animate={{
                scale: 1,
                opacity: 1,
              }}
              transition={{
                delay: 0.2,
                duration: 0.5,
              }}
              whileHover={{
                scale: 1.06,
                rotate: 2,
              }}
              className="relative flex h-24 w-24 items-center justify-center rounded-3xl border-4 border-white bg-gradient-to-br from-emerald-600 via-green-600 to-lime-500 text-3xl font-black text-white shadow-xl shadow-emerald-900/20"
            >
              {user?.name?.charAt(0)?.toUpperCase() || "S"}

              {/* Online/Verified Dot */}
              <span className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full border-4 border-white bg-emerald-500" />
            </motion.div>

            {/* Profile Heading */}
            <motion.div
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.25,
              }}
            >
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-black tracking-tight text-slate-800">
                  {user?.name || "Student"}
                </h1>

                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                  <Sparkles className="h-3.5 w-3.5" />
                  Student
                </span>
              </div>

              <p className="mt-1 text-sm text-slate-500">
                Student Account
              </p>
            </motion.div>

            {/* Profile Information */}
            <div className="mt-8 grid gap-4">
              {/* Name */}
              <motion.div
                initial={{
                  opacity: 0,
                  x: -15,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  delay: 0.3,
                }}
                whileHover={{
                  x: 4,
                }}
                className="group/item flex items-center gap-4 rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50/70 to-white p-4 transition-all duration-300 hover:border-emerald-200 hover:shadow-md hover:shadow-emerald-900/5"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
                  <User className="h-5 w-5 text-emerald-600 transition-transform duration-300 group-hover/item:scale-110" />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Name
                  </p>

                  <p className="mt-1 truncate font-semibold text-slate-800">
                    {user?.name || "—"}
                  </p>
                </div>
              </motion.div>

              {/* Email */}
              <motion.div
                initial={{
                  opacity: 0,
                  x: -15,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  delay: 0.38,
                }}
                whileHover={{
                  x: 4,
                }}
                className="group/item flex items-center gap-4 rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50/70 to-white p-4 transition-all duration-300 hover:border-emerald-200 hover:shadow-md hover:shadow-emerald-900/5"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
                  <Mail className="h-5 w-5 text-emerald-600 transition-transform duration-300 group-hover/item:scale-110" />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Email
                  </p>

                  <p className="mt-1 truncate font-semibold text-slate-800">
                    {user?.email || "—"}
                  </p>
                </div>
              </motion.div>

              {/* Role */}
              <motion.div
                initial={{
                  opacity: 0,
                  x: -15,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  delay: 0.46,
                }}
                whileHover={{
                  x: 4,
                }}
                className="group/item flex items-center gap-4 rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50/70 to-white p-4 transition-all duration-300 hover:border-emerald-200 hover:shadow-md hover:shadow-emerald-900/5"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
                  <ShieldCheck className="h-5 w-5 text-emerald-600 transition-transform duration-300 group-hover/item:scale-110" />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Role
                  </p>

                  <p className="mt-1 font-semibold capitalize text-emerald-700">
                    {user?.role || "user"}
                  </p>
                </div>
              </motion.div>

              {/* Enrolled Courses */}
              <motion.div
                initial={{
                  opacity: 0,
                  x: -15,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  delay: 0.54,
                }}
                whileHover={{
                  x: 4,
                }}
                className="group/item flex items-center gap-4 rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50/70 to-white p-4 transition-all duration-300 hover:border-emerald-200 hover:shadow-md hover:shadow-emerald-900/5"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
                  <BookOpen className="h-5 w-5 text-emerald-600 transition-transform duration-300 group-hover/item:scale-110" />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Enrolled Courses
                  </p>

                  <p className="mt-1 font-semibold text-slate-800">
                    {user?.enrolledCourses?.length || 0}
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StudentProfile;
