import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ExternalLink,
  FileText,
  Loader2,
  AlertCircle,
} from "lucide-react";

import api from "../../services/api";

const AssignmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        setLoading(true);
        setError("");

        /*
          Student endpoint /assignments/my already returns
          only the logged-in student's submissions.
        */

        const response = await api.get("/assignments/my");

        const assignments = Array.isArray(
          response.data?.assignments
        )
          ? response.data.assignments
          : [];

        const foundAssignment = assignments.find(
          (item) =>
            String(item._id || item.id) === String(id)
        );

        if (!foundAssignment) {
          setError("Assignment not found.");
          return;
        }

        setAssignment(foundAssignment);
      } catch (error) {
        console.error(
          "FETCH ASSIGNMENT DETAILS ERROR:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to load assignment."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAssignment();
  }, [id]);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-green-50">

        {/* Ambient Glows */}

        <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-emerald-400/15 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-green-400/15 blur-3xl" />

        {/* Floating dots */}

        <motion.div
          animate={{
            y: [0, -14, 0],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="pointer-events-none absolute left-[15%] top-[30%] h-2 w-2 rounded-full bg-emerald-500"
        />

        <motion.div
          animate={{
            y: [0, 12, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="pointer-events-none absolute right-[18%] top-[40%] h-2.5 w-2.5 rounded-full bg-green-400"
        />

        <div className="relative flex flex-col items-center gap-4">

          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-100 bg-white shadow-xl shadow-emerald-900/10">

            <div className="absolute inset-0 rounded-2xl bg-emerald-400/10 blur-md" />

            <Loader2 className="relative h-9 w-9 animate-spin text-emerald-600" />

          </div>

          <p className="text-sm font-semibold text-slate-500">
            Loading assignment...
          </p>

        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error || !assignment) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-green-50 px-5 py-10 text-slate-900">

        {/* Ambient Glows */}

        <div className="pointer-events-none absolute -left-32 top-10 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-green-400/10 blur-3xl" />

        <div className="relative mx-auto max-w-4xl">

          <motion.button
            initial={{
              opacity: 0,
              x: -15,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            onClick={() =>
              navigate("/student/assignments")
            }
            className="group inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-white px-4 py-2 text-sm font-bold text-emerald-700 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50 hover:shadow-md"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to My Assignments
          </motion.button>

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
              delay: 0.1,
            }}
            className="relative mt-10 overflow-hidden rounded-3xl border border-red-200 bg-white/90 p-8 text-center shadow-xl shadow-red-900/5 backdrop-blur-xl"
          >

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-red-200 bg-red-50">

              <AlertCircle className="h-9 w-9 text-red-500" />

            </div>

            <h1 className="mt-5 text-xl font-black text-slate-800">

              {error || "Assignment not found"}

            </h1>

            <button
              onClick={() =>
                navigate("/student/assignments")
              }
              className="mt-6 rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 px-5 py-3 font-bold text-white shadow-lg shadow-emerald-900/20 transition hover:-translate-y-0.5 hover:from-emerald-700 hover:to-green-600"
            >
              Back to Assignments
            </button>

          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-green-50 px-5 py-8 text-slate-900">

      {/* ========================================
          AMBIENT BACKGROUND
      ======================================== */}

      <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />

      <div className="pointer-events-none absolute right-[-160px] top-[35%] h-[28rem] w-[28rem] rounded-full bg-green-400/10 blur-3xl" />

      <div className="pointer-events-none absolute bottom-[-180px] left-[35%] h-[30rem] w-[30rem] rounded-full bg-lime-300/10 blur-3xl" />

      {/* Floating particles */}

      <motion.div
        animate={{
          y: [0, -12, 0],
          opacity: [0.2, 0.55, 0.2],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute left-[10%] top-40 h-2 w-2 rounded-full bg-emerald-500"
      />

      <motion.div
        animate={{
          y: [0, 15, 0],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute right-[12%] top-52 h-2.5 w-2.5 rounded-full bg-green-400"
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
        className="pointer-events-none absolute bottom-40 left-[18%] h-2 w-2 rounded-full bg-lime-400"
      />

      <div className="relative mx-auto max-w-7xl">

        {/* ========================================
            HEADER
        ======================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: -15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >

          <motion.button
            whileHover={{
              x: -2,
            }}
            whileTap={{
              scale: 0.97,
            }}
            onClick={() =>
              navigate("/student/assignments")
            }
            className="group inline-flex w-fit items-center gap-2 rounded-xl border border-emerald-200 bg-white/90 px-4 py-2 text-sm font-bold text-emerald-700 shadow-sm backdrop-blur transition hover:border-emerald-300 hover:bg-emerald-50 hover:shadow-md"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back
          </motion.button>

          <motion.a
            whileHover={{
              y: -2,
            }}
            whileTap={{
              scale: 0.97,
            }}
            href={assignment.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-fit items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-emerald-900/15 transition hover:from-emerald-700 hover:to-green-600"
          >
            Open in New Tab
            <ExternalLink className="h-4 w-4" />
          </motion.a>

        </motion.div>


        {/* ========================================
            FILE INFORMATION
        ======================================== */}

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
            delay: 0.1,
          }}
          className="relative mb-6 overflow-hidden rounded-3xl border border-emerald-100 bg-white/90 p-6 shadow-xl shadow-emerald-900/10 backdrop-blur-xl"
        >

          {/* Top Accent */}

          <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-emerald-600 via-green-500 to-lime-400" />

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-4">

              <motion.div
                whileHover={{
                  scale: 1.05,
                  rotate: 2,
                }}
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-100 to-green-50 shadow-inner"
              >
                <FileText className="h-7 w-7 text-emerald-600" />
              </motion.div>

              <div className="min-w-0">

                <h1 className="truncate text-xl font-black text-slate-800">

                  {assignment.originalName ||
                    "Assignment"}

                </h1>

                <p className="mt-1 text-sm font-medium text-slate-500">

                  {assignment.course?.title ||
                    "Course"}

                </p>

              </div>

            </div>

            <div
              className={`w-fit rounded-xl border px-4 py-2 text-sm font-bold ${
                assignment.status === "approved"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : assignment.status === "rejected"
                  ? "border-red-200 bg-red-50 text-red-600"
                  : "border-amber-200 bg-amber-50 text-amber-700"
              }`}
            >
              {assignment.status === "approved"
                ? "Approved"
                : assignment.status === "rejected"
                ? "Rejected"
                : "Pending"}
            </div>

          </div>

        </motion.div>


        {/* ========================================
            PDF VIEWER
        ======================================== */}

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
            delay: 0.18,
          }}
          className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-2xl shadow-emerald-900/10"
        >

          {/* Viewer Header */}

          <div className="flex items-center justify-between border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-green-50 px-5 py-4">

            <div className="flex items-center gap-2">

              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100">

                <FileText className="h-4 w-4 text-emerald-600" />

              </div>

              <span className="text-sm font-bold text-slate-700">
                Assignment Preview
              </span>

            </div>

            <span className="rounded-full border border-emerald-100 bg-white px-3 py-1 text-xs font-bold text-emerald-600 shadow-sm">
              PDF Viewer
            </span>

          </div>

          {/* PDF */}

          <div className="h-[75vh] min-h-[600px] bg-white">

            <iframe
              src={assignment.fileUrl}
              title={
                assignment.originalName ||
                "Assignment PDF"
              }
              className="h-full w-full border-0"
            />

          </div>

        </motion.div>


        {/* ========================================
            FEEDBACK
        ======================================== */}

        {assignment.feedback && (
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
              delay: 0.25,
            }}
            className="relative mt-6 overflow-hidden rounded-3xl border border-emerald-100 bg-white/90 p-6 shadow-xl shadow-emerald-900/5 backdrop-blur-xl"
          >

            {/* Accent */}

            <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-emerald-500 to-green-400" />

            <h2 className="font-black text-slate-800">
              Admin Feedback
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-500">
              {assignment.feedback}
            </p>

          </motion.div>
        )}

      </div>
    </div>
  );
};

export default AssignmentDetails;