import { useCallback, useEffect, useState } from "react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const useAssignments = (autoFetch = true) => {
  const [assignments, setAssignments] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ============================================
  // GET ASSIGNMENTS
  // ============================================

  const fetchAssignments = useCallback(
    async (token) => {
      try {
        setLoading(true);
        setError("");

        if (!token) {
          throw new Error(
            "Authentication token is required"
          );
        }

        const response = await fetch(
          `${API_URL}/assignments`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to fetch assignments"
          );
        }

        setAssignments(
          Array.isArray(data)
            ? data
            : data.assignments || []
        );

        return data;
      } catch (err) {
        setError(
          err.message ||
            "Failed to fetch assignments"
        );

        setAssignments([]);

        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // ============================================
  // UPLOAD ASSIGNMENT
  // ============================================

  const uploadAssignment = useCallback(
    async ({
      file,
      courseId,
      token,
    }) => {
      try {
        setLoading(true);
        setError("");

        if (!file) {
          throw new Error(
            "Please select a file"
          );
        }

        if (!courseId) {
          throw new Error(
            "Please select a course"
          );
        }

        if (!token) {
          throw new Error(
            "Authentication token is required"
          );
        }

        const formData = new FormData();

        formData.append("file", file);
        formData.append(
          "courseId",
          courseId
        );

        const response = await fetch(
          `${API_URL}/assignments/upload`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to upload assignment"
          );
        }

        setAssignments((prev) => [
          data,
          ...prev,
        ]);

        return data;
      } catch (err) {
        setError(
          err.message ||
            "Failed to upload assignment"
        );

        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // ============================================
  // DELETE LOCAL ASSIGNMENT
  // ============================================
  // Backend mein delete endpoint nahi hai.
  // Isliye ye sirf frontend state update karega.

  const removeAssignmentFromState = useCallback(
    (assignmentId) => {
      setAssignments((prev) =>
        prev.filter(
          (assignment) =>
            assignment._id !== assignmentId
        )
      );
    },
    []
  );

  // ============================================
  // CLEAR ERROR
  // ============================================

  const clearError = useCallback(() => {
    setError("");
  }, []);

  return {
    assignments,

    loading,
    error,

    fetchAssignments,
    uploadAssignment,

    removeAssignmentFromState,
    clearError,

    setAssignments,
  };
};

export default useAssignments;