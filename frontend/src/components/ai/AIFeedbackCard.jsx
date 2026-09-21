import {
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Sparkles,
} from "lucide-react";

import { motion } from "framer-motion";

export default function AIFeedbackCard({
  feedback,
}) {
  if (!feedback) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-lg shadow-emerald-100/30"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
          <Sparkles className="h-5 w-5" />
        </div>

        <div>
          <h3 className="font-bold text-slate-900">
            AI Assignment Feedback
          </h3>

          <p className="text-xs text-slate-500">
            Review this feedback before applying it.
          </p>
        </div>
      </div>

      <div className="mt-6 whitespace-pre-wrap rounded-2xl bg-slate-50 p-5 text-sm leading-7 text-slate-700">
        {feedback}
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />

          <p className="mt-2 text-xs font-semibold text-emerald-700">
            Strengths
          </p>
        </div>

        <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">
          <AlertTriangle className="h-5 w-5 text-amber-600" />

          <p className="mt-2 text-xs font-semibold text-amber-700">
            Issues
          </p>
        </div>

        <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
          <Lightbulb className="h-5 w-5 text-blue-600" />

          <p className="mt-2 text-xs font-semibold text-blue-700">
            Suggestions
          </p>
        </div>
      </div>
    </motion.div>
  );
}