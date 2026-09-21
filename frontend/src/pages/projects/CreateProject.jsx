import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  FolderKanban,
  Loader2,
  Save,
  Eye,
  Lock,
  Globe,
  AlertCircle,
} from "lucide-react";

import useProjects from "../../hooks/useProjects";

const CreateProject = () => {
  const navigate = useNavigate();

  const { createProject, loading, error } =
    useProjects();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    visibility: "private",
  });

  const [formError, setFormError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setFormError("");

    if (!formData.name.trim()) {
      setFormError("Project name is required.");
      return;
    }

    try {
      const project = await createProject({
        name: formData.name.trim(),
        description: formData.description.trim(),
        visibility: formData.visibility,
      });

      if (project?._id) {
        navigate(`/projects/${project._id}`);
      } else {
        navigate("/projects");
      }
    } catch (err) {
      console.error(
        "Create project failed:",
        err
      );

      setFormError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to create project."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/40">

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-4xl items-center gap-4 px-4 py-4 sm:px-6">
          
          <Link
            to="/projects"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
          >
            <ArrowLeft size={20} />
          </Link>

          <div>
            <h1 className="text-xl font-bold text-slate-900">
              Create New Project
            </h1>

            <p className="text-sm text-slate-500">
              Start a new collaboration workspace
            </p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">

          {/* Top */}
          <div className="border-b border-slate-100 bg-gradient-to-r from-emerald-50 to-teal-50 p-6 sm:p-8">
            <div className="flex items-center gap-4">
              
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 shadow-lg shadow-emerald-600/20">
                <FolderKanban
                  size={28}
                  className="text-white"
                />
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Project Details
                </h2>

                <p className="mt-1 text-sm text-slate-600">
                  Enter the basic information for your project.
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-6 p-6 sm:p-8"
          >

            {/* Errors */}
            {(formError || error) && (
              <div className="flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
                <AlertCircle
                  size={20}
                  className="mt-0.5 shrink-0"
                />

                <p className="text-sm font-medium">
                  {formError || error}
                </p>
              </div>
            )}

            {/* Project Name */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-800">
                Project Name
                <span className="ml-1 text-red-500">
                  *
                </span>
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. AI Learning Platform"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                disabled={loading}
              />
            </div>

            {/* Description */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-800">
                Description
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                placeholder="Describe what this project is about..."
                className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                disabled={loading}
              />

              <p className="mt-2 text-xs text-slate-400">
                Give your team a short overview of the project.
              </p>
            </div>

            {/* Visibility */}
            <div>
              <label className="mb-3 block text-sm font-semibold text-slate-800">
                Project Visibility
              </label>

              <div className="grid gap-4 sm:grid-cols-2">

                {/* Private */}
                <button
                  type="button"
                  disabled={loading}
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      visibility: "private",
                    }))
                  }
                  className={`rounded-2xl border p-4 text-left transition ${
                    formData.visibility === "private"
                      ? "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-500/10"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                      <Lock
                        size={19}
                        className="text-slate-600"
                      />
                    </div>

                    <div>
                      <p className="font-semibold text-slate-900">
                        Private
                      </p>

                      <p className="text-xs text-slate-500">
                        Only project members
                      </p>
                    </div>
                  </div>
                </button>

                {/* Public */}
                <button
                  type="button"
                  disabled={loading}
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      visibility: "public",
                    }))
                  }
                  className={`rounded-2xl border p-4 text-left transition ${
                    formData.visibility === "public"
                      ? "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-500/10"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                      <Globe
                        size={19}
                        className="text-blue-600"
                      />
                    </div>

                    <div>
                      <p className="font-semibold text-slate-900">
                        Public
                      </p>

                      <p className="text-xs text-slate-500">
                        Can be publicly shared
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Preview */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="mb-3 flex items-center gap-2">
                <Eye
                  size={18}
                  className="text-slate-500"
                />

                <span className="text-sm font-semibold text-slate-800">
                  Preview
                </span>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="font-bold text-slate-900">
                  {formData.name ||
                    "Your Project Name"}
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  {formData.description ||
                    "Your project description will appear here."}
                </p>

                <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                  {formData.visibility ===
                  "public" ? (
                    <>
                      <Globe size={14} />
                      Public project
                    </>
                  ) : (
                    <>
                      <Lock size={14} />
                      Private project
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">

              <Link
                to="/projects"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Create Project
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateProject;