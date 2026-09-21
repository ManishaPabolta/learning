const mongoose = require("mongoose");

const Note = require("../models/Note");
const Project = require("../models/Project");
const User = require("../models/User");

// =====================================================
// HELPERS
// =====================================================

const getUserId = (req) => {
  return req.user?.id || req.user?._id;
};

// =====================================================
// CHECK ADMIN
// =====================================================

const isAdmin = async (userId) => {
  if (!userId) {
    return false;
  }

  const user = await User.findById(userId)
    .select("role")
    .lean();

  return user?.role === "admin";
};

// =====================================================
// VALIDATE OBJECT ID
// =====================================================

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// =====================================================
// READ ACCESS
// ADMIN + OWNER + MEMBER
// =====================================================

const checkProjectReadAccess = async (
  projectId,
  userId
) => {
  if (
    !projectId ||
    !userId ||
    !isValidObjectId(projectId)
  ) {
    return null;
  }

  const admin = await isAdmin(userId);

  // Admin can read any project
  if (admin) {
    return Project.findById(projectId);
  }

  // Owner or member
  return Project.findOne({
    _id: projectId,

    $or: [
      {
        owner: userId,
      },
      {
        members: userId,
      },
    ],
  });
};

// =====================================================
// WRITE ACCESS
// OWNER + MEMBER ONLY
// ADMIN NEVER
// =====================================================

const checkProjectWriteAccess = async (
  projectId,
  userId
) => {
  if (
    !projectId ||
    !userId ||
    !isValidObjectId(projectId)
  ) {
    return null;
  }

  const admin = await isAdmin(userId);

  // Admin cannot create/update/delete notes
  if (admin) {
    return null;
  }

  return Project.findOne({
    _id: projectId,

    $or: [
      {
        owner: userId,
      },
      {
        members: userId,
      },
    ],
  });
};

// =====================================================
// GET PROJECT NOTES
// GET /api/notes/project/:projectId
// =====================================================

const getProjectNotes = async (
  req,
  res
) => {
  try {
    const { projectId } = req.params;

    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    if (!projectId) {
      return res.status(400).json({
        success: false,
        message: "Project ID is required.",
      });
    }

    if (!isValidObjectId(projectId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID.",
      });
    }

    const project =
      await checkProjectReadAccess(
        projectId,
        userId
      );

    if (!project) {
      return res.status(403).json({
        success: false,
        message:
          "Project not found or access denied.",
      });
    }

    const notes =
      await Note.find({
        project: projectId,
      })
        .populate(
          "author",
          "name email avatar profileImage"
        )
        .sort({
          updatedAt: -1,
        });

    return res.status(200).json({
      success: true,
      data: notes,
    });
  } catch (error) {
    console.error(
      "===================================="
    );

    console.error(
      "GET PROJECT NOTES ERROR"
    );

    console.error(error);

    console.error(
      "===================================="
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to get project notes.",
      error: error.message,
    });
  }
};

// =====================================================
// GET SINGLE NOTE
// GET /api/notes/:id
// =====================================================

const getNote = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Note ID is required.",
      });
    }

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid note ID.",
      });
    }

    const note =
      await Note.findById(id).populate(
        "author",
        "name email avatar profileImage"
      );

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found.",
      });
    }

    const project =
      await checkProjectReadAccess(
        note.project,
        userId
      );

    if (!project) {
      return res.status(403).json({
        success: false,
        message: "Access denied.",
      });
    }

    return res.status(200).json({
      success: true,
      data: note,
    });
  } catch (error) {
    console.error(
      "Get Note Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to get note.",
      error: error.message,
    });
  }
};

// =====================================================
// CREATE NOTE
// POST /api/notes
// ADMIN BLOCKED
// =====================================================

