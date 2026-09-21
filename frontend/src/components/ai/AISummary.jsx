import {
  BookOpen,
  Sparkles,
} from "lucide-react";

import { motion } from "framer-motion";

export default function AISummary({
  summary,
}) {
  if (!summary) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-lg shadow-emerald-100/30"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
          <BookOpen className="h-5 w-5" />
        </div>

        <div>
          <h3 className="font-bold text-slate-900">
            AI Summary
          </h3>

          <div className="mt-0.5 flex items-center gap-1 text-xs text-emerald-600">
            <Sparkles className="h-3 w-3" />
            Quick revision
          </div>
        </div>
      </div>

      <div className="mt-5 whitespace-pre-wrap rounded-2xl bg-slate-50 p-5 text-sm leading-7 text-slate-700">
        {summary}
      </div>
    </motion.div>
  );
}