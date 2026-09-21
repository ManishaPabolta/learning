import {
  Sparkles,
  Loader2,
} from "lucide-react";

export default function AIButton({
  children = "Ask AI",
  onClick,
  loading = false,
  type = "button",
  disabled = false,
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-200 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Sparkles className="h-4 w-4" />
      )}

      {loading ? "AI is working..." : children}
    </button>
  );
}