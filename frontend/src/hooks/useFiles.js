import { useCallback, useState } from "react";
import fileService from "../services/fileService";

const useFiles = (projectId) => {
  // =====================================================
  // STATE
  // =====================================================

  const [files, setFiles] = useState([]);

  const [loading, setLoading] = useState(false);

  const [uploading, setUploading] = useState(false);

  const [updating, setUpdating] = useState(false);

  const [deleting, setDeleting] = useState(false);

  const [error, setError] = useState("");

  const [uploadProgress, setUploadProgress] =
    useState(0);

  const [updateProgress, setUpdateProgress] =
    useState(0);

  // =====================================================
  // GET PROJECT FILES
  // =====================================================

  const getFiles = useCallback(async () => {
    if (!projectId) {
      setFiles([]);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const result =
        await fileService.getFiles(projectId);

      const projectFiles =
        result?.data?.files ||
        result?.files ||
        [];

      setFiles(
        Array.isArray(projectFiles)
          ? projectFiles
          : []
      );
    } catch (error) {
      console.error(
        "Get project files error:",
        error
      );

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to load files";

      setError(message);
      setFiles([]);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  // =====================================================
  // UPLOAD FILE
  // =====================================================

  const uploadFile = async (
    file,
    onProgress
  ) => {
    if (!projectId) {
      throw new Error(
        "Project ID is required"
      );
    }

    if (!file) {
      throw new Error(
        "Please select a file"
      );
    }

    try {
      setUploading(true);
      setError("");
      setUploadProgress(0);

      const handleProgress = (event) => {
        if (
          event &&
          event.total
        ) {
          const percent = Math.round(
            (event.loaded * 100) /
              event.total
          );

          setUploadProgress(percent);

          if (onProgress) {
            onProgress(percent);
          }
        }
      };

      const result =
        await fileService.uploadFile(
          projectId,
          file,
          handleProgress
        );

      // Refresh files after upload
      await getFiles();

      setUploadProgress(100);

      return result;
    } catch (error) {
      console.error(
        "Upload project file error:",
        error
      );

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to upload file";

      setError(message);

      throw error;
    } finally {
      setUploading(false);

      setTimeout(() => {
        setUploadProgress(0);
      }, 500);
    }
  };

  // =====================================================
  // UPDATE / REPLACE FILE
  // =====================================================

  const updateFile = async (
    fileId,
    newFile,
    onProgress
  ) => {
    if (!projectId) {
      throw new Error(
        "Project ID is required"
      );
    }

    if (!fileId) {
      throw new Error(
        "File ID is required"
      );
    }

    if (!newFile) {
      throw new Error(
        "Please select a replacement file"
      );
    }

    try {
      setUpdating(true);
      setError("");
      setUpdateProgress(0);

      const handleProgress = (event) => {
        if (
          event &&
          event.total
        ) {
          const percent = Math.round(
            (event.loaded * 100) /
              event.total
          );

          setUpdateProgress(percent);

          if (onProgress) {
            onProgress(percent);
          }
        }
      };

      const result =
        await fileService.updateFile(
          projectId,
          fileId,
          newFile,
          handleProgress
        );

      /*
       * Refresh the list so the new
       * filename/type/size/url appears.
       */

      await getFiles();

      setUpdateProgress(100);

      return result;
    } catch (error) {
      console.error(
        "Update project file error:",
        error
      );

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to update file";

      setError(message);

      throw error;
    } finally {
      setUpdating(false);

      setTimeout(() => {
        setUpdateProgress(0);
      }, 500);
    }
  };

  // =====================================================
  // DELETE FILE
  // =====================================================

  const deleteFile = async (
    fileId
  ) => {
    if (!projectId) {
      throw new Error(
        "Project ID is required"
      );
    }

    if (!fileId) {
      throw new Error(
        "File ID is required"
      );
    }

    try {
      setDeleting(true);
      setError("");

      const result =
        await fileService.deleteFile(
          projectId,
          fileId
        );

      /*
       * Remove immediately from UI.
       */

      setFiles((prevFiles) =>
        prevFiles.filter(
          (file) =>
            file?._id?.toString() !==
            fileId?.toString()
        )
      );

      return result;
    } catch (error) {
      console.error(
        "Delete project file error:",
        error
      );

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to delete file";

      setError(message);

      throw error;
    } finally {
      setDeleting(false);
    }
  };

  // =====================================================
  // CLEAR ERROR
  // =====================================================

  const clearError = () => {
    setError("");
  };

  // =====================================================
  // RETURN
  // =====================================================

  return {
    // Files
    files,

    // Loading states
    loading,
    uploading,
    updating,
    deleting,

    // Errors
    error,

    // Progress
    uploadProgress,
    updateProgress,

    // Actions
    getFiles,
    uploadFile,
    updateFile,
    deleteFile,

    // Utility
    clearError,
  };
};

export default useFiles;