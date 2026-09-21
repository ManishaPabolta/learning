import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  Plus,
  FolderKanban,
  Loader2,
  AlertCircle,
  RefreshCw,
  Sparkles,
  Users,
  Globe,
  Lock,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

import useProjects from "../../hooks/useProjects";
import useAuth from "../../hooks/useAuth";

const Projects = () => {
  const navigate = useNavigate();

  const { user } = useAuth();

  const {
    projects = [],
    loading,
    error,
    getProjects,
  } = useProjects();

  const isAdmin =
    user?.role === "admin";

  useEffect(() => {
    getProjects();
  }, [getProjects]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/40">
      {/* ==================================================
          HEADER
      ================================================== */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">

          <div className="flex items-center gap-3">

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-all hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
            >
              <ArrowLeft size={20} />
            </button>

            <div>
              <div className="flex items-center gap-2">

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100">
                  {isAdmin ? (
                    <ShieldCheck
                      size={20}
                      className="text-emerald-600"
                    />
                  ) : (
                    <FolderKanban
                      size={20}
                      className="text-emerald-600"
                    />
                  )}
                </div>

                <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
                  {isAdmin
                    ? "All Projects"
                    : "My Projects"}
                </h1>

              </div>

              <p className="mt-1 hidden text-sm text-slate-500 sm:block">
                {isAdmin
                  ? "Review and monitor student projects"
                  : "Manage and collaborate on your projects"}
              </p>
            </div>
          </div>

          {/* ==================================================
              CREATE BUTTON
              Admin should NOT create student projects from here.
          ================================================== */}
          {!isAdmin && (
            <Link
              to="/projects/create"
              className="relative z-50 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-700 hover:shadow-xl active:scale-95"
            >
              <Plus size={18} />

              <span className="hidden sm:inline">
                New Project
              </span>
            </Link>
          )}
        </div>
      </header>

      {/* ==================================================
          MAIN
      ================================================== */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* ==================================================
            HERO
        ================================================== */}
        <section className="mb-8 overflow-hidden rounded-3xl border border-emerald-100 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 p-6 text-white shadow-xl sm:p-8">

          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">

            <div>

              <div className="mb-3 flex items-center gap-2">

                {isAdmin ? (
                  <ShieldCheck size={20} />
                ) : (
                  <Sparkles size={20} />
                )}

                <span className="text-sm font-semibold uppercase tracking-wider text-emerald-50">
                  {isAdmin
                    ? "Admin Review Workspace"
                    : "Collaboration Workspace"}
                </span>

              </div>

              <h2 className="text-2xl font-bold sm:text-3xl">
                {isAdmin
                  ? "Review student projects"
                  : "Build something amazing together"}
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-emerald-50 sm:text-base">
                {isAdmin
                  ? "View student projects, inspect their work, check members, notes, files and analytics, and approve or reject public projects."
                  : "Create projects, invite teammates, share notes and files, and track your team's contribution from one place."}
              </p>

            </div>

            {!isAdmin && (
              <Link
                to="/projects/create"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-emerald-700 shadow-lg transition hover:bg-emerald-50 active:scale-95"
              >
                <Plus size={19} />
                Create Project
              </Link>
            )}

          </div>
        </section>

        {/* ==================================================
            ERROR
        ================================================== */}
        {error && (
          <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-start gap-3">

              <AlertCircle
                size={20}
                className="mt-0.5 shrink-0"
              />

              <div>

                <p className="font-semibold">
                  Unable to load projects
                </p>

                <p className="mt-1 text-sm">
                  {error}
                </p>

              </div>
            </div>

            <button
              type="button"
              onClick={getProjects}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-red-700 shadow-sm ring-1 ring-red-200 hover:bg-red-50"
            >
              <RefreshCw size={16} />
              Retry
            </button>

          </div>
        )}

        {/* ==================================================
            LOADING
        ================================================== */}
        {loading ? (
          <div className="flex min-h-[400px] items-center justify-center">

            <div className="rounded-2xl border border-slate-200 bg-white px-8 py-7 text-center shadow-sm">

              <Loader2
                size={32}
                className="mx-auto animate-spin text-emerald-600"
              />

              <p className="mt-4 font-semibold text-slate-800">
                Loading projects...
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Please wait a moment
              </p>

            </div>

          </div>
        ) : projects.length === 0 ? (

          /* ==================================================
              EMPTY
          ================================================== */
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-50">
              <FolderKanban
                size={38}
                className="text-emerald-600"
              />
            </div>

            <h2 className="mt-6 text-2xl font-bold text-slate-900">
              {isAdmin
                ? "No projects submitted yet"
                : "No projects yet"}
            </h2>

            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-500">
              {isAdmin
                ? "Student projects will appear here when they are created."
                : "You haven't created or joined any projects yet. Start a project and invite your team members to collaborate with you."}
            </p>

            {!isAdmin && (
              <Link
                to="/projects/create"
                className="mt-7 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 active:scale-95"
              >
                <Plus size={19} />
                Create Your First Project
              </Link>
            )}

          </div>
        ) : (

          /* ==================================================
              PROJECT LIST
          ================================================== */
          <>

            <div className="mb-5 flex items-center justify-between">

              <div>

                <h2 className="text-lg font-bold text-slate-900">
                  {isAdmin
                    ? "Student Projects"
                    : "Your Projects"}
                </h2>

                <p className="text-sm text-slate-500">
                  {projects.length}{" "}
                  {projects.length === 1
                    ? "project"
                    : "projects"}
                </p>

              </div>

              <button
                type="button"
                onClick={getProjects}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                title="Refresh"
              >
                <RefreshCw size={17} />
              </button>

            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">

              {projects.map((project) => (
                <ProjectCard
                  key={project._id}
                  project={project}
                  isAdmin={isAdmin}
                />
              ))}

            </div>

          </>
        )}

      </main>
    </div>
  );
};

// ======================================================
// PROJECT CARD
// ======================================================
const ProjectCard = ({
  project,
  isAdmin,
}) => {
  const visibility =
    project.visibility || "private";

  const members =
    Array.isArray(project.members)
      ? project.members
      : [];

  const moderationStatus =
    project.moderationStatus || "pending";

  return (
    <Link
      to={`/projects/${project._id}`}
      className="group block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl"
    >

      {/* ==================================================
          TOP
      ================================================== */}
      <div className="flex items-start justify-between gap-4">

        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50">
          <FolderKanban
            size={24}
            className="text-emerald-600"
          />
        </div>

        <div
          className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
            visibility === "public"
              ? "bg-blue-50 text-blue-600"
              : "bg-slate-100 text-slate-600"
          }`}
        >

          {visibility === "public" ? (
            <Globe size={13} />
          ) : (
            <Lock size={13} />
          )}

          {visibility}

        </div>

      </div>

      {/* ==================================================
          NAME
      ================================================== */}
      <h3 className="mt-5 truncate text-lg font-bold text-slate-900 group-hover:text-emerald-700">
        {project.name}
      </h3>

      {/* ==================================================
          DESCRIPTION
      ================================================== */}
      <p className="mt-2 line-clamp-2 min-h-[48px] text-sm leading-6 text-slate-500">
        {project.description ||
          "No project description available."}
      </p>

      {/* ==================================================
          ADMIN MODERATION STATUS
      ================================================== */}
      {isAdmin &&
        visibility === "public" && (
          <div className="mt-4">

            <span
              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                moderationStatus === "approved"
                  ? "bg-emerald-50 text-emerald-700"
                  : moderationStatus === "rejected"
                  ? "bg-red-50 text-red-700"
                  : "bg-amber-50 text-amber-700"
              }`}
            >
              {moderationStatus ===
              "approved"
                ? "Approved"
                : moderationStatus ===
                  "rejected"
                ? "Rejected"
                : "Pending Review"}
            </span>

          </div>
        )}

      {/* ==================================================
          FOOTER
      ================================================== */}
      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">

        <div className="flex items-center gap-2 text-sm text-slate-500">

          <Users size={16} />

          <span>
            {members.length}{" "}
            {members.length === 1
              ? "member"
              : "members"}
          </span>

        </div>

        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-500 transition group-hover:bg-emerald-50 group-hover:text-emerald-600">
          <ChevronRight size={17} />
        </div>

      </div>

    </Link>
  );
};

export default Projects;