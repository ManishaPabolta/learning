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
  (config) => {
    const token = getAccessToken();

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);

// ======================================================
// RESPONSE INTERCEPTOR
// ======================================================

api.interceptors.response.use(
  (response) => {
    return response;
  },

  async (error) => {
    const originalRequest = error.config;

    // No request config
    if (!originalRequest) {
      return Promise.reject(error);
    }

    const requestUrl = originalRequest.url || "";

    // ==================================================
    // NEVER REFRESH THESE APIs
    // ==================================================

    const excludedRoutes = [
      "/auth/login",
      "/auth/send-otp",
      "/auth/verify-otp",
      "/auth/refresh-token",
      "/auth/logout",
    ];

    const shouldSkipRefresh = excludedRoutes.some((route) =>
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
    // REQUEST ALREADY RETRIED
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

      // No refresh token
      if (!refreshToken) {
        clearAuthStorage();
        processQueue(error, null);

        return Promise.reject(error);
      }

      // ==================================================
      // CALL REFRESH TOKEN API
      // ==================================================

      const response = await axios.post(
        `${config.API_URL}/auth/refresh-token`,
        {
          refreshToken,
        }
      );

      // ==================================================
      // GET NEW TOKENS
      // ==================================================

      const newAccessToken =
        response.data?.accessToken;

      const newRefreshToken =
        response.data?.refreshToken;

      if (!newAccessToken) {
        throw new Error(
          "New access token was not received."
        );
      }

      // ==================================================
      // SAVE NEW ACCESS TOKEN
      // ==================================================

      setAccessToken(newAccessToken);

      if (newRefreshToken) {
        setRefreshToken(newRefreshToken);
      }

      // ==================================================
      // RELEASE WAITING REQUESTS
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