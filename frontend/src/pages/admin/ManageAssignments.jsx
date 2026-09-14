import React, { useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock3,
  FileText,
  ExternalLink,
  Loader2,
  ChevronDown,
  ChevronUp,
  Users,
  CalendarDays,
  BookOpen,
  AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import api from "../../services/api";

const ManageAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [processing, setProcessing] = useState(null);

  const [expandedAssignment, setExpandedAssignment] =
    useState(null);

  const [feedback, setFeedback] = useState("");

  const [reviewingSubmission, setReviewingSubmission] =
    useState(null);

  // =====================================================
  // FETCH ASSIGNMENTS
  // =====================================================

  const fetchAssignments = async () => {
    try {
      setLoading(true);

      const response = await api.get("/assignments");

      const data =
        response.data?.assignments ||
        response.data?.data ||
        response.data ||
        [];

      setAssignments(
        Array.isArray(data) ? data : []
      );
    } catch (error) {
      console.error(
        "Failed to fetch assignments:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to load assignments"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "No due date";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const formatDateTime = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  // =====================================================
  // TOGGLE ASSIGNMENT
  // =====================================================

  const toggleAssignment = (assignmentId) => {
    setExpandedAssignment((prev) =>
      prev === assignmentId
        ? null
        : assignmentId
    );
  };

  // =====================================================
  // DELETE ASSIGNMENT
  // =====================================================

  const handleDeleteAssignment = async (
    assignmentId
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this assignment? All student submissions will also be deleted."
    );

    if (!confirmed) return;

    try {
      setProcessing(assignmentId);

      const response = await api.delete(
        `/assignments/${assignmentId}`
      );

      setAssignments((prev) =>
        prev.filter(
          (assignment) =>
            assignment._id !== assignmentId
        )
      );

      if (
        expandedAssignment ===
        assignmentId
      ) {
        setExpandedAssignment(null);
      }

      alert(
        response.data?.message ||
          "Assignment deleted successfully"
      );
    } catch (error) {
      console.error(
        "DELETE ASSIGNMENT ERROR"
      );

      console.error(
        "STATUS:",
        error.response?.status
      );

      console.error(
        "DATA:",
        error.response?.data
      );

      console.error(
        "URL:",
        error.config?.url
      );

      console.error(
        "METHOD:",
        error.config?.method
      );

      alert(
        error.response?.data?.message ||
          "Failed to delete assignment"
      );
    } finally {
      setProcessing(null);
    }
  };

  // =====================================================
  // START REVIEW
  // =====================================================

  const startReview = (
    submission,
    type
  ) => {
    setReviewingSubmission({
      id: submission._id,
      type,
    });

    setFeedback(
      submission.feedback || ""
    );
  };

  // =====================================================
  // CANCEL REVIEW
  // =====================================================

  const cancelReview = () => {
    setReviewingSubmission(null);
    setFeedback("");
  };

  // =====================================================
  // APPROVE / REJECT
  // =====================================================

  const handleReview = async (
    submissionId,
    type
  ) => {
    try {
      setProcessing(submissionId);

      const finalFeedback =
        feedback.trim() ||
        (type === "approve"
          ? "Assignment approved"
          : "Assignment rejected");

      await api.patch(
        `/assignments/submissions/${submissionId}/${type}`,
        {
          feedback: finalFeedback,
        }
      );

      setReviewingSubmission(null);
      setFeedback("");

      await fetchAssignments();

      alert(
        type === "approve"
          ? "Assignment approved successfully"
          : "Assignment rejected successfully"
      );
    } catch (error) {
      console.error(
        "REVIEW ERROR:",
        error.response?.data ||
          error
      );

      alert(
        error.response?.data?.message ||
          `Failed to ${type} assignment`
      );
    } finally {
      setProcessing(null);
    }
  };

  // =====================================================
  // GET SUBMISSIONS
  // =====================================================

  const getSubmissions = (
    assignment
  ) => {
    return Array.isArray(
      assignment.submissions
    )
      ? assignment.submissions
      : [];
  };

  // =====================================================
  // STATUS BADGE
  // =====================================================

  const getStatusBadge = (
    status
  ) => {
    if (status === "approved") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
          <CheckCircle2 size={14} />
          Approved
        </span>
      );
    }

    if (status === "rejected") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
          <XCircle size={14} />
          Rejected
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
        <Clock3 size={14} />
        Pending
      </span>
    );
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2
            className="animate-spin text-green-600"
            size={40}
          />

          <p className="text-sm font-medium text-gray-500">
            Loading assignments...
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* =================================================
            HEADER
        ================================================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: -20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <div className="mb-2 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100">
                <FileText
                  size={25}
                  className="text-green-600"
                />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                  Manage Assignments
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                  Create, review and manage
                  student assignments
                </p>
              </div>
            </div>
          </div>

          <Link
            to="/admin/assignments/add"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-green-200 transition hover:bg-green-700"
          >
            <Plus size={19} />
            Add Assignment
          </Link>
        </motion.div>

        {/* =================================================
            EMPTY STATE
        ================================================= */}

        {assignments.length === 0 ? (
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.98,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center shadow-sm"
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
              <FileText
                size={30}
                className="text-green-600"
              />
            </div>

            <h2 className="text-xl font-bold text-gray-900">
              No assignments found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
              You haven't created any
              assignments yet. Create your
              first assignment for students.
            </p>

            <Link
              to="/admin/assignments/add"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
            >
              <Plus size={18} />
              Create Assignment
            </Link>
          </motion.div>
        ) : (
          /* =================================================
             ASSIGNMENT LIST
          ================================================= */

          <div className="space-y-5">
            {assignments.map(
              (
                assignment,
                index
              ) => {
                const submissions =
                  getSubmissions(
                    assignment
                  );

                const isExpanded =
                  expandedAssignment ===
                  assignment._id;

                const pendingCount =
                  submissions.filter(
                    (submission) =>
                      submission.status ===
                      "pending"
                  ).length;

                const approvedCount =
                  submissions.filter(
                    (submission) =>
                      submission.status ===
                      "approved"
                  ).length;

                const rejectedCount =
                  submissions.filter(
                    (submission) =>
                      submission.status ===
                      "rejected"
                  ).length;

                return (
                  <motion.div
                    key={
                      assignment._id
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
                      delay:
                        index * 0.05,
                    }}
                    className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
                  >
                    {/* =================================================
                        ASSIGNMENT HEADER
                    ================================================= */}

                    <div className="p-5 sm:p-6">
                      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

                        {/* LEFT */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start gap-4">
                            <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-100 sm:flex">
                              <BookOpen
                                size={21}
                                className="text-green-600"
                              />
                            </div>

                            <div className="min-w-0 flex-1">
                              <h2 className="break-words text-lg font-bold text-gray-900 sm:text-xl">
                                {
                                  assignment.title
                                }
                              </h2>

                              <div className="mt-2 flex flex-wrap gap-2">
                                <span className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                                  <BookOpen
                                    size={13}
                                  />

                                  {assignment
                                    .course
                                    ?.title ||
                                    "Unknown Course"}
                                </span>

                                <span className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                                  <CalendarDays
                                    size={13}
                                  />

                                  Due:{" "}
                                  {formatDate(
                                    assignment.dueDate
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* DESCRIPTION */}

                          <p className="mt-4 max-w-4xl whitespace-pre-wrap text-sm leading-6 text-gray-600">
                            {
                              assignment.description
                            }
                          </p>

                          {/* ADMIN ATTACHMENT */}

                          {assignment.attachmentUrl && (
                            <a
                              href={
                                assignment.attachmentUrl
                              }
                              target="_blank"
                              rel="noreferrer"
                              className="mt-4 inline-flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-xs font-semibold text-green-700 transition hover:bg-green-100"
                            >
                              <FileText
                                size={15}
                              />

                              View Assignment
                              File

                              <ExternalLink
                                size={13}
                              />
                            </a>
                          )}
                        </div>

                        {/* RIGHT ACTIONS */}

                        <div className="flex flex-wrap items-center gap-2 lg:max-w-xs lg:justify-end">
                          <div className="flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-2">
                            <Users
                              size={17}
                              className="text-gray-500"
                            />

                            <span className="text-sm font-semibold text-gray-700">
                              {
                                submissions.length
                              }
                            </span>

                            <span className="text-xs text-gray-500">
                              submission
                              {submissions.length !==
                              1
                                ? "s"
                                : ""}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              toggleAssignment(
                                assignment._id
                              )
                            }
                            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                          >
                            {isExpanded ? (
                              <>
                                Hide
                                <ChevronUp
                                  size={17}
                                />
                              </>
                            ) : (
                              <>
                                View
                                <ChevronDown
                                  size={17}
                                />
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteAssignment(
                                assignment._id
                              )
                            }
                            disabled={
                              processing ===
                              assignment._id
                            }
                            className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {processing ===
                            assignment._id ? (
                              <Loader2
                                size={17}
                                className="animate-spin"
                              />
                            ) : (
                              <Trash2
                                size={17}
                              />
                            )}

                            Delete
                          </button>
                        </div>
                      </div>

                      {/* =================================================
                          STATISTICS
                      ================================================= */}

                      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                        <div className="rounded-xl bg-gray-50 p-3">
                          <p className="text-xs text-gray-500">
                            Total
                          </p>

                          <p className="mt-1 text-lg font-bold text-gray-900">
                            {
                              submissions.length
                            }
                          </p>
                        </div>

                        <div className="rounded-xl bg-amber-50 p-3">
                          <p className="text-xs text-amber-700">
                            Pending
                          </p>

                          <p className="mt-1 text-lg font-bold text-amber-800">
                            {pendingCount}
                          </p>
                        </div>

                        <div className="rounded-xl bg-green-50 p-3">
                          <p className="text-xs text-green-700">
                            Approved
                          </p>

                          <p className="mt-1 text-lg font-bold text-green-800">
                            {approvedCount}
                          </p>
                        </div>

                        <div className="rounded-xl bg-red-50 p-3">
                          <p className="text-xs text-red-700">
                            Rejected
                          </p>

                          <p className="mt-1 text-lg font-bold text-red-800">
                            {rejectedCount}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* =================================================
                        SUBMISSIONS
                    ================================================= */}

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{
                            height: 0,
                            opacity: 0,
                          }}
                          animate={{
                            height: "auto",
                            opacity: 1,
                          }}
                          exit={{
                            height: 0,
                            opacity: 0,
                          }}
                          className="border-t border-gray-200 bg-gray-50"
                        >
                          <div className="p-5 sm:p-6">
                            <div className="mb-5 flex items-center justify-between">
                              <div>
                                <h3 className="text-lg font-bold text-gray-900">
                                  Student
                                  Submissions
                                </h3>

                                <p className="mt-1 text-xs text-gray-500">
                                  Review submitted
                                  work and provide
                                  feedback.
                                </p>
                              </div>
                            </div>

                            {submissions.length ===
                            0 ? (
                              <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center">
                                <AlertCircle
                                  size={28}
                                  className="mx-auto text-gray-400"
                                />

                                <p className="mt-3 text-sm font-medium text-gray-600">
                                  No students have
                                  submitted this
                                  assignment yet.
                                </p>
                              </div>
                            ) : (
                              <div className="space-y-4">
                                {submissions.map(
                                  (
                                    submission
                                  ) => (
                                    <div
                                      key={
                                        submission._id
                                      }
                                      className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5"
                                    >
                                      {/* STUDENT INFO */}

                                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                        <div className="flex items-start gap-3">
                                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100 font-bold text-green-700">
                                            {(
                                              submission
                                                .student
                                                ?.name ||
                                              "S"
                                            )
                                              .charAt(
                                                0
                                              )
                                              .toUpperCase()}
                                          </div>

                                          <div>
                                            <h4 className="font-semibold text-gray-900">
                                              {submission
                                                .student
                                                ?.name ||
                                                "Unknown Student"}
                                            </h4>

                                            <p className="text-xs text-gray-500">
                                              {submission
                                                .student
                                                ?.email ||
                                                "No email"}
                                            </p>

                                            <p className="mt-1 text-xs text-gray-400">
                                              Submitted:{" "}
                                              {formatDateTime(
                                                submission.submittedAt
                                              )}
                                            </p>
                                          </div>
                                        </div>

                                        <div>
                                          {getStatusBadge(
                                            submission.status
                                          )}
                                        </div>
                                      </div>

                                      {/* FILE */}

                                      <div className="mt-4 flex flex-col gap-3 rounded-xl bg-gray-50 p-3 sm:flex-row sm:items-center sm:justify-between">
                                        <div className="flex min-w-0 items-center gap-3">
                                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white">
                                            <FileText
                                              size={18}
                                              className="text-green-600"
                                            />
                                          </div>

                                          <div className="min-w-0">
                                            <p className="truncate text-sm font-medium text-gray-800">
                                              {submission.originalName ||
                                                "Submitted file"}
                                            </p>

                                            <p className="text-xs text-gray-500">
                                              {submission.fileType ||
                                                "File"}
                                            </p>
                                          </div>
                                        </div>

                                        {submission.fileUrl && (
                                          <a
                                            href={
                                              submission.fileUrl
                                            }
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-green-700"
                                          >
                                            Open File
                                            <ExternalLink
                                              size={14}
                                            />
                                          </a>
                                        )}
                                      </div>

                                      {/* FEEDBACK */}

                                      {submission.feedback && (
                                        <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-3">
                                          <p className="text-xs font-semibold text-blue-700">
                                            Admin Feedback
                                          </p>

                                          <p className="mt-1 whitespace-pre-wrap text-sm text-blue-900">
                                            {
                                              submission.feedback
                                            }
                                          </p>
                                        </div>
                                      )}

                                      {/* REVIEW ACTIONS */}

                                      {submission.status ===
                                        "pending" && (
                                        <div className="mt-4">
                                          {reviewingSubmission?.id ===
                                            submission._id ? (
                                            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                                              <label className="mb-2 block text-sm font-semibold text-gray-700">
                                                Feedback
                                              </label>

                                              <textarea
                                                value={
                                                  feedback
                                                }
                                                onChange={(
                                                  e
                                                ) =>
                                                  setFeedback(
                                                    e
                                                      .target
                                                      .value
                                                  )
                                                }
                                                rows={4}
                                                placeholder="Write feedback for the student..."
                                                className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                                              />

                                              <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:justify-end">
                                                <button
                                                  type="button"
                                                  onClick={
                                                    cancelReview
                                                  }
                                                  disabled={
                                                    processing ===
                                                    submission._id
                                                  }
                                                  className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-white disabled:opacity-50"
                                                >
                                                  Cancel
                                                </button>

                                                <button
                                                  type="button"
                                                  onClick={() =>
                                                    handleReview(
                                                      submission._id,
                                                      reviewingSubmission.type
                                                    )
                                                  }
                                                  disabled={
                                                    processing ===
                                                    submission._id
                                                  }
                                                  className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50 ${
                                                    reviewingSubmission.type ===
                                                    "approve"
                                                      ? "bg-green-600 hover:bg-green-700"
                                                      : "bg-red-600 hover:bg-red-700"
                                                  }`}
                                                >
                                                  {processing ===
                                                  submission._id ? (
                                                    <Loader2
                                                      size={
                                                        16
                                                      }
                                                      className="animate-spin"
                                                    />
                                                  ) : reviewingSubmission.type ===
                                                    "approve" ? (
                                                    <CheckCircle2
                                                      size={
                                                        16
                                                      }
                                                    />
                                                  ) : (
                                                    <XCircle
                                                      size={
                                                        16
                                                      }
                                                    />
                                                  )}

                                                  {reviewingSubmission.type ===
                                                  "approve"
                                                    ? "Approve"
                                                    : "Reject"}
                                                </button>
                                              </div>
                                            </div>
                                          ) : (
                                            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                                              <button
                                                type="button"
                                                onClick={() =>
                                                  startReview(
                                                    submission,
                                                    "reject"
                                                  )
                                                }
                                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                                              >
                                                <XCircle
                                                  size={
                                                    17
                                                  }
                                                />
                                                Reject
                                              </button>

                                              <button
                                                type="button"
                                                onClick={() =>
                                                  startReview(
                                                    submission,
                                                    "approve"
                                                  )
                                                }
                                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700"
                                              >
                                                <CheckCircle2
                                                  size={
                                                    17
                                                  }
                                                />
                                                Approve
                                              </button>
                                            </div>
                                          )}
                                        </div>
                                      )}

                                      {/* REVIEWED DATE */}

                                      {submission.reviewedAt && (
                                        <p className="mt-3 text-right text-xs text-gray-400">
                                          Reviewed:{" "}
                                          {formatDateTime(
                                            submission.reviewedAt
                                          )}
                                        </p>
                                      )}
                                    </div>
                                  )
                                )}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              }
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageAssignments;