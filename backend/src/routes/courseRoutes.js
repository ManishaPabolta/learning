const express = require("express");

const router = express.Router();

const {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  enrollCourse,
} = require("../controllers/courseController");

const auth = require("../middleware/auth");

const role = require("../middleware/role");

// =====================================================
// PUBLIC ROUTES
// =====================================================

// Get all courses
router.get("/", getCourses);

// Get single course
router.get("/:id", getCourseById);


// =====================================================
// ADMIN ROUTES
// =====================================================

// Create course
router.post(
  "/",
  auth,
  role("admin"),
  createCourse
);

// Update course
router.patch(
  "/:id",
  auth,
  role("admin"),
  updateCourse
);

// Delete course
router.delete(
  "/:id",
  auth,
  role("admin"),
  deleteCourse
);


// =====================================================
// STUDENT / USER ROUTE
// =====================================================

// Enroll in course
router.post(
  "/enroll/:id",
  auth,
  enrollCourse
);


module.exports = router;