import axios from "axios";

import config from "../config/config";

import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
  clearAuthStorage,
} from "../utils/storage";

const api = axios.create({
  baseURL: config.API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });

  failedQueue = [];
};

// ======================================================
// REQUEST INTERCEPTOR
// ======================================================

api.interceptors.request.use(
  (requestConfig) => {
    const token = getAccessToken();

    if (token) {
      requestConfig.headers =
        requestConfig.headers || {};

      requestConfig.headers.Authorization =
        `Bearer ${token}`;
    }

    return requestConfig;
  },

  (error) => {
    return Promise.reject(error);
  }
);

// ======================================================
// RESPONSE INTERCEPTOR
// ======================================================

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const requestUrl = originalRequest.url || "";

    // ==================================================
    // DO NOT REFRESH AUTH REQUESTS
    // ==================================================

    const excludedRoutes = [
      "/auth/login",
      "/auth/register",
      "/auth/send-otp",
      "/auth/verify-otp",
      "/auth/refresh-token",
      "/auth/logout",
    ];

    const shouldSkipRefresh =
      excludedRoutes.some((route) =>
        requestUrl.includes(route)
      );

    if (shouldSkipRefresh) {
      return Promise.reject(error);
    }

    // ==================================================
    // ONLY HANDLE 401
    // ==================================================

    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // ==================================================
    // PREVENT INFINITE RETRY
    // ==================================================

    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    // ==================================================
    // REFRESH ALREADY RUNNING
    // ==================================================

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve,
          reject,
        });
      }).then((newToken) => {
        originalRequest.headers =
          originalRequest.headers || {};

        originalRequest.headers.Authorization =
          `Bearer ${newToken}`;

        return api(originalRequest);
      });
    }

    // ==================================================
    // START REFRESH
    // ==================================================

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const refreshToken = getRefreshToken();

      if (!refreshToken) {
        clearAuthStorage();

        processQueue(error, null);

        return Promise.reject(error);
      }

      // ==================================================
      // REFRESH ACCESS TOKEN
      // ==================================================

      const refreshResponse = await axios.post(
        `${config.API_URL}/auth/refresh-token`,
        {
          refreshToken,
        }
      );

      const newAccessToken =
        refreshResponse.data?.accessToken;

      const newRefreshToken =
        refreshResponse.data?.refreshToken;

      if (!newAccessToken) {
        throw new Error(
          "New access token was not received."
        );
      }

      // ==================================================
      // SAVE NEW TOKENS
      // ==================================================

      setAccessToken(newAccessToken);

      if (newRefreshToken) {
        setRefreshToken(newRefreshToken);
      }

      // ==================================================
      // RETRY WAITING REQUESTS
      // ==================================================

      processQueue(null, newAccessToken);

      // ==================================================
      // RETRY ORIGINAL REQUEST
      // ==================================================

      originalRequest.headers =
        originalRequest.headers || {};

      originalRequest.headers.Authorization =
        `Bearer ${newAccessToken}`;

      return api(originalRequest);

    } catch (refreshError) {
      console.error(
        "Token refresh failed:",
        refreshError
      );

      processQueue(refreshError, null);

      clearAuthStorage();

      return Promise.reject(refreshError);

    } finally {
      isRefreshing = false;
    }
  }
);

export default api;