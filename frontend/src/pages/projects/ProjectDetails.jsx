import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  BarChart3,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Edit3,
  FileText,
  Folder,
  Loader2,
  Lock,
  MoreHorizontal,
  RefreshCw,
  ShieldCheck,
  Trash2,
  Users,
  XCircle,
  Eye,
  Globe,
} from "lucide-react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import projectService from "../../services/projectService";
import useAuth from "../../hooks/useAuth";

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const auth = useAuth();
  const user = auth?.user;

  // =========================================================
  // STATE
  // =========================================================

  const [project, setProject] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Admin review
  const [reviewStatus, setReviewStatus] = useState("");
  const [reviewText, setReviewText] = useState("");

  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState("");

  // Delete
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Refresh
  const [refreshing, setRefreshing] = useState(false);

  // =========================================================
  // LOAD PROJECT + MEMBERS
  // =========================================================

  const loadProject = async (showRefresh = false) => {
    if (!id) {
      setError("Project ID is missing.");
      setLoading(false);
      return;
    }

    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      /*
        IMPORTANT:

        We load BOTH:
        1. Project
        2. Members

        This makes sure that newly added members
        are visible on Project Details page.
      */

      const [projectResponse, membersResponse] =
        await Promise.all([
          projectService.getProject(id),
          projectService.getMembers(id),
        ]);

      // =====================================================
      // PROJECT RESPONSE
      // =====================================================

      const projectResponseData =
        projectResponse?.data ?? projectResponse;

      /*
        Support possible backend structures:

        {
          project: {...}
        }

        {
          data: {
            project: {...}
          }
        }

        {
          data: {...project}
        }

        {...project}
      */

      const projectData =
        projectResponseData?.project ||
        projectResponseData?.data?.project ||
        projectResponseData?.data ||
        projectResponseData;

      if (
        !projectData ||
        typeof projectData !== "object"
      ) {
        throw new Error("Project not found");
      }

      // =====================================================
      // MEMBERS RESPONSE
      // =====================================================

      const membersResponseData =
        membersResponse?.data ?? membersResponse;

      const membersData =
        membersResponseData?.members ||
        membersResponseData?.data?.members ||
        membersResponseData?.data ||
        [];

      const safeMembers =
        Array.isArray(membersData)
          ? membersData
          : [];

      // =====================================================
      // MERGE PROJECT + MEMBERS
      // =====================================================

      const mergedProject = {
        ...projectData,

        /*
          Always use the latest members response.

          If getProject already contains members,
          getMembers() is considered the latest truth.
        */
        members: safeMembers,
      };

      setProject(mergedProject);

      // =====================================================
      // ADMIN REVIEW DATA
      // =====================================================

      setReviewStatus(
        mergedProject?.moderationStatus || ""
      );

      setReviewText(
        mergedProject?.adminReview || ""
      );
    } catch (err) {
      console.error(
        "Project details error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load project"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    loadProject();
  }, [id]);

  // =========================================================
  // USER IDS
  // =========================================================

  const currentUserId =
    user?._id ||
    user?.id ||
    null;

  // =========================================================
  // OWNER
  // =========================================================

  const ownerId =
    project?.owner?._id ||
    project?.owner?.id ||
    project?.owner ||
    null;

  // =========================================================
  // ROLE
  // =========================================================

  const isAdmin =
    user?.role === "admin";

  const isUser =
    user?.role === "user" ||
    user?.role === "student";

  // =========================================================
  // OWNER CHECK
  // =========================================================

  const isOwner =
    Boolean(ownerId) &&
    Boolean(currentUserId) &&
    ownerId.toString() ===
      currentUserId.toString();

  // =========================================================
  // MEMBERS
  // =========================================================

  const projectMembers = useMemo(() => {
    if (!project) {
      return [];
    }

    if (Array.isArray(project.members)) {
      return project.members;
    }

    return [];
  }, [project]);

  // =========================================================
  // TOTAL MEMBERS
  // =========================================================

  const totalMembers = useMemo(() => {
    if (!project) {
      return 0;
    }

    const ids = new Set();

    // -------------------------------------------------------
    // ADD OWNER
    // -------------------------------------------------------

    if (ownerId) {
      ids.add(ownerId.toString());
    }

    // -------------------------------------------------------
    // ADD MEMBERS
    // -------------------------------------------------------

    projectMembers.forEach((member) => {
      const memberId =
        member?._id ||
        member?.id ||
        member;

      if (memberId) {
        ids.add(memberId.toString());
      }
    });

    return ids.size;
  }, [
    project,
    projectMembers,
    ownerId,
  ]);

  // =========================================================
  // PERMISSIONS
  // =========================================================

  /*
    USER/STUDENT + OWNER
      -> Edit
      -> Delete
      -> Manage Members

    ADMIN
      -> View
      -> Review public project

    NORMAL MEMBER
      -> View
  */

  const canEdit =
    isUser &&
    isOwner;

  const canDelete =
    isUser &&
    isOwner;

  const canManageMembers =
    isUser &&
    isOwner;

  const canReview =
    isAdmin &&
    project?.visibility === "public";

  // =========================================================
  // PROJECT STATUS
  // =========================================================

  const visibility =
    project?.visibility ||
    "private";

  const moderationStatus =
    project?.moderationStatus ||
    "pending";

  const isPublic =
    visibility === "public";

  const isApproved =
    moderationStatus === "approved";

  const isRejected =
    moderationStatus === "rejected";

  const isPending =
    moderationStatus === "pending";

  // =========================================================
  // OWNER DISPLAY
  // =========================================================

  const ownerName =
    project?.owner?.name ||
    project?.owner?.username ||
    project?.owner?.fullName ||
    project?.owner?.email ||
    "Unknown User";

  const ownerEmail =
    project?.owner?.email ||
    "";

  // =========================================================
  // DELETE PROJECT
  // =========================================================

  const handleDeleteProject = async () => {
    if (!canDelete || !id) {
      return;
    }

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this project? This action cannot be undone."
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeleteLoading(true);
      setError("");

      await projectService.deleteProject(id);

      navigate("/projects", {
        replace: true,
      });
    } catch (err) {
      console.error(
        "Delete project error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Failed to delete project"
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  // =========================================================
  // ADMIN REVIEW
  // =========================================================

  const handleReview = async (status) => {
    if (!canReview || !id) {
      return;
    }

    try {
      setReviewLoading(true);
      setReviewError("");
      setReviewSuccess("");

      await projectService.reviewProject(
        id,
        status,
        reviewText
      );

      setProject((previous) => ({
        ...previous,
        moderationStatus: status,
        adminReview: reviewText,
      }));

      setReviewStatus(status);

      setReviewSuccess(
        status === "approved"
          ? "Project approved successfully."
          : "Project rejected successfully."
      );
    } catch (err) {
      console.error(
        "Review project error:",
        err
      );

      setReviewError(
        err?.response?.data?.message ||
          "Failed to review project"
      );
    } finally {
      setReviewLoading(false);
    }
  };

  // =========================================================
  // NAVIGATION
  // =========================================================

  const goToMembers = () => {
    if (!id) {
      return;
    }

    navigate(`/projects/${id}/members`);
  };

  const goToAnalytics = () => {
    if (!id) {
      return;
    }

    navigate(`/projects/${id}/analytics`);
  };

  const goToNotes = () => {
    if (!id) {
      return;
    }

    navigate(`/projects/${id}/notes`);
  };

  const goToFiles = () => {
    if (!id) {
      return;
    }

    navigate(`/projects/${id}/files`);
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <Loader2
            size={42}
            className="mx-auto animate-spin text-emerald-600"
          />

          <p className="mt-4 text-sm font-medium text-slate-600">
            Loading project...
          </p>
        </div>
      </div>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (error && !project) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <div className="w-full max-w-lg rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
            <XCircle
              size={28}
              className="text-red-600"
            />
          </div>

          <h2 className="mt-4 text-xl font-bold text-slate-900">
            Unable to load project
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            {error}
          </p>

          <div className="mt-6 flex justify-center gap-3">

            <button
              type="button"
              onClick={() => loadProject()}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              <RefreshCw size={16} />
              Try Again
            </button>

            <button
              type="button"
              onClick={() =>
                navigate("/projects")
              }
              className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Back to Projects
            </button>

          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // MAIN
  // =========================================================

  return (
    <div className="space-y-6">

      {/* =====================================================
          TOP NAVIGATION
      ===================================================== */}

      <div className="flex items-center justify-between">

        <button
          type="button"
          onClick={() =>
            navigate("/projects")
          }
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 transition hover:text-emerald-600"
        >
          <ArrowLeft size={18} />
          Back to Projects
        </button>

        {/* REFRESH */}

        <button
          type="button"
          disabled={refreshing}
          onClick={() =>
            loadProject(true)
          }
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            size={17}
            className={
              refreshing
                ? "animate-spin"
                : ""
            }
          />

          Refresh
        </button>

      </div>

      {/* =====================================================
          ERROR BANNER
      ===================================================== */}

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">

          <XCircle
            size={20}
            className="mt-0.5 shrink-0 text-red-600"
          />

          <div>
            <p className="text-sm font-semibold text-red-800">
              Something went wrong
            </p>

            <p className="mt-1 text-sm text-red-700">
              {error}
            </p>
          </div>

        </div>
      )}

      {/* =====================================================
          PROJECT HEADER
      ===================================================== */}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">

          {/* PROJECT INFO */}

          <div className="flex min-w-0 gap-4">

            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-100">
              <Folder
                size={28}
                className="text-indigo-600"
              />
            </div>

            <div className="min-w-0">

              <div className="flex flex-wrap items-center gap-2">

                <h1 className="break-words text-2xl font-bold text-slate-900 sm:text-3xl">
                  {project?.name ||
                    "Untitled Project"}
                </h1>

                {isPublic ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                    <Globe size={13} />
                    Public
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                    <Lock size={13} />
                    Private
                  </span>
                )}

              </div>

              <p className="mt-2 text-sm text-slate-500">
                Owner:{" "}
                <span className="font-semibold text-slate-700">
                  {ownerName}
                </span>
              </p>

              {ownerEmail && (
                <p className="mt-1 text-xs text-slate-400">
                  {ownerEmail}
                </p>
              )}

              {project?.description && (
                <p className="mt-4 max-w-3xl whitespace-pre-wrap text-sm leading-6 text-slate-600">
                  {project.description}
                </p>
              )}

            </div>
          </div>

          {/* ACTIONS */}

          <div className="flex shrink-0 flex-wrap gap-3">

            {canEdit && (
              <button
                type="button"
                onClick={() =>
                  navigate(
                    `/projects/${id}/edit`
                  )
                }
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
              >
                <Edit3 size={17} />
                Edit Project
              </button>
            )}

            {canDelete && (
              <button
                type="button"
                disabled={deleteLoading}
                onClick={
                  handleDeleteProject
                }
                className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleteLoading ? (
                  <Loader2
                    size={17}
                    className="animate-spin"
                  />
                ) : (
                  <Trash2 size={17} />
                )}

                Delete
              </button>
            )}

          </div>
        </div>
      </section>

      {/* =====================================================
          ADMIN REVIEW
      ===================================================== */}

      {isAdmin && isPublic && (
        <section className="rounded-2xl border border-amber-200 bg-amber-50/60 p-6">

          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

            <div>

              <div className="flex items-center gap-2">

                <ShieldCheck
                  size={22}
                  className="text-amber-600"
                />

                <h2 className="text-lg font-bold text-slate-900">
                  Admin Review
                </h2>

              </div>

              <p className="mt-1 text-sm text-slate-600">
                Admin can review public projects.
                Project editing and member
                management remain disabled.
              </p>

              <div className="mt-3">

                {isPending && (
                  <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1.5 text-xs font-semibold text-amber-700">
                    <MoreHorizontal size={14} />
                    Pending Review
                  </span>
                )}

                {isApproved && (
                  <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                    <CheckCircle2 size={14} />
                    Approved
                  </span>
                )}

                {isRejected && (
                  <span className="inline-flex items-center gap-2 rounded-full bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-700">
                    <XCircle size={14} />
                    Rejected
                  </span>
                )}

              </div>

            </div>

            <div className="w-full max-w-xl">

              <textarea
                value={reviewText}
                onChange={(e) =>
                  setReviewText(
                    e.target.value
                  )
                }
                rows={4}
                placeholder="Write your review or reason..."
                className="w-full resize-none rounded-xl border border-amber-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
              />

              {reviewError && (
                <p className="mt-2 text-sm text-red-600">
                  {reviewError}
                </p>
              )}

              {reviewSuccess && (
                <p className="mt-2 text-sm text-emerald-600">
                  {reviewSuccess}
                </p>
              )}

              <div className="mt-3 flex flex-wrap gap-3">

                <button
                  type="button"
                  disabled={reviewLoading}
                  onClick={() =>
                    handleReview(
                      "approved"
                    )
                  }
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {reviewLoading ? (
                    <Loader2
                      size={16}
                      className="animate-spin"
                    />
                  ) : (
                    <CheckCircle2 size={16} />
                  )}

                  Approve
                </button>

                <button
                  type="button"
                  disabled={reviewLoading}
                  onClick={() =>
                    handleReview(
                      "rejected"
                    )
                  }
                  className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {reviewLoading ? (
                    <Loader2
                      size={16}
                      className="animate-spin"
                    />
                  ) : (
                    <XCircle size={16} />
                  )}

                  Reject
                </button>

              </div>
            </div>

          </div>
        </section>
      )}

      {/* =====================================================
          QUICK ACTIONS
      ===================================================== */}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {/* NOTES */}

        <button
          type="button"
          onClick={goToNotes}
          className="group relative z-10 block w-full cursor-pointer rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
        >

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
            <FileText
              size={24}
              className="text-blue-600"
            />
          </div>

          <div className="mt-5 flex items-center justify-between gap-3">

            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Notes
              </h3>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                View and manage project notes
              </p>
            </div>

            <ChevronRight
              size={20}
              className="shrink-0 text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-600"
            />

          </div>
        </button>

        {/* FILES */}

        <button
          type="button"
          onClick={goToFiles}
          className="group relative z-10 block w-full cursor-pointer rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:border-purple-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
        >

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100">
            <Folder
              size={24}
              className="text-purple-600"
            />
          </div>

          <div className="mt-5 flex items-center justify-between gap-3">

            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Files
              </h3>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                Upload and manage project files
              </p>
            </div>

            <ChevronRight
              size={20}
              className="shrink-0 text-slate-400 transition group-hover:translate-x-1 group-hover:text-purple-600"
            />

          </div>
        </button>

        {/* MEMBERS */}

        <button
          type="button"
          onClick={goToMembers}
          className="group relative z-10 block w-full cursor-pointer rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-300"
        >

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100">
            <Users
              size={24}
              className="text-emerald-600"
            />
          </div>

          <div className="mt-5 flex items-center justify-between gap-3">

            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Members
              </h3>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                {totalMembers} project member
                {totalMembers === 1
                  ? ""
                  : "s"}
              </p>
            </div>

            <ChevronRight
              size={20}
              className="shrink-0 text-slate-400 transition group-hover:translate-x-1 group-hover:text-emerald-600"
            />

          </div>
        </button>

        {/* ANALYTICS */}

        <button
          type="button"
          onClick={goToAnalytics}
          className="group relative z-10 block w-full cursor-pointer rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:border-orange-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
        >

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100">
            <BarChart3
              size={24}
              className="text-orange-600"
            />
          </div>

          <div className="mt-5 flex items-center justify-between gap-3">

            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Analytics
              </h3>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                View contribution analytics
              </p>
            </div>

            <ChevronRight
              size={20}
              className="shrink-0 text-slate-400 transition group-hover:translate-x-1 group-hover:text-orange-600"
            />

          </div>
        </button>

      </section>

      {/* =====================================================
          LOWER INFORMATION
      ===================================================== */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

        {/* PROJECT INFORMATION */}

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
              <BookOpen
                size={20}
                className="text-slate-700"
              />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Project Information
              </h2>

              <p className="text-sm text-slate-500">
                Basic project details
              </p>
            </div>

          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">

            {/* PROJECT NAME */}

            <div>
              <p className="text-sm text-slate-500">
                Project Name
              </p>

              <p className="mt-1 break-words text-base font-semibold text-slate-900">
                {project?.name || "—"}
              </p>
            </div>

            {/* OWNER */}

            <div>
              <p className="text-sm text-slate-500">
                Owner
              </p>

              <p className="mt-1 break-words text-base font-semibold text-slate-900">
                {ownerName}
              </p>
            </div>

            {/* MEMBERS */}

            <div>
              <p className="text-sm text-slate-500">
                Members
              </p>

              <p className="mt-1 text-base font-semibold text-slate-900">
                {totalMembers}
              </p>
            </div>

            {/* VISIBILITY */}

            <div>
              <p className="text-sm text-slate-500">
                Visibility
              </p>

              <p className="mt-1 flex items-center gap-2 text-base font-semibold capitalize text-slate-900">

                {isPublic ? (
                  <>
                    <Globe
                      size={17}
                      className="text-emerald-600"
                    />
                    Public
                  </>
                ) : (
                  <>
                    <Lock
                      size={17}
                      className="text-slate-500"
                    />
                    Private
                  </>
                )}

              </p>
            </div>

            {/* MODERATION */}

            <div>
              <p className="text-sm text-slate-500">
                Moderation Status
              </p>

              <p className="mt-1 text-base font-semibold capitalize text-slate-900">
                {moderationStatus}
              </p>
            </div>

            {/* CREATED */}

            <div>
              <p className="text-sm text-slate-500">
                Created
              </p>

              <p className="mt-1 text-base font-semibold text-slate-900">
                {project?.createdAt
                  ? new Date(
                      project.createdAt
                    ).toLocaleDateString()
                  : "—"}
              </p>
            </div>

          </div>

          {/* DESCRIPTION */}

          {project?.description && (
            <div className="mt-8 border-t border-slate-100 pt-6">

              <p className="text-sm text-slate-500">
                Description
              </p>

              <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-700">
                {project.description}
              </p>

            </div>
          )}

          {/* ADMIN REVIEW */}

          {project?.adminReview && (
            <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-4">

              <div className="flex items-center gap-2">

                <ShieldCheck
                  size={18}
                  className="text-slate-600"
                />

                <p className="text-sm font-semibold text-slate-800">
                  Admin Review
                </p>

              </div>

              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                {project.adminReview}
              </p>

            </div>
          )}

        </section>

        {/* ===================================================
            MEMBERS PREVIEW
        =================================================== */}

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between gap-4">

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Members
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {totalMembers} member
                {totalMembers === 1
                  ? ""
                  : "s"}
              </p>
            </div>

            <button
              type="button"
              onClick={goToMembers}
              className="relative z-10 cursor-pointer text-sm font-semibold text-emerald-600 transition hover:text-emerald-700"
            >
              View All
            </button>

          </div>

          <div className="mt-6 space-y-4">

            {/* OWNER */}

            {project?.owner && (
              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-700">
                  {(
                    project?.owner?.name ||
                    project?.owner?.username ||
                    project?.owner?.email ||
                    "U"
                  )
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div className="min-w-0 flex-1">

                  <p className="truncate text-sm font-semibold text-slate-900">
                    {ownerName}
                  </p>

                  <p className="truncate text-xs text-slate-500">
                    {ownerEmail ||
                      "Project Owner"}
                  </p>

                </div>

                <span className="shrink-0 rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                  Owner
                </span>

              </div>
            )}

            {/* MEMBERS */}

            {projectMembers
              .filter((member) => {
                const memberId =
                  member?._id ||
                  member?.id ||
                  member;

                return (
                  !ownerId ||
                  memberId?.toString() !==
                    ownerId?.toString()
                );
              })
              .slice(0, 4)
              .map((member, index) => {

                const memberName =
                  member?.name ||
                  member?.username ||
                  member?.fullName ||
                  member?.email ||
                  `Member ${index + 1}`;

                const memberEmail =
                  member?.email ||
                  "";

                return (
                  <div
                    key={
                      member?._id ||
                      member?.id ||
                      index
                    }
                    className="flex items-center gap-3"
                  >

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-100 font-semibold text-emerald-700">
                      {memberName
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div className="min-w-0 flex-1">

                      <p className="truncate text-sm font-semibold text-slate-900">
                        {memberName}
                      </p>

                      {memberEmail && (
                        <p className="truncate text-xs text-slate-500">
                          {memberEmail}
                        </p>
                      )}

                    </div>

                  </div>
                );
              })}

            {/* EMPTY */}

            {totalMembers === 0 && (
              <div className="rounded-xl bg-slate-50 p-5 text-center">

                <Users
                  size={28}
                  className="mx-auto text-slate-400"
                />

                <p className="mt-2 text-sm text-slate-500">
                  No members found
                </p>

              </div>
            )}

          </div>

          {/* VIEW ALL */}

          {totalMembers > 4 && (
            <button
              type="button"
              onClick={goToMembers}
              className="relative z-10 mt-6 w-full cursor-pointer rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              View all {totalMembers} members
            </button>
          )}

        </section>

      </div>

      {/* =====================================================
          PERMISSION INFORMATION
      ===================================================== */}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100">
            <Eye
              size={20}
              className="text-slate-600"
            />
          </div>

          <div>

            <p className="text-sm font-semibold text-slate-900">
              Your project access
            </p>

            <p className="mt-1 text-sm text-slate-500">

              {isAdmin
                ? "You are viewing this project as an admin. You can review public projects, but you cannot edit the project or manage members."
                : isOwner
                ? "You are the project owner. You can edit the project and manage its members."
                : "You are a project member. You can view project resources and collaborate according to your project permissions."}

            </p>

          </div>

        </div>

      </section>

    </div>
  );
};

export default ProjectDetails;