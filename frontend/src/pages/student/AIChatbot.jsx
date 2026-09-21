import {
  Bot,
  MessageCircle,
  Sparkles,
} from "lucide-react";

import { motion } from "framer-motion";

import AIChatbot from "../../components/ai/AIChatbot";

export default function AIChatbotPage() {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-8">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
              <Sparkles className="h-4 w-4" />
              AI Powered Learning
            </div>

            <h1 className="text-3xl font-black text-slate-900 sm:text-4xl">
              AI Learning Assistant
            </h1>

            <p className="mt-3 max-w-2xl text-slate-500">
              Ask questions about JavaScript, React, Node.js,
              MongoDB, courses, assignments, and other learning
              topics.
            </p>
          </div>

          <div className="mb-6 grid gap-4 sm:grid-cols-3">
            {[
              {
                icon: MessageCircle,
                title: "Ask Questions",
                text: "Get explanations anytime.",
              },
              {
                icon: Bot,
                title: "Learn Better",
                text: "Understand difficult concepts.",
              },
              {
                icon: Sparkles,
                title: "AI Powered",
                text: "Personalized learning help.",
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3 className="mt-4 font-bold text-slate-900">
                    {item.title}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>

          <AIChatbot />
        </motion.div>
      </div>
    </div>
  );
}