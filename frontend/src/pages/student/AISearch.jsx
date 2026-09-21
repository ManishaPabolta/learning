import { useState } from "react";

import {
  Search,
  Sparkles,
  BookOpen,
} from "lucide-react";

import { motion } from "framer-motion";

import useAI from "../../hooks/useAI";
import AIThinking from "../../components/ai/AIThinking";

export default function AISearch() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState("");

  const { search, loading, error } = useAI();

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!query.trim()) return;

    try {
      const response = await search({
        query,

        courses: [
          {
            title: "JavaScript",
            description:
              "Learn JavaScript from beginner to advanced.",
          },
          {
            title: "React",
            description:
              "Learn React and build modern web applications.",
          },
          {
            title: "Node.js",
            description:
              "Learn backend development using Node.js.",
          },
          {
            title: "MongoDB",
            description:
              "Learn MongoDB and database concepts.",
          },
        ],
      });

      setResult(
        response?.data?.results ||
          "No results found."
      );
    } catch {
      setResult("");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <Sparkles className="h-7 w-7" />
            </div>

            <h1 className="mt-5 text-3xl font-black text-slate-900 sm:text-4xl">
              AI Course Search
            </h1>

            <p className="mx-auto mt-3 max-w-xl text-slate-500">
              Search courses using natural language instead of
              exact keywords.
            </p>
          </div>

          <form
            onSubmit={handleSearch}
            className="mx-auto mt-8 max-w-3xl"
          >
            <div className="flex rounded-2xl border border-slate-200 bg-white p-2 shadow-lg shadow-slate-200/50">
              <div className="flex flex-1 items-center gap-3 px-3">
                <Search className="h-5 w-5 text-emerald-500" />

                <input
                  value={query}
                  onChange={(e) =>
                    setQuery(e.target.value)
                  }
                  placeholder="e.g. I want to learn frontend development"
                  className="w-full border-0 bg-transparent py-3 text-sm outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 px-5 py-3 font-bold text-white disabled:opacity-50"
              >
                Search
              </button>
            </div>
          </form>

          {error && (
            <div className="mx-auto mt-5 max-w-3xl rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="mx-auto mt-8 max-w-3xl">
            {loading && (
              <AIThinking text="Finding the most relevant courses..." />
            )}

            {!loading && result && (
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
                    <h2 className="font-bold text-slate-900">
                      AI Search Results
                    </h2>

                    <p className="text-xs text-slate-500">
                      Results based on your query
                    </p>
                  </div>
                </div>

                <div className="mt-5 whitespace-pre-wrap rounded-2xl bg-slate-50 p-5 text-sm leading-7 text-slate-700">
                  {result}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}