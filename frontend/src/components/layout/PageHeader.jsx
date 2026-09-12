import React from "react";
import { Link } from "react-router-dom";

const PageHeader = ({
  title,
  description,
  eyebrow,
  action,
  breadcrumbs = [],
}) => {
  return (
    <div className="relative mb-8 animate-[pageHeaderIn_500ms_ease-out]">

      {/* Subtle background glow */}
      <div
        className="
          pointer-events-none
          absolute
          -right-10
          -top-10
          h-28
          w-28
          rounded-full
          bg-emerald-100/40
          blur-3xl
        "
      />

      {/* Breadcrumb */}
      {breadcrumbs.length > 0 && (
        <div
          className="
            relative
            mb-5
            flex
            flex-wrap
            items-center
            gap-2
            text-xs
            font-medium
            text-slate-400
          "
        >
          {breadcrumbs.map((breadcrumb, index) => (
            <React.Fragment
              key={`${breadcrumb.label}-${index}`}
            >
              {index > 0 && (
                <span
                  className="
                    select-none
                    text-emerald-200
                  "
                >
                  /
                </span>
              )}

              {breadcrumb.path ? (
                <Link
                  to={breadcrumb.path}
                  className="
                    rounded-md
                    px-1
                    py-0.5
                    transition-all
                    duration-300
                    hover:bg-emerald-50
                    hover:text-emerald-600
                  "
                >
                  {breadcrumb.label}
                </Link>
              ) : (
                <span
                  className="
                    rounded-md
                    bg-emerald-50/70
                    px-2
                    py-0.5
                    font-semibold
                    text-emerald-700
                  "
                >
                  {breadcrumb.label}
                </span>
              )}
            </React.Fragment>
          ))}
        </div>
      )}

      <div
        className="
          relative
          flex
          flex-col
          gap-5
          sm:flex-row
          sm:items-end
          sm:justify-between
        "
      >
        {/* Heading */}
        <div className="min-w-0">

          {/* Eyebrow */}
          {eyebrow && (
            <div
              className="
                mb-3
                flex
                items-center
                gap-2.5
                animate-[fadeUp_450ms_ease-out]
              "
            >
              <span
                className="
                  relative
                  flex
                  h-2
                  w-2
                  items-center
                  justify-center
                "
              >
                <span
                  className="
                    absolute
                    h-2
                    w-2
                    rounded-full
                    bg-emerald-500
                    animate-ping
                    opacity-40
                  "
                />

                <span
                  className="
                    relative
                    h-1.5
                    w-1.5
                    rounded-full
                    bg-emerald-600
                  "
                />
              </span>

              <span
                className="
                  text-[11px]
                  font-extrabold
                  uppercase
                  tracking-[0.2em]
                  text-emerald-600
                "
              >
                {eyebrow}
              </span>
            </div>
          )}

          {/* Title */}
          <h1
            className="
              text-2xl
              font-extrabold
              tracking-tight
              text-slate-900
              sm:text-3xl
              animate-[fadeUp_500ms_ease-out]
            "
          >
            {title}
          </h1>

          {/* Description */}
          {description && (
            <p
              className="
                mt-2.5
                max-w-2xl
                text-sm
                leading-6
                text-slate-500
                sm:text-base
                animate-[fadeUp_600ms_ease-out]
              "
            >
              {description}
            </p>
          )}
        </div>

        {/* Action */}
        {action && (
          <div
            className="
              shrink-0
              animate-[actionIn_500ms_ease-out]
            "
          >
            {action}
          </div>
        )}
      </div>

      {/* Decorative Divider */}
      <div className="relative mt-6 h-px overflow-hidden bg-gradient-to-r from-emerald-100 via-slate-200 to-transparent">
        <div
          className="
            absolute
            left-0
            top-0
            h-px
            w-28
            bg-gradient-to-r
            from-emerald-500
            to-transparent
            animate-[headerLine_3s_ease-in-out_infinite]
          "
        />
      </div>

      <style>
        {`
          @keyframes pageHeaderIn {
            0% {
              opacity: 0;
              transform: translateY(10px);
            }

            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes fadeUp {
            0% {
              opacity: 0;
              transform: translateY(8px);
            }

            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes actionIn {
            0% {
              opacity: 0;
              transform: translateX(10px) scale(0.97);
            }

            100% {
              opacity: 1;
              transform: translateX(0) scale(1);
            }
          }

          @keyframes headerLine {
            0% {
              transform: translateX(-120%);
              opacity: 0;
            }

            20% {
              opacity: 1;
            }

            50% {
              transform: translateX(350%);
              opacity: 1;
            }

            80% {
              opacity: 0;
            }

            100% {
              transform: translateX(350%);
              opacity: 0;
            }
          }
        `}
      </style>
    </div>
  );
};

export default PageHeader;