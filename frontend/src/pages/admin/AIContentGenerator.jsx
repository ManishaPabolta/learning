import { useState } from "react";

import {
  Sparkles,
  FileText,
  WandSparkles,
  Copy,
  Check,
  RotateCcw,
  BookOpen,
  GraduationCap,
  Clock,
} from "lucide-react";

import { motion } from "framer-motion";

import useAI from "../../hooks/useAI";
import AIButton from "../../components/ai/AIButton";
import AIFormattedOutput from "../../components/ai/AIFormattedOutput";
export default function AIContentGenerator() {
  const [form, setForm] = useState({
    topic: "",
    difficulty: "Beginner",
    audience: "Students",
    duration: "",
  });

  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);

  const {
    generateCourse,
    loading,
    error,
  } = useAI();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleGenerate = async (e) => {
    e.preventDefault();

    if (!form.topic.trim()) return;

    try {
      const response = await generateCourse(form);

      setResult(
        response?.data?.course || ""
      );
    } catch {
      setResult("");
    }
  };

  const handleCopy = async () => {
    if (!result) return;

    try {
      await navigator.clipboard.writeText(result);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  const handleClear = () => {
    setResult("");
    setCopied(false);
  };

  return (
    <div className="h-[calc(100vh-80px)] overflow-hidden bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto flex h-full max-w-7xl flex-col">

        {/* =====================================================
            PAGE HEADER
        ====================================================== */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-5 shrink-0"
        >
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">

            <div>
              {/* Badge */}
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                <Sparkles className="h-3.5 w-3.5" />
                ADMIN AI TOOLS
              </div>

              <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                AI Course Content Generator
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Generate complete course drafts with the help of AI.
              </p>
            </div>

            {/* Clear */}
           <AIFormattedOutput content={result && (
              <button
                type="button"
                onClick={handleClear}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
              >
                <RotateCcw className="h-4 w-4" />
                Clear Result
              </button>
            )} />
          </div>
        </motion.div>


        {/* =====================================================
            MAIN CONTENT
        ====================================================== */}
        <div className="grid min-h-0 flex-1 gap-5 lg:grid-cols-[360px_minmax(0,1fr)]">


          {/* ===================================================
              LEFT SIDE - COURSE FORM
          ==================================================== */}
          <motion.form
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35 }}
            onSubmit={handleGenerate}
            className="flex min-h-0 flex-col overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-xl shadow-emerald-100/30"
          >

            {/* FORM HEADER */}
            <div className="shrink-0 border-b border-slate-100 bg-gradient-to-r from-emerald-50 to-white p-5">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-md">
                  <WandSparkles className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="font-bold text-slate-900">
                    Course Details
                  </h2>

                  <p className="text-xs text-slate-500">
                    Configure your course
                  </p>
                </div>

              </div>
            </div>


            {/* FORM BODY */}
            <div className="min-h-0 flex-1 overflow-y-auto p-5">

              <div className="space-y-5">

                {/* TOPIC */}
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Course Topic
                  </label>

                  <div className="relative">

                    <BookOpen className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                    <input
                      name="topic"
                      value={form.topic}
                      onChange={handleChange}
                      placeholder="e.g. JavaScript"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                    />

                  </div>
                </div>


                {/* DIFFICULTY */}
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Difficulty Level
                  </label>

                  <select
                    name="difficulty"
                    value={form.difficulty}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </div>


                {/* AUDIENCE */}
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Target Audience
                  </label>

                  <div className="relative">

                    <GraduationCap className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                    <input
                      name="audience"
                      value={form.audience}
                      onChange={handleChange}
                      placeholder="e.g. Beginners"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                    />

                  </div>
                </div>


                {/* DURATION */}
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Course Duration
                  </label>

                  <div className="relative">

                    <Clock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                    <input
                      name="duration"
                      value={form.duration}
                      onChange={handleChange}
                      placeholder="e.g. 8 weeks"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                    />

                  </div>
                </div>


                {/* AI INFO */}
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">

                  <div className="flex gap-3">

                    <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />

                    <div>

                      <p className="text-sm font-bold text-emerald-800">
                        AI will generate
                      </p>

                      <ul className="mt-2 space-y-1 text-xs leading-5 text-emerald-700">
                        <li>• Course title</li>
                        <li>• Course description</li>
                        <li>• Learning objectives</li>
                        <li>• Course modules</li>
                        <li>• Topics for each module</li>
                      </ul>

                    </div>

                  </div>

                </div>

              </div>
            </div>


            {/* GENERATE BUTTON */}
            <div className="shrink-0 border-t border-slate-100 bg-white p-5">

              <AIButton
                type="submit"
                loading={loading}
                disabled={!form.topic.trim()}
              >
                {loading
                  ? "Generating..."
                  : "Generate Course"}
              </AIButton>

            </div>

          </motion.form>


          {/* ===================================================
              RIGHT SIDE - GENERATED COURSE
          ==================================================== */}
          <motion.div
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35 }}
            className="flex min-h-0 flex-col overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-xl shadow-emerald-100/30"
          >

            {/* RESULT HEADER */}
            <div className="flex shrink-0 items-center justify-between border-b border-slate-100 bg-gradient-to-r from-white to-emerald-50/50 px-5 py-4">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <FileText className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="font-bold text-slate-900">
                    Generated Course
                  </h2>

                  <p className="text-xs text-slate-500">
                    AI-generated course draft
                  </p>
                </div>

              </div>


              {/* COPY BUTTON */}
              {result && (
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 shadow-sm transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                >

                  {copied ? (
                    <>
                      <Check className="h-4 w-4 text-emerald-600" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy
                    </>
                  )}

                </button>
              )}

            </div>


            {/* ERROR */}
            {error && (
              <div className="mx-5 mt-4 shrink-0 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
                {error}
              </div>
            )}


            {/* =================================================
                RESULT SCROLL AREA
            ================================================== */}
            <div className="min-h-0 flex-1 overflow-y-auto p-5">

              {result ? (

                <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5">

                  {/* AI BADGE */}
                  <div className="mb-5 flex items-center justify-between border-b border-slate-200 pb-4">

                    <div className="flex items-center gap-2">

                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100">
                        <Sparkles className="h-4 w-4 text-emerald-600" />
                      </div>

                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                        AI Generated Course
                      </span>

                    </div>

                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-bold text-emerald-700">
                      DRAFT
                    </span>

                  </div>


                  {/* GENERATED CONTENT */}
                  <div className="whitespace-pre-wrap break-words text-sm leading-7 text-slate-700">
                    {result}
                  </div>


                  {/* REVIEW WARNING */}
                  <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4">

                    <div className="flex gap-3">

                      <span className="text-base">
                        ⚠️
                      </span>

                      <div>

                        <p className="text-xs font-bold text-amber-800">
                          Review before publishing
                        </p>

                        <p className="mt-1 text-xs leading-5 text-amber-700">
                          AI-generated course content should be
                          reviewed and edited by the administrator
                          before publishing it to students.
                        </p>

                      </div>

                    </div>

                  </div>

                </div>

              ) : (

                /* =================================================
                   EMPTY STATE
                ================================================== */
                <div className="flex h-full min-h-[300px] items-center justify-center">

                  <div className="max-w-md text-center">

                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-50 to-green-100 shadow-inner">

                      <Sparkles className="h-9 w-9 text-emerald-500" />

                    </div>

                    <h3 className="mt-5 text-lg font-bold text-slate-800">
                      Your course will appear here
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Enter a course topic and configure the
                      details, then click{" "}
                      <span className="font-semibold text-emerald-600">
                        Generate Course
                      </span>
                      .
                    </p>

                  </div>

                </div>

              )}

            </div>

          </motion.div>

        </div>
      </div>
    </div>
  );
}