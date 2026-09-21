const express = require("express");

const router = express.Router();

const {
  getProjectNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
} = require("../controllers/noteController");

const auth = require("../middleware/auth");

// =====================================================
// GET PROJECT NOTES
// GET /api/notes/project/:projectId
// =====================================================

router.get(
  "/project/:projectId",
  auth,
  getProjectNotes
);

// =====================================================
// CREATE NOTE
// POST /api/notes
// =====================================================

router.post(
  "/",
  auth,
  createNote
);

// =====================================================
// GET SINGLE NOTE
// GET /api/notes/:id
// =====================================================

router.get(
  "/:id",
  auth,
  getNote
);

// =====================================================
// UPDATE NOTE
// PUT /api/notes/:id
// =====================================================

router.put(
  "/:id",
  auth,
  updateNote
);

// =====================================================
// DELETE NOTE
// DELETE /api/notes/:id
// =====================================================

router.delete(
  "/:id",
  auth,
  deleteNote
);

module.exports = router;