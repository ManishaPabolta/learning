import React, { useEffect, useState } from "react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import { motion } from "framer-motion";

import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  GraduationCap,
  Loader2,
  User,
  Users,
} from "lucide-react";

import useAuth from "../../hooks/useAuth";

import api from "../../services/api";

const CourseDetailsPage = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const { user } = useAuth();

  const [course, setCourse] = useState(null);

  const [loading, setLoading] = useState(true);

  const [enrolling, setEnrolling] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  // =====================================================
  // FETCH COURSE
  // =====================================================

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);

        setError("");

        if (!id) {
          setError("Course ID is missing.");
          return;
        }

        const response = await api.get(`/courses/${id}`);

        console.log(
          "Course details response:",
          response.data
        );

        const courseData =
          response.data?.course || response.data;

        if (!courseData) {
          throw new Error("Course data not found.");
        }

        setCourse(courseData);
      } catch (err) {
        console.error(
          "Course details error:",
          err.response?.data || err
        );

        setCourse(null);

        setError(
          err.response?.data?.message ||
            err.message ||
            "Unable to load this course."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  // =====================================================
  // ENROLL COURSE
  // =====================================================

  const handleEnroll = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      setEnrolling(true);

      setError("");

      setSuccess("");

      const response = await api.post(
        `/courses/enroll/${id}`
      );

      console.log(
        "Enrollment response:",
        response.data
      );

      setSuccess(
        response.data?.message ||
          "You have successfully enrolled in this course!"
      );

      setCourse((prev) => {
        if (!prev) {
          return prev;
        }

        const currentStudents =
          prev.students || [];

        const alreadyExists =
          currentStudents.some((student) => {
            if (typeof student === "string") {
              return student === user._id;
            }

            return student?._id === user._id;
          });

        if (alreadyExists) {
          return prev;
        }

        return {
          ...prev,
          students: [
            ...currentStudents,
            user._id,
          ],
        };
      });
    } catch (err) {
      console.error(
        "Enrollment error:",
        err.response?.data || err
      );

      setError(
        err.response?.data?.message ||
          "Unable to enroll in this course."
      );
    } finally {
      setEnrolling(false);
    }
  };

  // =====================================================
  // CHECK ENROLLMENT
  // =====================================================

  const isEnrolled =
    user &&
    course?.students?.some((student) => {
      if (typeof student === "string") {
        return student === user._id;
      }

      return student?._id === user._id;
    });

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-green-50 text-slate-900">
        <div className="relative text-center">
          <div className="relative mx-auto h-16 w-16">
            <motion.div
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute inset-0 rounded-full border-4 border-emerald-100 border-t-emerald-600"
            />

            <BookOpen className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 text-emerald-600" />
          </div>

          <p className="mt-5 text-sm font-medium text-slate-500">
            Loading course details...
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // COURSE NOT FOUND / ERROR
  // =====================================================

  if (!course) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-green-50 px-6 text-slate-900">
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="max-w-md text-center"
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 shadow-lg shadow-red-100">
            <BookOpen className="h-7 w-7 text-red-500" />
          </div>

          <h1 className="mt-6 text-3xl font-bold">
            Course not found
          </h1>

          <p className="mt-3 text-slate-600">
            {error || "Unable to load this course."}
          </p>

          <Link
            to="/courses"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 px-6 py-3 font-semibold text-white shadow-lg shadow-emerald-200 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <ArrowLeft className="h-4 w-4" />

            Back to Courses
          </Link>
        </motion.div>
      </div>
    );
  }

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-green-50 text-slate-900">
      {/* =================================================
          HERO SECTION
      ================================================= */}

      <section className="relative overflow-hidden border-b border-emerald-100">
        {/* Background Glow */}

        <div className="pointer-events-none absolute inset-0">
          <motion.div
            animate={{
              x: [0, 30, 0],
              y: [0, -20, 0],
            }}
            transition={{
              duration: 9,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute left-[-120px] top-0 h-[450px] w-[450px] rounded-full bg-emerald-300/20 blur-3xl"
          />

          <motion.div
            animate={{
              x: [0, -30, 0],
              y: [0, 25, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute right-[-120px] top-20 h-[450px] w-[450px] rounded-full bg-green-300/20 blur-3xl"
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8 lg:py-14">
          {/* Back Button */}

          <Link
            to="/courses"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-emerald-600"
          >
            <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-1" />

            Back to Courses
          </Link>

          <div className="mt-10 grid items-center gap-12 lg:grid-cols-[1.3fr_0.7fr]">
            {/* LEFT CONTENT */}

            <motion.div
              initial={{
                opacity: 0,
                x: -40,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                duration: 0.7,
              }}
            >
              {/* Course Badge */}

              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 shadow-sm">
                <GraduationCap className="h-4 w-4" />

                Online Course
              </div>

              {/* Title */}

              <h1 className="mt-6 max-w-4xl text-4xl font-black leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                {course.title}
              </h1>

              {/* Description */}

              <p className="mt-6 max-w-3xl text-base leading-8 text-slate-600 sm:text-lg">
                {course.description ||
                  "Build practical knowledge through this structured learning experience."}
              </p>

              {/* Category */}

              {course.category && (
                <div className="mt-6 inline-flex items-center rounded-full border border-emerald-100 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 shadow-sm">
                  Category: {course.category}
                </div>
              )}

              {/* Meta Information */}

              <div className="mt-8 flex flex-wrap gap-6 text-sm text-slate-600">
                {/* Students */}

                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-emerald-500" />

                  <span>
                    {course.students?.length || 0} students
                  </span>
                </div>

                {/* Instructor */}

                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-emerald-500" />

                  <span>
                    {course.instructor?.name || "Instructor"}
                  </span>
                </div>

                {/* Learning */}

                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-emerald-500" />

                  <span>Self-paced</span>
                </div>
              </div>
            </motion.div>

            {/* COURSE CARD */}

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.9,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              transition={{
                duration: 0.7,
              }}
              whileHover={{
                y: -5,
              }}
              className="overflow-hidden rounded-3xl border border-emerald-100 bg-white/90 shadow-2xl shadow-emerald-100/60 backdrop-blur-xl"
            >
              {/* Course Visual */}

              <div className="relative flex h-64 items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-100 via-green-50 to-lime-50">
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 8, 0],
                  }}
                  transition={{
                    duration: 7,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-emerald-300/30 blur-2xl"
                />

                <motion.div
                  animate={{
                    scale: [1, 1.15, 1],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                  }}
                  className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-green-300/30 blur-2xl"
                />

                <motion.div
                  animate={{
                    y: [0, -8, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="relative flex h-28 w-28 items-center justify-center rounded-3xl border border-white/80 bg-white/70 shadow-xl shadow-emerald-200/60 backdrop-blur-md"
                >
                  <BookOpen className="h-16 w-16 text-emerald-500" />
                </motion.div>
              </div>

              {/* Card Body */}

              <div className="p-6">
                {/* Success Message */}

                {success && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: -10,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5" />

                      {success}
                    </div>
                  </motion.div>
                )}

                {/* Error Message */}

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
                    className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600"
                  >
                    {error}
                  </motion.div>
                )}

                {/* Already Enrolled */}

                {isEnrolled ? (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-center">
                    <CheckCircle2 className="mx-auto mb-2 h-6 w-6 text-emerald-600" />

                    <p className="font-semibold text-emerald-700">
                      You are already enrolled
                    </p>

                    <Link
                      to="/student/courses"
                      className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:text-emerald-800"
                    >
                      Go to My Courses

                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                ) : (
                  <button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 via-green-600 to-lime-600 py-4 font-bold text-white shadow-lg shadow-emerald-200 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-200 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                  >
                    {enrolling ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />

                        Enrolling...
                      </>
                    ) : (
                      <>
                        Enroll Now

                        <ArrowRight className="h-5 w-5" />
                      </>
                    )}
                  </button>
                )}

                {/* Login Message */}

                {!user && (
                  <p className="mt-4 text-center text-xs text-slate-500">
                    Login is required to enroll in this course.
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =================================================
          COURSE INFORMATION
      ================================================= */}

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* About Course */}

          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            whileHover={{
              y: -4,
            }}
            className="rounded-3xl border border-emerald-100 bg-white p-7 shadow-lg shadow-emerald-100/30 transition sm:p-9 lg:col-span-2"
          >
            <h2 className="text-2xl font-bold text-slate-900">
              About this course
            </h2>

            <div className="mt-5 leading-8 text-slate-600">
              {course.description ? (
                <p className="whitespace-pre-line">
                  {course.description}
                </p>
              ) : (
                <p>
                  This course provides a structured learning
                  experience designed to help you develop
                  practical skills and knowledge.
                </p>
              )}
            </div>
          </motion.div>

          {/* What You Get */}

          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              delay: 0.1,
            }}
            whileHover={{
              y: -4,
            }}
            className="rounded-3xl border border-emerald-100 bg-white p-7 shadow-lg shadow-emerald-100/30 transition sm:p-9"
          >
            <h2 className="text-xl font-bold text-slate-900">
              What you'll get
            </h2>

            <div className="mt-6 space-y-4">
              {[
                "Structured learning",
                "Practical knowledge",
                "Assignments",
                "Progress tracking",
                "Flexible learning",
              ].map((item, index) => (
                <motion.div
                  key={item}
                  initial={{
                    opacity: 0,
                    x: 15,
                  }}
                  whileInView={{
                    opacity: 1,
                    x: 0,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    delay: index * 0.08,
                  }}
                  className="flex items-center gap-3 text-sm font-medium text-slate-600"
                >
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />

                  {item}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* =================================================
            INSTRUCTOR
        ================================================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          whileHover={{
            y: -4,
          }}
          className="mt-8 rounded-3xl border border-emerald-100 bg-white p-7 shadow-lg shadow-emerald-100/30 transition sm:p-9"
        >
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 shadow-sm">
              <User className="h-8 w-8 text-emerald-600" />
            </div>

            <div>
              <p className="text-sm font-medium text-slate-500">
                Course Instructor
              </p>

              <h3 className="mt-1 text-xl font-bold text-slate-900">
                {course.instructor?.name ||
                  "Course Instructor"}
              </h3>

              {course.instructor?.email && (
                <p className="mt-1 text-sm text-slate-500">
                  {course.instructor.email}
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default CourseDetailsPage;