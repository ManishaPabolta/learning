const fs = require("fs");

const Assignment = require("../models/Assignment");
const cloudinary = require("../config/cloudinary");

// ==========================================
// STUDENT - UPLOAD ASSIGNMENT
// ==========================================
exports.uploadAssignment = async (req, res) => {
  try {
    // ------------------------------------------
    // Check file
    // ------------------------------------------
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Assignment file is required",
      });
    }

    // ------------------------------------------
    // Check course
    // ------------------------------------------
    if (!req.body.courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required",
      });
    }

    // ------------------------------------------
    // Decide Cloudinary resource type
    // ------------------------------------------
    let resourceType = "raw";

    const imageTypes = [
      "image/png",
      "image/jpg",
      "image/jpeg",
    ];

    if (
      req.file.mimetype === "application/pdf" ||
      imageTypes.includes(req.file.mimetype)
    ) {
      resourceType = "image";
    }

    // ------------------------------------------
    // Upload file to Cloudinary
    // ------------------------------------------
    const result = await cloudinary.uploader.upload(
      req.file.path,
      {
        resource_type: resourceType,
        folder: "assignments",
        use_filename: true,
        unique_filename: true,
      }
    );

    // ------------------------------------------
    // Delete temporary local file
    // ------------------------------------------
    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    // ------------------------------------------
    // Create assignment in MongoDB
    // ------------------------------------------
    const assignment = await Assignment.create({
      student: req.user._id,
      course: req.body.courseId,

      fileUrl: result.secure_url,
      publicId: result.public_id,

      originalName: req.file.originalname,
      fileType: req.file.mimetype,

      status: "pending",
      feedback: "",
      reviewedAt: null,
    });

    // ------------------------------------------
    // Response
    // ------------------------------------------
    return res.status(201).json({
      success: true,
      message: "Assignment submitted successfully",
      assignment,
    });
  } catch (error) {
    console.error("UPLOAD ASSIGNMENT ERROR:", error);

    // ------------------------------------------
    // Delete temporary file if something failed
    // ------------------------------------------
    if (
      req.file?.path &&
      fs.existsSync(req.file.path)
    ) {
      fs.unlinkSync(req.file.path);
    }

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to upload assignment",
    });
  }
};

// ==========================================
// ADMIN - GET ALL SUBMISSIONS
// ==========================================
exports.getAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find()
      .populate("student", "name email")
      .populate("course", "title")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: assignments.length,
      assignments,
    });
  } catch (error) {
    console.error("GET ASSIGNMENTS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to get assignments",
    });
  }
};

// ==========================================
// STUDENT - GET OWN SUBMISSIONS
// ==========================================
exports.getMyAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find({
      student: req.user._id,
    })
      .populate("course", "title")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: assignments.length,
      assignments,
    });
  } catch (error) {
    console.error("GET MY ASSIGNMENTS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to get your assignments",
    });
  }
};

// ==========================================
// ADMIN - APPROVE ASSIGNMENT
// ==========================================
exports.approveAssignment = async (req, res) => {
  try {
    const { id } = req.params;

    const assignment = await Assignment.findById(id);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment submission not found",
      });
    }

    assignment.status = "approved";

    assignment.feedback =
      req.body.feedback?.trim() ||
      "Assignment approved";

    assignment.reviewedAt = new Date();

    await assignment.save();

    return res.status(200).json({
      success: true,
      message: "Assignment approved successfully",
      assignment,
    });
  } catch (error) {
    console.error("APPROVE ASSIGNMENT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to approve assignment",
    });
  }
};

// ==========================================
// ADMIN - REJECT ASSIGNMENT
// ==========================================
exports.rejectAssignment = async (req, res) => {
  try {
    const { id } = req.params;

    const assignment = await Assignment.findById(id);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment submission not found",
      });
    }

    assignment.status = "rejected";

    assignment.feedback =
      req.body.feedback?.trim() ||
      "Assignment rejected";

    assignment.reviewedAt = new Date();

    await assignment.save();

    return res.status(200).json({
      success: true,
      message: "Assignment rejected successfully",
      assignment,
    });
  } catch (error) {
    console.error("REJECT ASSIGNMENT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to reject assignment",
    });
  }
};
// STUDENT - UPDATE / REPLACE ASSIGNMENT
exports.updateAssignment = async (req, res) => {
  try {
    const { id } = req.params;

    // Assignment find karo
    const assignment = await Assignment.findById(id);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }

    // Security: sirf jis student ne submit ki hai wahi edit kare
    if (assignment.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to edit this assignment",
      });
    }

    // Approved/rejected assignment ko edit na karne dein
    if (assignment.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending assignments can be edited",
      });
    }

    // New file required
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select a new file",
      });
    }

    // New file ka resource type
    let resourceType = "raw";

    const imageTypes = [
      "application/pdf",
      "image/png",
      "image/jpg",
      "image/jpeg",
    ];

    if (imageTypes.includes(req.file.mimetype)) {
      resourceType = "image";
    }

    // New file Cloudinary par upload
    const result = await cloudinary.uploader.upload(
      req.file.path,
      {
        resource_type: resourceType,
        folder: "assignments",
        use_filename: true,
        unique_filename: true,
      }
    );

    // Local temporary file delete
    const fs = require("fs");

    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    // Old Cloudinary file delete
    if (assignment.publicId) {
      try {
        let oldResourceType = "raw";

        if (
          assignment.fileType === "application/pdf" ||
          assignment.fileType === "image/png" ||
          assignment.fileType === "image/jpg" ||
          assignment.fileType === "image/jpeg"
        ) {
          oldResourceType = "image";
        }

        await cloudinary.uploader.destroy(
          assignment.publicId,
          {
            resource_type: oldResourceType,
            type: "upload",
          }
        );
      } catch (deleteError) {
        console.error(
          "OLD CLOUDINARY FILE DELETE ERROR:",
          deleteError.message
        );
      }
    }

    // Database update
    assignment.fileUrl = result.secure_url;
    assignment.publicId = result.public_id;
    assignment.originalName = req.file.originalname;
    assignment.fileType = req.file.mimetype;

    // Edit karne ke baad status dobara pending
    assignment.status = "pending";
    assignment.feedback = "";
    assignment.reviewedAt = null;

    await assignment.save();

    return res.status(200).json({
      success: true,
      message: "Assignment updated successfully",
      assignment,
    });
  } catch (error) {
    console.error("UPDATE ASSIGNMENT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// STUDENT - DELETE ASSIGNMENT
exports.deleteAssignment = async (req, res) => {
  try {
    const { id } = req.params;

    const assignment = await Assignment.findById(id);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }

    // Security: sirf owner delete kar sakta hai
    if (assignment.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to delete this assignment",
      });
    }

    // Approved/rejected assignment delete na karne dein
    if (assignment.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending assignments can be removed",
      });
    }

    // Cloudinary file delete
    if (assignment.publicId) {
      try {
        let resourceType = "raw";

        if (
          assignment.fileType === "application/pdf" ||
          assignment.fileType === "image/png" ||
          assignment.fileType === "image/jpg" ||
          assignment.fileType === "image/jpeg"
        ) {
          resourceType = "image";
        }

        await cloudinary.uploader.destroy(
          assignment.publicId,
          {
            resource_type: resourceType,
            type: "upload",
          }
        );
      } catch (cloudinaryError) {
        console.error(
          "CLOUDINARY DELETE ERROR:",
          cloudinaryError.message
        );
      }
    }

    // Database se assignment delete
    await Assignment.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Assignment removed successfully",
    });
  } catch (error) {
    console.error("DELETE ASSIGNMENT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};