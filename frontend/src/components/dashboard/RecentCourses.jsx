import React from "react";
import { ArrowRight, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

const RecentCourses = ({ courses = [] }) => {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-emerald-100 bg-white p-5 shadow-[0_10px_35px_rgba(16,185,129,0.07)] transition-all duration-500 hover:shadow-[0_18px_45px_rgba(16,185,129,0.12)] sm:p-6">

      {/* Decorative glow */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-44 w-44 rounded-full bg-emerald-100/70 blur-3xl transition-transform duration-700 group-hover:scale-125" />

      <div className="relative">

        <div className="mb-5 flex items-center justify-between">

          <div>
            <h2 className="font-black text-slate-800">
              Recent Courses
            </h2>

            <p className="mt-1 text-xs font-medium text-slate-400">
              Continue your learning
            </p>
          </div>

          <Link
            to="/courses"
            className="
              group/all flex items-center gap-1
              rounded-lg px-2 py-1
              text-xs font-bold text-emerald-600
              transition-all duration-300
              hover:bg-emerald-50
              hover:text-emerald-700
            "
          >
            View all

            <ArrowRight
              size={14}
              className="transition-transform duration-300 group-hover/all:translate-x-1"
            />
          </Link>

        </div>

        <div className="space-y-3">

          {courses.length > 0 ? (
            courses.slice(0, 5).map((course, index) => (
              <Link
                key={course._id}
                to={`/courses/${course._id}`}
                style={{
                  animationDelay: `${index * 70}ms`,
                }}
                className="
                  group/course flex items-center gap-4
                  rounded-2xl border border-emerald-100
                  bg-emerald-50/30 p-3
                  transition-all duration-300
                  animate-[courseItem_0.5s_ease-out_both]
                  hover:-translate-y-0.5
                  hover:border-emerald-200
                  hover:bg-white
                  hover:shadow-md
                "
              >

                <div className="
                  flex h-12 w-12 shrink-0
                  items-center justify-center
                  overflow-hidden rounded-xl
                  bg-emerald-50
                  text-emerald-600
                  shadow-sm
                  transition-all duration-300
                  group-hover/course:scale-105
                ">

                  {course.image ? (
                    <img
                      src={course.image}
                      alt={course.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover/course:scale-110"
                    />
                  ) : (
                    <BookOpen
                      size={20}
                      className="transition-transform duration-300 group-hover/course:rotate-6"
                    />
                  )}

                </div>

                <div className="min-w-0 flex-1">

                  <h3 className="truncate text-sm font-bold text-slate-700 transition-colors group-hover/course:text-emerald-700">
                    {course.title}
                  </h3>

                  <p className="mt-1 truncate text-xs font-medium text-slate-400">
                    {course.instructor?.name || "Instructor"}
                  </p>

                </div>

                <ArrowRight
                  size={16}
                  className="
                    text-slate-300
                    transition-all duration-300
                    group-hover/course:translate-x-1
                    group-hover/course:text-emerald-600
                  "
                />

              </Link>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/30 py-10 text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-emerald-500 shadow-sm">
                <BookOpen size={30} />
              </div>

              <p className="mt-3 text-sm font-semibold text-slate-500">
                No courses yet
              </p>

            </div>
          )}

        </div>

      </div>

      <style>{`
        @keyframes courseItem {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>

    </div>
  );
};

export default RecentCourses;