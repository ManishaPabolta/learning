import api from "./api";

const fileService = {
  // ===================================================
  // GET PROJECT FILES
  // ===================================================

  getFiles: async (projectId) => {
    if (!projectId) {
      throw new Error("Project ID is required");
    }

    const response = await api.get(
      `/project-files/${projectId}`
    );

    return response.data;
  },

  // ===================================================
  // GET SINGLE FILE
  // ===================================================

  getFile: async (projectId, fileId) => {
    if (!projectId || !fileId) {
      throw new Error(
        "Project ID and File ID are required"
      );
    }

    const response = await api.get(
      `/project-files/${projectId}/${fileId}`
    );

    return response.data;
  },

  // ===================================================
  // UPLOAD FILE
  // ===================================================

  uploadFile: async (
    projectId,
    file,
    onUploadProgress
  ) => {
    if (!projectId) {
      throw new Error("Project ID is required");
    }

    if (!file) {
      throw new Error("File is required");
    }

    const formData = new FormData();

    formData.append("file", file);

    const response = await api.post(
      `/project-files/${projectId}`,
      formData,
      {
        onUploadProgress,

        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  },

  // ===================================================
  // UPDATE FILE
  // ===================================================

  updateFile: async (
    projectId,
    fileId,
    file,
    onUploadProgress
  ) => {
    if (!projectId) {
      throw new Error("Project ID is required");
    }

    if (!fileId) {
      throw new Error("File ID is required");
    }

    if (!file) {
      throw new Error("New file is required");
    }

    const formData = new FormData();

    formData.append("file", file);

    const response = await api.put(
      `/project-files/${projectId}/${fileId}`,
      formData,
      {
        onUploadProgress,

        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  },

  // ===================================================
  // DELETE FILE
  // ===================================================

  deleteFile: async (projectId, fileId) => {
    if (!projectId || !fileId) {
      throw new Error(
        "Project ID and File ID are required"
      );
    }

    const response = await api.delete(
      `/project-files/${projectId}/${fileId}`
    );

    return response.data;
  },

  // ===================================================
  // AI EXPLAIN CODE
  // ===================================================

  explainCode: async (code) => {
    if (!code || !code.trim()) {
      throw new Error("Code is required");
    }

    const response = await api.post(
      "/ai/explain-code",
      {
        code,
      }
    );

    return response.data;
  },

  // ===================================================
  // AI GENERATE DOCS
  // ===================================================

  generateDocs: async (code) => {
    if (!code || !code.trim()) {
      throw new Error("Code is required");
    }

    const response = await api.post(
      "/ai/docs",
      {
        code,
      }
    );

    return response.data;
  },
};

export default fileService;