import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ExternalLink,
  FileText,
  Pencil,
  Trash2,
  Upload,
  X,
  CheckCircle2,
  Clock3,
  XCircle,
  Loader2,
  Plus,
  Sparkles,
  CalendarDays,
  BookOpen,
  AlertCircle,
  ClipboardCheck,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import api from "../../services/api";

const MyAssignments = () => {
  const navigate = useNavigate();

  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingSubmission, setEditingSubmission] =
    useState(null);

  const [selectedFile, setSelectedFile] =
    useState(null);

  const [updating, setUpdating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // ==========================================
  // FETCH MY ASSIGNMENTS
  // ==========================================

 const fetchAssignments = async () => {
  try {
    setLoading(true);

    const response = await api.get(
      "/assignments/available"
    );

    console.log(
      "AVAILABLE ASSIGNMENTS:",
      response.data
    );

    if (response.data?.success) {
      setAssignments(
        Array.isArray(response.data.assignments)
          ? response.data.assignments
          : []
      );
    } else {
      setAssignments([]);
    }
  } catch (error) {
    console.error(
      "GET AVAILABLE ASSIGNMENTS ERROR:",
      error
    );

    setAssignments([]);

    alert(
      error.response?.data?.message ||
        "Failed to load assignments."
    );
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchAssignments();
  }, []);

  // ==========================================
  // SUBMIT
  // ==========================================

  const handleSubmitAssignment = () => {
    navigate(
      "/student/assignments/submit"
    );
  };

  // ==========================================
  // FILE VALIDATION
  // ==========================================

  const validateFile = (file) => {
    if (!file) return false;

    const allowedTypes = [
      "application/pdf",
      "image/png",
      "image/jpeg",
      "image/jpg",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    const allowedExtensions = [
      ".pdf",
      ".png",
      ".jpg",
      ".jpeg",
      ".doc",
      ".docx",
    ];

    const maxSize = 10 * 1024 * 1024;

    const extension = file.name
      .toLowerCase()
      .slice(file.name.lastIndexOf("."));

    if (
      !allowedTypes.includes(file.type) &&
      !allowedExtensions.includes(extension)
    ) {
      alert(
        "Only PDF, JPG, JPEG, PNG, DOC and DOCX files are allowed."
      );

      return false;
    }

    if (file.size > maxSize) {
      alert(
        "File size must be less than or equal to 10 MB."
      );

      return false;
    }

    return true;
  };

  // ==========================================
  // CAN MODIFY
  // ==========================================

  const canModifySubmission = (assignment) => {
    const status =
      assignment.submission?.status;

    return (
      status === "pending" ||
      status === "rejected"
    );
  };

  // ==========================================
  // EDIT
  // ==========================================

  const handleEditClick = (assignment) => {
    if (!canModifySubmission(assignment)) {
      alert(
        "Only pending or rejected submissions can be edited."
      );
      return;
    }

    setEditingSubmission(assignment);
    setSelectedFile(null);
  };

  // ==========================================
  // FILE CHANGE
  // ==========================================

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!validateFile(file)) {
      event.target.value = "";
      return;
    }

    setSelectedFile(file);
  };

  // ==========================================
  // UPDATE SUBMISSION
  // ==========================================

  const handleUpdateSubmission = async () => {
    if (!editingSubmission) return;

    if (!selectedFile) {
      alert("Please select a new file.");
      return;
    }

    const submissionId =
      editingSubmission.submission?._id;

    if (!submissionId) {
      alert(
        "Submission not found."
      );
      return;
    }

    try {
      setUpdating(true);

      const formData = new FormData();

      formData.append(
        "file",
        selectedFile
      );

      const response = await api.put(
        `/assignments/submissions/${submissionId}`,
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      if (response.data?.success) {
        alert(
          "Assignment updated successfully!\n\nYour submission has been sent for review again."
        );

        setEditingSubmission(null);
        setSelectedFile(null);

        await fetchAssignments();
      } else {
        alert(
          response.data?.message ||
            "Failed to update submission."
        );
      }
    } catch (error) {
      console.error(
        "UPDATE SUBMISSION ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to update submission."
      );
    } finally {
      setUpdating(false);
    }
  };

  // ==========================================
  // DELETE
  // ==========================================

  const handleDeleteSubmission = async (
    assignment
  ) => {
    if (!canModifySubmission(assignment)) {
      alert(
        "Only pending or rejected submissions can be removed."
      );
      return;
    }

    const submission =
      assignment.submission;

    if (!submission?._id) {
      alert(
        "No submission found."
      );
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to remove "${submission.originalName}"?\n\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setDeletingId(submission._id);

      const response = await api.delete(
        `/assignments/submissions/${submission._id}`
      );

      if (response.data?.success) {
        alert(
          "Submission removed successfully!"
        );

        await fetchAssignments();
      } else {
        alert(
          response.data?.message ||
            "Failed to remove submission."
        );
      }
    } catch (error) {
      console.error(
        "DELETE SUBMISSION ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to remove submission."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ==========================================
  // CLOSE MODAL
  // ==========================================

  const closeEditModal = () => {
    if (updating) return;

    setEditingSubmission(null);
    setSelectedFile(null);
  };

  // ==========================================
  // STATUS
  // ==========================================

  const getStatus = (status) => {
    switch (status) {
      case "approved":
        return {
          label: "Approved",
          icon: CheckCircle2,
          className:
            "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
        };

      case "rejected":
        return {
          label: "Rejected",
          icon: XCircle,
          className:
            "bg-red-50 text-red-700 ring-1 ring-red-200",
        };

      default:
        return {
          label: "Pending Review",
          icon: Clock3,
          className:
            "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
        };
    }
  };

  // ==========================================
  // DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) return "—";

    try {
      return new Date(date).toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      );
    } catch {
      return "—";
    }
  };

  // ==========================================
  // DUE DATE CHECK
  // ==========================================

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;

    return new Date(dueDate) < new Date();
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="relative flex min-h-[60vh] items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-green-50">
        <div className="pointer-events-none absolute -left-20 top-10 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl" />

        <div className="pointer-events-none absolute -right-20 bottom-10 h-64 w-64 rounded-full bg-lime-400/10 blur-3xl" />

        <div className="relative flex flex-col items-center gap-4">
          <motion.div
            animate={{
              scale: [1, 1.08, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-100 bg-white shadow-xl"
          >
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          </motion.div>

          <p className="text-sm font-medium text-slate-500">
            Loading your assignments...
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <>
      <div className="relative min-h-full overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-green-50 px-1 py-2 text-slate-900 sm:px-2">

        {/* BACKGROUND */}

        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />

          <div className="absolute -right-24 top-1/3 h-80 w-80 rounded-full bg-green-400/10 blur-3xl" />

          <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-lime-300/10 blur-3xl" />
        </div>

        <div className="relative space-y-6">

          {/* HEADER */}

          <motion.div
            initial={{
              opacity: 0,
              y: -15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-3 py-1.5 text-xs font-bold text-emerald-700 shadow-sm backdrop-blur">
                <Sparkles className="h-3.5 w-3.5" />
                Student Workspace
              </div>

              <h1 className="bg-gradient-to-r from-emerald-700 via-green-600 to-lime-500 bg-clip-text text-4xl font-black tracking-tight text-transparent">
                My Assignments
              </h1>

              <p className="mt-2 text-slate-500">
                View assignments, submit your work and track review status.
              </p>
            </div>

            <motion.button
              type="button"
              onClick={handleSubmitAssignment}
              whileHover={{
                y: -2,
                scale: 1.01,
              }}
              whileTap={{
                scale: 0.98,
              }}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 via-green-600 to-lime-500 px-5 py-3 font-semibold text-white shadow-lg shadow-emerald-600/20"
            >
              <Plus className="h-5 w-5" />

              Submit Assignment
            </motion.button>
          </motion.div>

          {/* SUMMARY */}

          <div className="grid gap-4 sm:grid-cols-3">

            <div className="rounded-2xl border border-emerald-100 bg-white/90 p-5 shadow-lg">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Total
              </p>

              <p className="mt-2 text-3xl font-black text-emerald-700">
                {assignments.length}
              </p>
            </div>

            <div className="rounded-2xl border border-amber-100 bg-white/90 p-5 shadow-lg">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Pending
              </p>

              <p className="mt-2 text-3xl font-black text-amber-600">
                {
                  assignments.filter(
                    (item) =>
                      item.submission?.status ===
                      "pending"
                  ).length
                }
              </p>
            </div>

            <div className="rounded-2xl border border-red-100 bg-white/90 p-5 shadow-lg">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Rejected
              </p>

              <p className="mt-2 text-3xl font-black text-red-600">
                {
                  assignments.filter(
                    (item) =>
                      item.submission?.status ===
                      "rejected"
                  ).length
                }
              </p>
            </div>
          </div>

          {/* EMPTY */}

          {assignments.length === 0 ? (
            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="rounded-3xl border border-dashed border-emerald-200 bg-white/90 px-6 py-16 text-center shadow-xl"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50">
                <ClipboardCheck className="h-8 w-8 text-emerald-600" />
              </div>

              <h2 className="mt-5 text-xl font-bold text-slate-900">
                No assignments available
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Your enrolled courses don't have any assignments right now.
              </p>
            </motion.div>
          ) : (
            <div className="grid gap-5">

              {assignments.map(
                (assignment, index) => {
                  const submission =
                    assignment.submission;

                  const status = getStatus(
                    submission?.status
                  );

                  const StatusIcon =
                    status.icon;

                  const canModify =
                    canModifySubmission(
                      assignment
                    );

                  const isDeleting =
                    deletingId ===
                    submission?._id;

                  return (
                    <motion.div
                      key={assignment._id}
                      initial={{
                        opacity: 0,
                        y: 25,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        delay:
                          index * 0.05,
                      }}
                      whileHover={{
                        y: -3,
                      }}
                      className="group relative overflow-hidden rounded-3xl border border-emerald-100 bg-white/90 shadow-lg backdrop-blur-xl"
                    >

                      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 via-green-500 to-lime-400" />

                      <div className="p-5 sm:p-6">

                        {/* ASSIGNMENT HEADER */}

                        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

                          <div className="flex min-w-0 gap-4">

                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-50">
                              <BookOpen className="h-7 w-7 text-emerald-600" />
                            </div>

                            <div className="min-w-0">

                              <h2 className="text-xl font-black text-slate-900">
                                {assignment.title ||
                                  "Untitled Assignment"}
                              </h2>

                              <p className="mt-1 text-sm font-medium text-emerald-700">
                                {assignment.course?.title ||
                                  "Course"}
                              </p>

                              <p className="mt-3 text-sm leading-6 text-slate-500">
                                {assignment.description ||
                                  "No instructions provided."}
                              </p>

                            </div>
                          </div>

                          {submission ? (
                            <div
                              className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold ${status.className}`}
                            >
                              <StatusIcon className="h-4 w-4" />

                              {status.label}
                            </div>
                          ) : (
                            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 ring-1 ring-blue-200">
                              <AlertCircle className="h-4 w-4" />

                              Not Submitted
                            </div>
                          )}
                        </div>

                        {/* META */}

                        <div className="mt-5 flex flex-wrap gap-3">

                          <div className="inline-flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600">
                            <CalendarDays className="h-4 w-4" />

                            Due:{" "}
                            {formatDate(
                              assignment.dueDate
                            )}
                          </div>

                          {assignment.dueDate &&
                            isOverdue(
                              assignment.dueDate
                            ) &&
                            !submission && (
                              <div className="inline-flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2 text-xs font-bold text-red-600">
                                <AlertCircle className="h-4 w-4" />

                                Deadline Passed
                              </div>
                            )}
                        </div>

                        {/* SUBMISSION */}

                        {submission && (
                          <div className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4">

                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                              <div className="flex min-w-0 items-center gap-3">

                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white">
                                  <FileText className="h-5 w-5 text-emerald-600" />
                                </div>

                                <div className="min-w-0">

                                  <p className="truncate text-sm font-bold text-slate-800">
                                    {submission.originalName}
                                  </p>

                                  <p className="mt-1 text-xs text-slate-500">
                                    Submitted{" "}
                                    {formatDate(
                                      submission.submittedAt ||
                                        submission.createdAt
                                    )}
                                  </p>

                                </div>
                              </div>

                              {submission.fileUrl && (
                                <a
                                  href={
                                    submission.fileUrl
                                  }
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-800 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-900"
                                >
                                  <ExternalLink className="h-4 w-4" />

                                  View File
                                </a>
                              )}
                            </div>
                          </div>
                        )}

                        {/* FEEDBACK */}

                        {submission?.feedback && (
                          <div
                            className={`mt-5 rounded-2xl border p-4 ${
                              submission.status ===
                              "rejected"
                                ? "border-red-200 bg-red-50"
                                : "border-emerald-200 bg-emerald-50"
                            }`}
                          >
                            <p
                              className={`text-xs font-bold uppercase tracking-wide ${
                                submission.status ===
                                "rejected"
                                  ? "text-red-500"
                                  : "text-emerald-600"
                              }`}
                            >
                              Admin Feedback
                            </p>

                            <p
                              className={`mt-1 text-sm leading-6 ${
                                submission.status ===
                                "rejected"
                                  ? "text-red-700"
                                  : "text-slate-700"
                              }`}
                            >
                              {submission.feedback}
                            </p>

                            {submission.reviewedAt && (
                              <p className="mt-2 text-xs text-slate-400">
                                Reviewed on{" "}
                                {formatDate(
                                  submission.reviewedAt
                                )}
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      {/* ACTIONS */}

                      <div className="border-t border-emerald-100 bg-gradient-to-r from-emerald-50/70 via-white to-green-50/70 px-5 py-4 sm:px-6">

                        <div className="flex flex-wrap gap-2">

                          {!submission && (
                            <button
                              type="button"
                              onClick={() =>
                                navigate(
                                  `/student/assignments/submit?assignmentId=${assignment._id}`
                                )
                              }
                              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/20"
                            >
                              <Upload className="h-4 w-4" />

                              Submit Now
                            </button>
                          )}

                          {submission &&
                            submission.fileUrl && (
                              <a
                                href={
                                  submission.fileUrl
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-900"
                              >
                                <ExternalLink className="h-4 w-4" />

                                View Submission
                              </a>
                            )}

                          {canModify && (
                            <button
                              type="button"
                              onClick={() =>
                                handleEditClick(
                                  assignment
                                )
                              }
                              disabled={
                                updating ||
                                isDeleting
                              }
                              className="inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm font-semibold text-amber-700 hover:bg-amber-100 disabled:opacity-50"
                            >
                              <Pencil className="h-4 w-4" />

                              {submission?.status ===
                              "rejected"
                                ? "Resubmit"
                                : "Edit"}
                            </button>
                          )}

                          {canModify && (
                            <button
                              type="button"
                              onClick={() =>
                                handleDeleteSubmission(
                                  assignment
                                )
                              }
                              disabled={
                                isDeleting ||
                                updating
                              }
                              className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-100 disabled:opacity-50"
                            >
                              {isDeleting ? (
                                <>
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                  Removing...
                                </>
                              ) : (
                                <>
                                  <Trash2 className="h-4 w-4" />
                                  Remove
                                </>
                              )}
                            </button>
                          )}
                        </div>

                        {/* STATUS HELP */}

                        {!submission && (
                          <p className="mt-3 text-xs text-blue-600">
                            This assignment has not been submitted yet.
                          </p>
                        )}

                        {submission?.status ===
                          "pending" && (
                          <p className="mt-3 text-xs text-amber-600">
                            Your submission is waiting for admin review.
                          </p>
                        )}

                        {submission?.status ===
                          "rejected" && (
                          <p className="mt-3 text-xs text-red-500">
                            Your submission was rejected. Update your file and resubmit it.
                          </p>
                        )}

                        {submission?.status ===
                          "approved" && (
                          <p className="mt-3 text-xs text-emerald-600">
                            Your assignment has been approved. This submission is locked.
                          </p>
                        )}
                      </div>
                    </motion.div>
                  );
                }
              )}
            </div>
          )}
        </div>
      </div>

      {/* ==========================================
          EDIT MODAL
      ========================================== */}

      <AnimatePresence>
        {editingSubmission && (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-md"
          >
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
              exit={{
                opacity: 0,
                scale: 0.95,
                y: 20,
              }}
              className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-emerald-100 bg-white shadow-2xl"
            >

              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 via-green-500 to-lime-400" />

              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">

                <div>
                  <div className="flex items-center gap-2">
                    <Pencil className="h-5 w-5 text-emerald-600" />

                    <h2 className="text-lg font-bold text-slate-900">
                      {editingSubmission.submission?.status ===
                      "rejected"
                        ? "Resubmit Assignment"
                        : "Edit Submission"}
                    </h2>
                  </div>

                  <p className="mt-1 text-xs text-slate-500">
                    Upload a new version of your assignment.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeEditModal}
                  disabled={updating}
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 hover:bg-emerald-50 hover:text-emerald-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-5 px-5 py-6 sm:px-6">

                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    Assignment
                  </p>

                  <p className="mt-1 font-bold text-slate-800">
                    {editingSubmission.title}
                  </p>
                </div>

                {editingSubmission.submission?.status ===
                  "rejected" &&
                  editingSubmission.submission
                    ?.feedback && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
                      <p className="text-xs font-bold uppercase tracking-wide text-red-500">
                        Rejection Feedback
                      </p>

                      <p className="mt-1 text-sm leading-6 text-red-700">
                        {
                          editingSubmission
                            .submission
                            .feedback
                        }
                      </p>
                    </div>
                  )}

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Select New File
                  </label>

                  <label
                    htmlFor="assignment-edit-file"
                    className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-emerald-200 bg-emerald-50/40 px-5 py-8 text-center hover:border-emerald-400 hover:bg-emerald-50"
                  >
                    <Upload className="h-8 w-8 text-emerald-600" />

                    {selectedFile ? (
                      <>
                        <p className="mt-3 max-w-full truncate text-sm font-bold text-slate-800">
                          {selectedFile.name}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          Click to choose another file
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="mt-3 text-sm font-bold text-slate-800">
                          Choose new file
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          PDF, JPG, JPEG, PNG, DOC or DOCX · Max 10MB
                        </p>
                      </>
                    )}

                    <input
                      id="assignment-edit-file"
                      type="file"
                      hidden
                      accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                      onChange={handleFileChange}
                      disabled={updating}
                    />
                  </label>
                </div>

                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-800">
                  Your updated submission will return to{" "}
                  <strong>Pending</strong> status and will need to be reviewed again.
                </div>
              </div>

              <div className="flex flex-col-reverse gap-2 border-t border-slate-100 bg-slate-50 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">

                <button
                  type="button"
                  onClick={closeEditModal}
                  disabled={updating}
                  className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-emerald-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleUpdateSubmission}
                  disabled={
                    updating ||
                    !selectedFile
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50"
                >
                  {updating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      Resubmit
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MyAssignments;