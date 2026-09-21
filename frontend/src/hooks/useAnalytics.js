import {
  useCallback,
  useState,
} from "react";

import analyticsService from "../services/analyticsService";

const useAnalytics = () => {
  const [analytics, setAnalytics] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const getAnalytics = useCallback(
    async (projectId) => {
      try {
        setLoading(true);
        setError("");

        const response =
          await analyticsService.getAnalytics(
            projectId
          );

        const data =
          response?.data?.data ??
          response?.data ??
          null;

        setAnalytics(data);

        return data;
      } catch (err) {
        console.error(
          "Get Analytics Error:",
          err
        );

        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to load analytics."
        );

        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const clearAnalytics = useCallback(() => {
    setAnalytics(null);
    setError("");
  }, []);

  return {
    analytics,
    loading,
    error,

    getAnalytics,
    clearAnalytics,
  };
};

export default useAnalytics;