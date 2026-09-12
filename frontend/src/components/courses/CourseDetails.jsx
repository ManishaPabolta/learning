
import React from "react";
import {
  BookOpen,
  User,
  Users,
  CalendarDays,
  ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";

import EnrollButton from "./EnrollButton";

const CourseDetails = ({ course }) => {
  if (!course) return null;

  return (
    <div className="mx-auto max-w-6xl">

      {/* Back */}
      <Link
        to="/courses"
        className="group mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-all duration-300 hover:text-emerald-600"
      >
        <ArrowLeft
          size={17}
          className="transition-transform duration-300 group-hover:-translate-x-1"
        />
        Back to courses
      </Link>

      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-xl shadow-emerald-900/5">

        {/* Glow */}
        <div className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />

        <div className="grid lg:grid-cols-2">

          {/* Image */}
          <div className="relative min-h-[300px] overflow-hidden bg-gradient-to-br from-emerald-100 via-green-50 to-lime-100">

            {course.image ? (
              <img
                src={course.image}
                alt={course.title}
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
              />
            ) : (
              <div className="flex h-full min-h-[300px] items-center justify-center">
                <BookOpen
                  size={90}
                  className="text-emerald-400/50"
                />
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/30 to-transparent" />

          </div>

          {/* Info */}
          <div className="relative flex flex-col justify-center p-7 sm:p-10">

            <span className="mb-4 w-fit rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
              Learning Course
            </span>

            <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              {course.title}
            </h1>

            <p className="mt-5 leading-7 text-slate-500">
              {course.description ||
                "Build practical knowledge and improve your skills with this course."}
            </p>

            {/* Stats */}
            <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3">

              <div className="group/stat rounded-xl border border-slate-100 bg-slate-50 p-3 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-100 hover:bg-emerald-50/50">
                <User
                  size={17}
                  className="mb-2 text-emerald-600"
                />

                <p className="text-xs text-slate-400">
                  Instructor
                </p>

                <p className="mt-1 truncate text-sm font-semibold text-slate-800">
                  {course.instructor?.name || "Instructor"}
                </p>
              </div>

              <div className="group/stat rounded-xl border border-slate-100 bg-slate-50 p-3 transition-all duration-300 hover:-translate-y-1 hover:border-green-100 hover:bg-green-50/50">
                <Users
                  size={17}
                  className="mb-2 text-green-600"
                />

                <p className="text-xs text-slate-400">
                  Students
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-800">
                  {course.students?.length || 0}
                </p>
              </div>

              <div className="group/stat rounded-xl border border-slate-100 bg-slate-50 p-3 transition-all duration-300 hover:-translate-y-1 hover:border-lime-100 hover:bg-lime-50/50">
                <CalendarDays
                  size={17}
                  className="mb-2 text-lime-600"
                />

                <p className="text-xs text-slate-400">
                  Created
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-800">
                  {course.createdAt
                    ? new Date(
                        course.createdAt
                      ).toLocaleDateString()
                    : "Recently"}
                </p>
              </div>

            </div>

            {/* Enroll */}
            <div className="mt-7">
              <EnrollButton courseId={course._id} />
            </div>

          </div>

        </div>
      </div>

      {/* Description */}
      <div className="relative mt-6 overflow-hidden rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm shadow-emerald-900/5 sm:p-8">

        <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-emerald-400/5 blur-3xl" />

        <h2 className="relative text-xl font-bold text-slate-900">
          About this course
        </h2>

        <p className="relative mt-4 whitespace-pre-line leading-8 text-slate-500">
          {course.description ||
            "Course information will be available soon."}
        </p>

      </div>

    </div>
  );
};

export default CourseDetails;

