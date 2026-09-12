
import { useEffect, useState } from "react";
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
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import api from "../../services/api";

const SubmitAssignment = () => {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState("");
  const [file, setFile] = useState(null);

  const [loadingCourses, setLoadingCourses] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ==========================================
  // GET COURSES
  // ==========================================

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoadingCourses(true);
        setError("");

        const response = await api.get("/courses");

        console.log("COURSES RESPONSE:", response.data);

        const data = response.data;

        let courseList = [];

        if (Array.isArray(data)) {
          courseList = data;
        } else if (Array.isArray(data?.courses)) {
          courseList = data.courses;
        } else if (Array.isArray(data?.data)) {
          courseList = data.data;
        }

        setCourses(courseList);
      } catch (error) {
        console.error("FETCH COURSES ERROR:", error);

        setError(
          error.response?.data?.message ||
            "Unable to load courses."
        );
      } finally {
        setLoadingCourses(false);
      }
    };

    fetchCourses();
  }, []);

  // ==========================================
  // FILE VALIDATION
  // ==========================================

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];

    setError("");
    setMessage("");

    if (!selectedFile) {
      setFile(null);
      return;
    }

    // ------------------------------------------
    // MAX FILE SIZE = 10 MB
    // ------------------------------------------

    const maxSize = 10 * 1024 * 1024;

    if (selectedFile.size > maxSize) {
      setError(
        "File size must be less than or equal to 10 MB."
      );

      setFile(null);
      e.target.value = "";

      return;
    }

    // ------------------------------------------
    // ALLOWED EXTENSIONS
    // ------------------------------------------

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

    const isValidExtension =
      allowedExtensions.some((extension) =>
        fileName.endsWith(extension)
      );

    if (!isValidExtension) {
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
  // REMOVE SELECTED FILE
  // ==========================================

  const handleRemoveFile = () => {
    setFile(null);

    const fileInput =
      document.getElementById("assignment-file");

    if (fileInput) {
      fileInput.value = "";
    }

    setError("");
    setMessage("");
  };

  // ==========================================
  // SUBMIT ASSIGNMENT
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    // ------------------------------------------
    // COURSE VALIDATION
    // ------------------------------------------

    if (!courseId) {
      setError("Please select a course.");
      return;
    }

    // ------------------------------------------
    // FILE VALIDATION
    // ------------------------------------------

    if (!file) {
      setError("Please select your assignment file.");
      return;
    }

    try {
      setSubmitting(true);

      const formData = new FormData();

      formData.append("file", file);
      formData.append("courseId", courseId);

      console.log("SUBMITTING ASSIGNMENT...");
      console.log("Course ID:", courseId);
      console.log("File:", file.name);

      const response = await api.post(
        "/assignments/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(
        "SUBMISSION RESPONSE:",
        response.data
      );

      if (response.data?.success) {
        setMessage(
          response.data?.message ||
            "Assignment submitted successfully."
        );

        setCourseId("");
        setFile(null);

        // Reset input
        const fileInput =
          document.getElementById(
            "assignment-file"
          );

        if (fileInput) {
          fileInput.value = "";
        }

        // Redirect after success
        setTimeout(() => {
          navigate("/student/assignments");
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
  // FORMAT FILE SIZE
  // ==========================================

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 KB";

    const mb = bytes / 1024 / 1024;

    if (mb >= 1) {
      return `${mb.toFixed(2)} MB`;
    }

    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-green-50 px-5 py-10 text-slate-900">
      {/* ======================================
          AMBIENT BACKGROUND
      ====================================== */}

      <div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />

      <div className="pointer-events-none absolute right-[-120px] top-1/4 h-[28rem] w-[28rem] rounded-full bg-green-400/10 blur-3xl" />

      <div className="pointer-events-none absolute bottom-[-140px] left-1/3 h-96 w-96 rounded-full bg-lime-300/10 blur-3xl" />

      {/* Floating Particles */}
      <motion.div
        animate={{
          y: [0, -15, 0],
          opacity: [0.2, 0.7, 0.2],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute left-[8%] top-28 h-2 w-2 rounded-full bg-emerald-400"
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
        className="pointer-events-none absolute right-[12%] top-44 h-3 w-3 rounded-full bg-green-400"
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
        className="pointer-events-none absolute bottom-36 left-[15%] h-2 w-2 rounded-full bg-lime-400"
      />

      <div className="relative z-10 mx-auto max-w-3xl">

        {/* ======================================
            BACK BUTTON
        ====================================== */}

        <Link
          to="/student/assignments"
          className="group inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 transition hover:text-emerald-900"
        >
          <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
          Back to My Assignments
        </Link>

        {/* ======================================
            HEADER
        ====================================== */}

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
          className="mt-8"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-3 py-1.5 text-xs font-bold text-emerald-700 shadow-sm backdrop-blur-xl">
            <FileText className="h-4 w-4" />
            Assignment Submission
          </div>

          <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">
            <span className="bg-gradient-to-r from-emerald-700 via-green-600 to-lime-500 bg-clip-text text-transparent">
              Submit Assignment
            </span>
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Select your course, upload your assignment,
            and submit it for admin review.
          </p>
        </motion.div>

        {/* ======================================
            FORM
        ====================================== */}

        <motion.form
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
            delay: 0.1,
          }}
          onSubmit={handleSubmit}
          className="relative mt-8 overflow-hidden rounded-[2rem] border border-emerald-100 bg-white/90 shadow-2xl shadow-emerald-900/10 backdrop-blur-xl"
        >
          {/* Top Accent */}
          <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-emerald-500 via-green-500 to-lime-400" />

          {/* ====================================
              FORM HEADER
          ==================================== */}

          <div className="border-b border-emerald-100 bg-gradient-to-r from-emerald-50/80 to-white px-6 py-5 sm:px-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
                <Sparkles className="h-5 w-5 text-emerald-600" />
              </div>

              <div>
                <h2 className="font-bold text-slate-800">
                  Assignment Submission Form
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Make sure you select the correct course
                  and file before submitting.
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8">

            {/* ==================================
                SUCCESS MESSAGE
            ================================== */}

            {message && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: -10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="mb-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-700"
              >
                <CheckCircle className="mt-0.5 h-5 w-5 shrink-0" />

                <div>
                  <p className="font-bold">
                    Submission successful
                  </p>

                  <p className="mt-1 text-sm text-emerald-600">
                    {message}
                  </p>
                </div>
              </motion.div>
            )}

            {/* ==================================
                ERROR MESSAGE
            ================================== */}

            {error && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: -10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700"
              >
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

                <div>
                  <p className="font-bold">
                    Submission error
                  </p>

                  <p className="mt-1 text-sm text-red-600">
                    {error}
                  </p>
                </div>
              </motion.div>
            )}

            {/* ==================================
                COURSE
            ================================== */}

            <div>
              <label
                htmlFor="course"
                className="mb-2 block text-sm font-bold text-slate-700"
              >
                Select Course
              </label>

              {loadingCourses ? (
                <div className="flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50/50 px-4 py-3.5 text-sm text-slate-500">
                  <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />

                  Loading available courses...
                </div>
              ) : courses.length === 0 ? (
                <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-700">
                  No courses are currently available.
                </div>
              ) : (
                <div className="relative">
                  <select
                    id="course"
                    value={courseId}
                    onChange={(e) => {
                      setCourseId(e.target.value);
                      setError("");
                    }}
                    disabled={submitting}
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-medium text-slate-800 outline-none transition-all duration-300 hover:border-emerald-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <option value="">
                      Select a course
                    </option>

                    {courses.map((course) => {
                      const courseValue =
                        course._id || course.id;

                      return (
                        <option
                          key={courseValue}
                          value={courseValue}
                        >
                          {course.title ||
                            course.name ||
                            "Untitled Course"}
                        </option>
                      );
                    })}
                  </select>
                </div>
              )}
            </div>

            {/* ==================================
                FILE UPLOAD
            ================================== */}

            <div className="mt-7">
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Assignment File
              </label>

              {!file ? (
                <label
                  htmlFor="assignment-file"
                  className="group relative flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-emerald-200 bg-gradient-to-br from-emerald-50/60 via-white to-green-50/50 px-6 py-12 text-center transition-all duration-300 hover:border-emerald-400 hover:bg-emerald-50/70 hover:shadow-lg hover:shadow-emerald-900/5"
                >
                  {/* Hover Glow */}
                  <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-emerald-400/10 blur-3xl transition-transform duration-500 group-hover:scale-150" />

                  <motion.div
                    whileHover={{
                      scale: 1.08,
                      y: -3,
                    }}
                    className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-100 to-green-100 shadow-sm"
                  >
                    <Upload className="h-7 w-7 text-emerald-600" />
                  </motion.div>

                  <p className="relative mt-5 font-bold text-slate-800">
                    Click to upload your assignment
                  </p>

                  <p className="relative mt-2 text-sm text-slate-500">
                    PDF, JPG, JPEG, PNG, DOC or DOCX
                  </p>

                  <p className="relative mt-1 text-xs text-slate-400">
                    Maximum file size: 10 MB
                  </p>

                  <input
                    id="assignment-file"
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={handleFileChange}
                    disabled={submitting}
                  />
                </label>
              ) : (
                <motion.div
                  initial={{
                    opacity: 0,
                    scale: 0.98,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-5 shadow-sm"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
                        <FileText className="h-6 w-6 text-emerald-600" />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate font-bold text-slate-800">
                          {file.name}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      disabled={submitting}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-400 transition-all duration-300 hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
                      title="Remove file"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <label
                    htmlFor="assignment-file"
                    className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-emerald-200 bg-white px-4 py-2 text-sm font-bold text-emerald-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-50"
                  >
                    <Upload className="h-4 w-4" />
                    Choose another file
                  </label>

                  <input
                    id="assignment-file"
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={handleFileChange}
                    disabled={submitting}
                  />
                </motion.div>
              )}
            </div>

            {/* ==================================
                INFORMATION
            ================================== */}

            <div className="mt-7 rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50/80 to-green-50/50 p-4">
              <div className="flex gap-3">
                <FileText className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />

                <div>
                  <p className="text-sm font-bold text-emerald-800">
                    Before submitting
                  </p>

                  <ul className="mt-2 space-y-1 text-xs leading-5 text-slate-500">
                    <li>
                      • Select the correct course.
                    </li>

                    <li>
                      • Upload your final assignment file.
                    </li>

                    <li>
                      • Maximum file size is 10 MB.
                    </li>

                    <li>
                      • Your submission will initially be
                      marked as Pending.
                    </li>

                    <li>
                      • Admin will review your submission.
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* ==================================
                SUBMIT BUTTON
            ================================== */}

            <motion.button
              whileHover={
                !submitting &&
                !loadingCourses &&
                courses.length > 0
                  ? {
                      y: -2,
                      scale: 1.01,
                    }
                  : {}
              }
              whileTap={
                !submitting &&
                !loadingCourses &&
                courses.length > 0
                  ? {
                      scale: 0.98,
                    }
                  : {}
              }
              type="submit"
              disabled={
                submitting ||
                loadingCourses ||
                courses.length === 0
              }
              className="group relative mt-8 flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-emerald-600 via-green-600 to-lime-500 px-5 py-4 font-bold text-white shadow-lg shadow-emerald-600/20 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-600/30 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {/* Shine */}
              <span className="absolute inset-0 -translate-x-full bg-white/15 transition-transform duration-500 group-hover:translate-x-full" />

              <span className="relative z-10 flex items-center gap-2">
                {submitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Submitting Assignment...
                  </>
                ) : (
                  <>
                    <Upload className="h-5 w-5" />
                    Submit Assignment
                  </>
                )}
              </span>
            </motion.button>
          </div>
        </motion.form>

        {/* ======================================
            BOTTOM NOTE
        ====================================== */}

        <p className="mt-5 text-center text-xs text-slate-400">
          After submission, you can track your assignment
          status from My Assignments.
        </p>
      </div>
    </div>
  );
};

export default SubmitAssignment;
