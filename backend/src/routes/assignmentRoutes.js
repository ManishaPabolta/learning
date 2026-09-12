const express = require("express");

const router = express.Router();

const {
  uploadAssignment,
  getAssignments,
  getMyAssignments,
  approveAssignment,
  rejectAssignment,
  updateAssignment,
  deleteAssignment,
} = require("../controllers/assignmentController");

const auth = require("../middleware/auth");
const role = require("../middleware/role");
const upload = require("../middleware/upload");

// ==========================================
// STUDENT - SUBMIT ASSIGNMENT
// ==========================================
router.post(
  "/upload",
  auth,
  upload.single("file"),
  uploadAssignment
);

// ==========================================
// STUDENT - GET OWN SUBMISSIONS
// ==========================================
router.get(
  "/my",
  auth,
  getMyAssignments
);

// ==========================================
// ADMIN - GET ALL SUBMISSIONS
// ==========================================
router.get(
  "/",
  auth,
  role("admin"),
  getAssignments
);

// ==========================================
// ADMIN - APPROVE ASSIGNMENT
// ==========================================
router.patch(
  "/:id/approve",
  auth,
  role("admin"),
  approveAssignment
);

// ==========================================
// ADMIN - REJECT ASSIGNMENT
// ==========================================
router.patch(
  "/:id/reject",
  auth,
  role("admin"),
  rejectAssignment
);
// STUDENT - UPDATE ASSIGNMENT
router.put(
  "/:id",
  auth,
  upload.single("file"),
  updateAssignment
);

// STUDENT - DELETE ASSIGNMENT
router.delete(
  "/:id",
  auth,
  deleteAssignment
);

module.exports = router;