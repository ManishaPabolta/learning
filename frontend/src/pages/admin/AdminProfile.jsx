import { motion } from "framer-motion";
import {
  ShieldCheck,
  User,
  Mail,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";

const AdminProfile = () => {
  const { user } = useAuth();

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-green-50 px-5 py-10 text-slate-900 sm:px-6 lg:px-8">
      {/* =========================
          AMBIENT BACKGROUND
      ========================= */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 35, 0],
            y: [0, -25, 0],
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-emerald-400/15 blur-3xl"
        />

        <motion.div
          animate={{
            x: [0, -35, 0],
            y: [0, 30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-green-400/15 blur-3xl"
        />

        <motion.div
          animate={{
            y: [0, -12, 0],
            opacity: [0.25, 0.7, 0.25],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute left-[15%] top-[20%] h-2 w-2 rounded-full bg-emerald-500"
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
          className="absolute right-[18%] top-[30%] h-1.5 w-1.5 rounded-full bg-green-500"
        />

        <div className="absolute bottom-[20%] left-[12%] h-1.5 w-1.5 rounded-full bg-lime-500/50" />
        <div className="absolute bottom-[28%] right-[12%] h-2 w-2 rounded-full bg-emerald-400/50" />
      </div>

      {/* =========================
          CONTENT
      ========================= */}

      <div className="relative mx-auto max-w-3xl">
        {/* =========================
            PAGE INTRO
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
            duration: 0.5,
          }}
          className="mb-7"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-emerald-700 shadow-sm backdrop-blur-xl">
            <Sparkles className="h-3.5 w-3.5" />
            Account
          </div>

          <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            Admin{" "}
            <span className="bg-gradient-to-r from-emerald-600 via-green-500 to-lime-500 bg-clip-text text-transparent">
              Profile
            </span>
          </h1>

          <p className="mt-2 text-sm text-slate-500 sm:text-base">
            View your administrator account information.
          </p>
        </motion.div>

        {/* =========================
            PROFILE CARD
        ========================= */}

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
          className="relative overflow-hidden rounded-[2rem] border border-emerald-100 bg-white/90 shadow-2xl shadow-emerald-900/10 backdrop-blur-xl"
        >
          {/* Top Accent */}

          <div className="absolute left-0 right-0 top-0 z-10 h-1.5 bg-gradient-to-r from-emerald-600 via-green-500 to-lime-400" />

          {/* =========================
              COVER
          ========================= */}

          <div className="relative h-36 overflow-hidden bg-gradient-to-br from-emerald-600 via-green-500 to-lime-400 sm:h-40">
            {/* Cover glow */}

            <motion.div
              animate={{
                x: [0, 50, 0],
                scale: [1, 1.15, 1],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-white/20 blur-3xl"
            />

            <motion.div
              animate={{
                x: [0, -40, 0],
                y: [0, 20, 0],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -left-20 bottom-[-100px] h-56 w-56 rounded-full bg-white/10 blur-3xl"
            />

            {/* Decorative pattern */}

            <div className="absolute right-8 top-8 grid grid-cols-4 gap-2 opacity-30">
              {[...Array(16)].map((_, index) => (
                <span
                  key={index}
                  className="h-1.5 w-1.5 rounded-full bg-white"
                />
              ))}
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/10 to-transparent" />
          </div>

          {/* =========================
              PROFILE CONTENT
          ========================= */}

          <div className="-mt-12 px-5 pb-8 sm:-mt-14 sm:px-9">
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
                type: "spring",
                stiffness: 180,
              }}
              className="relative flex h-24 w-24 items-center justify-center rounded-[1.6rem] border-4 border-white bg-gradient-to-br from-emerald-600 via-green-500 to-lime-400 text-white shadow-xl shadow-emerald-900/20 sm:h-28 sm:w-28"
            >
              <ShieldCheck className="h-11 w-11 sm:h-12 sm:w-12" />

              {/* Online indicator */}

              <span className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-4 border-white bg-emerald-500">
                <CheckCircle2 className="h-3.5 w-3.5 text-white" />
              </span>
            </motion.div>

            {/* Name */}

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
                delay: 0.3,
              }}
            >
              <h2 className="mt-5 text-3xl font-black tracking-tight text-slate-900">
                {user?.name || "Administrator"}
              </h2>

              <div className="mt-2 flex flex-wrap items-center gap-2">
                <p className="text-sm font-medium text-slate-500">
                  Administrator Account
                </p>

                <span className="h-1 w-1 rounded-full bg-slate-300" />

                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                  Admin
                </span>
              </div>
            </motion.div>

            {/* =========================
                ACCOUNT DETAILS
            ========================= */}

            <div className="mt-8 space-y-4">
              {/* NAME */}

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
                  delay: 0.35,
                }}
                whileHover={{
                  x: 4,
                }}
                className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 transition-all duration-300 hover:border-emerald-200 hover:bg-white hover:shadow-md hover:shadow-emerald-900/5"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 transition-transform duration-300 group-hover:scale-105">
                  <User className="h-5 w-5" />
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

              {/* EMAIL */}

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
                  delay: 0.42,
                }}
                whileHover={{
                  x: 4,
                }}
                className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 transition-all duration-300 hover:border-emerald-200 hover:bg-white hover:shadow-md hover:shadow-emerald-900/5"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-600 transition-transform duration-300 group-hover:scale-105">
                  <Mail className="h-5 w-5" />
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

              {/* ROLE */}

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
                  delay: 0.49,
                }}
                whileHover={{
                  x: 4,
                }}
                className="group flex items-center gap-4 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4 transition-all duration-300 hover:border-emerald-200 hover:bg-white hover:shadow-md hover:shadow-emerald-900/5"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 transition-transform duration-300 group-hover:scale-105">
                  <ShieldCheck className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Role
                  </p>

                  <p className="mt-1 font-bold capitalize text-emerald-700">
                    {user?.role || "admin"}
                  </p>
                </div>

                <div className="ml-auto">
                  <span className="flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                    Verified
                  </span>
                </div>
              </motion.div>
            </div>

            {/* =========================
                SECURITY FOOTER
            ========================= */}

            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              transition={{
                delay: 0.6,
              }}
              className="mt-6 flex items-start gap-3 rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-green-50 p-4"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
                <ShieldCheck className="h-4.5 w-4.5" />
              </div>

              <div>
                <p className="text-sm font-bold text-emerald-800">
                  Administrator Access
                </p>

                <p className="mt-0.5 text-xs leading-5 text-emerald-700/70">
                  Your account has administrator permissions
                  for managing the learning platform.
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminProfile;