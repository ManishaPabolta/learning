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
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import api from "../../services/api";

const MyAssignments = () => {
  const navigate = useNavigate();

  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // EDIT MODAL
  // ==========================================

  const [editingAssignment, setEditingAssignment] =
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

      const response = await api.get("/assignments/my");

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
        "GET MY ASSIGNMENTS ERROR:",
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
  // OPEN SUBMIT ASSIGNMENT PAGE
  // ==========================================

  const handleSubmitAssignment = () => {
    navigate("/student/assignments/submit");
  };

  // ==========================================
  // FILE VALIDATION
  // ==========================================

  const validateFile = (file) => {
    if (!file) {
      return false;
    }

    const allowedTypes = [
      "application/pdf",
      "image/png",
      "image/jpeg",
      "image/jpg",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    const maxSize = 10 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      alert(
        "Invalid file type.\n\nOnly PDF, JPG, JPEG, PNG, DOC and DOCX files are allowed."
      );

      return false;
    }

    if (file.size > maxSize) {
      alert(
        "File size must be less than 10MB."
      );

      return false;
    }

    return true;
  };

  // ==========================================
  // CHECK EDIT / DELETE
  // ==========================================

  const canModifyAssignment = (assignment) => {
    return (
      assignment.status === "pending" ||
      assignment.status === "rejected"
    );
  };

  // ==========================================
  // OPEN EDIT MODAL
  // ==========================================

  const handleEditClick = (assignment) => {
    if (!canModifyAssignment(assignment)) {
      alert(
        "Only pending or rejected assignments can be edited."
      );

      return;
    }

    setEditingAssignment(assignment);
    setSelectedFile(null);
  };

  // ==========================================
  // SELECT NEW FILE
  // ==========================================

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!validateFile(file)) {
      event.target.value = "";
      return;
    }

    setSelectedFile(file);
  };

  // ==========================================
  // UPDATE ASSIGNMENT
  // ==========================================

  const handleUpdateAssignment = async () => {
    if (!editingAssignment) {
      return;
    }

    if (!selectedFile) {
      alert("Please select a new file first.");
      return;
    }

    try {
      setUpdating(true);

      const formData = new FormData();

      formData.append("file", selectedFile);

      const response = await api.put(
        `/assignments/${editingAssignment._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data?.success) {
        alert(
          "Assignment updated successfully!\n\nYour assignment has been sent for review again."
        );

        setEditingAssignment(null);
        setSelectedFile(null);

        await fetchAssignments();
      } else {
        alert(
          response.data?.message ||
            "Failed to update assignment."
        );
      }
    } catch (error) {
      console.error(
        "UPDATE ASSIGNMENT ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to update assignment."
      );
    } finally {
      setUpdating(false);
    }
  };

  // ==========================================
  // DELETE ASSIGNMENT
  // ==========================================

  const handleDeleteAssignment = async (assignment) => {
    if (!canModifyAssignment(assignment)) {
      alert(
        "Only pending or rejected assignments can be removed."
      );

      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to remove "${assignment.originalName}"?\n\nThis action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(assignment._id);

      const response = await api.delete(
        `/assignments/${assignment._id}`
      );

      if (response.data?.success) {
        alert("Assignment removed successfully!");

        setAssignments((previousAssignments) =>
          previousAssignments.filter(
            (item) =>
              item._id !== assignment._id
          )
        );
      } else {
        alert(
          response.data?.message ||
            "Failed to remove assignment."
        );
      }
    } catch (error) {
      console.error(
        "DELETE ASSIGNMENT ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to remove assignment."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ==========================================
  // CLOSE EDIT MODAL
  // ==========================================

  const closeEditModal = () => {
    if (updating) {
      return;
    }

    setEditingAssignment(null);
    setSelectedFile(null);
  };

  // ==========================================
  // STATUS UI
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
          label: "Pending",
          icon: Clock3,
          className:
            "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
        };
    }
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

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
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="relative flex min-h-[60vh] items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-green-50">
        {/* Ambient glow */}
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
            className="flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-100 bg-white shadow-xl shadow-emerald-900/10"
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
  // MAIN UI
  // ==========================================

  return (
    <>
      <div className="relative min-h-full overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-green-50 px-1 py-2 text-slate-900 sm:px-2">

        {/* =====================================
            AMBIENT BACKGROUND
        ===================================== */}

        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />
          <div className="absolute -right-24 top-1/3 h-80 w-80 rounded-full bg-green-400/10 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-lime-300/10 blur-3xl" />

          <motion.div
            animate={{
              y: [0, -18, 0],
              opacity: [0.25, 0.5, 0.25],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute left-[12%] top-[15%] h-2 w-2 rounded-full bg-emerald-400"
          />

          <motion.div
            animate={{
              y: [0, 16, 0],
              opacity: [0.2, 0.45, 0.2],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
            className="absolute right-[18%] top-[25%] h-1.5 w-1.5 rounded-full bg-green-400"
          />

          <motion.div
            animate={{
              y: [0, -14, 0],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 5.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
            className="absolute bottom-[20%] right-[30%] h-2 w-2 rounded-full bg-lime-400"
          />
        </div>

        <div className="relative space-y-6">

          {/* =====================================
              HEADER
          ===================================== */}

          <motion.div
            initial={{
              opacity: 0,
              y: -15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.5,
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
                View and manage your submitted assignments.
              </p>
            </div>

            {/* =================================
                NEW SUBMISSION BUTTON
            ================================= */}

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
              className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-emerald-600 via-green-600 to-lime-500 px-5 py-3 font-semibold text-white shadow-lg shadow-emerald-600/20 transition"
            >
              <span className="absolute inset-0 -translate-x-full bg-white/20 transition-transform duration-700 group-hover:translate-x-full" />

              <Plus className="relative h-5 w-5" />

              <span className="relative">
                Submit Assignment
              </span>
            </motion.button>
          </motion.div>

          {/* =====================================
              SUMMARY
          ===================================== */}

          <div className="flex justify-end">
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.95,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              className="relative overflow-hidden rounded-2xl border border-emerald-100 bg-white/85 px-6 py-4 text-center shadow-lg shadow-emerald-900/5 backdrop-blur-xl"
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 via-green-500 to-lime-400" />

              <p className="text-xs font-medium text-emerald-600">
                Total Submissions
              </p>

              <p className="mt-1 text-2xl font-black text-emerald-700">
                {assignments.length}
              </p>
            </motion.div>
          </div>

          {/* =====================================
              EMPTY STATE
          ===================================== */}

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
              className="relative overflow-hidden rounded-3xl border border-dashed border-emerald-200 bg-white/85 px-6 py-16 text-center shadow-xl shadow-emerald-900/5 backdrop-blur-xl"
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 via-green-500 to-lime-400" />

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50">
                <FileText className="h-8 w-8 text-emerald-600" />
              </div>

              <h2 className="mt-5 text-lg font-bold text-slate-900">
                No assignments submitted yet
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                You haven't submitted any assignments yet.
                Click the button below to submit your first
                assignment.
              </p>

              <motion.button
                type="button"
                onClick={handleSubmitAssignment}
                whileHover={{
                  y: -2,
                }}
                whileTap={{
                  scale: 0.98,
                }}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:from-emerald-700 hover:to-green-700"
              >
                <Upload className="h-4 w-4" />

                Submit Assignment
              </motion.button>
            </motion.div>
          ) : (

            /* =====================================
               ASSIGNMENTS LIST
            ===================================== */

            <div className="grid gap-5">

              {assignments.map((assignment, index) => {
                const status = getStatus(
                  assignment.status
                );

                const StatusIcon = status.icon;

                const isDeleting =
                  deletingId === assignment._id;

                const canModify =
                  canModifyAssignment(
                    assignment
                  );

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
                      duration: 0.45,
                      delay: index * 0.06,
                    }}
                    whileHover={{
                      y: -3,
                    }}
                    className="group relative overflow-hidden rounded-3xl border border-emerald-100 bg-white/90 shadow-lg shadow-emerald-900/5 backdrop-blur-xl transition-shadow duration-300 hover:shadow-2xl hover:shadow-emerald-900/10"
                  >
                    {/* TOP ACCENT */}

                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 via-green-500 to-lime-400 opacity-80 transition-opacity group-hover:opacity-100" />

                    {/* =================================
                        ASSIGNMENT INFORMATION
                    ================================= */}

                    <div className="p-5 sm:p-6">

                      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

                        {/* FILE INFO */}

                        <div className="flex min-w-0 gap-4">

                          <motion.div
                            whileHover={{
                              rotate: 3,
                              scale: 1.05,
                            }}
                            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-green-50 shadow-sm"
                          >
                            <FileText className="h-7 w-7 text-emerald-600" />
                          </motion.div>

                          <div className="min-w-0">

                            <h2 className="truncate text-base font-bold text-slate-900 sm:text-lg">
                              {assignment.originalName ||
                                "Assignment File"}
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                              Submitted on{" "}
                              {formatDate(
                                assignment.createdAt
                              )}
                            </p>

                            {assignment.course?.title && (
                              <p className="mt-1 text-sm font-medium text-slate-700">
                                Course:{" "}
                                {assignment.course.title}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* STATUS */}

                        <motion.div
                          initial={{
                            opacity: 0,
                            scale: 0.9,
                          }}
                          animate={{
                            opacity: 1,
                            scale: 1,
                          }}
                          className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold ${status.className}`}
                        >
                          <StatusIcon className="h-4 w-4" />

                          {status.label}
                        </motion.div>
                      </div>

                      {/* =================================
                          ADMIN FEEDBACK
                      ================================= */}

                      {assignment.feedback && (
                        <motion.div
                          initial={{
                            opacity: 0,
                            height: 0,
                          }}
                          animate={{
                            opacity: 1,
                            height: "auto",
                          }}
                          className={`mt-5 rounded-2xl border p-4 ${
                            assignment.status ===
                            "rejected"
                              ? "border-red-100 bg-red-50"
                              : "border-slate-100 bg-slate-50"
                          }`}
                        >
                          <p
                            className={`text-xs font-bold uppercase tracking-wide ${
                              assignment.status ===
                              "rejected"
                                ? "text-red-500"
                                : "text-slate-500"
                            }`}
                          >
                            Admin Feedback
                          </p>

                          <p
                            className={`mt-1 text-sm leading-6 ${
                              assignment.status ===
                              "rejected"
                                ? "text-red-700"
                                : "text-slate-700"
                            }`}
                          >
                            {assignment.feedback}
                          </p>

                          {assignment.reviewedAt && (
                            <p className="mt-2 text-xs text-slate-400">
                              Reviewed on{" "}
                              {formatDate(
                                assignment.reviewedAt
                              )}
                            </p>
                          )}
                        </motion.div>
                      )}
                    </div>

                    {/* =================================
                        ACTION BUTTONS
                    ================================= */}

                    <div className="border-t border-emerald-100 bg-gradient-to-r from-emerald-50/70 via-white to-green-50/70 px-5 py-4 sm:px-6">

                      <div className="flex flex-wrap gap-2">

                        {/* VIEW FILE */}

                        {assignment.fileUrl && (
                          <motion.a
                            whileHover={{
                              y: -1,
                            }}
                            whileTap={{
                              scale: 0.98,
                            }}
                            href={assignment.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-800 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-900"
                          >
                            <ExternalLink className="h-4 w-4" />

                            View File
                          </motion.a>
                        )}

                        {/* EDIT */}

                        {canModify && (
                          <motion.button
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
                            whileHover={{
                              y: -1,
                            }}
                            whileTap={{
                              scale: 0.98,
                            }}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm font-semibold text-amber-700 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <Pencil className="h-4 w-4" />

                            Edit
                          </motion.button>
                        )}

                        {/* REMOVE */}

                        {canModify && (
                          <motion.button
                            type="button"
                            onClick={() =>
                              handleDeleteAssignment(
                                assignment
                              )
                            }
                            disabled={
                              isDeleting ||
                              updating
                            }
                            whileHover={{
                              y: -1,
                            }}
                            whileTap={{
                              scale: 0.98,
                            }}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
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
                          </motion.button>
                        )}
                      </div>

                      {/* =================================
                          STATUS MESSAGE
                      ================================= */}

                      {assignment.status ===
                        "pending" && (
                        <p className="mt-3 text-xs text-slate-400">
                          Your assignment is waiting for
                          admin review. You can edit or
                          remove it while it is pending.
                        </p>
                      )}

                      {assignment.status ===
                        "rejected" && (
                        <p className="mt-3 text-xs text-red-500">
                          Your assignment was rejected.
                          You can edit it and submit a new
                          version, or remove it.
                        </p>
                      )}

                      {assignment.status ===
                        "approved" && (
                        <p className="mt-3 text-xs text-emerald-600">
                          This assignment has been approved.
                          Editing and removal are disabled.
                        </p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ==========================================
          EDIT ASSIGNMENT MODAL
      ========================================== */}

      <AnimatePresence>
        {editingAssignment && (
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
              transition={{
                duration: 0.25,
              }}
              className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-2xl shadow-emerald-950/20"
            >

              {/* MODAL TOP ACCENT */}

              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 via-green-500 to-lime-400" />

              {/* MODAL HEADER */}

              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">

                <div>
                  <div className="mb-1 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50">
                      <Pencil className="h-4 w-4 text-emerald-600" />
                    </div>

                    <h2 className="text-lg font-bold text-slate-900">
                      Edit Assignment
                    </h2>
                  </div>

                  <p className="mt-1 text-xs text-slate-500">
                    Replace your existing assignment file.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeEditModal}
                  disabled={updating}
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-emerald-50 hover:text-emerald-700 disabled:opacity-50"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* MODAL BODY */}

              <div className="space-y-5 px-5 py-6 sm:px-6">

                {/* CURRENT FILE */}

                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">

                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    Current File
                  </p>

                  <div className="mt-2 flex items-center gap-3">

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50">
                      <FileText className="h-5 w-5 text-emerald-600" />
                    </div>

                    <p className="truncate text-sm font-semibold text-slate-700">
                      {editingAssignment.originalName ||
                        "Assignment File"}
                    </p>
                  </div>
                </div>

                {/* REJECTED FEEDBACK */}

                {editingAssignment.status ===
                  "rejected" &&
                  editingAssignment.feedback && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-4">

                      <p className="text-xs font-bold uppercase tracking-wide text-red-500">
                        Rejection Feedback
                      </p>

                      <p className="mt-1 text-sm leading-6 text-red-700">
                        {editingAssignment.feedback}
                      </p>
                    </div>
                  )}

                {/* NEW FILE */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Select New File
                  </label>

                  <label
                    htmlFor="assignment-edit-file"
                    className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-emerald-200 bg-emerald-50/30 px-5 py-8 text-center transition hover:border-emerald-400 hover:bg-emerald-50"
                  >

                    <motion.div
                      whileHover={{
                        scale: 1.08,
                        rotate: 3,
                      }}
                      className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-md shadow-emerald-900/5"
                    >
                      <Upload className="h-6 w-6 text-emerald-600" />
                    </motion.div>

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
                          Choose a new assignment file
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          PDF, JPG, JPEG, PNG, DOC or DOCX
                          · Max 10MB
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

                {/* INFO */}

                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">

                  <p className="text-sm leading-6 text-amber-800">
                    <strong>Important:</strong>{" "}
                    Replacing this file will send the
                    assignment back to{" "}
                    <strong>Pending</strong> status for
                    admin review.
                  </p>
                </div>
              </div>

              {/* MODAL FOOTER */}

              <div className="flex flex-col-reverse gap-2 border-t border-slate-100 bg-slate-50 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">

                {/* CANCEL */}

                <button
                  type="button"
                  onClick={closeEditModal}
                  disabled={updating}
                  className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                {/* REPLACE */}

                <motion.button
                  type="button"
                  onClick={handleUpdateAssignment}
                  disabled={
                    updating ||
                    !selectedFile
                  }
                  whileHover={
                    !updating && selectedFile
                      ? {
                          y: -1,
                        }
                      : {}
                  }
                  whileTap={
                    !updating && selectedFile
                      ? {
                          scale: 0.98,
                        }
                      : {}
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:from-emerald-700 hover:to-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {updating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      Replace File
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MyAssignments;