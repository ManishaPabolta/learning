import api from "./api";

// =====================================================
// GET COURSES
// =====================================================

export const getCourses = async ({
  page = 1,
  limit = 10,
  search = "",
} = {}) => {
  const response = await api.get("/courses", {
    params: {
      page,
      limit,
      search,
    },
  });

  console.log(
    "GET COURSES RESPONSE:",
    response.data
  );

  return response.data;
};

// =====================================================
// GET COURSE BY ID
// =====================================================

export const getCourseById = async (id) => {
  if (!id) {
    throw new Error(
      "Course ID is required"
    );
  }

  const response = await api.get(
    `/courses/${id}`
  );

  return response.data;
};

// =====================================================
// CREATE COURSE
// =====================================================
// Admin only
// =====================================================

export const createCourse = async (data) => {
  if (!data) {
    throw new Error(
      "Course data is required"
    );
  }

  const response = await api.post(
    "/courses",
    data
  );

  return response.data;
};

// =====================================================
// UPDATE COURSE
// =====================================================
// PATCH /courses/:id
// =====================================================

export const updateCourse = async (
  id,
  data
) => {
  if (!id) {
    throw new Error(
      "Course ID is required"
    );
  }

  if (!data) {
    throw new Error(
      "Course data is required"
    );
  }

  const response = await api.patch(
    `/courses/${id}`,
    data
  );

  return response.data;
};

// =====================================================
// DELETE COURSE
// =====================================================

export const deleteCourse = async (id) => {
  if (!id) {
    throw new Error(
      "Course ID is required"
    );
  }

  const response = await api.delete(
    `/courses/${id}`
  );

  return response.data;
};

// =====================================================
// ENROLL COURSE
// =====================================================

export const enrollCourse = async (id) => {
  if (!id) {
    throw new Error(
      "Course ID is required"
    );
  }

  const response = await api.post(
    `/courses/enroll/${id}`
  );

  return response.data;
};