
import React from "react";
import {
  Search,
  X,
  SlidersHorizontal,
} from "lucide-react";

const CourseFilters = ({
  search = "",
  setSearch,
  onClear,
}) => {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm shadow-emerald-900/5">

      {/* Background Glow */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-emerald-400/5 blur-3xl" />

      <div className="relative flex flex-col gap-3 md:flex-row md:items-center">

        {/* Search */}
        <div className="relative flex-1">

          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors duration-300"
          />

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search courses..."
            className="
              w-full
              rounded-xl
              border
              border-slate-200
              bg-slate-50
              py-3
              pl-11
              pr-10
              text-sm
              text-slate-800
              outline-none
              placeholder:text-slate-400
              transition-all
              duration-300

              hover:border-emerald-200

              focus:border-emerald-500
              focus:bg-white
              focus:ring-4
              focus:ring-emerald-500/10
            "
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="
                absolute
                right-3
                top-1/2
                -translate-y-1/2
                rounded-lg
                p-1
                text-slate-400
                transition-all
                duration-200
                hover:bg-red-50
                hover:text-red-500
              "
            >
              <X size={17} />
            </button>
          )}

        </div>

        {/* Filter */}
        <button
          type="button"
          className="
            group
            flex
            items-center
            justify-center
            gap-2
            rounded-xl
            border
            border-slate-200
            bg-white
            px-5
            py-3
            text-sm
            font-medium
            text-slate-600
            transition-all
            duration-300

            hover:-translate-y-0.5
            hover:border-emerald-200
            hover:bg-emerald-50
            hover:text-emerald-700
            hover:shadow-md
            hover:shadow-emerald-500/10
          "
        >
          <SlidersHorizontal
            size={17}
            className="transition-transform duration-300 group-hover:rotate-12"
          />

          Filters
        </button>

        {/* Clear */}
        {search && (
          <button
            type="button"
            onClick={onClear}
            className="
              rounded-xl
              px-4
              py-3
              text-sm
              font-medium
              text-slate-500
              transition-all
              duration-300

              hover:bg-red-50
              hover:text-red-500
            "
          >
            Clear
          </button>
        )}

      </div>

    </div>
  );
};

export default CourseFilters;
