import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  ExternalLink,
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  RefreshCw,
  MessageSquare,
} from "lucide-react";

import api from "../../services/api";

const ManageSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const [search, setSearch] = useState("");

  const [feedbacks, setFeedbacks] = useState({});

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==========================================
  // GET ALL SUBMISSIONS
  // ==========================================
  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/assignments");

      console.log(
        "ALL SUBMISSIONS:",
        response.data
      );

      const data = response.data;

      setSubmissions(
        Array.isArray(data?.assignments)
          ? data.assignments
          : []
      );
    } catch (error) {
      console.error(
        "FETCH SUBMISSIONS ERROR:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load submissions."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  // ==========================================
  // APPROVE
  // ==========================================
  const handleApprove = async (id) => {
    try {
      setProcessingId(id);
      setError("");
      setSuccess("");

      const feedback =
        feedbacks[id] || "Assignment approved";

      await api.patch(
        `/assignments/${id}/approve`,
        {
          feedback,
        }
      );

      setSuccess(
        "Assignment approved successfully."
      );

      await fetchSubmissions();
    } catch (error) {
      console.error(
        "APPROVE ERROR:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to approve assignment."
      );
    } finally {
      setProcessingId(null);
    }
  };

  // ==========================================
  // REJECT
  // ==========================================
  const handleReject = async (id) => {
    const feedback =
      feedbacks[id]?.trim();

    if (!feedback) {
      setError(
        "Please enter feedback before rejecting."
      );
      return;
    }

    try {
      setProcessingId(id);
      setError("");
      setSuccess("");

      await api.patch(
        `/assignments/${id}/reject`,
        {
          feedback,
        }
      );

      setSuccess(
        "Assignment rejected successfully."
      );

      await fetchSubmissions();
    } catch (error) {
      console.error(
        "REJECT ERROR:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to reject assignment."
      );
    } finally {
      setProcessingId(null);
    }
  };

  // ==========================================
  // SEARCH
  // ==========================================
  const filteredSubmissions =
    submissions.filter((submission) => {
      const studentName =
        submission.student?.name || "";

      const studentEmail =
        submission.student?.email || "";

      const courseTitle =
        submission.course?.title || "";

      const fileName =
        submission.originalName || "";

      const searchText = search
        .toLowerCase()
        .trim();

      return (
        studentName
          .toLowerCase()
          .includes(searchText) ||
        studentEmail
          .toLowerCase()
          .includes(searchText) ||
        courseTitle
          .toLowerCase()
          .includes(searchText) ||
        fileName
          .toLowerCase()
          .includes(searchText)
      );
    });

  // ==========================================
  // STATUS
  // ==========================================
  const getStatus = (status) => {
    if (status === "approved") {
      return {
        label: "Approved",
        icon: CheckCircle,
        className:
          "bg-emerald-50 text-emerald-700 border-emerald-200",
      };
    }

    if (status === "rejected") {
      return {
        label: "Rejected",
        icon: XCircle,
        className:
          "bg-red-50 text-red-600 border-red-200",
      };
    }

    return {
      label: "Pending",
      icon: Clock,
      className:
        "bg-amber-50 text-amber-700 border-amber-200",
    };
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-green-50 px-5 py-10 text-slate-900">

      {/* ==========================================
          AMBIENT BACKGROUND
      ========================================== */}

      <div className="pointer-events-none absolute -left-40 top-10 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />

      <div className="pointer-events-none absolute -right-40 top-[35%] h-96 w-96 rounded-full bg-green-400/10 blur-3xl" />

      <div className="pointer-events-none absolute bottom-[-180px] left-[35%] h-[30rem] w-[30rem] rounded-full bg-lime-300/10 blur-3xl" />

      {/* Floating Particles */}

      <motion.div
        animate={{
          y: [0, -14, 0],
          opacity: [0.2, 0.55, 0.2],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute left-[9%] top-32 h-2 w-2 rounded-full bg-emerald-500"
      />

      <motion.div
        animate={{
          y: [0, 12, 0],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute right-[14%] top-48 h-2.5 w-2.5 rounded-full bg-green-400"
      />

      <motion.div
        animate={{
          y: [0, -10, 0],
          opacity: [0.2, 0.45, 0.2],
        }}
        transition={{
          duration: 4.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute bottom-40 left-[18%] h-2 w-2 rounded-full bg-lime-400"
      />

      <div className="relative mx-auto max-w-7xl">

        {/* ==========================================
            HEADER
        ========================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: -20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"
        >

          <div>

            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-3 py-1.5 text-xs font-bold text-emerald-700 shadow-sm backdrop-blur">

              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />

              Administration

            </div>

            <h1 className="bg-gradient-to-r from-emerald-700 via-green-600 to-lime-500 bg-clip-text text-4xl font-black tracking-tight text-transparent">

              Manage Submissions

            </h1>

            <p className="mt-3 text-slate-500">

              Review student assignments and approve or reject them.

            </p>

          </div>

          <motion.button
            onClick={fetchSubmissions}
            disabled={loading}
            whileHover={{
              y: -2,
            }}
            whileTap={{
              scale: 0.97,
            }}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-emerald-200 bg-white px-5 py-3 font-bold text-emerald-700 shadow-sm shadow-emerald-900/5 transition hover:border-emerald-300 hover:bg-emerald-50 hover:shadow-lg hover:shadow-emerald-900/10 disabled:opacity-50 lg:self-auto"
          >

            <RefreshCw
              className={`h-4 w-4 ${
                loading ? "animate-spin" : ""
              }`}
            />

            Refresh

          </motion.button>

        </motion.div>


        {/* ==========================================
            SEARCH
        ========================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.1,
          }}
          className="group relative mt-8"
        >

          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 transition group-focus-within:text-emerald-600" />

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search student, email, course or file..."
            className="w-full rounded-2xl border border-emerald-100 bg-white/90 py-4 pl-12 pr-5 text-slate-800 shadow-sm outline-none backdrop-blur transition duration-300 placeholder:text-slate-400 hover:border-emerald-200 focus:border-emerald-400 focus:shadow-lg focus:shadow-emerald-900/10"
          />

          <div className="pointer-events-none absolute bottom-0 left-4 right-4 h-0.5 origin-left scale-x-0 rounded-full bg-gradient-to-r from-emerald-500 to-lime-400 transition-transform duration-300 group-focus-within:scale-x-100" />

        </motion.div>


        {/* ==========================================
            SUCCESS
        ========================================== */}

        {success && (
          <motion.div
            initial={{
              opacity: 0,
              y: -10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="mt-6 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 font-medium text-emerald-700 shadow-sm"
          >

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100">

              <CheckCircle className="h-5 w-5" />

            </div>

            {success}

          </motion.div>
        )}


        {/* ==========================================
            ERROR
        ========================================== */}

        {error && (
          <motion.div
            initial={{
              opacity: 0,
              y: -10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="mt-6 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 font-medium text-red-600 shadow-sm"
          >

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-100">

              <XCircle className="h-5 w-5" />

            </div>

            {error}

          </motion.div>
        )}


        {/* ==========================================
            LOADING
        ========================================== */}

        {loading ? (
          <div className="relative flex min-h-[400px] items-center justify-center">

            <div className="flex flex-col items-center gap-4">

              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-100 bg-white shadow-xl shadow-emerald-900/10">

                <div className="absolute inset-0 rounded-2xl bg-emerald-400/10 blur-md" />

                <Loader2 className="relative h-9 w-9 animate-spin text-emerald-600" />

              </div>

              <p className="text-sm font-semibold text-slate-500">
                Loading submissions...
              </p>

            </div>

          </div>

        ) : filteredSubmissions.length === 0 ? (

          /* ==========================================
              EMPTY
          ========================================== */

          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="relative mt-10 overflow-hidden rounded-3xl border border-emerald-100 bg-white/90 px-6 py-20 text-center shadow-xl shadow-emerald-900/5 backdrop-blur-xl"
          >

            <div className="pointer-events-none absolute left-1/2 top-0 h-32 w-64 -translate-x-1/2 rounded-full bg-emerald-400/10 blur-3xl" />

            <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50">

              <FileText className="h-8 w-8 text-emerald-600" />

            </div>

            <h2 className="relative mt-5 text-xl font-black text-slate-800">

              No submissions found

            </h2>

            <p className="relative mt-2 text-slate-500">

              Student submissions will appear here.

            </p>

          </motion.div>

        ) : (

          /* ==========================================
              LIST
          ========================================== */

          <div className="mt-8 space-y-5">

            {filteredSubmissions.map(
              (submission, index) => {

                const status = getStatus(
                  submission.status
                );

                const StatusIcon = status.icon;

                const id =
                  submission._id ||
                  submission.id;

                const isProcessing =
                  processingId === id;

                return (
                  <motion.div
                    key={id}
                    initial={{
                      opacity: 0,
                      y: 20,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay: index * 0.05,
                    }}
                    whileHover={{
                      y: -3,
                    }}
                    className="group relative overflow-hidden rounded-3xl border border-emerald-100 bg-white/90 p-6 shadow-xl shadow-emerald-900/5 backdrop-blur-xl transition-shadow duration-300 hover:shadow-2xl hover:shadow-emerald-900/10"
                  >

                    {/* Card Top Accent */}

                    <div className="absolute left-0 right-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-emerald-600 via-green-500 to-lime-400 transition-transform duration-500 group-hover:scale-x-100" />

                    {/* ==================================
                        TOP
                    ================================== */}

                    <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">

                      {/* STUDENT */}

                      <div className="flex gap-4">

                        <motion.div
                          whileHover={{
                            scale: 1.06,
                            rotate: 2,
                          }}
                          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-100 to-green-50 shadow-inner"
                        >

                          <FileText className="h-6 w-6 text-emerald-600" />

                        </motion.div>

                        <div>

                          <h2 className="text-lg font-black text-slate-800 transition group-hover:text-emerald-700">

                            {submission.student?.name ||
                              "Unknown Student"}

                          </h2>

                          <p className="mt-1 text-sm text-slate-500">

                            {submission.student?.email ||
                              "No email"}

                          </p>

                          <p className="mt-2 text-sm text-slate-500">

                            Course:{" "}

                            <span className="font-bold text-slate-700">

                              {submission.course?.title ||
                                "Unknown Course"}

                            </span>

                          </p>

                        </div>

                      </div>


                      {/* STATUS */}

                      <div
                        className={`inline-flex items-center gap-2 self-start rounded-xl border px-4 py-2 text-sm font-bold ${status.className}`}
                      >

                        <StatusIcon className="h-4 w-4" />

                        {status.label}

                      </div>

                    </div>


                   {/* ==================================
    FILE
================================== */}

<div className="mt-6 rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50/80 to-green-50/50 p-5">

  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

    {/* File Information */}
    <div className="min-w-0">

      <p className="text-sm font-semibold text-emerald-600">
        Submitted File
      </p>

      <p className="mt-1 truncate font-bold text-slate-800">
        {submission.originalName || "Assignment file"}
      </p>

      <p className="mt-1 text-xs text-slate-400">
        {submission.createdAt
          ? new Date(submission.createdAt).toLocaleString()
          : ""}
      </p>

    </div>

   {submission.fileUrl && (
  <motion.a
    whileHover={{ y: -2 }}
    whileTap={{ scale: 0.97 }}
    href={submission.fileUrl}
    target="_blank"
    rel="noreferrer"
    className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-slate-900 to-slate-700 px-5 py-3 text-sm font-bold !text-white shadow-lg shadow-slate-900/20 transition-all duration-300 hover:from-slate-800 hover:to-slate-600 hover:shadow-xl hover:shadow-slate-900/25"
  >
    <span className="!text-white">
      View Fil
    </span>

    <ExternalLink className="h-4 w-4 !text-white" />
  </motion.a>
)}

  </div>

</div>


                    {/* ==================================
                        FEEDBACK
                    ================================== */}

                    <div className="mt-5">

                      <label className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700">

                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50">

                          <MessageSquare className="h-4 w-4 text-emerald-600" />

                        </span>

                        Feedback

                      </label>

                      <textarea
                        value={
                          feedbacks[id] ??
                          submission.feedback ??
                          ""
                        }
                        onChange={(e) =>
                          setFeedbacks((prev) => ({
                            ...prev,
                            [id]:
                              e.target.value,
                          }))
                        }
                        placeholder="Write feedback for the student..."
                        rows={3}
                        className="w-full resize-none rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-emerald-200 focus:border-emerald-400 focus:shadow-lg focus:shadow-emerald-900/10"
                      />

                    </div>


                    {/* ==================================
                        ACTIONS
                    ================================== */}

                    <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">

                      <motion.button
                        onClick={() =>
                          handleReject(id)
                        }
                        disabled={
                          isProcessing ||
                          submission.status ===
                            "rejected"
                        }
                        whileHover={{
                          y: -2,
                        }}
                        whileTap={{
                          scale: 0.97,
                        }}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-bold text-red-600 transition hover:border-red-300 hover:bg-red-100 hover:shadow-md hover:shadow-red-900/10 disabled:cursor-not-allowed disabled:opacity-40"
                      >

                        {isProcessing ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <XCircle className="h-4 w-4" />
                        )}

                        Reject

                      </motion.button>


                      <motion.button
                        onClick={() =>
                          handleApprove(id)
                        }
                        disabled={
                          isProcessing ||
                          submission.status ===
                            "approved"
                        }
                        whileHover={{
                          y: -2,
                        }}
                        whileTap={{
                          scale: 0.97,
                        }}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-900/15 transition hover:from-emerald-700 hover:to-green-600 disabled:cursor-not-allowed disabled:opacity-40"
                      >

                        {isProcessing ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <CheckCircle className="h-4 w-4" />
                        )}

                        Approve

                      </motion.button>

                    </div>

                  </motion.div>
                );
              }
            )}

          </div>
        )}
      </div>
    </div>
  );
};

export default ManageSubmissions;