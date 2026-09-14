import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Upload,
  FileText,
  Loader2,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  CalendarDays,
  X,
  ChevronDown,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ALLOWED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const ALLOWED_EXTENSIONS = [
  ".pdf",
  ".jpg",
  ".jpeg",
  ".png",
  ".doc",
  ".docx",
];

const AddAssignment = () => {
  const navigate = useNavigate();
  const { accessToken } = useAuth();

  const fileInputRef = useRef(null);

  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [courseError, setCourseError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    courseId: "",
    dueDate: "",
  });

  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =====================================================
  // FETCH COURSES
  // =====================================================

  const fetchCourses = async () => {
    try {
      setLoadingCourses(true);
      setCourseError("");

      const response = await axios.get(`${API_URL}/courses`, {
        params: {
          page: 1,
          limit: 100,
        },
        timeout: 10000,
      });

      console.log("COURSES RESPONSE:", response.data);

      const courseList = Array.isArray(response.data?.courses)
        ? response.data.courses
        : [];

      setCourses(courseList);

      if (courseList.length === 0) {
        setCourseError("No courses found. Please create a course first.");
      }
    } catch (err) {
      console.error("FETCH COURSES ERROR:", err);

      if (err.code === "ECONNABORTED") {
        setCourseError("Course request timed out.");
      } else {
        setCourseError(
          err.response?.data?.message ||
            "Unable to load courses."
        );
      }
    } finally {
      setLoadingCourses(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  // =====================================================
  // FILE VALIDATION
  // =====================================================

  const validateFile = (selectedFile) => {
    if (!selectedFile) return true;

    if (selectedFile.size > MAX_FILE_SIZE) {
      setError("File size must be less than 10 MB.");
      return false;
    }

    const fileName = selectedFile.name.toLowerCase();

    const validExtension = ALLOWED_EXTENSIONS.some((extension) =>
      fileName.endsWith(extension)
    );

    const validMimeType =
      !selectedFile.type ||
      ALLOWED_TYPES.includes(selectedFile.type);

    if (!validExtension || !validMimeType) {
      setError(
        "Only PDF, JPG, JPEG, PNG, DOC and DOCX files are allowed."
      );
      return false;
    }

    return true;
  };

  // =====================================================
  // FILE CHANGE
  // =====================================================

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return;

    setError("");

    if (!validateFile(selectedFile)) {
      e.target.value = "";
      setFile(null);
      return;
    }

    setFile(selectedFile);
  };

  // =====================================================
  // REMOVE FILE
  // =====================================================

  const removeFile = () => {
    setFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // =====================================================
  // SUBMIT ASSIGNMENT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // Required validation
    if (!formData.title.trim()) {
      setError("Please enter assignment title.");
      return;
    }

    if (!formData.description.trim()) {
      setError("Please enter assignment description.");
      return;
    }

    if (!formData.courseId) {
      setError("Please select a course.");
      return;
    }

    if (!formData.dueDate) {
      setError("Please select a due date.");
      return;
    }

    // Check selected date
    const selectedDate = new Date(formData.dueDate);
    const now = new Date();

    if (selectedDate <= now) {
      setError("Due date must be in the future.");
      return;
    }

    if (file && !validateFile(file)) {
      return;
    }

    if (!accessToken) {
      setError("You are not logged in. Please login again.");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();

      data.append("title", formData.title.trim());
      data.append("description", formData.description.trim());

      // IMPORTANT:
      // Backend controller expects courseId
      data.append("courseId", formData.courseId);

      data.append("dueDate", formData.dueDate);

      if (file) {
        data.append("file", file);
      }

      console.log("CREATING ASSIGNMENT:", {
        title: formData.title,
        courseId: formData.courseId,
        dueDate: formData.dueDate,
        file: file?.name,
      });

      await axios.post(`${API_URL}/assignments`, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        timeout: 30000,
      });

      setSuccess("Assignment created successfully!");

      setFormData({
        title: "",
        description: "",
        courseId: "",
        dueDate: "",
      });

      setFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Redirect after success
      setTimeout(() => {
        navigate("/admin/assignments");
      }, 1200);
    } catch (err) {
      console.error("CREATE ASSIGNMENT ERROR:", err);

      setError(
        err.response?.data?.message ||
          "Failed to create assignment. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // FORMAT FILE SIZE
  // =====================================================

  const formatFileSize = (bytes) => {
    if (bytes < 1024) {
      return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Link
            to="/admin/assignments"
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-emerald-600"
          >
            <ArrowLeft size={18} />
            Back to Assignments
          </Link>

          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
              <BookOpen size={25} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                Create Assignment
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Create an assignment for a specific course.
              </p>
            </div>
          </div>
        </motion.div>

        {/* =====================================================
            ALERTS
        ===================================================== */}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700"
          >
            <AlertCircle
              size={20}
              className="mt-0.5 shrink-0"
            />

            <p className="text-sm font-medium">
              {error}
            </p>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-700"
          >
            <CheckCircle2
              size={20}
              className="shrink-0"
            />

            <p className="text-sm font-medium">
              {success}
            </p>
          </motion.div>
        )}

        {/* =====================================================
            FORM
        ===================================================== */}

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8"
        >
          {/* TITLE */}

          <div className="mb-6">
            <label
              htmlFor="title"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Assignment Title
              <span className="ml-1 text-red-500">*</span>
            </label>

            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Build a React Todo App"
              maxLength={150}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
              disabled={loading}
            />
          </div>

          {/* DESCRIPTION */}

          <div className="mb-6">
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Description
              <span className="ml-1 text-red-500">*</span>
            </label>

            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Explain what students need to complete..."
              rows={6}
              maxLength={3000}
              className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
              disabled={loading}
            />

            <p className="mt-1 text-right text-xs text-slate-400">
              {formData.description.length}/3000
            </p>
          </div>

          {/* COURSE + DUE DATE */}

          <div className="mb-6 grid gap-6 md:grid-cols-2">

            {/* COURSE */}

            <div>
              <label
                htmlFor="courseId"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Select Course
                <span className="ml-1 text-red-500">*</span>
              </label>

              <div className="relative">
                <select
                  id="courseId"
                  name="courseId"
                  value={formData.courseId}
                  onChange={handleChange}
                  disabled={loadingCourses || loading}
                  required
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 pr-11 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 disabled:cursor-not-allowed disabled:bg-slate-50"
                >
                  <option value="">
                    {loadingCourses
                      ? "Loading courses..."
                      : "Select Course"}
                  </option>

                  {!loadingCourses &&
                    courses.map((course) => (
                      <option
                        key={course._id}
                        value={course._id}
                      >
                        {course.title}
                      </option>
                    ))}
                </select>

                <ChevronDown
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
              </div>

              {courseError && (
                <div className="mt-2 flex items-center justify-between gap-2">
                  <p className="text-xs text-red-500">
                    {courseError}
                  </p>

                  <button
                    type="button"
                    onClick={fetchCourses}
                    className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
                  >
                    Retry
                  </button>
                </div>
              )}

              {!loadingCourses &&
                courses.length > 0 && (
                  <p className="mt-2 text-xs text-slate-400">
                    {courses.length} course
                    {courses.length !== 1 ? "s" : ""} available
                  </p>
                )}
            </div>

            {/* DUE DATE */}

            <div>
              <label
                htmlFor="dueDate"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Due Date
                <span className="ml-1 text-red-500">*</span>
              </label>

              <div className="relative">
                <CalendarDays
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="dueDate"
                  name="dueDate"
                  type="datetime-local"
                  value={formData.dueDate}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 disabled:bg-slate-50"
                />
              </div>

              <p className="mt-2 text-xs text-slate-400">
                Students must submit the assignment before this date.
              </p>
            </div>
          </div>

          {/* FILE UPLOAD */}

          <div className="mb-8">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Assignment File
              <span className="ml-2 text-xs font-normal text-slate-400">
                Optional
              </span>
            </label>

            {!file ? (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
                className="group w-full rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-8 text-center transition hover:border-emerald-400 hover:bg-emerald-50/40 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-emerald-600 shadow-sm transition group-hover:scale-105">
                  <Upload size={22} />
                </div>

                <p className="text-sm font-semibold text-slate-700">
                  Click to upload assignment file
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  PDF, JPG, JPEG, PNG, DOC, DOCX • Maximum 10 MB
                </p>
              </button>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-between gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
                    <FileText size={21} />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-700">
                      {file.name}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={removeFile}
                  disabled={loading}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-slate-500 transition hover:bg-red-50 hover:text-red-500"
                >
                  <X size={18} />
                </button>
              </motion.div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* ACTIONS */}

          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
            <Link
              to="/admin/assignments"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={loading || loadingCourses || courses.length === 0}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                  Creating Assignment...
                </>
              ) : (
                <>
                  <CheckCircle2 size={18} />
                  Create Assignment
                </>
              )}
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default AddAssignment;