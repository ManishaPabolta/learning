import { Loader2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function AIThinking({
  text = "AI is thinking...",
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-white px-4 py-3 shadow-sm"
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50">
        <Sparkles className="h-4 w-4 text-emerald-600" />
      </div>

      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />

        <span>{text}</span>
      </div>
    </motion.div>
  );
}