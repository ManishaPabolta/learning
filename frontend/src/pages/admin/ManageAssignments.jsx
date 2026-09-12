
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  ExternalLink,
  Loader2,
  User,
  BookOpen,
  CheckCircle,
  XCircle,
  Clock,
  X,
  MessageSquare,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

import api from "../../services/api";

const ManageAssignments = () => {
  const [assignments, setAssignments] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // Modal state
  const [showModal, setShowModal] = useState(false);

  const [selectedAssignment, setSelectedAssignment] =
    useState(null);

  const [action, setAction] = useState(null);

  const [feedback, setFeedback] = useState("");

  const [processing, setProcessing] = useState(false);

  // ==========================================
  // FETCH ASSIGNMENTS
  // ==========================================

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/assignments");

      console.log(
        "ADMIN ASSIGNMENTS:",
        response.data
      );

      setAssignments(
        Array.isArray(response.data?.assignments)
          ? response.data.assignments
          : []
      );
    } catch (error) {
      console.error(
        "FETCH ADMIN ASSIGNMENTS ERROR:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load submitted assignments."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  // ==========================================
  // OPEN APPROVE / REJECT MODAL
  // ==========================================

  const openActionModal = (
    assignment,
    selectedAction
  ) => {
    setSelectedAssignment(assignment);
    setAction(selectedAction);

    // Existing feedback clear kar do
    setFeedback("");

    setShowModal(true);
  };

  // ==========================================
  // CLOSE MODAL
  // ==========================================

  const closeModal = () => {
    if (processing) return;

    setShowModal(false);
    setSelectedAssignment(null);
    setAction(null);
    setFeedback("");
  };

  // ==========================================
  // APPROVE / REJECT
  // ==========================================

  const handleSubmitAction = async () => {
    if (!selectedAssignment) return;

    // Reject ke liye feedback mandatory
    if (
      action === "reject" &&
      !feedback.trim()
    ) {
      alert(
        "Please enter a reason for rejecting this assignment."
      );

      return;
    }

    try {
      setProcessing(true);

      const assignmentId =
        selectedAssignment._id ||
        selectedAssignment.id;

      const endpoint =
        action === "approve"
          ? `/assignments/${assignmentId}/approve`
          : `/assignments/${assignmentId}/reject`;

      const defaultFeedback =
        action === "approve"
          ? "Assignment approved successfully."
          : "";

      const response = await api.patch(endpoint, {
        feedback:
          feedback.trim() || defaultFeedback,
      });

      console.log(
        "ASSIGNMENT ACTION RESPONSE:",
        response.data
      );

      const updatedAssignment =
        response.data?.assignment;

      // ==========================================
      // UPDATE UI IMMEDIATELY
      // ==========================================

      setAssignments((prevAssignments) =>
        prevAssignments.map((assignment) => {
          const currentId =
            assignment._id ||
            assignment.id;

          if (currentId !== assignmentId) {
            return assignment;
          }

          return {
            ...assignment,

            ...(updatedAssignment || {}),

            status:
              updatedAssignment?.status ||
              (action === "approve"
                ? "approved"
                : "rejected"),

            feedback:
              updatedAssignment?.feedback ??
              feedback.trim() ??
              "",

            reviewedAt:
              updatedAssignment?.reviewedAt ||
              new Date().toISOString(),
          };
        })
      );

      // Modal close
      setShowModal(false);
      setSelectedAssignment(null);
      setAction(null);
      setFeedback("");

      alert(
        action === "approve"
          ? "Assignment approved successfully."
          : "Assignment rejected successfully."
      );
    } catch (error) {
      console.error(
        "ASSIGNMENT ACTION ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          `Failed to ${
            action === "approve"
              ? "approve"
              : "reject"
          } assignment.`
      );
    } finally {
      setProcessing(false);
    }
  };

  // ==========================================
  // STATUS
  // ==========================================

  const getStatus = (status) => {
    switch (status) {
      case "approved":
        return {
          label: "Approved",
          icon: CheckCircle,
          className:
            "border-emerald-200 bg-emerald-50 text-emerald-700",
        };

      case "rejected":
        return {
          label: "Rejected",
          icon: XCircle,
          className:
            "border-red-200 bg-red-50 text-red-600",
        };

      default:
        return {
          label: "Pending",
          icon: Clock,
          className:
            "border-amber-200 bg-amber-50 text-amber-700",
        };
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-green-50">
        {/* Ambient Glows */}
        <div className="pointer-events-none absolute -left-24 top-20 h-80 w-80 rounded-full bg-emerald-400/20 blur-3xl" />

        <div className="pointer-events-none absolute -right-24 bottom-10 h-96 w-96 rounded-full bg-lime-400/20 blur-3xl" />

        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative flex flex-col items-center gap-4"
        >
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-200 bg-white shadow-xl shadow-emerald-900/10">
            <Loader2 className="h-9 w-9 animate-spin text-emerald-600" />

            <span className="absolute inset-0 rounded-2xl border border-emerald-400/30 animate-ping" />
          </div>

          <p className="text-sm font-semibold text-slate-600">
            Loading assignments...
          </p>
        </motion.div>
      </div>
    );
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-green-50 px-5 py-10 text-slate-900">

      {/* ======================================
          AMBIENT BACKGROUND
      ====================================== */}

      <div className="pointer-events-none absolute -left-32 top-20 h-96 w-96 rounded-full bg-emerald-400/15 blur-3xl" />

      <div className="pointer-events-none absolute -right-32 top-1/3 h-96 w-96 rounded-full bg-green-400/15 blur-3xl" />

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
        className="pointer-events-none absolute left-[7%] top-[18%] h-2 w-2 rounded-full bg-emerald-500"
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
        className="pointer-events-none absolute right-[10%] top-[25%] h-3 w-3 rounded-full bg-green-400"
      />

      <motion.div
        animate={{
          x: [0, 10, 0],
          y: [0, -10, 0],
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

      <div className="pointer-events-none absolute left-0 top-36 h-px w-full bg-gradient-to-r from-transparent via-emerald-200/60 to-transparent" />

      <div className="pointer-events-none absolute bottom-28 left-0 h-px w-full bg-gradient-to-r from-transparent via-green-200/50 to-transparent" />

      <div className="relative mx-auto max-w-7xl">

        {/* ======================================
            HEADER
        ====================================== */}

        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-wider text-emerald-700 shadow-sm backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5" />
            Administration
          </div>

          <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">

            <div>
              <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
                Submitted{" "}
                <span className="bg-gradient-to-r from-emerald-600 via-green-500 to-lime-500 bg-clip-text text-transparent">
                  Assignments
                </span>
              </h1>

              <p className="mt-3 text-slate-500">
                Review assignments submitted by students.
              </p>
            </div>

            <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-emerald-100 bg-white/80 px-4 py-2.5 text-sm font-semibold text-emerald-700 shadow-sm backdrop-blur-md">
              <ShieldCheck className="h-4 w-4" />
              Assignment Review
            </div>

          </div>
        </motion.div>

        {/* ======================================
            ERROR
        ====================================== */}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-600 shadow-sm"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <span className="text-sm font-medium">
                {error}
              </span>

              <button
                onClick={fetchAssignments}
                className="rounded-xl bg-red-100 px-4 py-2 text-sm font-semibold transition hover:bg-red-200"
              >
                Retry
              </button>
            </div>
          </motion.div>
        )}

        {/* ======================================
            EMPTY STATE
        ====================================== */}

        {!error &&
          assignments.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative mt-10 overflow-hidden rounded-[2rem] border border-emerald-100 bg-white/90 py-20 text-center shadow-xl shadow-emerald-900/5 backdrop-blur-xl"
            >
              <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-emerald-600 via-green-500 to-lime-400" />

              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-50">
                <FileText className="h-10 w-10 text-emerald-400" />
              </div>

              <h2 className="mt-5 text-xl font-bold text-slate-900">
                No assignments submitted yet
              </h2>

              <p className="mt-2 text-slate-500">
                Student submissions will appear here.
              </p>
            </motion.div>
          )}

        {/* ======================================
            ASSIGNMENTS
        ====================================== */}

        <div className="mt-10 grid gap-5">
          {assignments.map(
            (assignment, index) => {
              const status = getStatus(
                assignment.status
              );

              const StatusIcon = status.icon;

              return (
                <motion.div
                  key={
                    assignment._id ||
                    assignment.id ||
                    index
                  }
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: index * 0.05,
                    duration: 0.4,
                  }}
                  whileHover={{
                    y: -3,
                  }}
                  className="group relative overflow-hidden rounded-[1.75rem] border border-emerald-100 bg-white/90 p-6 shadow-lg shadow-emerald-900/5 backdrop-blur-xl transition-all duration-300 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-900/10"
                >

                  {/* Top accent */}

                  <div className="absolute left-0 right-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-emerald-600 via-green-500 to-lime-400 transition-transform duration-500 group-hover:scale-x-100" />

                  {/* ==================================
                      TOP SECTION
                  ================================== */}

                  <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                    {/* FILE + STUDENT INFO */}

                    <div className="flex min-w-0 gap-4">

                      <motion.div
                        whileHover={{
                          scale: 1.05,
                          rotate: 2,
                        }}
                        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-50 to-green-100 shadow-sm"
                      >
                        <FileText className="h-6 w-6 text-emerald-600" />
                      </motion.div>

                      <div className="min-w-0">
                        <h2 className="break-all text-lg font-bold text-slate-900">
                          {assignment.originalName ||
                            "Assignment"}
                        </h2>

                        {/* STUDENT + COURSE */}

                        <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-500">

                          <span className="flex items-center gap-2">
                            <User className="h-4 w-4 text-emerald-600" />

                            {assignment.student?.name ||
                              "Student"}
                          </span>

                          <span className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-emerald-600" />

                            {assignment.course?.title ||
                              "Course"}
                          </span>

                        </div>

                        {/* EMAIL */}

                        {assignment.student
                          ?.email && (
                          <p className="mt-2 break-all text-xs text-slate-400">
                            {
                              assignment
                                .student.email
                            }
                          </p>
                        )}

                        {/* SUBMITTED DATE */}

                        {assignment.createdAt && (
                          <p className="mt-2 text-xs text-slate-400">
                            Submitted{" "}
                            {new Date(
                              assignment.createdAt
                            ).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* ==================================
                        STATUS + OPEN FILE
                    ================================== */}

                    <div className="flex flex-wrap items-center gap-3">

                      {/* STATUS */}

                      <div
                        className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold ${status.className}`}
                      >
                        <StatusIcon className="h-4 w-4" />

                        {status.label}
                      </div>

                      {/* OPEN FILE */}

                      {assignment.fileUrl && (
                        <motion.a
                          href={
                            assignment.fileUrl
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          className="group/file inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-emerald-600/20 transition-all hover:shadow-lg hover:shadow-emerald-600/30"
                        >
                          Open File

                          <ExternalLink className="h-4 w-4 transition-transform duration-300 group-hover/file:-translate-y-0.5 group-hover/file:translate-x-0.5" />
                        </motion.a>
                      )}

                    </div>
                  </div>

                  {/* ==================================
                      ADMIN FEEDBACK
                  ================================== */}

                  {assignment.feedback && (
                    <motion.div
                      initial={{
                        opacity: 0,
                        y: 5,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-5"
                    >

                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm">
                          <MessageSquare className="h-4 w-4 text-emerald-600" />
                        </div>

                        <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                          Admin Feedback
                        </p>
                      </div>

                      <p className="mt-3 text-sm leading-6 text-slate-600">
                        {assignment.feedback}
                      </p>

                    </motion.div>
                  )}

                  {/* ==================================
                      ADMIN ACTIONS
                  ================================== */}

                  {assignment.status !==
                    "approved" &&
                    assignment.status !==
                      "rejected" && (
                      <div className="mt-6 flex flex-wrap gap-3 border-t border-slate-100 pt-5">

                        {/* APPROVE */}

                        <motion.button
                          onClick={() =>
                            openActionModal(
                              assignment,
                              "approve"
                            )
                          }
                          disabled={processing}
                          whileHover={!processing ? { scale: 1.02 } : {}}
                          whileTap={!processing ? { scale: 0.97 } : {}}
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-emerald-600/20 transition-all hover:shadow-lg hover:shadow-emerald-600/30 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <CheckCircle className="h-4 w-4" />

                          Approve
                        </motion.button>

                        {/* REJECT */}

                        <motion.button
                          onClick={() =>
                            openActionModal(
                              assignment,
                              "reject"
                            )
                          }
                          disabled={processing}
                          whileHover={!processing ? { scale: 1.02 } : {}}
                          whileTap={!processing ? { scale: 0.97 } : {}}
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-semibold text-red-600 transition-all hover:border-red-300 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <XCircle className="h-4 w-4" />

                          Reject
                        </motion.button>

                      </div>
                    )}

                  {/* ==================================
                      REVIEWED INFO
                  ================================== */}

                  {assignment.reviewedAt && (
                    <p className="mt-4 text-xs text-slate-400">
                      Reviewed on{" "}
                      {new Date(
                        assignment.reviewedAt
                      ).toLocaleString()}
                    </p>
                  )}
                </motion.div>
              );
            }
          )}
        </div>
      </div>

      {/* ==========================================
          APPROVE / REJECT MODAL
      ========================================== */}

      {showModal &&
        selectedAssignment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-6 backdrop-blur-md">

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.94,
                y: 20,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              transition={{
                duration: 0.25,
              }}
              className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[2rem] border border-emerald-100 bg-white p-6 shadow-2xl shadow-slate-900/20 sm:p-7"
            >

              {/* Top accent */}

              <div
                className={`absolute left-0 right-0 top-0 h-1.5 ${
                  action === "approve"
                    ? "bg-gradient-to-r from-emerald-600 via-green-500 to-lime-400"
                    : "bg-gradient-to-r from-red-500 via-rose-500 to-orange-400"
                }`}
              />

              {/* MODAL HEADER */}

              <div className="flex items-start justify-between gap-4">

                <div>
                  <div className="flex items-center gap-3">

                    {action === "approve" ? (
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50">
                        <CheckCircle className="h-5 w-5 text-emerald-600" />
                      </div>
                    ) : (
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50">
                        <XCircle className="h-5 w-5 text-red-500" />
                      </div>
                    )}

                    <div>
                      <h2 className="text-xl font-bold text-slate-900">
                        {action === "approve"
                          ? "Approve Assignment"
                          : "Reject Assignment"}
                      </h2>

                      <p className="mt-1 max-w-xs break-all text-sm text-slate-400">
                        {selectedAssignment.originalName ||
                          "Assignment"}
                      </p>
                    </div>

                  </div>
                </div>

                {/* CLOSE */}

                <button
                  onClick={closeModal}
                  disabled={processing}
                  className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
                >
                  <X className="h-5 w-5" />
                </button>

              </div>

              {/* ==================================
                  CONFIRMATION TEXT
              ================================== */}

              <div
                className={`mt-6 rounded-2xl border p-4 ${
                  action === "approve"
                    ? "border-emerald-100 bg-emerald-50/70"
                    : "border-red-100 bg-red-50/70"
                }`}
              >
                <p className="text-sm font-medium text-slate-700">
                  {action === "approve"
                    ? "Are you sure you want to approve this assignment?"
                    : "Are you sure you want to reject this assignment?"}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Student:{" "}
                  {selectedAssignment.student
                    ?.name || "Student"}
                </p>
              </div>

              {/* ==================================
                  FEEDBACK TEXTAREA
              ================================== */}

              <div className="mt-6">

                <label className="mb-2 block text-sm font-bold text-slate-700">
                  {action === "reject"
                    ? "Reason for rejection"
                    : "Note / Feedback"}

                  {action === "reject" && (
                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  )}
                </label>

                <textarea
                  value={feedback}
                  onChange={(e) =>
                    setFeedback(e.target.value)
                  }
                  rows={5}
                  disabled={processing}
                  placeholder={
                    action === "reject"
                      ? "Explain why this assignment is being rejected..."
                      : "Write an optional note for the student..."
                  }
                  className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition-all duration-300 placeholder:text-slate-400 hover:border-emerald-200 hover:bg-white focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                />

                {action === "reject" && (
                  <p className="mt-2 text-xs leading-5 text-slate-400">
                    Please provide a clear reason so the
                    student knows what needs to be improved.
                  </p>
                )}

              </div>

              {/* ==================================
                  MODAL BUTTONS
              ================================== */}

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                {/* CANCEL */}

                <button
                  onClick={closeModal}
                  disabled={processing}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-500 transition hover:bg-slate-50 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                {/* CONFIRM */}

                <button
                  onClick={handleSubmitAction}
                  disabled={
                    processing ||
                    (action === "reject" &&
                      !feedback.trim())
                  }
                  className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white shadow-md transition-all disabled:cursor-not-allowed disabled:opacity-50 ${
                    action === "approve"
                      ? "bg-gradient-to-r from-emerald-600 to-green-500 shadow-emerald-600/20 hover:shadow-lg"
                      : "bg-gradient-to-r from-red-600 to-rose-500 shadow-red-600/20 hover:shadow-lg"
                  }`}
                >

                  {processing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />

                      Processing...
                    </>
                  ) : (
                    <>
                      {action === "approve" ? (
                        <>
                          <CheckCircle className="h-4 w-4" />
                          Confirm Approval
                        </>
                      ) : (
                        <>
                          <XCircle className="h-4 w-4" />
                          Confirm Rejection
                        </>
                      )}
                    </>
                  )}

                </button>

              </div>

            </motion.div>
          </div>
        )}
    </div>
  );
};

export default ManageAssignments;
