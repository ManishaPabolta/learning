
import React from "react";
import CourseCard from "./CourseCard";
import Loader from "../common/Loader";
import EmptyState from "../common/EmptyState";

const CourseGrid = ({
  courses = [],
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div
            key={item}
            className="overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm"
          >
            <div className="h-48 animate-pulse bg-gradient-to-br from-emerald-50 via-green-50 to-lime-50" />

            <div className="space-y-4 p-5">
              <div className="h-5 w-3/4 animate-pulse rounded bg-emerald-50" />

              <div className="h-4 w-full animate-pulse rounded bg-slate-100" />

              <div className="h-4 w-5/6 animate-pulse rounded bg-slate-100" />

              <div className="h-10 animate-pulse rounded-xl bg-emerald-50" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!courses.length) {
    return (
      <EmptyState
        title="No courses found"
        message="Try changing your search or check back later for new courses."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {courses.map((course, index) => (
        <div
          key={course._id}
          className="animate-[fadeUp_.5s_ease-out]"
          style={{
            animationDelay: `${index * 80}ms`,
            animationFillMode: "both",
          }}
        >
          <CourseCard course={course} />
        </div>
      ))}
    </div>
  );
};

export default CourseGrid;
