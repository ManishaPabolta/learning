import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ExternalLink,
  FileText,
  Loader2,
  AlertCircle,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  XCircle,
  Upload,
  MessageSquare,
} from "lucide-react";

import api from "../../services/api";

const AssignmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // FETCH ASSIGNMENT
  // ==========================================

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        setLoading(true);
        setError("");

        /*
          /assignments/available returns assignments
          created by admin for courses in which the
          logged-in student is enrolled.
        */

        const response = await api.get(
          "/assignments/available"
        );

        const assignments = Array.isArray(
          response.data?.assignments
        )
          ? response.data.assignments
          : Array.isArray(response.data?.data)
          ? response.data.data
          : Array.isArray(response.data)
          ? response.data
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
  // DATE FORMATTER
  // ==========================================

  const formatDate = (date) => {
    if (!date) return "Not specified";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ==========================================
  // STATUS
  // ==========================================

  const getStatus = () => {
    /*
      Depending on backend response, submission can be
      available as:
        assignment.submission
        assignment.mySubmission
        assignment.submissions[0]
    */

    return (
      assignment?.submission ||
      assignment?.mySubmission ||
      assignment?.submissions?.[0] ||
      null
    );
  };

  const submission = getStatus();

  const status = submission?.status || "not_submitted";

  // ==========================================
  // STATUS UI
  // ==========================================

  const statusConfig = {
    approved: {
      label: "Approved",
      icon: CheckCircle2,
      classes:
        "border-emerald-200 bg-emerald-50 text-emerald-700",
    },

    rejected: {
      label: "Rejected",
      icon: XCircle,
      classes:
        "border-red-200 bg-red-50 text-red-600",
    },

    pending: {
      label: "Pending Review",
      icon: Clock3,
      classes:
        "border-amber-200 bg-amber-50 text-amber-700",
    },

    not_submitted: {
      label: "Not Submitted",
      icon: Upload,
      classes:
        "border-blue-200 bg-blue-50 text-blue-700",
    },
  };

  const currentStatus =
    statusConfig[status] ||
    statusConfig.not_submitted;

  const StatusIcon = currentStatus.icon;

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-green-50">

        <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-emerald-400/15 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-green-400/15 blur-3xl" />

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
            Back to Assignments
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

  // ==========================================
  // MAIN UI
  // ==========================================

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-green-50 px-5 py-8 text-slate-900">

      {/* ========================================
          BACKGROUND
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

      <div className="relative mx-auto max-w-6xl">

        {/* ========================================
            TOP HEADER
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
          className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
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
            className="group inline-flex w-fit items-center gap-2 rounded-xl border border-emerald-200 bg-white/90 px-4 py-2.5 text-sm font-bold text-emerald-700 shadow-sm backdrop-blur transition hover:border-emerald-300 hover:bg-emerald-50 hover:shadow-md"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Assignments
          </motion.button>

          <div
            className={`inline-flex w-fit items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold ${currentStatus.classes}`}
          >
            <StatusIcon className="h-4 w-4" />
            {currentStatus.label}
          </div>

        </motion.div>

        {/* ========================================
            ASSIGNMENT HERO
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
            delay: 0.1,
          }}
          className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-white/95 p-6 shadow-2xl shadow-emerald-900/10 backdrop-blur-xl md:p-8"
        >

          {/* Top accent */}

          <div className="absolute left-0 right-0 top-0 h-1.5 bg-gradient-to-r from-emerald-600 via-green-500 to-lime-400" />

          <div className="flex flex-col gap-6">

            {/* Icon + title */}

            <div className="flex gap-4">

              <motion.div
                whileHover={{
                  scale: 1.05,
                  rotate: 2,
                }}
                className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/20"
              >
                <FileText className="h-8 w-8" />
              </motion.div>

              <div className="min-w-0">

                <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-600">
                  Assignment
                </p>

                <h1 className="mt-1 text-2xl font-black leading-tight text-slate-800 md:text-3xl">
                  {assignment.title}
                </h1>

              </div>

            </div>

            {/* Course + due date */}

            <div className="grid gap-3 sm:grid-cols-2">

              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">

                <div className="flex items-center gap-2 text-emerald-700">
                  <BookOpen className="h-5 w-5" />

                  <span className="text-xs font-bold uppercase tracking-wide">
                    Course
                  </span>
                </div>

                <p className="mt-2 font-bold text-slate-800">
                  {assignment.course?.title ||
                    assignment.courseTitle ||
                    "Course"}
                </p>

              </div>

              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">

                <div className="flex items-center gap-2 text-emerald-700">
                  <CalendarDays className="h-5 w-5" />

                  <span className="text-xs font-bold uppercase tracking-wide">
                    Due Date
                  </span>
                </div>

                <p className="mt-2 font-bold text-slate-800">
                  {formatDate(assignment.dueDate)}
                </p>

              </div>

            </div>

          </div>
        </motion.div>

        {/* ========================================
            DESCRIPTION / INSTRUCTIONS
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
          className="mt-6 rounded-3xl border border-emerald-100 bg-white/95 p-6 shadow-xl shadow-emerald-900/5 md:p-8"
        >

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100">
              <FileText className="h-5 w-5 text-emerald-700" />
            </div>

            <div>
              <h2 className="text-lg font-black text-slate-800">
                Assignment Instructions
              </h2>

              <p className="text-xs text-slate-400">
                Read carefully before submitting
              </p>
            </div>

          </div>

          <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50 p-5">

            <p className="whitespace-pre-wrap text-sm leading-7 text-slate-600">
              {assignment.description ||
                assignment.instructions ||
                "No instructions provided by the admin."}
            </p>

          </div>

        </motion.div>

        {/* ========================================
            ADMIN ATTACHMENT
        ======================================== */}

        {assignment.attachmentUrl && (
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
              delay: 0.22,
            }}
            className="mt-6 rounded-3xl border border-emerald-100 bg-white/95 p-6 shadow-xl shadow-emerald-900/5"
          >

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-center gap-3">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100">
                  <FileText className="h-6 w-6 text-emerald-700" />
                </div>

                <div>

                  <h2 className="font-black text-slate-800">
                    Assignment Resource
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {assignment.attachmentName ||
                      "Admin attachment"}
                  </p>

                </div>

              </div>

              <a
                href={assignment.attachmentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700"
              >
                Open Resource
                <ExternalLink className="h-4 w-4" />
              </a>

            </div>

          </motion.div>
        )}

        {/* ========================================
            SUBMISSION STATUS
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
            delay: 0.26,
          }}
          className="mt-6 rounded-3xl border border-emerald-100 bg-white/95 p-6 shadow-xl shadow-emerald-900/5 md:p-8"
        >

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <p className="text-xs font-bold uppercase tracking-[0.15em] text-emerald-600">
                Your Submission
              </p>

              <h2 className="mt-1 text-xl font-black text-slate-800">
                {submission
                  ? "Submission status"
                  : "Ready to submit?"}
              </h2>

            </div>

            {/* NOT SUBMITTED */}

            {!submission && (
              <button
                onClick={() =>
                  navigate(
                    `/student/assignments/submit?assignmentId=${assignment._id}`
                  )
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 px-5 py-3 font-bold text-white shadow-lg shadow-emerald-900/15 transition hover:-translate-y-0.5 hover:from-emerald-700 hover:to-green-600"
              >
                <Upload className="h-5 w-5" />
                Submit Assignment
              </button>
            )}

            {/* REJECTED */}

            {submission?.status === "rejected" && (
              <button
                onClick={() =>
                  navigate(
                    `/student/assignments/submit?assignmentId=${assignment._id}`
                  )
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-red-600 px-5 py-3 font-bold text-white shadow-lg shadow-red-900/10 transition hover:-translate-y-0.5 hover:from-red-600 hover:to-red-700"
              >
                <Upload className="h-5 w-5" />
                Resubmit Assignment
              </button>
            )}

            {/* PENDING */}

            {submission?.status === "pending" && (
              <div className="inline-flex items-center gap-2 rounded-xl bg-amber-50 px-5 py-3 font-bold text-amber-700">
                <Clock3 className="h-5 w-5" />
                Waiting for Review
              </div>
            )}

            {/* APPROVED */}

            {submission?.status === "approved" && (
              <div className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-5 py-3 font-bold text-emerald-700">
                <CheckCircle2 className="h-5 w-5" />
                Successfully Approved
              </div>
            )}

          </div>

          {/* Submitted file */}

          {submission?.fileUrl && (
            <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 p-4">

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div className="flex items-center gap-3 min-w-0">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white border border-slate-200">
                    <FileText className="h-5 w-5 text-slate-600" />
                  </div>

                  <div className="min-w-0">

                    <p className="text-xs font-semibold text-slate-400">
                      Submitted File
                    </p>

                    <p className="truncate text-sm font-bold text-slate-700">
                      {submission.originalName ||
                        "Submitted assignment"}
                    </p>

                  </div>

                </div>

                <a
                  href={submission.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white border border-emerald-200 px-4 py-2.5 text-sm font-bold text-emerald-700 transition hover:bg-emerald-50"
                >
                  View File
                  <ExternalLink className="h-4 w-4" />
                </a>

              </div>

            </div>
          )}

        </motion.div>

        {/* ========================================
            FEEDBACK
        ======================================== */}

        {submission?.feedback && (
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
              delay: 0.3,
            }}
            className={`relative mt-6 overflow-hidden rounded-3xl border bg-white/95 p-6 shadow-xl ${
              submission.status === "rejected"
                ? "border-red-100 shadow-red-900/5"
                : "border-emerald-100 shadow-emerald-900/5"
            }`}
          >

            <div
              className={`absolute left-0 top-0 h-full w-1 ${
                submission.status === "rejected"
                  ? "bg-red-500"
                  : "bg-emerald-500"
              }`}
            />

            <div className="flex gap-3">

              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                  submission.status === "rejected"
                    ? "bg-red-50"
                    : "bg-emerald-50"
                }`}
              >
                <MessageSquare
                  className={`h-5 w-5 ${
                    submission.status === "rejected"
                      ? "text-red-500"
                      : "text-emerald-600"
                  }`}
                />
              </div>

              <div>

                <h2 className="font-black text-slate-800">
                  Admin Feedback
                </h2>

                <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-600">
                  {submission.feedback}
                </p>

              </div>

            </div>

          </motion.div>
        )}

        {/* ========================================
            REVIEWED DATE
        ======================================== */}

        {submission?.reviewedAt && (
          <p className="mt-5 text-center text-xs font-medium text-slate-400">
            Reviewed on {formatDate(submission.reviewedAt)}
          </p>
        )}

      </div>
    </div>
  );
};

export default AssignmentDetails;