const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

const Project = require("../models/Project");
const ProjectFile = require("../models/ProjectFile");
const User = require("../models/User");

// =====================================================
// HELPERS
// =====================================================

const getUserId = (req) => {
  return req.user?.id || req.user?._id;
};

const getUserRole = (req) => {
  return req.user?.role;
};

const isAdmin = (req) => {
  return getUserRole(req) === "admin";
};

// =====================================================
// VALIDATE OBJECT ID
// =====================================================

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// =====================================================
// GET PROJECT
// =====================================================

const getProject = async (projectId) => {
  if (!isValidObjectId(projectId)) {
    return null;
  }

  return await Project.findById(projectId);
};

// =====================================================
// CHECK PROJECT ACCESS
// =====================================================

const hasProjectAccess = (project, userId) => {
  if (!project || !userId) {
    return false;
  }

  const ownerId = String(project.owner);

  if (ownerId === String(userId)) {
    return true;
  }

  return project.members?.some(
    (member) => String(member) === String(userId)
  );
};

// =====================================================
// GET PROJECT FILES
// =====================================================

const getProjectFiles = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (!isValidObjectId(projectId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID",
      });
    }

    const project = await getProject(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Admin can view files
    if (!isAdmin(req)) {
      const allowed = hasProjectAccess(project, userId);

      if (!allowed) {
        return res.status(403).json({
          success: false,
          message: "You do not have access to this project",
        });
      }
    }

    const files = await ProjectFile.find({
      project: projectId,
    })
      .populate("uploadedBy", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      files,
    });
  } catch (error) {
    console.error("GET PROJECT FILES ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load project files",
      error: error.message,
    });
  }
};

// =====================================================
// GET SINGLE FILE
// =====================================================

const getProjectFile = async (req, res) => {
  try {
    const { projectId, fileId } = req.params;
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (
      !isValidObjectId(projectId) ||
      !isValidObjectId(fileId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID or file ID",
      });
    }

    const project = await getProject(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    if (!isAdmin(req)) {
      const allowed = hasProjectAccess(project, userId);

      if (!allowed) {
        return res.status(403).json({
          success: false,
          message: "You do not have access to this project",
        });
      }
    }

    const file = await ProjectFile.findOne({
      _id: fileId,
      project: projectId,
    }).populate("uploadedBy", "name email");

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    return res.status(200).json({
      success: true,
      file,
    });
  } catch (error) {
    console.error("GET PROJECT FILE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get project file",
      error: error.message,
    });
  }
};

// =====================================================
// UPLOAD PROJECT FILE
// =====================================================

const uploadProjectFile = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = getUserId(req);

    console.log("========================================");
    console.log("PROJECT FILE UPLOAD");
    console.log("projectId:", projectId);
    console.log("userId:", userId);
    console.log("role:", getUserRole(req));
    console.log("file:", req.file);
    console.log("========================================");

    // -----------------------------------------------
    // AUTH
    // -----------------------------------------------

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // -----------------------------------------------
    // PROJECT ID
    // -----------------------------------------------

    if (!projectId) {
      return res.status(400).json({
        success: false,
        message: "Project ID is required",
      });
    }

    if (!isValidObjectId(projectId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID",
      });
    }

    // -----------------------------------------------
    // FILE
    // -----------------------------------------------

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message:
          "No file received. Make sure FormData field name is 'file'.",
      });
    }

    // -----------------------------------------------
    // PROJECT
    // -----------------------------------------------

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // -----------------------------------------------
    // ADMIN
    // -----------------------------------------------

    if (isAdmin(req)) {
      return res.status(403).json({
        success: false,
        message: "Admin cannot upload files to projects",
      });
    }

    // -----------------------------------------------
    // OWNER / MEMBER ACCESS
    // -----------------------------------------------

    const allowed = hasProjectAccess(project, userId);

    if (!allowed) {
      return res.status(403).json({
        success: false,
        message:
          "You must be the project owner or a project member to upload files",
      });
    }

    // -----------------------------------------------
    // FILE DATA
    // -----------------------------------------------

    const fileName = req.file.filename;

    const originalName =
      req.file.originalname || fileName;

    const mimeType =
      req.file.mimetype || "application/octet-stream";

    const size = req.file.size || 0;

    const relativePath = path
      .join("uploads", fileName)
      .replace(/\\/g, "/");

    const baseUrl =
      `${req.protocol}://${req.get("host")}`;

    const fileUrl = `${baseUrl}/uploads/${encodeURIComponent(
      fileName
    )}`;

    // -----------------------------------------------
    // SAVE DB
    // -----------------------------------------------

    const projectFile = await ProjectFile.create({
      project: projectId,

      uploadedBy: userId,

      originalName,

      fileName,

      mimeType,

      size,

      path: relativePath,

      url: fileUrl,
    });

    // -----------------------------------------------
    // POPULATE
    // -----------------------------------------------

    const populatedFile =
      await ProjectFile.findById(projectFile._id)
        .populate("uploadedBy", "name email");

    return res.status(201).json({
      success: true,
      message: "Project file uploaded successfully",

      file: populatedFile,
    });
  } catch (error) {
    console.error("========================================");
    console.error("UPLOAD PROJECT FILE ERROR");
    console.error(error);
    console.error("========================================");

    // -----------------------------------------------
    // CLEAN UP UPLOADED FILE IF DB FAILED
    // -----------------------------------------------

    if (req.file?.path) {
      try {
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
      } catch (deleteError) {
        console.error(
          "Failed to cleanup uploaded file:",
          deleteError
        );
      }
    }

    return res.status(500).json({
      success: false,
      message: "Failed to upload project file",
      error: error.message,
    });
  }
};

