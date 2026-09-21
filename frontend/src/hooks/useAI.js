import { useState } from "react";

import {
  chatWithAI,
  getAIRecommendations,
  searchWithAI,
  summarizeWithAI,
  generateCourseWithAI,
  generateAssignmentWithAI,
  generateAIFeedback,
} from "../services/aiApi";

const useAI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const clearError = () => {
    setError("");
  };

  // ======================================================
  // CHAT
  // ======================================================

  const chat = async (data) => {
    try {
      setLoading(true);
      setError("");

      const response = await chatWithAI(data);

      return response;
    } catch (err) {
      console.error("AI Chat Error:", err);

      const message =
        err.response?.data?.message ||
        err.message ||
        "AI chat failed.";

      setError(message);

      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // RECOMMENDATIONS
  // ======================================================

  const recommendations = async (data) => {
    try {
      setLoading(true);
      setError("");

      const response = await getAIRecommendations(data);

      return response;
    } catch (err) {
      console.error("AI Recommendation Error:", err);

      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to generate recommendations.";

      setError(message);

      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // SEARCH
  // ======================================================

  const aiSearch = async (data) => {
    try {
      setLoading(true);
      setError("");

      const response = await searchWithAI(data);

      return response;
    } catch (err) {
      console.error("AI Search Error:", err);

      const message =
        err.response?.data?.message ||
        err.message ||
        "AI search failed.";

      setError(message);

      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // SUMMARY
  // ======================================================

  const summarize = async (content) => {
    try {
      setLoading(true);
      setError("");

      const response = await summarizeWithAI(content);

      return response;
    } catch (err) {
      console.error("AI Summary Error:", err);

      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to summarize content.";

      setError(message);

      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // COURSE GENERATOR
  // ======================================================

  const generateCourse = async (data) => {
    try {
      setLoading(true);
      setError("");

      const response = await generateCourseWithAI(data);

      return response;
    } catch (err) {
      console.error("AI Course Generation Error:", err);

      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to generate course.";

      setError(message);

      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // ASSIGNMENT GENERATOR
  // ======================================================

  const generateAssignment = async (data) => {
    try {
      setLoading(true);
      setError("");

      const response = await generateAssignmentWithAI(data);

      return response;
    } catch (err) {
      console.error("AI Assignment Generation Error:", err);

      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to generate assignment.";

      setError(message);

      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // FEEDBACK
  // ======================================================

  const generateFeedback = async (data) => {
    try {
      setLoading(true);
      setError("");

      const response = await generateAIFeedback(data);

      return response;
    } catch (err) {
      console.error("AI Feedback Error:", err);

      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to generate AI feedback.";

      setError(message);

      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    clearError,

    chat,
    recommendations,
    aiSearch,
    summarize,
    generateCourse,
    generateAssignment,
    generateFeedback,
  };
};

export default useAI;