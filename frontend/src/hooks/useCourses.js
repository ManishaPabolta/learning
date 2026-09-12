import { useCallback, useEffect, useState } from "react";
import api from "../services/api";

const useCourses = (options = {}) => {
  const {
    autoFetch = true,
    page = 1,
    limit = 10,
    search = "",
  } = options;

  const [courses, setCourses] = useState([]);
  const [course, setCourse] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(page);

  // ======================================================
  // GET ALL COURSES
  // ======================================================

  const fetchCourses = useCallback(
    async (customOptions = {}) => {
      try {
        setLoading(true);
        setError("");

        const currentPageValue =
          customOptions.page ?? currentPage;

        const limitValue =
          customOptions.limit ?? limit;

        const searchValue =
          customOptions.search ?? search;

        const response = await api.get("/courses", {
          params: {
            page: currentPageValue,
            limit: limitValue,
            ...(searchValue.trim()
              ? {
                  search: searchValue.trim(),
                }
              : {}),
          },
        });

        const data = response.data;

        setCourses(data.courses || []);
        setTotal(data.total || 0);
        setCurrentPage(
          data.page || currentPageValue
        );

        return data;
      } catch (err) {
        const message =
          err.response?.data?.message ||
          err.message ||
          "Failed to fetch courses";

        setError(message);
        setCourses([]);

        throw err;
      } finally {
        setLoading(false);
      }
    },
    [currentPage, limit, search]
  );

  // ======================================================
  // GET COURSE BY ID
  // ======================================================

  const fetchCourseById = useCallback(
    async (id) => {
      try {
        setLoading(true);
        setError("");

        if (!id) {
          throw new Error("Course ID is required");
        }

        const response = await api.get(
          `/courses/${id}`
        );

        const data = response.data;

        setCourse(data);

        return data;
      } catch (err) {
        const message =
          err.response?.data?.message ||
          err.message ||
          "Failed to fetch course";

        setError(message);
        setCourse(null);

        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // ======================================================
  // CREATE COURSE - ADMIN
  // ======================================================

  const createCourse = useCallback(
    async (courseData) => {
      try {
        setLoading(true);
        setError("");

        const response = await api.post(
          "/courses",
          courseData
        );

        const data = response.data;

        setCourses((prev) => [
          data,
          ...prev,
        ]);

        return data;
      } catch (err) {
        const message =
          err.response?.data?.message ||
          err.message ||
          "Failed to create course";

        setError(message);

        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // ======================================================
  // UPDATE COURSE - ADMIN
  // ======================================================

  const updateCourse = useCallback(
    async (id, courseData) => {
      try {
        setLoading(true);
        setError("");

        if (!id) {
          throw new Error(
            "Course ID is required"
          );
        }

        const response = await api.patch(
          `/courses/${id}`,
          courseData
        );

        const data = response.data;

        setCourses((prev) =>
          prev.map((item) =>
            item._id === id
              ? data
              : item
          )
        );

        setCourse(data);

        return data;
      } catch (err) {
        const message =
          err.response?.data?.message ||
          err.message ||
          "Failed to update course";

        setError(message);

        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // ======================================================
  // DELETE COURSE - ADMIN
  // ======================================================

  const deleteCourse = useCallback(
    async (id) => {
      try {
        setLoading(true);
        setError("");

        if (!id) {
          throw new Error(
            "Course ID is required"
          );
        }

        const response = await api.delete(
          `/courses/${id}`
        );

        const data = response.data;

        setCourses((prev) =>
          prev.filter(
            (item) => item._id !== id
          )
        );

        return data;
      } catch (err) {
        const message =
          err.response?.data?.message ||
          err.message ||
          "Failed to delete course";

        setError(message);

        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // ======================================================
  // ENROLL COURSE - USER
  // ======================================================

  const enrollCourse = useCallback(
    async (id) => {
      try {
        setLoading(true);
        setError("");

        if (!id) {
          throw new Error(
            "Course ID is required"
          );
        }

        const response = await api.post(
          `/courses/enroll/${id}`
        );

        const data = response.data;

        return data;
      } catch (err) {
        const message =
          err.response?.data?.message ||
          err.message ||
          "Failed to enroll course";

        setError(message);

        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // ======================================================
  // INITIAL FETCH
  // ======================================================

  useEffect(() => {
    if (!autoFetch) return;

    fetchCourses().catch(() => {});
  }, [autoFetch, fetchCourses]);

  // ======================================================
  // RETURN
  // ======================================================

  return {
    // Data
    courses,
    course,

    // State
    loading,
    error,

    // Pagination
    total,
    currentPage,

    // API functions
    fetchCourses,
    fetchCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
    enrollCourse,

    // Setters
    setCourses,
    setCourse,
    setCurrentPage,
  };
};

export default useCourses;