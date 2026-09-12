
import { useEffect, useState } from "react";
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
} from "lucide-react";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const API_URL = import.meta.env.VITE_API_URL;

const AddAssignment = () => {
  const { accessToken, user } = useAuth();

  const [courses, setCourses] = useState([]);
  const [course, setCourse] = useState("");
  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/courses`,
          {
            params: {
              page: 1,
              limit: 100,
            },
          }
        );

        setCourses(response.data.courses || []);
      } catch (err) {
        setError("Unable to load courses.");
      } finally {
        setLoadingCourses(false);
      }
    };

    fetchCourses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!course) {
      setError("Please select a course.");
      return;
    }

    if (!file) {
      setError("Please select an assignment file.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      const formData = new FormData();

      formData.append("file", file);
      formData.append("course", course);

      await axios.post(
        `${API_URL}/assignments/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage("Assignment uploaded successfully!");
      setFile(null);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to upload assignment."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-green-50 px-5 py-10 text-slate-900">

      {/* ================= BACKGROUND DECORATION ================= */}

      <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl animate-pulse" />

      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-green-400/10 blur-3xl animate-pulse" />

      <div className="pointer-events-none absolute left-[12%] top-[25%] h-2 w-2 rounded-full bg-emerald-400/60 animate-ping" />

      <div className="pointer-events-none absolute right-[15%] top-[18%] h-1.5 w-1.5 rounded-full bg-green-500/50 animate-pulse" />

      <div className="pointer-events-none absolute bottom-[20%] left-[20%] h-1.5 w-1.5 rounded-full bg-lime-500/50 animate-bounce" />

      <div className="relative z-10 mx-auto max-w-2xl">

        {/* ================= BACK ================= */}

        <Link
          to="/admin/assignments"
          className="
            group
            inline-flex
            items-center
            gap-2
            rounded-xl
            border
            border-emerald-100
            bg-white/80
            px-4
            py-2.5
            text-sm
            font-semibold
            text-slate-600
            shadow-sm
            backdrop-blur-md
            transition-all
            duration-300

            hover:-translate-x-1
            hover:border-emerald-200
            hover:bg-emerald-50
            hover:text-emerald-700
          "
        >
          <ArrowLeft
            className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1"
          />

          Back
        </Link>

        {/* ================= MAIN CARD ================= */}

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
            duration: 0.5,
            ease: "easeOut",
          }}
          className="
            relative
            mt-8
            overflow-hidden
            rounded-[2rem]
            border
            border-emerald-100
            bg-white/90
            p-7
            shadow-2xl
            shadow-emerald-900/10
            backdrop-blur-2xl
            sm:p-9
          "
        >

          {/* Card Glow */}
          <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl" />

          {/* Top Accent */}
          <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-emerald-600 via-green-500 to-lime-400" />

          {/* ================= HEADER ================= */}

          <div className="relative">

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.8,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              transition={{
                delay: 0.15,
                duration: 0.4,
              }}
              className="
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-2xl
                bg-gradient-to-br
                from-emerald-100
                to-green-50
                text-emerald-600
                shadow-sm
              "
            >
              <Upload className="h-7 w-7" />
            </motion.div>

            <motion.h1
              initial={{
                opacity: 0,
                x: -15,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                delay: 0.2,
              }}
              className="mt-6 text-3xl font-black tracking-tight text-slate-900"
            >
              Upload Assignment
            </motion.h1>

            <p className="mt-2 max-w-lg text-sm leading-6 text-slate-500">
              Upload an assignment file for the selected course.
            </p>

          </div>

          {/* ================= SUCCESS MESSAGE ================= */}

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
              className="
                mt-6
                flex
                items-start
                gap-3
                rounded-2xl
                border
                border-emerald-200
                bg-emerald-50
                p-4
                text-sm
                font-medium
                text-emerald-700
              "
            >
              <CheckCircle2
                size={19}
                className="mt-0.5 shrink-0 text-emerald-600"
              />

              <span>{message}</span>
            </motion.div>
          )}

          {/* ================= ERROR MESSAGE ================= */}

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
              className="
                mt-6
                flex
                items-start
                gap-3
                rounded-2xl
                border
                border-red-200
                bg-red-50
                p-4
                text-sm
                font-medium
                text-red-600
              "
            >
              <AlertCircle
                size={19}
                className="mt-0.5 shrink-0 text-red-500"
              />

              <span>{error}</span>
            </motion.div>
          )}

          {/* ================= FORM ================= */}

          <form
            onSubmit={handleSubmit}
            className="relative mt-8 space-y-6"
          >

            {/* ================= COURSE ================= */}

            <div>

              <label className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700">
                <BookOpen
                  size={16}
                  className="text-emerald-600"
                />

                Course
              </label>

              <div className="relative">

                <select
                  value={course}
                  onChange={(e) =>
                    setCourse(e.target.value)
                  }
                  disabled={loadingCourses}
                  className="
                    w-full
                    appearance-none
                    rounded-xl
                    border
                    border-slate-200
                    bg-slate-50
                    px-4
                    py-3.5
                    text-sm
                    font-medium
                    text-slate-800
                    outline-none
                    transition-all
                    duration-300

                    hover:border-emerald-200

                    focus:border-emerald-500
                    focus:bg-white
                    focus:ring-4
                    focus:ring-emerald-500/10

                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >
                  <option value="">
                    {loadingCourses
                      ? "Loading courses..."
                      : "Select course"}
                  </option>

                  {courses.map((item) => (
                    <option
                      key={item._id}
                      value={item._id}
                    >
                      {item.title}
                    </option>
                  ))}
                </select>

                {/* Arrow */}
                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </div>

              </div>

            </div>

            {/* ================= FILE UPLOAD ================= */}

            <label
              className="
                group
                flex
                cursor-pointer
                flex-col
                items-center
                justify-center
                rounded-2xl
                border-2
                border-dashed
                border-emerald-200
                bg-emerald-50/40
                px-6
                py-12
                text-center
                transition-all
                duration-300

                hover:border-emerald-400
                hover:bg-emerald-50
                hover:shadow-lg
                hover:shadow-emerald-500/10
              "
            >

              <div
                className="
                  flex
                  h-16
                  w-16
                  items-center
                  justify-center
                  rounded-2xl
                  bg-white
                  text-emerald-600
                  shadow-md
                  shadow-emerald-900/5
                  transition-all
                  duration-300

                  group-hover:-translate-y-1
                  group-hover:scale-105
                  group-hover:shadow-lg
                "
              >
                <FileText className="h-9 w-9" />
              </div>

              <p className="mt-5 max-w-full truncate px-4 text-sm font-bold text-slate-800 sm:text-base">
                {file
                  ? file.name
                  : "Choose assignment file"}
              </p>

              <p className="mt-2 text-xs text-slate-400">
                PDF, DOC, DOCX and supported files
              </p>

              {!file && (
                <span className="mt-4 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-emerald-600 shadow-sm">
                  Browse files
                </span>
              )}

              {file && (
                <span className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                  <CheckCircle2 size={14} />
                  File selected
                </span>
              )}

              <input
                type="file"
                onChange={(e) =>
                  setFile(
                    e.target.files?.[0] || null
                  )
                }
                className="hidden"
              />

            </label>

            {/* ================= SUBMIT ================= */}

            <button
              type="submit"
              disabled={loading}
              className="
                group
                flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-gradient-to-r
                from-emerald-600
                via-green-500
                to-lime-400
                py-4
                font-bold
                text-white
                shadow-lg
                shadow-emerald-500/20
                transition-all
                duration-300

                hover:-translate-y-0.5
                hover:shadow-xl
                hover:shadow-emerald-500/30

                active:translate-y-0

                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload
                    className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-0.5"
                  />

                  Upload Assignment
                </>
              )}
            </button>

          </form>

          {/* Bottom Accent */}
          <div className="absolute bottom-0 left-1/2 h-1 w-24 -translate-x-1/2 rounded-full bg-gradient-to-r from-emerald-500 to-lime-400" />

        </motion.div>

        {/* ================= FOOTER ================= */}

        <p className="mt-6 text-center text-xs text-slate-400">
          Upload assignments securely for your students.
        </p>

      </div>
    </div>
  );
};

export default AddAssignment;
