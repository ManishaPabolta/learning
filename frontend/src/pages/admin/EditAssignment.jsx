import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowLeft,
  FileText,
  Sparkles,
  ShieldAlert,
} from "lucide-react";
import { Link } from "react-router-dom";

const EditAssignment = () => {
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
            opacity: [0.2, 0.7, 0.2],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute left-[15%] top-[22%] h-2 w-2 rounded-full bg-emerald-500"
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

        <div className="absolute bottom-[22%] left-[12%] h-1.5 w-1.5 rounded-full bg-lime-500/50" />
        <div className="absolute bottom-[30%] right-[14%] h-2 w-2 rounded-full bg-emerald-400/50" />
      </div>

      {/* =========================
          CONTENT
      ========================= */}

      <div className="relative mx-auto max-w-2xl">
        {/* =========================
            BACK LINK
        ========================= */}

        <motion.div
          initial={{
            opacity: 0,
            x: -15,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
        >
          <Link
            to="/admin/assignments"
            className="group inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-500 transition-all duration-200 hover:bg-white hover:text-emerald-600 hover:shadow-sm"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
            Back to Assignments
          </Link>
        </motion.div>

        {/* =========================
            MAIN CARD
        ========================= */}

        <motion.div
          initial={{
            opacity: 0,
            scale: 0.95,
            y: 20,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
          }}
          transition={{
            duration: 0.55,
          }}
          className="relative mt-8 overflow-hidden rounded-[2rem] border border-emerald-100 bg-white/90 p-7 shadow-2xl shadow-emerald-900/10 backdrop-blur-xl sm:p-10"
        >
          {/* Top accent */}

          <div className="absolute left-0 right-0 top-0 h-1.5 bg-gradient-to-r from-emerald-600 via-green-500 to-lime-400" />

          {/* Background glow */}

          <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-emerald-400/10 blur-3xl" />

          <div className="relative text-center">
            {/* =========================
                ICON
            ========================= */}

            <motion.div
              initial={{
                scale: 0.7,
                rotate: -8,
                opacity: 0,
              }}
              animate={{
                scale: 1,
                rotate: 0,
                opacity: 1,
              }}
              transition={{
                delay: 0.15,
                type: "spring",
                stiffness: 180,
              }}
              className="mx-auto flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-emerald-100 via-green-50 to-lime-50 text-emerald-600 shadow-inner shadow-emerald-200/60"
            >
              <AlertTriangle className="h-9 w-9" />
            </motion.div>

            {/* =========================
                BADGE
            ========================= */}

            <motion.div
              initial={{
                opacity: 0,
                y: 8,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.25,
              }}
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-amber-700"
            >
              <ShieldAlert className="h-3.5 w-3.5" />
              Feature Unavailable
            </motion.div>

            {/* =========================
                TITLE
            ========================= */}

            <motion.h1
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
              className="mt-5 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl"
            >
              Assignment{" "}
              <span className="bg-gradient-to-r from-emerald-600 via-green-500 to-lime-500 bg-clip-text text-transparent">
                Editing
              </span>
            </motion.h1>

            {/* =========================
                DESCRIPTION
            ========================= */}

            <motion.p
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.38,
              }}
              className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-500 sm:text-base"
            >
              The current backend does not provide an
              assignment update endpoint. Once a
              PATCH/PUT endpoint is added, this page can
              be connected directly to it.
            </motion.p>

            {/* =========================
                INFO BOX
            ========================= */}

            <motion.div
              initial={{
                opacity: 0,
                y: 12,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.46,
              }}
              className="mx-auto mt-7 flex max-w-md items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 px-5 py-4 text-left shadow-sm"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
                <FileText className="h-5 w-5" />
              </div>

              <div>
                <p className="text-sm font-bold text-slate-700">
                  No fake API call used
                </p>

                <p className="mt-0.5 text-xs text-slate-400">
                  Waiting for a backend update endpoint.
                </p>
              </div>
            </motion.div>

            {/* =========================
                BACK ACTION
            ========================= */}

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
                delay: 0.55,
              }}
              className="mt-7"
            >
              <Link
                to="/admin/assignments"
                className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 via-green-500 to-lime-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-600/30"
              >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Back to Assignments
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* =========================
            BOTTOM ACCENT
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
          className="mx-auto mt-8 h-px max-w-md origin-center bg-gradient-to-r from-transparent via-emerald-200 to-transparent"
        >
          <span className="sr-only">
            SkillForge
          </span>
        </motion.div>

        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400">
          <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
          SkillForge Assignment Management
        </div>
      </div>
    </div>
  );
};

export default EditAssignment;