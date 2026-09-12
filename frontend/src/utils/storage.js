import config from "../config/config";

export const setAccessToken = (token) => {
  if (!token) return;

  localStorage.setItem(config.TOKEN_KEY, token);
};

export const getAccessToken = () => {
  return localStorage.getItem(config.TOKEN_KEY);
};

export const removeAccessToken = () => {
  localStorage.removeItem(config.TOKEN_KEY);
};

export const setRefreshToken = (token) => {
  if (!token) return;

  localStorage.setItem(config.REFRESH_TOKEN_KEY, token);
};

export const getRefreshToken = () => {
  return localStorage.getItem(config.REFRESH_TOKEN_KEY);
};

export const removeRefreshToken = () => {
  localStorage.removeItem(config.REFRESH_TOKEN_KEY);
};

export const setUser = (user) => {
  if (!user) return;

  localStorage.setItem(
    config.USER_KEY,
    JSON.stringify(user)
  );
};

export const getUser = () => {
  const user = localStorage.getItem(config.USER_KEY);

  if (!user) return null;

  try {
    return JSON.parse(user);
  } catch {
    return null;
  }
};

export const removeUser = () => {
  localStorage.removeItem(config.USER_KEY);
};

export const clearAuthStorage = () => {
  removeAccessToken();
  removeRefreshToken();
  removeUser();
};