import { useCallback, useEffect, useState } from "react";

import {
  AlertCircle,
  CheckCircle2,
  File as FileIcon,
  ShieldCheck,
  UploadCloud,
} from "lucide-react";

import { useParams } from "react-router-dom";

import useFiles from "../../hooks/useFiles";
import useAuth from "../../hooks/useAuth";

import FileUploader from "../../components/files/FileUploader";
import FileList from "../../components/files/FileList";
import FilePreview from "../../components/files/FilePreview";

const ProjectFiles = () => {
  const { projectId } = useParams();

  const { user } = useAuth();

  // =====================================================
  // ROLE
  // =====================================================

  const isAdmin = user?.role === "admin";

  /*
   * Admin:
   *   View only
   *
   * Owner / Member:
   *   View
   *   Upload
   *   Replace
   *   Delete
   *
   * Backend also checks the actual permission.
   */

  const canManageFiles = !isAdmin;

  // =====================================================
  // FILE HOOK
  // =====================================================

  const {
    files = [],
    loading,
    uploading,
    deleting,
    uploadProgress,
    error,

    getFiles,
    uploadFile,
    updateFile,
    deleteFile,

    clearError,
  } = useFiles(projectId);

  // =====================================================
  // LOCAL STATE
  // =====================================================

  const [previewFile, setPreviewFile] = useState(null);

  const [successMessage, setSuccessMessage] = useState("");

  const [updatingFileId, setUpdatingFileId] = useState(null);

  // =====================================================
  // LOAD FILES
  // =====================================================

  useEffect(() => {
    if (!projectId) {
      return;
    }

    getFiles();
  }, [projectId, getFiles]);

  // =====================================================
  // SUCCESS MESSAGE
  // =====================================================

  const showSuccess = useCallback((message) => {
    setSuccessMessage(message);

    window.setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  }, []);

  // =====================================================
  // UPLOAD
  // =====================================================

  const handleUpload = async (selectedFile) => {
    if (!canManageFiles) {
      return;
    }

    /*
     * FileUploader normally sends the actual File object.
     *
     * Extra safety:
     * If an event is accidentally passed,
     * extract the selected file from the event.
     */

    let file = selectedFile;

    if (
      selectedFile &&
      selectedFile.target &&
      selectedFile.target.files
    ) {
      file = selectedFile.target.files[0];
    }

    // No file selected
    if (!file) {
      clearError();
      return;
    }

    /*
     * IMPORTANT:
     * Do NOT use:
     *
     * file instanceof File
     *
     * because File can conflict with lucide-react's File icon.
     */

    try {
      clearError();
      setSuccessMessage("");

      await uploadFile(file);

      showSuccess("File uploaded successfully.");
    } catch (err) {
      console.error(
        "Project file upload error:",
        err
      );
    }
  };

  // =====================================================
  // UPDATE / REPLACE FILE
  // =====================================================

  const handleUpdate = async (fileId, newFile) => {
    if (!canManageFiles) {
      return;
    }

    if (!fileId || !newFile) {
      return;
    }

    try {
      clearError();
      setSuccessMessage("");

      setUpdatingFileId(fileId);

      await updateFile(fileId, newFile);

      showSuccess("File updated successfully.");
    } catch (err) {
      console.error(
        "Project file update error:",
        err
      );
    } finally {
      setUpdatingFileId(null);
    }
  };

  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = async (fileId) => {
    if (!canManageFiles) {
      return;
    }

    if (!fileId) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this file?"
    );

    if (!confirmed) {
      return;
    }

    try {
      clearError();
      setSuccessMessage("");

      await deleteFile(fileId);

      // Close preview if deleted file was being previewed
      setPreviewFile((currentFile) => {
        if (
          currentFile?._id?.toString() ===
          fileId?.toString()
        ) {
          return null;
        }

        return currentFile;
      });

      showSuccess("File deleted successfully.");
    } catch (err) {
      console.error(
        "Delete project file error:",
        err
      );
    }
  };

  // =====================================================
  // PREVIEW
  // =====================================================

  const handlePreview = (file) => {
    setPreviewFile(file);
  };

  // =====================================================
  // INVALID PROJECT
  // =====================================================

  if (!projectId) {
    return (
      <div className="mx-auto max-w-7xl p-6">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <div className="flex items-center gap-3">
            <AlertCircle
              size={22}
              className="shrink-0 text-red-600"
            />

            <div>
              <h2 className="font-semibold text-red-800">
                Project ID missing
              </h2>

              <p className="mt-1 text-sm text-red-700">
                Unable to load project files because the
                project ID is missing from the URL.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="mx-auto max-w-7xl space-y-7 p-6">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100">
              <FileIcon
                size={25}
                className="text-purple-600"
              />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Project Files
              </h1>

              <p className="mt-1 text-slate-500">
                {isAdmin
                  ? "View files uploaded by project members."
                  : "Upload and manage project assets."}
              </p>
            </div>
          </div>
        </div>

        {/* ADMIN BADGE */}

        {isAdmin && (
          <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-600">
            <ShieldCheck size={17} />

            Admin View Only
          </div>
        )}
      </div>

      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div className="flex items-start justify-between gap-4 rounded-xl border border-red-200 bg-red-50 p-4">
          <div className="flex min-w-0 items-start gap-3">
            <AlertCircle
              size={20}
              className="mt-0.5 shrink-0 text-red-600"
            />

            <div className="min-w-0">
              <p className="text-sm font-semibold text-red-800">
                File operation failed
              </p>

              <p className="mt-1 break-words text-sm text-red-700">
                {error}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={clearError}
            className="shrink-0 text-sm font-semibold text-red-700 hover:text-red-900"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* =====================================================
          SUCCESS
      ===================================================== */}

      {successMessage && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <CheckCircle2
            size={20}
            className="shrink-0 text-emerald-600"
          />

          <p className="text-sm font-medium text-emerald-700">
            {successMessage}
          </p>
        </div>
      )}

      {/* =====================================================
          UPLOADER
      ===================================================== */}

      {canManageFiles && (
        <div className="space-y-3">
          <FileUploader
            onUpload={handleUpload}
            uploading={uploading}
          />

          {/* UPLOAD PROGRESS */}

          {uploading && (
            <div className="rounded-xl border border-purple-100 bg-purple-50 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UploadCloud
                    size={18}
                    className="text-purple-600"
                  />

                  <span className="text-sm font-semibold text-purple-800">
                    Uploading file...
                  </span>
                </div>

                <span className="text-sm font-bold text-purple-700">
                  {uploadProgress || 0}%
                </span>
              </div>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-purple-100">
                <div
                  className="h-full rounded-full bg-purple-600 transition-all duration-300"
                  style={{
                    width: `${uploadProgress || 0}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* =====================================================
          ADMIN INFO
      ===================================================== */}

      {isAdmin && (
        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
          <div className="flex items-start gap-3">
            <ShieldCheck
              size={22}
              className="mt-0.5 shrink-0 text-blue-600"
            />

            <div>
              <h2 className="font-semibold text-blue-900">
                Admin access
              </h2>

              <p className="mt-1 text-sm leading-6 text-blue-700">
                You can view and preview project files.
                File upload, replacement, and deletion
                are disabled for administrators.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          FILE LIST
      ===================================================== */}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Project Assets
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {files.length} file
              {files.length === 1 ? "" : "s"}
            </p>
          </div>
        </div>

        <FileList
          files={files}
          loading={loading}
          onDelete={
            canManageFiles
              ? handleDelete
              : undefined
          }
          onUpdate={
            canManageFiles
              ? handleUpdate
              : undefined
          }
          updatingFileId={updatingFileId}
          onPreview={handlePreview}
        />
      </section>

      {/* =====================================================
          FILE PREVIEW
      ===================================================== */}

      <FilePreview
        file={previewFile}
        onClose={() => setPreviewFile(null)}
      />

      {/* =====================================================
          DELETE LOADING
      ===================================================== */}

      {deleting && (
        <div className="pointer-events-none fixed bottom-6 right-6 z-50">
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-xl">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-purple-600" />

            <span className="text-sm font-medium text-slate-700">
              Deleting file...
            </span>
          </div>
        </div>
      )}

      {/* =====================================================
          UPDATE LOADING
      ===================================================== */}

      {updatingFileId && (
        <div className="pointer-events-none fixed bottom-6 right-6 z-50">
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-xl">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-purple-600" />

            <span className="text-sm font-medium text-slate-700">
              Updating file...
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectFiles;