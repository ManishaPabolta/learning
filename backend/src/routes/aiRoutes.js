const express = require("express");

const router = express.Router();

const {
  // Existing LMS AI
  chat,
  generateFeedback,
  generateCourse,
  createAssignmentWithAI,
  summarize,
  recommendations,
  aiSearch,

  // CollabSphere AI
  explainProjectNote,
  improveProjectNote,
  explainProjectCode,
  generateProjectDocs,
  generateProjectReadme,
} = require("../controllers/aiController");

const auth = require("../middleware/auth");


// ======================================================
// STUDENT AI
// ======================================================

// AI Chatbot
router.post(
  "/chat",
  auth,
  chat
);

// AI Recommendations
router.post(
  "/recommendations",
  auth,
  recommendations
);

// AI Search
router.post(
  "/search",
  auth,
  aiSearch
);

// AI Summary
router.post(
  "/summarize",
  auth,
  summarize
);


// ======================================================
// ADMIN / REVIEW AI
// ======================================================

// AI Assignment Feedback
router.post(
  "/feedback",
  auth,
  generateFeedback
);

// AI Course Generator
router.post(
  "/generate-course",
  auth,
  generateCourse
);

// AI Assignment Generator
router.post(
  "/generate-assignment",
  auth,
  createAssignmentWithAI
);


// ======================================================
// COLLABSPHERE AI
// ======================================================

// Explain Markdown note
router.post(
  "/explain-note",
  auth,
  explainProjectNote
);

// Suggest improvements for Markdown note
router.post(
  "/improve-note",
  auth,
  improveProjectNote
);

// Explain uploaded/source code
router.post(
  "/explain-code",
  auth,
  explainProjectCode
);

// Generate documentation from code
router.post(
  "/docs",
  auth,
  generateProjectDocs
);

// Generate README
router.post(
  "/readme",
  auth,
  generateProjectReadme
);


module.exports = router;