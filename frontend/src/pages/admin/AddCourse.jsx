import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  FileText,
  Layers3,
  Loader2,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";

import useCourses from "../../hooks/useCourses";

const AddCourse = () => {
  const navigate = useNavigate();

  const {
    createCourse,
    loading,
    error,
  } = useCourses({
    autoFetch: false,
  });

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
  });

  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] =
    useState("");

  // =========================
  // HANDLE INPUT CHANGE
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setFormError("");
    setSuccessMessage("");
  };

  // =========================
  // HANDLE FORM SUBMIT
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setFormError("");
    setSuccessMessage("");

    // =========================
    // VALIDATION
    // =========================

    if (!formData.title.trim()) {
      setFormError("Course title is required.");
      return;
    }

    if (!formData.description.trim()) {
      setFormError(
        "Course description is required."
      );
      return;
    }

    if (!formData.category.trim()) {
      setFormError(
        "Please select a course category."
      );
      return;
    }

    try {
      // =========================
      // CREATE COURSE
      // =========================

      const result = await createCourse({
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category.trim(),
      });

      console.log(
        "Course created successfully:",
        result
      );

      // =========================
      // SUCCESS MESSAGE
      // =========================

      setSuccessMessage(
        "Course created successfully!"
      );

      // =========================
      // RESET FORM
      // =========================

      setFormData({
        title: "",
        description: "",
        category: "",
      });

      // =========================
      // REDIRECT
      // =========================

      setTimeout(() => {
        navigate("/admin/courses");
      }, 1000);
    } catch (err) {
      console.error(
        "Create course error:",
        err
      );

      setFormError(
        err.response?.data?.message ||
          err.message ||
          "Failed to create course."
      );
    }
  };

  // =========================
  // JSX
  // =========================

  return (
    <div className="relative min-h-[calc(100vh-5rem)] w-full overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-green-50 px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
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
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-emerald-400/15 blur-3xl"
        />

        <motion.div
          animate={{
            x: [0, -35, 0],
            y: [0, 25, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -bottom-32 -right-24 h-80 w-80 rounded-full bg-green-400/15 blur-3xl"
        />

        <div className="absolute left-[10%] top-[18%] h-2 w-2 rounded-full bg-emerald-400/50" />
        <div className="absolute right-[15%] top-[28%] h-1.5 w-1.5 rounded-full bg-green-500/40" />
        <div className="absolute bottom-[20%] left-[18%] h-1.5 w-1.5 rounded-full bg-lime-500/40" />
        <div className="absolute bottom-[30%] right-[12%] h-2 w-2 rounded-full bg-emerald-400/40" />
      </div>

      {/* =========================
          CONTENT
      ========================= */}

      <div className="relative mx-auto max-w-4xl">
        {/* =========================
            BACK BUTTON
        ========================= */}

        <motion.button
          type="button"
          onClick={() =>
            navigate("/admin/courses")
          }
          initial={{
            opacity: 0,
            x: -15,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          whileHover={{
            x: -3,
          }}
          className="group mb-6 inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-500 transition hover:bg-white hover:text-emerald-600 hover:shadow-sm"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          Back to Courses
        </motion.button>

        {/* =========================
            PAGE HEADER
        ========================= */}

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
          className="mb-7"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 shadow-sm backdrop-blur"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Course Management
          </div>

          <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            Add{" "}
            <span className="bg-gradient-to-r from-emerald-600 via-green-500 to-lime-500 bg-clip-text text-transparent">
              Course
            </span>
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
            Create a new course and make it available
            for your students.
          </p>
        </motion.div>

        {/* =========================
            FORM CARD
        ========================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
            delay: 0.1,
          }}
          className="relative overflow-hidden rounded-[2rem] border border-emerald-100 bg-white/90 p-5 shadow-2xl shadow-emerald-900/10 backdrop-blur-xl sm:p-8"
        >
          {/* Top Accent */}

          <div className="absolute left-0 right-0 top-0 h-1.5 bg-gradient-to-r from-emerald-600 via-green-500 to-lime-400" />

          {/* Decorative Glow */}

          <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-emerald-400/10 blur-3xl" />

          <div className="relative">
            {/* =========================
                CARD HEADER
            ========================= */}

            <div className="mb-8 flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-100 to-green-50 text-emerald-600 shadow-inner shadow-emerald-200/50">
                <BookOpen className="h-7 w-7" />
              </div>

              <div>
                <h2 className="text-xl font-black text-slate-900">
                  Course Information
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Add the basic details of your new
                  course.
                </p>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {/* =========================
                  COURSE TITLE
              ========================= */}

              <div>
                <label
                  htmlFor="title"
                  className="mb-2.5 flex items-center gap-2 text-sm font-bold text-slate-700"
                >
                  <BookOpen className="h-4 w-4 text-emerald-500" />
                  Course Title
                </label>

                <input
                  id="title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter course title"
                  disabled={loading}
                  className="
                    w-full
                    rounded-2xl
                    border
                    border-slate-200
                    bg-slate-50/70
                    px-4
                    py-3.5
                    text-sm
                    text-slate-900
                    placeholder:text-slate-400
                    outline-none
                    transition-all
                    duration-200
                    hover:border-emerald-200
                    hover:bg-white
                    focus:border-emerald-500
                    focus:bg-white
                    focus:ring-4
                    focus:ring-emerald-500/10
                    disabled:cursor-not-allowed
                    disabled:bg-slate-100
                    disabled:opacity-70
                  "
                />
              </div>

              {/* =========================
                  DESCRIPTION
              ========================= */}

              <div>
                <label
                  htmlFor="description"
                  className="mb-2.5 flex items-center gap-2 text-sm font-bold text-slate-700"
                >
                  <FileText className="h-4 w-4 text-emerald-500" />
                  Description
                </label>

                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter course description"
                  rows={6}
                  disabled={loading}
                  className="
                    w-full
                    resize-none
                    rounded-2xl
                    border
                    border-slate-200
                    bg-slate-50/70
                    px-4
                    py-3.5
                    text-sm
                    leading-6
                    text-slate-900
                    placeholder:text-slate-400
                    outline-none
                    transition-all
                    duration-200
                    hover:border-emerald-200
                    hover:bg-white
                    focus:border-emerald-500
                    focus:bg-white
                    focus:ring-4
                    focus:ring-emerald-500/10
                    disabled:cursor-not-allowed
                    disabled:bg-slate-100
                    disabled:opacity-70
                  "
                />
              </div>

              {/* =========================
                  CATEGORY
              ========================= */}

              <div>
                <label
                  htmlFor="category"
                  className="mb-2.5 flex items-center gap-2 text-sm font-bold text-slate-700"
                >
                  <Layers3 className="h-4 w-4 text-emerald-500" />
                  Course Category
                </label>

                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  disabled={loading}
                  className="
                    w-full
                    rounded-2xl
                    border
                    border-slate-200
                    bg-slate-50/70
                    px-4
                    py-3.5
                    text-sm
                    text-slate-900
                    outline-none
                    transition-all
                    duration-200
                    hover:border-emerald-200
                    hover:bg-white
                    focus:border-emerald-500
                    focus:bg-white
                    focus:ring-4
                    focus:ring-emerald-500/10
                    disabled:cursor-not-allowed
                    disabled:bg-slate-100
                    disabled:opacity-70
                  "
                >
                  <option value="">
                    Select a category
                  </option>

                  <option value="Web Development">
                    Web Development
                  </option>

                  <option value="Frontend Development">
                    Frontend Development
                  </option>

                  <option value="Backend Development">
                    Backend Development
                  </option>

                  <option value="Full Stack Development">
                    Full Stack Development
                  </option>

                  <option value="JavaScript">
                    JavaScript
                  </option>

                  <option value="React">
                    React
                  </option>

                  <option value="Node.js">
                    Node.js
                  </option>

                  <option value="Python">
                    Python
                  </option>

                  <option value="Database">
                    Database
                  </option>

                  <option value="AWS & Cloud">
                    AWS & Cloud
                  </option>

                  <option value="DevOps">
                    DevOps
                  </option>

                  <option value="Other">
                    Other
                  </option>
                </select>
              </div>

              {/* =========================
                  ERROR MESSAGE
              ========================= */}

              {(formError || error) && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: -8,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm font-medium text-red-600"
                >
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 text-xs font-black">
                    !
                  </div>

                  <span>
                    {formError || error}
                  </span>
                </motion.div>
              )}

              {/* =========================
                  SUCCESS MESSAGE
              ========================= */}

              {successMessage && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: -8,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3.5 text-sm font-semibold text-emerald-700"
                >
                  <CheckCircle2 className="h-5 w-5 shrink-0" />

                  <span>{successMessage}</span>
                </motion.div>
              )}

              {/* =========================
                  BUTTONS
              ========================= */}

              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
                {/* CANCEL */}

                <motion.button
                  type="button"
                  onClick={() =>
                    navigate("/admin/courses")
                  }
                  disabled={loading}
                  whileHover={{
                    y: -1,
                  }}
                  whileTap={{
                    scale: 0.98,
                  }}
                  className="
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    px-6
                    py-3.5
                    text-sm
                    font-bold
                    text-slate-600
                    shadow-sm
                    transition-all
                    hover:border-emerald-200
                    hover:bg-emerald-50
                    hover:text-emerald-700
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  Cancel
                </motion.button>

                {/* CREATE */}

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={
                    !loading
                      ? {
                          y: -2,
                          scale: 1.01,
                        }
                      : {}
                  }
                  whileTap={
                    !loading
                      ? {
                          scale: 0.98,
                        }
                      : {}
                  }
                  className="
                    group
                    relative
                    flex
                    items-center
                    justify-center
                    gap-2
                    overflow-hidden
                    rounded-2xl
                    bg-gradient-to-r
                    from-emerald-600
                    via-green-500
                    to-lime-500
                    px-6
                    py-3.5
                    text-sm
                    font-bold
                    text-white
                    shadow-lg
                    shadow-emerald-600/25
                    transition-all
                    duration-300
                    hover:shadow-xl
                    hover:shadow-emerald-600/30
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                    disabled:shadow-none
                  "
                >
                  {/* Button shine */}

                  <span className="absolute inset-y-0 -left-20 w-16 -skew-x-12 bg-white/20 transition-all duration-700 group-hover:left-[120%]" />

                  {loading ? (
                    <>
                      <Loader2 className="relative h-5 w-5 animate-spin" />
                      <span className="relative">
                        Creating Course...
                      </span>
                    </>
                  ) : (
                    <>
                      <BookOpen className="relative h-5 w-5" />
                      <span className="relative">
                        Create Course
                      </span>
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>

        {/* =========================
            BOTTOM INFO
        ========================= */}

        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            delay: 0.5,
          }}
          className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-400"
        >
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
          Course details can be updated later from
          course management.
        </motion.div>
      </div>
    </div>
  );
};

export default AddCourse;