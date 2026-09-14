import { useCallback, useEffect, useState } from "react";
import api from "../services/api";

const useAssignments = (autoFetch = true) => {
  // =========================================================
  // STATE
  // =========================================================

  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =========================================================
  // CLEAR ERROR
  // =========================================================

  const clearError = useCallback(() => {
    setError("");
  }, []);

  // =========================================================
  // GET AVAILABLE ASSIGNMENTS - STUDENT
  // =========================================================
  // Sirf un courses ke assignments:
  // jisme current student enrolled hai.
  //
  // GET /assignments/available
  // =========================================================

  const fetchAvailableAssignments = useCallback(
    async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          "/assignments/available"
        );

        console.log(
          "AVAILABLE ASSIGNMENTS:",
          response.data
        );

        if (response.data?.success) {
          const assignmentList =
            Array.isArray(
              response.data.assignments
            )
              ? response.data.assignments
              : [];

          setAssignments(assignmentList);

          return assignmentList;
        }

        setAssignments([]);

        return [];
      } catch (err) {
        console.error(
          "GET AVAILABLE ASSIGNMENTS ERROR:",
          err
        );

        const message =
          err.response?.data?.message ||
          "Failed to load available assignments.";

        setError(message);
        setAssignments([]);

        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // =========================================================
  // GET MY SUBMISSIONS - STUDENT
  // =========================================================
  // Ye sirf student's submitted assignments deta hai.
  //
  // GET /assignments/my
  // =========================================================

  const fetchMyAssignments = useCallback(
    async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          "/assignments/my"
        );

        console.log(
          "MY ASSIGNMENTS:",
          response.data
        );

        if (response.data?.success) {
          const submissionList =
            Array.isArray(
              response.data.assignments
            )
              ? response.data.assignments
              : [];

          return {
            assignments: submissionList,
            submissions: Array.isArray(
              response.data.submissions
            )
              ? response.data.submissions
              : [],
          };
        }

        return {
          assignments: [],
          submissions: [],
        };
      } catch (err) {
        console.error(
          "GET MY ASSIGNMENTS ERROR:",
          err
        );

        const message =
          err.response?.data?.message ||
          "Failed to load your assignments.";

        setError(message);

        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // =========================================================
  // GET ALL ASSIGNMENTS - ADMIN
  // =========================================================
  //
  // GET /assignments
  //
  // Admin ke liye.
  // Isme assignments ke saath submissions bhi aayengi.
  // =========================================================

  const fetchAllAssignments = useCallback(
    async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          "/assignments"
        );

        console.log(
          "ALL ASSIGNMENTS:",
          response.data
        );

        if (response.data?.success) {
          const assignmentList =
            Array.isArray(
              response.data.assignments
            )
              ? response.data.assignments
              : [];

          setAssignments(assignmentList);

          return assignmentList;
        }

        setAssignments([]);

        return [];
      } catch (err) {
        console.error(
          "GET ALL ASSIGNMENTS ERROR:",
          err
        );

        const message =
          err.response?.data?.message ||
          "Failed to load assignments.";

        setError(message);
        setAssignments([]);

        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // =========================================================
  // GET SINGLE ASSIGNMENT
  // =========================================================
  //
  // GET /assignments/:id
  // =========================================================

  const fetchAssignmentById = useCallback(
    async (assignmentId) => {
      try {
        setLoading(true);
        setError("");

        if (!assignmentId) {
          throw new Error(
            "Assignment ID is required."
          );
        }

        const response = await api.get(
          `/assignments/${assignmentId}`
        );

        console.log(
          "ASSIGNMENT DETAILS:",
          response.data
        );

        if (response.data?.success) {
          return response.data.assignment;
        }

        throw new Error(
          response.data?.message ||
            "Assignment not found."
        );
      } catch (err) {
        console.error(
          "GET ASSIGNMENT ERROR:",
          err
        );

        const message =
          err.response?.data?.message ||
          err.message ||
          "Failed to load assignment.";

        setError(message);

        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // =========================================================
  // SUBMIT ASSIGNMENT - STUDENT
  // =========================================================
  //
  // POST /assignments/:assignmentId/submit
  //
  // FormData:
  // file
  // =========================================================

  const submitAssignment = useCallback(
    async ({
      assignmentId,
      file,
    }) => {
      try {
        setLoading(true);
        setError("");

        if (!assignmentId) {
          throw new Error(
            "Assignment ID is required."
          );
        }

        if (!file) {
          throw new Error(
            "Please select a file."
          );
        }

        const formData = new FormData();

        formData.append(
          "file",
          file
        );

        const response = await api.post(
          `/assignments/${assignmentId}/submit`,
          formData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

        console.log(
          "SUBMIT ASSIGNMENT:",
          response.data
        );

        if (!response.data?.success) {
          throw new Error(
            response.data?.message ||
              "Failed to submit assignment."
          );
        }

        return response.data;
      } catch (err) {
        console.error(
          "SUBMIT ASSIGNMENT ERROR:",
          err
        );

        const message =
          err.response?.data?.message ||
          err.message ||
          "Failed to submit assignment.";

        setError(message);

        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // =========================================================
  // UPDATE SUBMISSION - STUDENT
  // =========================================================
  //
  // PUT /assignments/submissions/:id
  //
  // Only pending/rejected submissions can be updated.
  // =========================================================

  const updateSubmission = useCallback(
    async ({
      submissionId,
      file,
    }) => {
      try {
        setLoading(true);
        setError("");

        if (!submissionId) {
          throw new Error(
            "Submission ID is required."
          );
        }

        if (!file) {
          throw new Error(
            "Please select a new file."
          );
        }

        const formData = new FormData();

        formData.append(
          "file",
          file
        );

        const response = await api.put(
          `/assignments/submissions/${submissionId}`,
          formData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

        console.log(
          "UPDATE SUBMISSION:",
          response.data
        );

        if (!response.data?.success) {
          throw new Error(
            response.data?.message ||
              "Failed to update submission."
          );
        }

        return response.data;
      } catch (err) {
        console.error(
          "UPDATE SUBMISSION ERROR:",
          err
        );

        const message =
          err.response?.data?.message ||
          err.message ||
          "Failed to update submission.";

        setError(message);

        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // =========================================================
  // DELETE SUBMISSION - STUDENT
  // =========================================================
  //
  // DELETE /assignments/submissions/:id
  //
  // Only pending/rejected submissions can be deleted.
  // =========================================================

  const deleteSubmission = useCallback(
    async (submissionId) => {
      try {
        setLoading(true);
        setError("");

        if (!submissionId) {
          throw new Error(
            "Submission ID is required."
          );
        }

        const response = await api.delete(
          `/assignments/submissions/${submissionId}`
        );

        console.log(
          "DELETE SUBMISSION:",
          response.data
        );

        if (!response.data?.success) {
          throw new Error(
            response.data?.message ||
              "Failed to delete submission."
          );
        }

        return response.data;
      } catch (err) {
        console.error(
          "DELETE SUBMISSION ERROR:",
          err
        );

        const message =
          err.response?.data?.message ||
          err.message ||
          "Failed to delete submission.";

        setError(message);

        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // =========================================================
  // APPROVE SUBMISSION - ADMIN
  // =========================================================
  //
  // PATCH /assignments/submissions/:id/approve
  // =========================================================

  const approveSubmission = useCallback(
    async ({
      submissionId,
      feedback = "",
    }) => {
      try {
        setLoading(true);
        setError("");

        if (!submissionId) {
          throw new Error(
            "Submission ID is required."
          );
        }

        const response = await api.patch(
          `/assignments/submissions/${submissionId}/approve`,
          {
            feedback,
          }
        );

        console.log(
          "APPROVE SUBMISSION:",
          response.data
        );

        if (!response.data?.success) {
          throw new Error(
            response.data?.message ||
              "Failed to approve submission."
          );
        }

        return response.data;
      } catch (err) {
        console.error(
          "APPROVE SUBMISSION ERROR:",
          err
        );

        const message =
          err.response?.data?.message ||
          err.message ||
          "Failed to approve submission.";

        setError(message);

        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // =========================================================
  // REJECT SUBMISSION - ADMIN
  // =========================================================
  //
  // PATCH /assignments/submissions/:id/reject
  // =========================================================

  const rejectSubmission = useCallback(
    async ({
      submissionId,
      feedback = "",
    }) => {
      try {
        setLoading(true);
        setError("");

        if (!submissionId) {
          throw new Error(
            "Submission ID is required."
          );
        }

        const response = await api.patch(
          `/assignments/submissions/${submissionId}/reject`,
          {
            feedback,
          }
        );

        console.log(
          "REJECT SUBMISSION:",
          response.data
        );

        if (!response.data?.success) {
          throw new Error(
            response.data?.message ||
              "Failed to reject submission."
          );
        }

        return response.data;
      } catch (err) {
        console.error(
          "REJECT SUBMISSION ERROR:",
          err
        );

        const message =
          err.response?.data?.message ||
          err.message ||
          "Failed to reject submission.";

        setError(message);

        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // =========================================================
  // REMOVE FROM LOCAL STATE
  // =========================================================

  const removeAssignmentFromState =
    useCallback((assignmentId) => {
      setAssignments((prev) =>
        prev.filter(
          (assignment) =>
            assignment._id !== assignmentId
        )
      );
    }, []);

  // =========================================================
  // AUTO FETCH
  // =========================================================
  //
  // Default mein student available assignments fetch honge.
  //
  // Agar kisi page par autoFetch={false} diya:
  // automatically request nahi jayegi.
  // =========================================================

  useEffect(() => {
    if (!autoFetch) {
      return;
    }

    fetchAvailableAssignments().catch(() => {
      // Error already handled inside function.
    });
  }, [
    autoFetch,
    fetchAvailableAssignments,
  ]);

  // =========================================================
  // RETURN
  // =========================================================

  return {
    // State
    assignments,
    setAssignments,

    loading,
    error,

    // Student
    fetchAvailableAssignments,
    fetchMyAssignments,

    // Admin
    fetchAllAssignments,

    // Single assignment
    fetchAssignmentById,

    // Submission
    submitAssignment,
    updateSubmission,
    deleteSubmission,

    // Admin review
    approveSubmission,
    rejectSubmission,

    // Local state
    removeAssignmentFromState,

    // Error
    clearError,
  };
};

export default useAssignments;