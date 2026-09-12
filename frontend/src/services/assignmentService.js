import api from "./api";

/*
|--------------------------------------------------------------------------
| Upload Assignment
|--------------------------------------------------------------------------
*/

export const uploadAssignment = async ({
  file,
  courseId,
}) => {
  const formData = new FormData();

  formData.append(
    "file",
    file
  );

  formData.append(
    "courseId",
    courseId
  );

  const response = await api.post(
    "/assignments/upload",
    formData,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    }
  );

  return response.data;
};

/*
|--------------------------------------------------------------------------
| Get Uploaded Assignments
|--------------------------------------------------------------------------
*/

export const getAssignments = async () => {
  const response = await api.get(
    "/assignments"
  );

  return response.data;
};