import { useCallback, useState } from "react";
import noteService from "../services/noteService";

const useNotes = (projectId) => {
  const [notes, setNotes] = useState([]);
  const [note, setNote] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =====================================================
  // GET ALL PROJECT NOTES
  // =====================================================

  const getNotes = useCallback(async () => {
    if (!projectId) {
      setNotes([]);
      return [];
    }

    try {
      setLoading(true);
      setError("");

      const result = await noteService.getNotes(projectId);

      /*
        Backend response:

        {
          success: true,
          data: [ ...notes ]
        }
      */

      const noteList = Array.isArray(result?.data)
        ? result.data
        : Array.isArray(result?.data?.notes)
        ? result.data.notes
        : Array.isArray(result?.notes)
        ? result.notes
        : [];

      setNotes(noteList);

      return noteList;
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to load notes";

      setError(message);
      setNotes([]);

      throw error;
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  // =====================================================
  // GET SINGLE NOTE
  // =====================================================

  const getNote = useCallback(async (id) => {
    if (!id) {
      throw new Error("Note ID is required");
    }

    try {
      setLoading(true);
      setError("");

      const result = await noteService.getNote(id);

      /*
        Supports:

        {
          success: true,
          data: note
        }

        OR

        {
          success: true,
          data: {
            note: note
          }
        }
      */

      const noteData =
        result?.data?.note ||
        result?.data ||
        result?.note ||
        null;

      setNote(noteData);

      return noteData;
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to load note";

      setError(message);

      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // =====================================================
  // CREATE NOTE
  // =====================================================

  const createNote = useCallback(
    async (data) => {
      if (!projectId) {
        throw new Error("Project ID is required");
      }

      if (!data?.title?.trim()) {
        throw new Error("Note title is required");
      }

      try {
        setLoading(true);
        setError("");

        const payload = {
          ...data,
          title: data.title.trim(),
          project: projectId,
          content: data.content || "",
          tags: Array.isArray(data.tags) ? data.tags : [],
        };

        console.log("Creating note:", payload);

        const result =
          await noteService.createNote(payload);

        console.log("Create note response:", result);

        /*
          Backend returns:

          {
            success: true,
            message: "...",
            data: savedNote
          }
        */

        const createdNote =
          result?.data?.note ||
          result?.data ||
          result?.note ||
          null;

        if (!createdNote) {
          throw new Error(
            "Note was created but server returned no note data"
          );
        }

        /*
          Immediately update local state.

          This makes the newly-created note available
          even before another GET request completes.
        */

        setNotes((prev) => {
          const exists = prev.some(
            (item) => item._id === createdNote._id
          );

          if (exists) {
            return prev;
          }

          return [createdNote, ...prev];
        });

        setNote(createdNote);

        /*
          Also refresh from MongoDB.

          This confirms that the note really exists
          in the database and keeps the UI synchronized.
        */

        await getNotes();

        return createdNote;
      } catch (error) {
        const message =
          error?.response?.data?.message ||
          error?.message ||
          "Failed to create note";

        setError(message);

        console.error(
          "Create note error:",
          error?.response?.data || error
        );

        throw error;
      } finally {
        setLoading(false);
      }
    },
    [projectId, getNotes]
  );

  // =====================================================
  // UPDATE NOTE
  // =====================================================

  const updateNote = useCallback(
    async (id, data) => {
      if (!id) {
        throw new Error("Note ID is required");
      }

      try {
        setLoading(true);
        setError("");

        const payload = {
          ...data,
          title: data?.title?.trim(),
          content: data?.content || "",
          tags: Array.isArray(data?.tags)
            ? data.tags
            : [],
        };

        const result =
          await noteService.updateNote(id, payload);

        const updatedNote =
          result?.data?.note ||
          result?.data ||
          result?.note ||
          null;

        if (updatedNote) {
          setNote(updatedNote);

          setNotes((prev) =>
            prev.map((item) =>
              item._id === updatedNote._id
                ? updatedNote
                : item
            )
          );
        }

        await getNotes();

        return updatedNote || result;
      } catch (error) {
        const message =
          error?.response?.data?.message ||
          error?.message ||
          "Failed to update note";

        setError(message);

        console.error(
          "Update note error:",
          error?.response?.data || error
        );

        throw error;
      } finally {
        setLoading(false);
      }
    },
    [getNotes]
  );

  // =====================================================
  // DELETE NOTE
  // =====================================================

  const deleteNote = useCallback(async (id) => {
    if (!id) {
      throw new Error("Note ID is required");
    }

    try {
      setLoading(true);
      setError("");

      await noteService.deleteNote(id);

      setNotes((prev) =>
        prev.filter((item) => item._id !== id)
      );

      if (note?._id === id) {
        setNote(null);
      }
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to delete note";

      setError(message);

      console.error(
        "Delete note error:",
        error?.response?.data || error
      );

      throw error;
    } finally {
      setLoading(false);
    }
  }, [note]);

  // =====================================================
  // AI - EXPLAIN NOTE
  // =====================================================

  const explainNote = useCallback(async (content) => {
    if (!content?.trim()) {
      throw new Error("Note content is required");
    }

    return noteService.explainNote(content);
  }, []);

  // =====================================================
  // AI - IMPROVE NOTE
  // =====================================================

  const improveNote = useCallback(async (content) => {
    if (!content?.trim()) {
      throw new Error("Note content is required");
    }

    return noteService.improveNote(content);
  }, []);

  // =====================================================
  // RETURN
  // =====================================================

  return {
    notes,
    note,
    loading,
    error,

    getNotes,
    getNote,

    createNote,
    updateNote,
    deleteNote,

    explainNote,
    improveNote,
  };
};

export default useNotes;