const createNote = async (
  req,
  res
) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const {
      title,
      content,
      project,
      tags,
    } = req.body;

    // -------------------------------------------------
    // TITLE
    // -------------------------------------------------

    if (
      typeof title !== "string" ||
      !title.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Note title is required.",
      });
    }

    // -------------------------------------------------
    // PROJECT
    // -------------------------------------------------

    if (!project) {
      return res.status(400).json({
        success: false,
        message:
          "Project ID is required.",
      });
    }

    if (!isValidObjectId(project)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid project ID.",
      });
    }

    // -------------------------------------------------
    // WRITE ACCESS
    // -------------------------------------------------

    const projectDoc =
      await checkProjectWriteAccess(
        project,
        userId
      );

    if (!projectDoc) {
      const admin = await isAdmin(userId);

      if (admin) {
        return res.status(403).json({
          success: false,
          message:
            "Admin cannot create notes.",
        });
      }

      return res.status(403).json({
        success: false,
        message:
          "Only the project owner or members can create notes.",
      });
    }

    // -------------------------------------------------
    // TAGS
    // -------------------------------------------------

    let normalizedTags = [];

    if (Array.isArray(tags)) {
      normalizedTags = tags
        .filter(
          (tag) =>
            typeof tag === "string"
        )
        .map((tag) => tag.trim())
        .filter(Boolean);
    }

    // -------------------------------------------------
    // CREATE
    // -------------------------------------------------

    const note =
      await Note.create({
        title: title.trim(),

        content:
          typeof content === "string"
            ? content
            : "",

        project: projectDoc._id,

        author: userId,

        tags: normalizedTags,
      });

    // -------------------------------------------------
    // FETCH POPULATED NOTE
    // -------------------------------------------------

    const populatedNote =
      await Note.findById(
        note._id
      ).populate(
        "author",
        "name email avatar profileImage"
      );

    return res.status(201).json({
      success: true,

      message:
        "Note created successfully.",

      data: populatedNote,
    });
  } catch (error) {
    console.error(
      "===================================="
    );

    console.error(
      "CREATE NOTE ERROR"
    );

    console.error(error);

    console.error(
      "===================================="
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to create note.",

      error: error.message,
    });
  }
};

// =====================================================
// UPDATE NOTE
// PUT /api/notes/:id
// =====================================================

const updateNote = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    if (!id) {
      return res.status(400).json({
        success: false,
        message:
          "Note ID is required.",
      });
    }

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid note ID.",
      });
    }

    const note =
      await Note.findById(id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message:
          "Note not found.",
      });
    }

    // -------------------------------------------------
    // PROJECT WRITE ACCESS
    // -------------------------------------------------

    const project =
      await checkProjectWriteAccess(
        note.project,
        userId
      );

    if (!project) {
      const admin = await isAdmin(userId);

      if (admin) {
        return res.status(403).json({
          success: false,
          message:
            "Admin cannot edit notes.",
        });
      }

      return res.status(403).json({
        success: false,
        message:
          "Only the project owner or members can edit notes.",
      });
    }

    const {
      title,
      content,
      tags,
    } = req.body;

    // -------------------------------------------------
    // TITLE
    // -------------------------------------------------

    if (title !== undefined) {
      if (
        typeof title !== "string" ||
        !title.trim()
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Note title cannot be empty.",
        });
      }

      note.title = title.trim();
    }

    // -------------------------------------------------
    // CONTENT
    // -------------------------------------------------

    if (content !== undefined) {
      note.content =
        typeof content === "string"
          ? content
          : "";
    }

    // -------------------------------------------------
    // TAGS
    // -------------------------------------------------

    if (tags !== undefined) {
      note.tags = Array.isArray(tags)
        ? tags
            .filter(
              (tag) =>
                typeof tag === "string"
            )
            .map((tag) =>
              tag.trim()
            )
            .filter(Boolean)
        : [];
    }

    // -------------------------------------------------
    // SAVE
    // -------------------------------------------------

    await note.save();

    // -------------------------------------------------
    // FETCH UPDATED NOTE
    // -------------------------------------------------

    const updatedNote =
      await Note.findById(
        note._id
      ).populate(
        "author",
        "name email avatar profileImage"
      );

    return res.status(200).json({
      success: true,

      message:
        "Note updated successfully.",

      data: updatedNote,
    });
  } catch (error) {
    console.error(
      "===================================="
    );

    console.error(
      "UPDATE NOTE ERROR"
    );

    console.error(error);

    console.error(
      "===================================="
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to update note.",

      error: error.message,
    });
  }
};

// =====================================================
// DELETE NOTE
// DELETE /api/notes/:id
// =====================================================

const deleteNote = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    if (!id) {
      return res.status(400).json({
        success: false,
        message:
          "Note ID is required.",
      });
    }

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid note ID.",
      });
    }

    const note =
      await Note.findById(id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message:
          "Note not found.",
      });
    }

    // -------------------------------------------------
    // WRITE ACCESS
    // -------------------------------------------------

    const project =
      await checkProjectWriteAccess(
        note.project,
        userId
      );

    if (!project) {
      const admin = await isAdmin(userId);

      if (admin) {
        return res.status(403).json({
          success: false,
          message:
            "Admin cannot delete notes.",
        });
      }

      return res.status(403).json({
        success: false,
        message:
          "Only the project owner or members can delete notes.",
      });
    }

    // -------------------------------------------------
    // DELETE
    // -------------------------------------------------

    await Note.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,

      message:
        "Note deleted successfully.",
    });
  } catch (error) {
    console.error(
      "===================================="
    );

    console.error(
      "DELETE NOTE ERROR"
    );

    console.error(error);

    console.error(
      "===================================="
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to delete note.",

      error: error.message,
    });
  }
};

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  getProjectNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
};