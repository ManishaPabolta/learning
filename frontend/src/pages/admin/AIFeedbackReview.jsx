import { useState } from "react";

import {
  FileCheck2,
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  ClipboardCheck,
  MessageSquareText,
} from "lucide-react";

import { motion } from "framer-motion";

import useAI from "../../hooks/useAI";
import AIButton from "../../components/ai/AIButton";
import AIFeedbackCard from "../../components/ai/AIFeedbackCard";

export default function AIFeedbackReview() {
  const [form, setForm] = useState({
    assignmentTitle: "",
    assignmentDescription: "",
    requirements: "",
    studentSubmission: "",
  });

  const [feedback, setFeedback] = useState("");
  const [copied, setCopied] = useState(false);

  const {
    generateFeedback,
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

    if (!form.studentSubmission.trim()) return;

    try {
      const response = await generateFeedback(form);

      setFeedback(
        response?.data?.feedback || ""
      );
    } catch {
      setFeedback("");
    }
  };

  const handleCopy = async () => {
    if (!feedback) return;

    try {
      await navigator.clipboard.writeText(feedback);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  const handleClear = () => {
    setFeedback("");
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
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                <Sparkles className="h-3.5 w-3.5" />
                AI ASSIGNMENT REVIEW
              </div>

              <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                AI Feedback Review
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Analyze student submissions and generate educational feedback.
              </p>
            </div>

            {feedback && (
              <button
                type="button"
                onClick={handleClear}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
              >
                <RotateCcw className="h-4 w-4" />
                Clear Review
              </button>
            )}

          </div>
        </motion.div>


        {/* =====================================================
            MAIN CONTENT
        ====================================================== */}
        <div className="grid min-h-0 flex-1 gap-5 lg:grid-cols-[400px_minmax(0,1fr)]">


          {/* ===================================================
              LEFT - SUBMISSION FORM
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
                  <FileCheck2 className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="font-bold text-slate-900">
                    Submission Details
                  </h2>

                  <p className="text-xs text-slate-500">
                    Provide assignment information
                  </p>
                </div>

              </div>
            </div>


            {/* FORM BODY */}
            <div className="min-h-0 flex-1 overflow-y-auto p-5">

              <div className="space-y-5">

                {/* ASSIGNMENT TITLE */}
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Assignment Title
                  </label>

                  <input
                    name="assignmentTitle"
                    value={form.assignmentTitle}
                    onChange={handleChange}
                    placeholder="e.g. JavaScript Array Assignment"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                  />
                </div>


                {/* DESCRIPTION */}
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Assignment Description
                  </label>

                  <textarea
                    name="assignmentDescription"
                    value={form.assignmentDescription}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Describe what the student was asked to do..."
                    className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                  />
                </div>


                {/* REQUIREMENTS */}
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Assignment Requirements
                  </label>

                  <textarea
                    name="requirements"
                    value={form.requirements}
                    onChange={handleChange}
                    rows={4}
                    placeholder="List the requirements the student must satisfy..."
                    className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                  />
                </div>


                {/* STUDENT SUBMISSION */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="block text-sm font-bold text-slate-700">
                      Student Submission
                    </label>

                    <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                      Code / Text
                    </span>
                  </div>

                  <textarea
                    name="studentSubmission"
                    value={form.studentSubmission}
                    onChange={handleChange}
                    rows={10}
                    placeholder="Paste student's code, answer, or submission here..."
                    className="w-full resize-none rounded-xl border border-slate-200 bg-slate-950 px-4 py-4 font-mono text-xs leading-6 text-emerald-100 outline-none transition placeholder:text-slate-500 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  />

                  <p className="mt-1.5 text-xs text-slate-400">
                    AI will compare the submission with the assignment requirements.
                  </p>
                </div>


                {/* AI ANALYSIS INFO */}
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">

                  <div className="flex gap-3">

                    <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />

                    <div>

                      <p className="text-sm font-bold text-emerald-800">
                        AI will analyze
                      </p>

                      <ul className="mt-2 space-y-1 text-xs leading-5 text-emerald-700">
                        <li>• Strengths in the submission</li>
                        <li>• Errors and issues</li>
                        <li>• Missing requirements</li>
                        <li>• Improvement suggestions</li>
                        <li>• Suggested score</li>
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
                disabled={!form.studentSubmission.trim()}
              >
                {loading
                  ? "Analyzing Submission..."
                  : "Generate AI Feedback"}
              </AIButton>

            </div>

          </motion.form>


          {/* ===================================================
              RIGHT - AI FEEDBACK
          ==================================================== */}
          <motion.div
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35 }}
            className="flex min-h-0 flex-col overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-xl shadow-emerald-100/30"
          >

            {/* FEEDBACK HEADER */}
            <div className="flex shrink-0 items-center justify-between border-b border-slate-100 bg-gradient-to-r from-white to-emerald-50/50 px-5 py-4">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <ClipboardCheck className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="font-bold text-slate-900">
                    AI Feedback
                  </h2>

                  <p className="text-xs text-slate-500">
                    Educational review of the submission
                  </p>
                </div>

              </div>


              {/* COPY BUTTON */}
              {feedback && (
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
                FEEDBACK SCROLL AREA
            ================================================== */}
            <div className="min-h-0 flex-1 overflow-y-auto p-5">

              {feedback ? (

                <div className="space-y-4">

                  {/* AI SUMMARY CARD */}
                  <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-5">

                    <div className="flex items-center gap-3">

                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
                        <Sparkles className="h-5 w-5 text-emerald-600" />
                      </div>

                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                          AI Analysis Complete
                        </p>

                        <p className="text-sm font-semibold text-slate-800">
                          Review the feedback below
                        </p>
                      </div>

                    </div>

                  </div>


                  {/* ACTUAL FEEDBACK */}
                  <div className="rounded-2xl border border-slate-200 bg-white">

                    <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-4">

                      <MessageSquareText className="h-5 w-5 text-emerald-600" />

                      <h3 className="font-bold text-slate-900">
                        Detailed Feedback
                      </h3>

                    </div>

                    <div className="p-5">
                      <AIFeedbackCard
                        feedback={feedback}
                      />
                    </div>

                  </div>


                  {/* ADMIN NOTE */}
                  <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">

                    <div className="flex gap-3">

                      <span className="text-base">
                        ⚠️
                      </span>

                      <div>

                        <p className="text-xs font-bold text-amber-800">
                          Administrator Review Required
                        </p>

                        <p className="mt-1 text-xs leading-5 text-amber-700">
                          AI feedback is a recommendation only.
                          The administrator should review the
                          submission and make the final evaluation.
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

                      <FileCheck2 className="h-9 w-9 text-emerald-500" />

                    </div>

                    <h3 className="mt-5 text-lg font-bold text-slate-800">
                      AI feedback will appear here
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Add the assignment details and paste the
                      student's submission, then click{" "}
                      <span className="font-semibold text-emerald-600">
                        Generate AI Feedback
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