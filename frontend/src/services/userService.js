import api from "./api";

export const getProfile = async () => {
  const response = await api.get(
    "/auth/me"
  );

  return response.data;
};

export const logout = async () => {
  const response = await api.post(
    "/auth/logout"
  );

  return response.data;
};