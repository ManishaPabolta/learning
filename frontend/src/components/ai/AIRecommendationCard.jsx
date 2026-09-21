import {
  ArrowRight,
  BookOpen,
  Sparkles,
} from "lucide-react";

import { motion } from "framer-motion";

export default function AIRecommendationCard({
  course,
  reason,
  priority = "Medium",
  onClick,
}) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="group relative overflow-hidden rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm transition-all hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-100/40"
    >
      <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-emerald-100/60 blur-2xl" />

      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <BookOpen className="h-6 w-6" />
          </div>

          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            {priority}
          </span>
        </div>

        <h3 className="mt-5 text-lg font-bold text-slate-900">
          {course}
        </h3>

        <div className="mt-3 flex gap-2">
          <Sparkles className="mt-1 h-4 w-4 shrink-0 text-emerald-500" />

          <p className="text-sm leading-6 text-slate-500">
            {reason}
          </p>
        </div>

        {onClick && (
          <button
            type="button"
            onClick={onClick}
            className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-emerald-600 transition hover:text-emerald-700"
          >
            View Course
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </button>
        )}
      </div>
    </motion.div>
  );
}