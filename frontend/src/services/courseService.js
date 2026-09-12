import api from "./api";

/*
|--------------------------------------------------------------------------
| Get Courses
|--------------------------------------------------------------------------
|
| Supports:
| ?page=1
| ?limit=10
| ?search=react
|
*/

export const getCourses = async ({
  page = 1,
  limit = 10,
  search = "",
} = {}) => {
  const response = await api.get(
    "/courses",
    {
      params: {
        page,
        limit,
        search,
      },
    }
  );

  return response.data;
};

/*
|--------------------------------------------------------------------------
| Get Course By ID
|--------------------------------------------------------------------------
*/

export const getCourseById = async (id) => {
  const response = await api.get(
    `/courses/${id}`
  );

  return response.data;
};

/*
|--------------------------------------------------------------------------
| Create Course
|--------------------------------------------------------------------------
| Admin only
*/

export const createCourse = async (data) => {
  const response = await api.post(
    "/courses",
    data
  );

  return response.data;
};

/*
|--------------------------------------------------------------------------
| Update Course
|--------------------------------------------------------------------------
| PATCH /courses/:id
*/

export const updateCourse = async (
  id,
  data
) => {
  const response = await api.patch(
    `/courses/${id}`,
    data
  );

  return response.data;
};

/*
|--------------------------------------------------------------------------
| Delete Course
|--------------------------------------------------------------------------
*/

export const deleteCourse = async (id) => {
  const response = await api.delete(
    `/courses/${id}`
  );

  return response.data;
};

/*
|--------------------------------------------------------------------------
| Enroll Course
|--------------------------------------------------------------------------
*/

export const enrollCourse = async (id) => {
  const response = await api.post(
    `/courses/enroll/${id}`
  );

  return response.data;
};