import React from "react";

const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  className = "",
}) => {
  if (totalPages <= 1) {
    return null;
  }

  const getPages = () => {
    const pages = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }

      return pages;
    }

    pages.push(1);

    if (currentPage > 3) {
      pages.push("...");
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(
      totalPages - 1,
      currentPage + 1
    );

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push("...");
    }

    pages.push(totalPages);

    return pages;
  };

  const pages = getPages();

  return (
    <div
      className={`
        mt-8
        flex
        flex-wrap
        items-center
        justify-center
        gap-2
        ${className}
      `}
    >
      {/* Previous */}
      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() =>
          onPageChange(currentPage - 1)
        }
        className="
          flex
          h-10
          min-w-10
          items-center
          justify-center
          rounded-xl
          border
          border-slate-200
          bg-white
          px-3
          text-sm
          font-bold
          text-slate-600
          shadow-sm
          transition-all
          duration-300
          hover:-translate-x-1
          hover:border-emerald-300
          hover:bg-emerald-50
          hover:text-emerald-600
          hover:shadow-md
          hover:shadow-emerald-500/10
          active:scale-90
          disabled:cursor-not-allowed
          disabled:opacity-40
          disabled:hover:translate-x-0
          disabled:hover:shadow-sm
        "
      >
        ←
      </button>

      {/* Page Numbers */}
      {pages.map((page, index) => {
        if (page === "...") {
          return (
            <span
              key={`dots-${index}`}
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                text-sm
                font-semibold
                text-slate-400
              "
            >
              ...
            </span>
          );
        }

        const active =
          currentPage === page;

        return (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            className={`
              relative
              flex
              h-10
              w-10
              items-center
              justify-center
              overflow-hidden
              rounded-xl
              text-sm
              font-bold
              transition-all
              duration-300
              active:scale-90

              ${
                active
                  ? `
                    bg-gradient-to-br
                    from-emerald-500
                    to-green-600
                    text-white
                    shadow-lg
                    shadow-emerald-500/25
                    hover:-translate-y-0.5
                  `
                  : `
                    border
                    border-slate-200
                    bg-white
                    text-slate-600
                    shadow-sm
                    hover:-translate-y-1
                    hover:border-emerald-300
                    hover:bg-emerald-50
                    hover:text-emerald-600
                    hover:shadow-md
                    hover:shadow-emerald-500/10
                  `
              }
            `}
          >
            {active && (
              <span
                className="
                  absolute
                  inset-0
                  bg-gradient-to-r
                  from-white/0
                  via-white/15
                  to-white/0
                  animate-[paginationShine_2s_linear_infinite]
                "
              />
            )}

            <span className="relative z-10">
              {page}
            </span>
          </button>
        );
      })}

      {/* Next */}
      <button
        type="button"
        disabled={currentPage === totalPages}
        onClick={() =>
          onPageChange(currentPage + 1)
        }
        className="
          flex
          h-10
          min-w-10
          items-center
          justify-center
          rounded-xl
          border
          border-slate-200
          bg-white
          px-3
          text-sm
          font-bold
          text-slate-600
          shadow-sm
          transition-all
          duration-300
          hover:translate-x-1
          hover:border-emerald-300
          hover:bg-emerald-50
          hover:text-emerald-600
          hover:shadow-md
          hover:shadow-emerald-500/10
          active:scale-90
          disabled:cursor-not-allowed
          disabled:opacity-40
          disabled:hover:translate-x-0
          disabled:hover:shadow-sm
        "
      >
        →
      </button>

      <style>{`
        @keyframes paginationShine {
          0% {
            transform: translateX(-120%);
          }
          100% {
            transform: translateX(120%);
          }
        }
      `}</style>
    </div>
  );
};

export default Pagination;