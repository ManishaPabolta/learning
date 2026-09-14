const express = require("express");

const router = express.Router();

// =====================================================
// CONTROLLERS
// =====================================================

const {
  createAssignment,
  getAssignments,
  getAvailableAssignments,
  getMyAssignments,
  getAssignmentById,
  submitAssignment,
  approveSubmission,
  rejectSubmission,
  updateSubmission,
  deleteSubmission,
  deleteAssignment, // ⭐ IMPORTANT
} = require("../controllers/assignmentController");

// =====================================================
// MIDDLEWARE
// =====================================================

const auth = require("../middleware/auth");
const role = require("../middleware/role");
const upload = require("../middleware/upload");

// =====================================================
// ADMIN
// =====================================================

// -----------------------------------------------------
// CREATE ASSIGNMENT
// POST /api/assignments
// -----------------------------------------------------

router.post(
  "/",
  auth,
  role("admin"),
  upload.single("file"),
  createAssignment
);

// -----------------------------------------------------
// GET ALL ASSIGNMENTS
// GET /api/assignments
// -----------------------------------------------------

router.get(
  "/",
  auth,
  role("admin"),
  getAssignments
);

// -----------------------------------------------------
// DELETE ASSIGNMENT
// DELETE /api/assignments/:id
//
// This deletes:
// 1. Assignment
// 2. Admin assignment attachment
// 3. All student submissions
// 4. Student submitted files from Cloudinary
// -----------------------------------------------------

router.delete(
  "/:id",
  auth,
  role("admin"),
  deleteAssignment
);

// =====================================================
// STUDENT
// =====================================================

// -----------------------------------------------------
// GET AVAILABLE ASSIGNMENTS
// GET /api/assignments/available
//
// Shows assignments for courses in which
// the current student is enrolled.
// -----------------------------------------------------

router.get(
  "/available",
  auth,
  role("user"),
  getAvailableAssignments
);

// -----------------------------------------------------
// GET MY SUBMITTED ASSIGNMENTS
// GET /api/assignments/my
// -----------------------------------------------------

router.get(
  "/my",
  auth,
  role("user"),
  getMyAssignments
);

// -----------------------------------------------------
// SUBMIT ASSIGNMENT
// POST /api/assignments/:assignmentId/submit
// -----------------------------------------------------

router.post(
  "/:assignmentId/submit",
  auth,
  role("user"),
  upload.single("file"),
  submitAssignment
);

// -----------------------------------------------------
// UPDATE / RESUBMIT
// PUT /api/assignments/submissions/:id
// -----------------------------------------------------

router.put(
  "/submissions/:id",
  auth,
  role("user"),
  upload.single("file"),
  updateSubmission
);

// -----------------------------------------------------
// DELETE STUDENT SUBMISSION
// DELETE /api/assignments/submissions/:id
// -----------------------------------------------------

router.delete(
  "/submissions/:id",
  auth,
  role("user"),
  deleteSubmission
);

// =====================================================
// ADMIN REVIEW
// =====================================================

// -----------------------------------------------------
// APPROVE SUBMISSION
// PATCH /api/assignments/submissions/:id/approve
// -----------------------------------------------------

router.patch(
  "/submissions/:id/approve",
  auth,
  role("admin"),
  approveSubmission
);

// -----------------------------------------------------
// REJECT SUBMISSION
// PATCH /api/assignments/submissions/:id/reject
// -----------------------------------------------------

router.patch(
  "/submissions/:id/reject",
  auth,
  role("admin"),
  rejectSubmission
);

// =====================================================
// STUDENT - SINGLE ASSIGNMENT
// =====================================================

// -----------------------------------------------------
// GET SINGLE ASSIGNMENT
// GET /api/assignments/:id
// -----------------------------------------------------

router.get(
  "/:id",
  auth,
  role("user"),
  getAssignmentById
);

// =====================================================
// EXPORT
// =====================================================

module.exports = router;