import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2,
  ArrowLeft,
  X,
  Sparkles,
  CalendarDays,
  BookOpen,
} from "lucide-react";
import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import api from "../../services/api";

const SubmitAssignment = () => {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const preselectedAssignmentId =
    searchParams.get("assignmentId");

  const [assignments, setAssignments] =
    useState([]);

  const [assignmentId, setAssignmentId] =
    useState(
      preselectedAssignmentId || ""
    );

  const [file, setFile] =
    useState(null);

  const [loadingAssignments, setLoadingAssignments] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  // ==========================================
  // FETCH AVAILABLE ASSIGNMENTS
  // ==========================================

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setLoadingAssignments(true);
        setError("");

        const response = await api.get(
          "/assignments/available"
        );

        if (response.data?.success) {
          const list =
            Array.isArray(
              response.data.assignments
            )
              ? response.data.assignments
              : [];

          setAssignments(list);

          if (
            preselectedAssignmentId &&
            list.some(
              (item) =>
                item._id ===
                preselectedAssignmentId
            )
          ) {
            setAssignmentId(
              preselectedAssignmentId
            );
          }
        } else {
          setAssignments([]);
        }
      } catch (error) {
        console.error(
          "FETCH AVAILABLE ASSIGNMENTS ERROR:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Unable to load assignments."
        );
      } finally {
        setLoadingAssignments(false);
      }
    };

    fetchAssignments();
  }, [preselectedAssignmentId]);

  // ==========================================
  // FILE VALIDATION
  // ==========================================

  const handleFileChange = (e) => {
    const selectedFile =
      e.target.files?.[0];

    setError("");
    setMessage("");

    if (!selectedFile) {
      setFile(null);
      return;
    }

    const maxSize =
      10 * 1024 * 1024;

    if (selectedFile.size > maxSize) {
      setError(
        "File size must be less than or equal to 10 MB."
      );

      setFile(null);
      e.target.value = "";

      return;
    }

    const allowedExtensions = [
      ".pdf",
      ".jpg",
      ".jpeg",
      ".png",
      ".doc",
      ".docx",
    ];

    const fileName =
      selectedFile.name.toLowerCase();

    const validExtension =
      allowedExtensions.some(
        (extension) =>
          fileName.endsWith(extension)
      );

    if (!validExtension) {
      setError(
        "Only PDF, JPG, JPEG, PNG, DOC and DOCX files are allowed."
      );

      setFile(null);
      e.target.value = "";

      return;
    }

    setFile(selectedFile);
  };

  // ==========================================
  // REMOVE FILE
  // ==========================================

  const handleRemoveFile = () => {
    setFile(null);

    const input =
      document.getElementById(
        "assignment-file"
      );

    if (input) {
      input.value = "";
    }

    setError("");
    setMessage("");
  };

  // ==========================================
  // SELECTED ASSIGNMENT
  // ==========================================

  const selectedAssignment =
    assignments.find(
      (assignment) =>
        assignment._id === assignmentId
    );

  // ==========================================
  // SUBMIT
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!assignmentId) {
      setError(
        "Please select an assignment."
      );
      return;
    }

    if (!file) {
      setError(
        "Please select your assignment file."
      );
      return;
    }

    try {
      setSubmitting(true);

      const formData =
        new FormData();

      formData.append(
        "file",
        file
      );

      const response =
        await api.post(
          `/assignments/${assignmentId}/submit`,
          formData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

      if (response.data?.success) {
        setMessage(
          response.data.message ||
            "Assignment submitted successfully."
        );

        setFile(null);

        const input =
          document.getElementById(
            "assignment-file"
          );

        if (input) {
          input.value = "";
        }

        setTimeout(() => {
          navigate(
            "/student/assignments"
          );
        }, 1200);
      } else {
        setError(
          response.data?.message ||
            "Failed to submit assignment."
        );
      }
    } catch (error) {
      console.error(
        "SUBMIT ASSIGNMENT ERROR:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to submit assignment. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ==========================================
  // FILE SIZE
  // ==========================================

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 KB";

    const mb =
      bytes / 1024 / 1024;

    if (mb >= 1) {
      return `${mb.toFixed(2)} MB`;
    }

    return `${(
      bytes / 1024
    ).toFixed(1)} KB`;
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-green-50 px-5 py-10 text-slate-900">

      {/* BACKGROUND */}

      <div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />

      <div className="pointer-events-none absolute right-[-120px] top-1/4 h-[28rem] w-[28rem] rounded-full bg-green-400/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-3xl">

        {/* BACK */}

        <Link
          to="/student/assignments"
          className="group inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-900"
        >
          <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-1" />

          Back to My Assignments
        </Link>

        {/* HEADER */}

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="mt-8"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-3 py-1.5 text-xs font-bold text-emerald-700 shadow-sm">
            <Sparkles className="h-4 w-4" />

            Assignment Submission
          </div>

          <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">
            <span className="bg-gradient-to-r from-emerald-700 via-green-600 to-lime-500 bg-clip-text text-transparent">
              Submit Assignment
            </span>
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Select an assignment from your enrolled courses and upload your work for admin review.
          </p>
        </motion.div>

        {/* FORM */}

        <motion.form
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          onSubmit={handleSubmit}
          className="relative mt-8 overflow-hidden rounded-[2rem] border border-emerald-100 bg-white/90 shadow-2xl"
        >

          <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-emerald-500 via-green-500 to-lime-400" />

          <div className="border-b border-emerald-100 bg-emerald-50/60 px-6 py-5 sm:px-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
                <FileText className="h-5 w-5 text-emerald-600" />
              </div>

              <div>
                <h2 className="font-bold text-slate-800">
                  Submission Form
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Select the correct assignment before uploading.
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8">

            {/* SUCCESS */}

            {message && (
              <div className="mb-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-700">
                <CheckCircle className="h-5 w-5 shrink-0" />

                <div>
                  <p className="font-bold">
                    Submission successful
                  </p>

                  <p className="mt-1 text-sm">
                    {message}
                  </p>
                </div>
              </div>
            )}

            {/* ERROR */}

            {error && (
              <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
                <AlertCircle className="h-5 w-5 shrink-0" />

                <div>
                  <p className="font-bold">
                    Submission error
                  </p>

                  <p className="mt-1 text-sm">
                    {error}
                  </p>
                </div>
              </div>
            )}

            {/* ASSIGNMENT SELECT */}

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Select Assignment
              </label>

              {loadingAssignments ? (
                <div className="flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-4 text-sm text-slate-500">
                  <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />

                  Loading available assignments...
                </div>
              ) : assignments.length === 0 ? (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
                  No assignments are currently available for your enrolled courses.
                </div>
              ) : (
                <select
                  value={assignmentId}
                  onChange={(e) => {
                    setAssignmentId(
                      e.target.value
                    );
                    setError("");
                  }}
                  disabled={submitting}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-medium text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                >
                  <option value="">
                    Select an assignment
                  </option>

                  {assignments.map(
                    (assignment) => (
                      <option
                        key={
                          assignment._id
                        }
                        value={
                          assignment._id
                        }
                      >
                        {assignment.title} —{" "}
                        {assignment.course
                          ?.title ||
                          "Course"}
                      </option>
                    )
                  )}
                </select>
              )}
            </div>

            {/* SELECTED ASSIGNMENT */}

            {selectedAssignment && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-5"
              >
                <div className="flex items-start gap-3">

                  <BookOpen className="mt-1 h-5 w-5 shrink-0 text-emerald-600" />

                  <div className="min-w-0">

                    <h3 className="font-bold text-slate-900">
                      {selectedAssignment.title}
                    </h3>

                    <p className="mt-1 text-sm text-emerald-700">
                      {selectedAssignment.course
                        ?.title}
                    </p>

                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      {
                        selectedAssignment.description
                      }
                    </p>

                    {selectedAssignment.dueDate && (
                      <div className="mt-3 inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-xs font-bold text-slate-600">
                        <CalendarDays className="h-4 w-4 text-emerald-600" />

                        Due{" "}
                        {new Date(
                          selectedAssignment.dueDate
                        ).toLocaleDateString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* FILE */}

            <div className="mt-7">
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Assignment File
              </label>

              {!file ? (
                <label
                  htmlFor="assignment-file"
                  className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-emerald-200 bg-emerald-50/40 px-6 py-12 text-center hover:border-emerald-400 hover:bg-emerald-50"
                >
                  <Upload className="h-8 w-8 text-emerald-600" />

                  <p className="mt-5 font-bold text-slate-800">
                    Click to upload your assignment
                  </p>

                  <p className="mt-2 text-sm text-slate-500">
                    PDF, JPG, JPEG, PNG, DOC or DOCX
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Maximum file size: 10 MB
                  </p>

                  <input
                    id="assignment-file"
                    type="file"
                    hidden
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={
                      handleFileChange
                    }
                    disabled={
                      submitting
                    }
                  />
                </label>
              ) : (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">

                  <div className="flex items-center justify-between gap-4">

                    <div className="flex min-w-0 items-center gap-4">

                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white">
                        <FileText className="h-6 w-6 text-emerald-600" />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate font-bold text-slate-800">
                          {file.name}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {formatFileSize(
                            file.size
                          )}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={
                        handleRemoveFile
                      }
                      disabled={
                        submitting
                      }
                      className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 hover:bg-red-50 hover:text-red-500"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <label
                    htmlFor="assignment-file"
                    className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-emerald-200 bg-white px-4 py-2 text-sm font-bold text-emerald-700 hover:bg-emerald-50"
                  >
                    <Upload className="h-4 w-4" />

                    Choose another file
                  </label>

                  <input
                    id="assignment-file"
                    type="file"
                    hidden
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={
                      handleFileChange
                    }
                    disabled={
                      submitting
                    }
                  />
                </div>
              )}
            </div>

            {/* INFO */}

            <div className="mt-7 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4">
              <div className="flex gap-3">

                <FileText className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />

                <div>
                  <p className="text-sm font-bold text-emerald-800">
                    Before submitting
                  </p>

                  <ul className="mt-2 space-y-1 text-xs leading-5 text-slate-500">
                    <li>
                      • Select the correct assignment.
                    </li>

                    <li>
                      • Upload your final work.
                    </li>

                    <li>
                      • Maximum file size is 10 MB.
                    </li>

                    <li>
                      • Allowed: PDF, JPG, JPEG, PNG, DOC, DOCX.
                    </li>

                    <li>
                      • Your submission will start as Pending.
                    </li>

                    <li>
                      • Admin will review your work.
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* BUTTON */}

            <motion.button
              type="submit"
              disabled={
                submitting ||
                loadingAssignments ||
                assignments.length === 0
              }
              whileHover={{
                y: -2,
              }}
              whileTap={{
                scale: 0.98,
              }}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 via-green-600 to-lime-500 px-5 py-4 font-bold text-white shadow-lg shadow-emerald-600/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />

                  Submitting...
                </>
              ) : (
                <>
                  <Upload className="h-5 w-5" />

                  Submit Assignment
                </>
              )}
            </motion.button>
          </div>
        </motion.form>

        <p className="mt-5 text-center text-xs text-slate-400">
          You can track your submission status and admin feedback from My Assignments.
        </p>
      </div>
    </div>
  );
};

export default SubmitAssignment;