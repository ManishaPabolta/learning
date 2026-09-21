const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");
const upload = require("../middleware/upload");

const {
  getProjectFiles,
  getProjectFile,
  uploadProjectFile,
  updateProjectFile,
  deleteProjectFile,
} = require("../controllers/projectFileController");

// =====================================================
// GET ALL PROJECT FILES
// GET /api/project-files/:projectId
// =====================================================

router.get(
  "/:projectId",
  auth,
  getProjectFiles
);

// =====================================================
// GET SINGLE PROJECT FILE
// GET /api/project-files/:projectId/:fileId
// =====================================================

router.get(
  "/:projectId/:fileId",
  auth,
  getProjectFile
);

// =====================================================
// UPLOAD PROJECT FILE
// POST /api/project-files/:projectId
// =====================================================

router.post(
  "/:projectId",
  auth,
  upload.single("file"),
  uploadProjectFile
);

// =====================================================
// UPDATE PROJECT FILE
// PUT /api/project-files/:projectId/:fileId
// =====================================================

router.put(
  "/:projectId/:fileId",
  auth,
  upload.single("file"),
  updateProjectFile
);

// =====================================================
// DELETE PROJECT FILE
// DELETE /api/project-files/:projectId/:fileId
// =====================================================

router.delete(
  "/:projectId/:fileId",
  auth,
  deleteProjectFile
);

module.exports = router;