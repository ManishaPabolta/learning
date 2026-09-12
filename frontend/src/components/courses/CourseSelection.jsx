
import React from "react";
import {
  BookOpen,
  ChevronDown,
} from "lucide-react";

const CourseSelection = ({
  courses = [],
  value = "",
  onChange,
  label = "Select Course",
  placeholder = "Choose a course",
  disabled = false,
}) => {
  return (
    <div className="w-full">

      {/* Label */}
      <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
        <BookOpen
          size={16}
          className="text-emerald-600"
        />

        {label}
      </label>

      {/* Select Wrapper */}
      <div className="group relative">

        {/* Icon */}
        <BookOpen
          size={18}
          className="
            pointer-events-none
            absolute
            left-4
            top-1/2
            z-10
            -translate-y-1/2
            text-slate-400
            transition
            group-focus-within:text-emerald-600
          "
        />

        {/* Select */}
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="
            w-full
            appearance-none
            rounded-xl
            border
            border-slate-200
            bg-slate-50
            py-3.5
            pl-11
            pr-11
            text-sm
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
            disabled:opacity-50
          "
        >
          <option
            value=""
            className="bg-white text-slate-400"
          >
            {placeholder}
          </option>

          {courses.map((course) => (
            <option
              key={course._id}
              value={course._id}
              className="bg-white text-slate-800"
            >
              {course.title}
            </option>
          ))}
        </select>

        {/* Arrow */}
        <ChevronDown
          size={18}
          className="
            pointer-events-none
            absolute
            right-4
            top-1/2
            -translate-y-1/2
            text-slate-400
            transition-all
            duration-300
            group-focus-within:rotate-180
            group-focus-within:text-emerald-600
          "
        />

      </div>

      {/* Helper */}
      {!courses.length && (
        <p className="mt-2 text-xs text-slate-400">
          No courses available.
        </p>
      )}

    </div>
  );
};

export default CourseSelection;