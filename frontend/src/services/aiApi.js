import api from "./api";

// ======================================================
// AI CHATBOT
// ======================================================

export const chatWithAI = async ({
  message,
  courseContext = "",
  assignmentContext = "",
}) => {
  const response = await api.post("/ai/chat", {
    message,
    courseContext,
    assignmentContext,
  });

  return response.data;
};

// ======================================================
// AI RECOMMENDATIONS
// ======================================================

export const getAIRecommendations = async ({
  studentProfile = {},
  enrolledCourses = [],
  completedCourses = [],
  availableCourses = [],
  performance = {},
}) => {
  const response = await api.post("/ai/recommendations", {
    studentProfile,
    enrolledCourses,
    completedCourses,
    availableCourses,
    performance,
  });

  return response.data;
};

// ======================================================
// AI SEARCH
// ======================================================

export const searchWithAI = async ({
  query,
  courses = [],
}) => {
  const response = await api.post("/ai/search", {
    query,
    courses,
  });

  return response.data;
};

// ======================================================
// AI SUMMARIZATION
// ======================================================

export const summarizeWithAI = async (content) => {
  const response = await api.post("/ai/summarize", {
    content,
  });

  return response.data;
};

// ======================================================
// AI COURSE CONTENT GENERATOR
// ======================================================

export const generateCourseWithAI = async ({
  topic,
  difficulty = "Beginner",
  audience = "Students",
  duration = "",
}) => {
  const response = await api.post("/ai/generate-course", {
    topic,
    difficulty,
    audience,
    duration,
  });

  return response.data;
};

// ======================================================
// AI ASSIGNMENT GENERATOR
// ======================================================

export const generateAssignmentWithAI = async ({
  topic,
  difficulty = "Beginner",
  courseName = "",
}) => {
  const response = await api.post("/ai/generate-assignment", {
    topic,
    difficulty,
    courseName,
  });

  return response.data;
};

// ======================================================
// AI ASSIGNMENT FEEDBACK
// ======================================================

export const generateAIFeedback = async ({
  assignmentTitle,
  assignmentDescription,
  requirements,
  studentSubmission,
}) => {
  const response = await api.post("/ai/feedback", {
    assignmentTitle,
    assignmentDescription,
    requirements,
    studentSubmission,
  });

  return response.data;
};