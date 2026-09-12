import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Loader2,
  Save,
  BookOpen,
  FileText,
  Tag,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";

import api from "../../services/api";

const EditCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // ============================
  // GET COURSE BY ID
  // ============================
  useEffect(() => {
    const getCourse = async () => {
      try {
        setLoading(true);
        setError("");

        if (!id) {
          setError("Course ID is missing.");
          return;
        }

        console.log("Edit Course ID:", id);

        const response = await api.get(`/courses/${id}`);

        console.log("Course Response:", response.data);

        const course =
          response.data?.course || response.data;

        if (!course) {
          setError("Course not found.");
          return;
        }

        setForm({
          title: course.title || "",
          description: course.description || "",
          category: course.category || "",
        });
      } catch (err) {
        console.error("Get course error:", err);

        setError(
          err.response?.data?.message ||
            "Unable to load course."
        );
      } finally {
        setLoading(false);
      }
    };

    getCourse();
  }, [id]);

  // ============================
  // HANDLE INPUT
  // ============================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ============================
  // UPDATE COURSE
  // ============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      if (!id) {
        setError("Course ID is missing.");
        return;
      }

      if (!form.title.trim()) {
        setError("Course title is required.");
        return;
      }

      if (!form.description.trim()) {
        setError("Course description is required.");
        return;
      }

      if (!form.category.trim()) {
        setError("Course category is required.");
        return;
      }

      console.log("Updating Course ID:", id);
      console.log("Update Data:", form);

      const response = await api.patch(
        `/courses/${id}`,
        {
          title: form.title.trim(),
          description: form.description.trim(),
          category: form.category.trim(),
        }
      );

      console.log(
        "Update Response:",
        response.data
      );

      navigate("/admin/courses");
    } catch (err) {
      console.error("Update course error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to update course."
      );
    } finally {
      setSaving(false);
    }
  };

  // ============================
  // LOADING
  // ============================
  if (loading) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-green-50 text-slate-900">
        {/* Ambient Glows */}
        <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-lime-400/20 blur-3xl" />

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative flex flex-col items-center gap-4"
        >
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-200 bg-white shadow-xl shadow-emerald-900/10">
            <Loader2 className="h-9 w-9 animate-spin text-emerald-600" />

            <span className="absolute inset-0 rounded-2xl border border-emerald-400/30 animate-ping" />
          </div>

          <p className="text-sm font-semibold text-slate-600">
            Loading course...
          </p>
        </motion.div>
      </div>
    );
  }

  // ============================
  // UI
  // ============================
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-green-50 px-5 py-10 text-slate-900">

      {/* ============================
          AMBIENT BACKGROUND
      ============================ */}

      <div className="pointer-events-none absolute -left-32 top-20 h-80 w-80 rounded-full bg-emerald-400/15 blur-3xl" />

      <div className="pointer-events-none absolute -right-32 top-1/3 h-96 w-96 rounded-full bg-green-400/15 blur-3xl" />

      <div className="pointer-events-none absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-lime-400/10 blur-3xl" />

      {/* Floating Dots */}
      <motion.div
        animate={{
          y: [0, -18, 0],
          opacity: [0.3, 0.7, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute left-[8%] top-[18%] h-2 w-2 rounded-full bg-emerald-500"
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
        className="pointer-events-none absolute right-[12%] top-[28%] h-3 w-3 rounded-full bg-green-400"
      />

      <motion.div
        animate={{
          y: [0, -12, 0],
          x: [0, 8, 0],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute bottom-[18%] right-[25%] h-2 w-2 rounded-full bg-lime-500"
      />

      {/* Decorative Lines */}
      <div className="pointer-events-none absolute left-0 top-40 h-px w-full bg-gradient-to-r from-transparent via-emerald-200/60 to-transparent" />

      <div className="pointer-events-none absolute bottom-32 left-0 h-px w-full bg-gradient-to-r from-transparent via-green-200/50 to-transparent" />

      {/* ============================
          MAIN CONTENT
      ============================ */}

      <div className="relative mx-auto max-w-3xl">

        {/* BACK BUTTON */}
        <motion.div
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35 }}
        >
          <Link
            to="/admin/courses"
            className="group inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-white/70 px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-x-1 hover:border-emerald-300 hover:bg-white hover:text-emerald-700 hover:shadow-md"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to Courses
          </Link>
        </motion.div>

        {/* ============================
            CARD
        ============================ */}

        <motion.div
          initial={{ opacity: 0, y: 25, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 0.45,
            ease: "easeOut",
          }}
          className="relative mt-8 overflow-hidden rounded-[2rem] border border-emerald-100 bg-white/90 p-7 shadow-2xl shadow-emerald-900/10 backdrop-blur-2xl sm:p-9"
        >

          {/* Top Accent */}
          <div className="absolute left-0 right-0 top-0 h-1.5 bg-gradient-to-r from-emerald-600 via-green-500 to-lime-400" />

          {/* ============================
              HEADER
          ============================ */}

          <div className="flex items-start gap-4">

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 }}
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-green-500 text-white shadow-lg shadow-emerald-600/20"
            >
              <BookOpen className="h-7 w-7" />
            </motion.div>

            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-700">
                <Sparkles className="h-3.5 w-3.5" />
                Course Management
              </div>

              <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                Edit{" "}
                <span className="bg-gradient-to-r from-emerald-600 via-green-500 to-lime-500 bg-clip-text text-transparent">
                  Course
                </span>
              </h1>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Update your course information.
              </p>
            </div>
          </div>

          {/* ============================
              ERROR
          ============================ */}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600"
            >
              <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-100">
                <span className="font-bold">!</span>
              </div>

              <span className="leading-6">
                {error}
              </span>
            </motion.div>
          )}

          {/* ============================
              FORM
          ============================ */}

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-6"
          >

            {/* TITLE */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label className="mb-2.5 flex items-center gap-2 text-sm font-bold text-slate-700">
                <BookOpen className="h-4 w-4 text-emerald-600" />
                Course Title
              </label>

              <div className="group relative">
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Enter course title"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3.5 text-slate-900 outline-none transition-all duration-300 placeholder:text-slate-400 hover:border-emerald-200 hover:bg-white focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                />

                <div className="pointer-events-none absolute bottom-0 left-4 right-4 h-0.5 origin-left scale-x-0 rounded-full bg-gradient-to-r from-emerald-500 to-lime-400 transition-transform duration-300 group-focus-within:scale-x-100" />
              </div>
            </motion.div>

            {/* DESCRIPTION */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28 }}
            >
              <label className="mb-2.5 flex items-center gap-2 text-sm font-bold text-slate-700">
                <FileText className="h-4 w-4 text-emerald-600" />
                Description
              </label>

              <div className="group relative">
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={7}
                  placeholder="Enter course description"
                  className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3.5 text-slate-900 outline-none transition-all duration-300 placeholder:text-slate-400 hover:border-emerald-200 hover:bg-white focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                />

                <div className="pointer-events-none absolute bottom-1 left-4 right-4 h-0.5 origin-left scale-x-0 rounded-full bg-gradient-to-r from-emerald-500 to-lime-400 transition-transform duration-300 group-focus-within:scale-x-100" />
              </div>
            </motion.div>

            {/* CATEGORY */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.36 }}
            >
              <label className="mb-2.5 flex items-center gap-2 text-sm font-bold text-slate-700">
                <Tag className="h-4 w-4 text-emerald-600" />
                Category
              </label>

              <div className="group relative">
                <input
                  type="text"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  placeholder="Example: Web Development"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3.5 text-slate-900 outline-none transition-all duration-300 placeholder:text-slate-400 hover:border-emerald-200 hover:bg-white focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                />

                <div className="pointer-events-none absolute bottom-0 left-4 right-4 h-0.5 origin-left scale-x-0 rounded-full bg-gradient-to-r from-emerald-500 to-lime-400 transition-transform duration-300 group-focus-within:scale-x-100" />
              </div>
            </motion.div>

            {/* SAVE BUTTON */}
            <motion.button
              type="submit"
              disabled={saving}
              whileHover={!saving ? { scale: 1.01 } : {}}
              whileTap={!saving ? { scale: 0.98 } : {}}
              className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 via-green-500 to-lime-500 py-4 font-bold text-white shadow-lg shadow-emerald-600/20 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-600/30 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {/* Shine */}
              <span className="absolute inset-y-0 -left-20 w-16 rotate-12 bg-white/25 blur-md transition-all duration-700 group-hover:left-[110%]" />

              {saving ? (
                <>
                  <Loader2 className="relative h-5 w-5 animate-spin" />
                  <span className="relative">
                    Updating...
                  </span>
                </>
              ) : (
                <>
                  <Save className="relative h-5 w-5 transition-transform duration-300 group-hover:rotate-6" />
                  <span className="relative">
                    Save Changes
                  </span>
                </>
              )}
            </motion.button>
          </form>

          {/* ============================
              BOTTOM INFO
          ============================ */}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400"
          >
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            Course information will be updated securely.
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default EditCourse;