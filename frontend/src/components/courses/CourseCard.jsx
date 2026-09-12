
import React from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  User,
  ArrowRight,
  Users,
} from "lucide-react";

const CourseCard = ({ course }) => {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-emerald-200 hover:shadow-2xl hover:shadow-emerald-900/10">

      {/* Glow */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-emerald-400/10 blur-3xl transition-all duration-500 group-hover:bg-emerald-400/20" />

      {/* Course Image */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-emerald-100 via-green-50 to-lime-100">

        {course?.image ? (
          <img
            src={course.image}
            alt={course.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <BookOpen
              size={55}
              className="text-emerald-400/70 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
            />
          </div>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/40 via-transparent to-transparent" />

        {/* Badge */}
        <div className="absolute left-4 top-4 rounded-full border border-white/70 bg-white/90 px-3 py-1 text-xs font-bold text-emerald-700 shadow-sm backdrop-blur-md">
          Course
        </div>
      </div>

      {/* Content */}
      <div className="relative p-5">

        <h3 className="line-clamp-2 text-lg font-bold text-slate-900 transition-colors duration-300 group-hover:text-emerald-700">
          {course?.title || "Untitled Course"}
        </h3>

        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
          {course?.description ||
            "Learn practical skills through this comprehensive course."}
        </p>

        {/* Instructor */}
        <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">

          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 transition-all duration-300 group-hover:bg-emerald-100 group-hover:scale-105">
            <User size={14} />
          </div>

          <span className="truncate">
            {course?.instructor?.name || "NGSkillForge Instructor"}
          </span>

        </div>

        {/* Bottom */}
        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">

          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Users size={14} className="text-emerald-600" />
            {course?.students?.length || 0} students
          </div>

          <Link
            to={`/courses/${course?._id}`}
            className="group/button flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 transition-all duration-300 hover:-translate-y-0.5 hover:bg-emerald-600 hover:text-white hover:shadow-lg hover:shadow-emerald-600/20"
          >
            View Course

            <ArrowRight
              size={14}
              className="transition-transform duration-300 group-hover/button:translate-x-1"
            />
          </Link>

        </div>

      </div>

      {/* Bottom Accent */}
      <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-emerald-600 via-green-500 to-lime-400 transition-all duration-500 group-hover:w-full" />

    </div>
  );
};

export default CourseCard;

