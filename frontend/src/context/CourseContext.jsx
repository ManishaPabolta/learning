import {
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";

import {
  getCourses as getCoursesApi,
  getCourseById as getCourseByIdApi,
  createCourse as createCourseApi,
  updateCourse as updateCourseApi,
  deleteCourse as deleteCourseApi,
  enrollCourse as enrollCourseApi,
} from "../services/courseService";

import { getErrorMessage } from "../utils/helpers";

const CourseContext = createContext(null);

export const CourseProvider = ({
  children,
}) => {
  // --------------------------------------------------
  // State
  // --------------------------------------------------

  const [courses, setCourses] = useState([]);

  const [selectedCourse, setSelectedCourse] =
    useState(null);

  const [totalCourses, setTotalCourses] =
    useState(0);

  const [currentPage, setCurrentPage] =
    useState(1);

  const [limit, setLimit] = useState(10);

  const [search, setSearch] =
    useState("");

  const [isLoading, setIsLoading] =
    useState(false);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [error, setError] = useState(null);

  // --------------------------------------------------
  // Clear Error
  // --------------------------------------------------

  const clearError = () => {
    setError(null);
  };

  // --------------------------------------------------
  // Get All Courses
  // --------------------------------------------------

  const fetchCourses = useCallback(
    async ({
      page = 1,
      limit: courseLimit = 10,
      search: searchValue = "",
    } = {}) => {
      try {
        setIsLoading(true);
        setError(null);

        const response =
          await getCoursesApi({
            page,
            limit: courseLimit,
            search: searchValue,
          });

        setCourses(
          response?.courses || []
        );

        setTotalCourses(
          response?.total || 0
        );

        setCurrentPage(
          response?.page || page
        );

        setLimit(courseLimit);

        setSearch(searchValue);

        return {
          success: true,
          data: response,
        };
      } catch (error) {
        const message = getErrorMessage(
          error,
          "Unable to load courses"
        );

        setError(message);

        return {
          success: false,
          message,
        };
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // --------------------------------------------------
  // Get Course By ID
  // --------------------------------------------------

  const fetchCourseById = async (
    courseId
  ) => {
    try {
      setIsLoading(true);
      setError(null);

      const response =
        await getCourseByIdApi(
          courseId
        );

      setSelectedCourse(response);

      return {
        success: true,
        data: response,
      };
    } catch (error) {
      const message = getErrorMessage(
        error,
        "Unable to load course"
      );

      setError(message);

      return {
        success: false,
        message,
      };
    } finally {
      setIsLoading(false);
    }
  };

  // --------------------------------------------------
  // Create Course
  // --------------------------------------------------

  const createCourse = async (
    courseData
  ) => {
    try {
      setIsSubmitting(true);
      setError(null);

      const response =
        await createCourseApi(
          courseData
        );

      /*
       * Add newly created course
       * to current course list.
       */

      if (response) {
        setCourses((previous) => [
          response,
          ...previous,
        ]);

        setTotalCourses(
          (previous) => previous + 1
        );
      }

      return {
        success: true,
        data: response,
      };
    } catch (error) {
      const message = getErrorMessage(
        error,
        "Unable to create course"
      );

      setError(message);

      return {
        success: false,
        message,
      };
    } finally {
      setIsSubmitting(false);
    }
  };

  // --------------------------------------------------
  // Update Course
  // --------------------------------------------------

  const updateCourse = async (
    courseId,
    courseData
  ) => {
    try {
      setIsSubmitting(true);
      setError(null);

      const response =
        await updateCourseApi(
          courseId,
          courseData
        );

      /*
       * Update course in local state.
       */

      setCourses((previous) =>
        previous.map((course) =>
          course._id === courseId
            ? response
            : course
        )
      );

      /*
       * Update selected course
       * if currently opened.
       */

      if (
        selectedCourse?._id === courseId
      ) {
        setSelectedCourse(response);
      }

      return {
        success: true,
        data: response,
      };
    } catch (error) {
      const message = getErrorMessage(
        error,
        "Unable to update course"
      );

      setError(message);

      return {
        success: false,
        message,
      };
    } finally {
      setIsSubmitting(false);
    }
  };

  // --------------------------------------------------
  // Delete Course
  // --------------------------------------------------

  const deleteCourse = async (
    courseId
  ) => {
    try {
      setIsSubmitting(true);
      setError(null);

      const response =
        await deleteCourseApi(
          courseId
        );

      /*
       * Remove deleted course locally.
       */

      setCourses((previous) =>
        previous.filter(
          (course) =>
            course._id !== courseId
        )
      );

      setTotalCourses(
        (previous) =>
          Math.max(previous - 1, 0)
      );

      /*
       * Clear selected course if deleted.
       */

      if (
        selectedCourse?._id === courseId
      ) {
        setSelectedCourse(null);
      }

      return {
        success: true,
        data: response,
      };
    } catch (error) {
      const message = getErrorMessage(
        error,
        "Unable to delete course"
      );

      setError(message);

      return {
        success: false,
        message,
      };
    } finally {
      setIsSubmitting(false);
    }
  };

  // --------------------------------------------------
  // Enroll Course
  // --------------------------------------------------

  const enrollCourse = async (
    courseId
  ) => {
    try {
      setIsSubmitting(true);
      setError(null);

      const response =
        await enrollCourseApi(
          courseId
        );

      return {
        success: true,
        data: response,
      };
    } catch (error) {
      const message = getErrorMessage(
        error,
        "Unable to enroll in course"
      );

      setError(message);

      return {
        success: false,
        message,
      };
    } finally {
      setIsSubmitting(false);
    }
  };

  // --------------------------------------------------
  // Pagination
  // --------------------------------------------------

  const nextPage = async () => {
    const totalPages =
      Math.ceil(
        totalCourses / limit
      );

    if (currentPage >= totalPages) {
      return;
    }

    return fetchCourses({
      page: currentPage + 1,
      limit,
      search,
    });
  };

  const previousPage = async () => {
    if (currentPage <= 1) {
      return;
    }

    return fetchCourses({
      page: currentPage - 1,
      limit,
      search,
    });
  };

  // --------------------------------------------------
  // Search
  // --------------------------------------------------

  const searchCourses = async (
    searchValue
  ) => {
    return fetchCourses({
      page: 1,
      limit,
      search: searchValue,
    });
  };

  // --------------------------------------------------
  // Reset
  // --------------------------------------------------

  const clearSelectedCourse = () => {
    setSelectedCourse(null);
  };

  // --------------------------------------------------
  // Context Value
  // --------------------------------------------------

  const value = {
    // Data
    courses,
    selectedCourse,
    totalCourses,

    // Pagination
    currentPage,
    limit,

    // Search
    search,

    // State
    isLoading,
    isSubmitting,
    error,

    // Course methods
    fetchCourses,
    fetchCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
    enrollCourse,

    // Pagination methods
    nextPage,
    previousPage,

    // Search
    searchCourses,

    // Utilities
    clearError,
    clearSelectedCourse,
  };

  return (
    <CourseContext.Provider value={value}>
      {children}
    </CourseContext.Provider>
  );
};

// --------------------------------------------------
// Custom Hook
// --------------------------------------------------

export const useCourses = () => {
  const context =
    useContext(CourseContext);

  if (!context) {
    throw new Error(
      "useCourses must be used inside CourseProvider"
    );
  }

  return context;
};

export default CourseContext;