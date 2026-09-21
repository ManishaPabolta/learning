import { useState } from "react";

import {
  BookOpen,
  Sparkles,
  RefreshCw,
} from "lucide-react";

import { motion } from "framer-motion";

import useAI from "../../hooks/useAI";
import AIRecommendationCard from "../../components/ai/AIRecommendationCard";
import AIThinking from "../../components/ai/AIThinking";

export default function AIRecommendations() {
  const [recommendations, setRecommendations] =
    useState([]);

  const { recommendations: getRecommendations, loading, error } =
    useAI();

  const loadRecommendations = async () => {
    try {
      /*
       * Later we can replace these arrays with your
       * actual MongoDB/student data.
       */

      const result = await getRecommendations({
        studentProfile: {
          level: "Beginner",
          interests: [
            "JavaScript",
            "Web Development",
          ],
        },

        enrolledCourses: [],

        completedCourses: [],

        availableCourses: [
          {
            title: "JavaScript",
            description:
              "Learn JavaScript from basics to advanced concepts.",
          },
          {
            title: "React",
            description:
              "Build modern frontend applications with React.",
          },
          {
            title: "Node.js",
            description:
              "Learn backend development using Node.js.",
          },
          {
            title: "MongoDB",
            description:
              "Learn NoSQL database development.",
          },
        ],

        performance: {},
      });

      /*
       * Backend currently returns AI text.
       * We keep it as one result until we create
       * structured JSON recommendations.
       */

      const text =
        result?.data?.recommendations || "";

      setRecommendations([
        {
          course: "AI Course Recommendations",
          reason: text,
          priority: "AI",
        },
      ]);
    } catch {
      setRecommendations([]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
                <Sparkles className="h-4 w-4" />
                Personalized Learning
              </div>

              <h1 className="text-3xl font-black text-slate-900 sm:text-4xl">
                Recommended Courses
              </h1>

              <p className="mt-3 max-w-2xl text-slate-500">
                Discover courses based on your learning interests
                and progress.
              </p>
            </div>

            <button
              type="button"
              onClick={loadRecommendations}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 px-5 py-3 font-bold text-white shadow-lg shadow-emerald-200 disabled:opacity-50"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  loading ? "animate-spin" : ""
                }`}
              />

              Generate
            </button>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
              <BookOpen className="h-6 w-6 text-emerald-600" />

              <p className="mt-4 text-sm text-slate-500">
                Available learning paths
              </p>
            </div>

            <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
              <Sparkles className="h-6 w-6 text-emerald-600" />

              <p className="mt-4 text-sm text-slate-500">
                AI personalized suggestions
              </p>
            </div>
          </div>

          <div className="mt-8">
            {loading && (
              <AIThinking text="Analyzing your learning path..." />
            )}

            {error && (
              <div className="mb-5 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
                {error}
              </div>
            )}

            {!loading && recommendations.length === 0 && (
              <div className="rounded-3xl border border-dashed border-emerald-200 bg-white p-12 text-center">
                <Sparkles className="mx-auto h-10 w-10 text-emerald-400" />

                <h3 className="mt-4 font-bold text-slate-900">
                  Generate your recommendations
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Click Generate to let AI analyze your learning path.
                </p>
              </div>
            )}

            <div className="grid gap-5 md:grid-cols-2">
              {recommendations.map((item, index) => (
                <AIRecommendationCard
                  key={index}
                  course={item.course}
                  reason={item.reason}
                  priority={item.priority}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}