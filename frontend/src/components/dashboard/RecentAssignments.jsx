import React from "react";
import {
  FileText,
  ExternalLink,
} from "lucide-react";

const RecentAssignments = ({
  assignments = [],
}) => {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-emerald-100 bg-white p-5 shadow-[0_10px_35px_rgba(16,185,129,0.07)] transition-all duration-500 hover:shadow-[0_18px_45px_rgba(16,185,129,0.12)] sm:p-6">

      {/* Decorative glow */}
      <div className="pointer-events-none absolute -left-20 -top-20 h-44 w-44 rounded-full bg-green-100/60 blur-3xl" />

      <div className="relative">

        <div className="mb-5">
          <h2 className="font-black text-slate-800">
            Recent Assignments
          </h2>

          <p className="mt-1 text-xs font-medium text-slate-400">
            Your latest submissions
          </p>
        </div>

        <div className="space-y-3">

          {assignments.length > 0 ? (
            assignments.slice(0, 5).map((assignment, index) => (
              <div
                key={assignment._id}
                style={{
                  animationDelay: `${index * 70}ms`,
                }}
                className="
                  group/item flex items-center gap-4
                  rounded-2xl border border-emerald-100
                  bg-emerald-50/30 p-3
                  transition-all duration-300
                  animate-[assignmentItem_0.5s_ease-out_both]
                  hover:-translate-y-0.5
                  hover:border-emerald-200
                  hover:bg-white
                  hover:shadow-md
                "
              >

                <div className="
                  flex h-11 w-11 shrink-0
                  items-center justify-center
                  rounded-xl
                  bg-emerald-50
                  text-emerald-600
                  shadow-sm
                  transition-all duration-300
                  group-hover/item:scale-105
                  group-hover/item:rotate-3
                ">
                  <FileText size={19} />
                </div>

                <div className="min-w-0 flex-1">

                  <h3 className="truncate text-sm font-bold text-slate-700 transition-colors group-hover/item:text-emerald-700">
                    {assignment.originalName ||
                      "Assignment"}
                  </h3>

                  <p className="mt-1 truncate text-xs font-medium text-slate-400">
                    {assignment.course?.title ||
                      "Course"}
                  </p>

                </div>

                {assignment.fileUrl && (
                  <a
                    href={assignment.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="
                      group/link rounded-xl
                      border border-emerald-100
                      bg-white p-2
                      text-slate-400
                      shadow-sm
                      transition-all duration-300
                      hover:border-emerald-200
                      hover:bg-emerald-50
                      hover:text-emerald-600
                    "
                  >
                    <ExternalLink
                      size={16}
                      className="transition-transform duration-300 group-hover/link:scale-110 group-hover/link:rotate-6"
                    />
                  </a>
                )}

              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/30 py-10 text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-emerald-500 shadow-sm">
                <FileText size={30} />
              </div>

              <p className="mt-3 text-sm font-semibold text-slate-500">
                No assignments submitted
              </p>

            </div>
          )}

        </div>

      </div>

      <style>{`
        @keyframes assignmentItem {
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

export default RecentAssignments;