// =====================================================
// UPDATE PROJECT FILE
// =====================================================

const updateProjectFile = async (req, res) => {
  try {
    const { projectId, fileId } = req.params;
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (
      !isValidObjectId(projectId) ||
      !isValidObjectId(fileId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID or file ID",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message:
          "No replacement file received. FormData field must be 'file'.",
      });
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    if (isAdmin(req)) {
      return res.status(403).json({
        success: false,
        message: "Admin cannot update project files",
      });
    }

    const allowed = hasProjectAccess(project, userId);

    if (!allowed) {
      return res.status(403).json({
        success: false,
        message:
          "You must be the project owner or member",
      });
    }

    const existingFile = await ProjectFile.findOne({
      _id: fileId,
      project: projectId,
    });

    if (!existingFile) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    // -----------------------------------------------
    // DELETE OLD PHYSICAL FILE
    // -----------------------------------------------

    if (existingFile.path) {
      const oldPath = path.join(
        __dirname,
        "..",
        existingFile.path
      );

      try {
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      } catch (error) {
        console.error(
          "Old file delete error:",
          error
        );
      }
    }

    // -----------------------------------------------
    // NEW FILE
    // -----------------------------------------------

    const fileName = req.file.filename;

    const originalName =
      req.file.originalname || fileName;

    const mimeType =
      req.file.mimetype || "application/octet-stream";

    const size = req.file.size || 0;

    const relativePath = path
      .join("uploads", fileName)
      .replace(/\\/g, "/");

    const baseUrl =
      `${req.protocol}://${req.get("host")}`;

    const fileUrl = `${baseUrl}/uploads/${encodeURIComponent(
      fileName
    )}`;

    // -----------------------------------------------
    // UPDATE
    // -----------------------------------------------

    existingFile.originalName = originalName;
    existingFile.fileName = fileName;
    existingFile.mimeType = mimeType;
    existingFile.size = size;
    existingFile.path = relativePath;
    existingFile.url = fileUrl;
    existingFile.uploadedBy = userId;

    await existingFile.save();

    const populatedFile =
      await ProjectFile.findById(existingFile._id)
        .populate("uploadedBy", "name email");

    return res.status(200).json({
      success: true,
      message: "Project file updated successfully",
      file: populatedFile,
    });
  } catch (error) {
    console.error("UPDATE PROJECT FILE ERROR:", error);

    if (req.file?.path) {
      try {
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
      } catch (deleteError) {
        console.error(
          "Failed to cleanup replacement file:",
          deleteError
        );
      }
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update project file",
      error: error.message,
    });
  }
};

// =====================================================
// DELETE PROJECT FILE
// =====================================================

const deleteProjectFile = async (req, res) => {
  try {
    const { projectId, fileId } = req.params;
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (
      !isValidObjectId(projectId) ||
      !isValidObjectId(fileId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID or file ID",
      });
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    if (isAdmin(req)) {
      return res.status(403).json({
        success: false,
        message: "Admin cannot delete project files",
      });
    }

    const allowed = hasProjectAccess(project, userId);

    if (!allowed) {
      return res.status(403).json({
        success: false,
        message:
          "You must be the project owner or member",
      });
    }

    const file = await ProjectFile.findOne({
      _id: fileId,
      project: projectId,
    });

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    // -----------------------------------------------
    // DELETE PHYSICAL FILE
    // -----------------------------------------------

    if (file.path) {
      const physicalPath = path.join(
        __dirname,
        "..",
        file.path
      );

      try {
        if (fs.existsSync(physicalPath)) {
          fs.unlinkSync(physicalPath);
        }
      } catch (error) {
        console.error(
          "Physical file delete error:",
          error
        );
      }
    }

    // -----------------------------------------------
    // DELETE DB
    // -----------------------------------------------

    await ProjectFile.findByIdAndDelete(fileId);

    return res.status(200).json({
      success: true,
      message: "Project file deleted successfully",
    });
  } catch (error) {
    console.error("DELETE PROJECT FILE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete project file",
      error: error.message,
    });
  }
};

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  getProjectFiles,
  getProjectFile,
  uploadProjectFile,
  updateProjectFile,
  deleteProjectFile,
};