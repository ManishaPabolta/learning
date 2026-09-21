import api from "./api";

const noteService = {
  // ===================================================
  // GET PROJECT NOTES
  // ===================================================

  getNotes: async (projectId) => {
    if (!projectId) {
      throw new Error(
        "Project ID is required"
      );
    }

    const response = await api.get(
      `/notes/project/${projectId}`
    );

    return response.data;
  },

  // ===================================================
  // GET SINGLE NOTE
  // ===================================================

  getNote: async (id) => {
    if (!id) {
      throw new Error(
        "Note ID is required"
      );
    }

    const response = await api.get(
      `/notes/${id}`
    );

    return response.data;
  },

  // ===================================================
  // CREATE NOTE
  // ===================================================

  createNote: async (noteData) => {
    if (!noteData) {
      throw new Error(
        "Note data is required"
      );
    }

    const response = await api.post(
      "/notes",
      noteData
    );

    return response.data;
  },

  // ===================================================
  // UPDATE NOTE
  // ===================================================

  updateNote: async (
    id,
    noteData
  ) => {
    if (!id) {
      throw new Error(
        "Note ID is required"
      );
    }

    if (!noteData) {
      throw new Error(
        "Note data is required"
      );
    }

    const response = await api.put(
      `/notes/${id}`,
      noteData
    );

    return response.data;
  },

  // ===================================================
  // DELETE NOTE
  // ===================================================

  deleteNote: async (id) => {
    if (!id) {
      throw new Error(
        "Note ID is required"
      );
    }

    const response = await api.delete(
      `/notes/${id}`
    );

    return response.data;
  },

  // ===================================================
  // AI EXPLAIN NOTE
  // ===================================================

  explainNote: async (
    content
  ) => {
    const response = await api.post(
      "/ai/explain-note",
      {
        content,
      }
    );

    return response.data;
  },

  // ===================================================
  // AI IMPROVE NOTE
  // ===================================================

  improveNote: async (
    content
  ) => {
    const response = await api.post(
      "/ai/improve-note",
      {
        content,
      }
    );

    return response.data;
  },
};

export default noteService;