const fs = require("fs");

const Assignment = require("../models/Assignment");
const AssignmentSubmission = require("../models/AssignmentSubmission");
const Course = require("../models/Course");

const cloudinary = require("../config/cloudinary");

const {
  createNotification,
  notifyAdmins,
  notifyCourseStudents,
} = require("../services/notificationService");

// =====================================================
// HELPER - CLOUDINARY RESOURCE TYPE
// =====================================================

const getResourceType = (mimetype = "") => {
  if (mimetype.startsWith("image/")) {
    return "image";
  }

  return "raw";
};

// =====================================================
// HELPER - DELETE LOCAL TEMP FILE
// =====================================================

const deleteLocalFile = (filePath) => {
  try {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error(
      "LOCAL FILE DELETE ERROR:",
      error.message
    );
  }
};

// =====================================================
// HELPER - DELETE CLOUDINARY FILE
// =====================================================

const deleteCloudinaryFile = async (
  publicId,
  fileType = ""
) => {
  if (!publicId) {
    return;
  }

  try {
    const resourceType = getResourceType(fileType);

    await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
      type: "upload",
    });
  } catch (error) {
    console.error(
      "CLOUDINARY DELETE ERROR:",
      error.message
    );
  }
};

// =====================================================
// ADMIN - CREATE ASSIGNMENT
// =====================================================

const createAssignment = async (req, res) => {
  try {
    const {
      title,
      description,
      courseId,
      dueDate,
    } = req.body;

    // -----------------------------------------------
    // VALIDATION
    // -----------------------------------------------

    if (!title?.trim()) {
      if (req.file?.path) {
        deleteLocalFile(req.file.path);
      }

      return res.status(400).json({
        success: false,
        message: "Assignment title is required",
      });
    }

    if (!description?.trim()) {
      if (req.file?.path) {
        deleteLocalFile(req.file.path);
      }

      return res.status(400).json({
        success: false,
        message:
          "Assignment description is required",
      });
    }

    if (!courseId) {
      if (req.file?.path) {
        deleteLocalFile(req.file.path);
      }

      return res.status(400).json({
        success: false,
        message: "Course is required",
      });
    }

    if (!dueDate) {
      if (req.file?.path) {
        deleteLocalFile(req.file.path);
      }

      return res.status(400).json({
        success: false,
        message: "Due date is required",
      });
    }

    // -----------------------------------------------
    // CHECK COURSE
    // -----------------------------------------------

    const course = await Course.findById(courseId);

    if (!course) {
      if (req.file?.path) {
        deleteLocalFile(req.file.path);
      }

      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // -----------------------------------------------
    // ADMIN ATTACHMENT
    // -----------------------------------------------

    let attachmentData = {
      attachmentUrl: "",
      attachmentPublicId: "",
      attachmentName: "",
      attachmentType: "",
    };

    if (req.file) {
      const resourceType = getResourceType(
        req.file.mimetype
      );

      try {
        const result =
          await cloudinary.uploader.upload(
            req.file.path,
            {
              resource_type: resourceType,
              folder: "assignments",
              use_filename: true,
              unique_filename: true,
            }
          );

        attachmentData = {
          attachmentUrl: result.secure_url,
          attachmentPublicId: result.public_id,
          attachmentName: req.file.originalname,
          attachmentType: req.file.mimetype,
        };
      } finally {
        deleteLocalFile(req.file.path);
      }
    }

    // -----------------------------------------------
    // CREATE ASSIGNMENT
    // -----------------------------------------------

    const assignment = await Assignment.create({
      title: title.trim(),
      description: description.trim(),
      course: courseId,
      createdBy: req.user._id,
      dueDate: new Date(dueDate),
      ...attachmentData,
      isActive: true,
    });

    // -----------------------------------------------
    // POPULATE RESPONSE
    // -----------------------------------------------

    await assignment.populate([
      {
        path: "course",
        select: "title category students",
      },
      {
        path: "createdBy",
        select: "name email",
      },
    ]);

    // =================================================
    // NOTIFY ENROLLED STUDENTS
    // =================================================

    await notifyCourseStudents({
      courseId: course._id,

      sender: req.user._id,

      type: "assignment_created",

      title: "New Assignment Added",

      message: `A new assignment "${assignment.title}" has been added to "${course.title}".`,

      course: course._id,

      assignment: assignment._id,

      link: `/student/assignments/${assignment._id}`,

      metadata: {
        assignmentId: assignment._id,
        assignmentTitle: assignment.title,
        courseId: course._id,
        courseTitle: course.title,
        action: "created",
      },
    });

    return res.status(201).json({
      success: true,
      message: "Assignment created successfully",
      assignment,
    });
  } catch (error) {
    console.error(
      "CREATE ASSIGNMENT ERROR:",
      error
    );

    if (req.file?.path) {
      deleteLocalFile(req.file.path);
    }

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to create assignment",
    });
  }
};

// =====================================================
// ADMIN - GET ALL ASSIGNMENTS
// =====================================================

const getAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find({
      isActive: true,
    })
      .populate(
        "course",
        "title category students"
      )
      .populate(
        "createdBy",
        "name email"
      )
      .sort({
        createdAt: -1,
      })
      .lean();

    const assignmentIds = assignments.map(
      (assignment) => assignment._id
    );

    const submissions =
      await AssignmentSubmission.find({
        assignment: {
          $in: assignmentIds,
        },
      })
        .populate(
          "student",
          "name email profileImage"
        )
        .sort({
          createdAt: -1,
        })
        .lean();

    const submissionMap = {};

    submissions.forEach((submission) => {
      const key =
        submission.assignment.toString();

      if (!submissionMap[key]) {
        submissionMap[key] = [];
      }

      submissionMap[key].push(submission);
    });

    const result = assignments.map(
      (assignment) => ({
        ...assignment,

        submissions:
          submissionMap[
            assignment._id.toString()
          ] || [],
      })
    );

    return res.status(200).json({
      success: true,
      count: result.length,
      assignments: result,
    });
  } catch (error) {
    console.error(
      "GET ASSIGNMENTS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to get assignments",
    });
  }
};

// =====================================================
// STUDENT - GET AVAILABLE ASSIGNMENTS
// =====================================================

const getAvailableAssignments = async (
  req,
  res
) => {
  try {
    const courses = await Course.find({
      students: req.user._id,
    }).select("_id");

    const courseIds = courses.map(
      (course) => course._id
    );

    const assignments =
      await Assignment.find({
        course: {
          $in: courseIds,
        },

        isActive: true,
      })
        .populate(
          "course",
          "title category"
        )
        .populate(
          "createdBy",
          "name email"
        )
        .sort({
          dueDate: 1,
          createdAt: -1,
        })
        .lean();

    const assignmentIds =
      assignments.map(
        (assignment) => assignment._id
      );

    const submissions =
      await AssignmentSubmission.find({
        assignment: {
          $in: assignmentIds,
        },

        student: req.user._id,
      }).lean();

    const submissionMap = {};

    submissions.forEach((submission) => {
      submissionMap[
        submission.assignment.toString()
      ] = submission;
    });

    const result = assignments.map(
      (assignment) => ({
        ...assignment,

        submission:
          submissionMap[
            assignment._id.toString()
          ] || null,
      })
    );

    return res.status(200).json({
      success: true,
      count: result.length,
      assignments: result,
    });
  } catch (error) {
    console.error(
      "GET AVAILABLE ASSIGNMENTS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to get available assignments",
    });
  }
};

// =====================================================
// STUDENT - GET MY ASSIGNMENTS
// =====================================================

const getMyAssignments = async (
  req,
  res
) => {
  try {
    const submissions =
      await AssignmentSubmission.find({
        student: req.user._id,
      })
        .populate({
          path: "assignment",
          populate: [
            {
              path: "course",
              select: "title category",
            },
            {
              path: "createdBy",
              select: "name email",
            },
          ],
        })
        .populate(
          "student",
          "name email profileImage"
        )
        .sort({
          createdAt: -1,
        });

    return res.status(200).json({
      success: true,
      count: submissions.length,
      assignments: submissions,
      submissions,
    });
  } catch (error) {
    console.error(
      "GET MY ASSIGNMENTS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to get your assignments",
    });
  }
};

// =====================================================
// STUDENT - GET SINGLE ASSIGNMENT
// =====================================================

const getAssignmentById = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const assignment =
      await Assignment.findOne({
        _id: id,
        isActive: true,
      })
        .populate(
          "course",
          "title category students"
        )
        .populate(
          "createdBy",
          "name email"
        )
        .lean();

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }

    const isEnrolled =
      assignment.course?.students?.some(
        (studentId) =>
          studentId.toString() ===
          req.user._id.toString()
      );

    if (
      req.user.role !== "admin" &&
      !isEnrolled
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not enrolled in this course",
      });
    }

    let submission = null;

    if (req.user.role !== "admin") {
      submission =
        await AssignmentSubmission.findOne({
          assignment: id,
          student: req.user._id,
        }).lean();
    }

    return res.status(200).json({
      success: true,
      assignment,
      submission,
    });
  } catch (error) {
    console.error(
      "GET ASSIGNMENT BY ID ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to get assignment",
    });
  }
};

// =====================================================
// STUDENT - SUBMIT ASSIGNMENT
// =====================================================

const submitAssignment = async (
  req,
  res
) => {
  try {
    const {
      assignmentId,
    } = req.params;

    // -----------------------------------------------
    // FILE CHECK
    // -----------------------------------------------

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message:
          "Assignment file is required",
      });
    }

    // -----------------------------------------------
    // FIND ASSIGNMENT
    // -----------------------------------------------

    const assignment =
      await Assignment.findOne({
        _id: assignmentId,
        isActive: true,
      });

    if (!assignment) {
      deleteLocalFile(req.file.path);

      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }

    // -----------------------------------------------
    // CHECK COURSE
    // -----------------------------------------------

    const course =
      await Course.findById(
        assignment.course
      ).select("students title");

    if (!course) {
      deleteLocalFile(req.file.path);

      return res.status(404).json({
        success: false,
        message:
          "Assignment course not found",
      });
    }

    // -----------------------------------------------
    // CHECK ENROLLMENT
    // -----------------------------------------------

    const isEnrolled =
      course.students.some(
        (studentId) =>
          studentId.toString() ===
          req.user._id.toString()
      );

    if (!isEnrolled) {
      deleteLocalFile(req.file.path);

      return res.status(403).json({
        success: false,
        message:
          "You are not enrolled in this course",
      });
    }

    // -----------------------------------------------
    // FIND EXISTING SUBMISSION
    // -----------------------------------------------

    const existingSubmission =
      await AssignmentSubmission.findOne({
        assignment: assignmentId,
        student: req.user._id,
      });

    if (existingSubmission) {
      if (
        existingSubmission.status ===
        "approved"
      ) {
        deleteLocalFile(req.file.path);

        return res.status(400).json({
          success: false,
          message:
            "Approved assignment cannot be resubmitted",
        });
      }

      if (
        existingSubmission.status ===
        "pending"
      ) {
        deleteLocalFile(req.file.path);

        return res.status(400).json({
          success: false,
          message:
            "Your assignment is already under review",
        });
      }
    }

    // -----------------------------------------------
    // UPLOAD FILE
    // -----------------------------------------------

    const resourceType =
      getResourceType(
        req.file.mimetype
      );

    let result;

    try {
      result =
        await cloudinary.uploader.upload(
          req.file.path,
          {
            resource_type: resourceType,
            folder:
              "assignments/submissions",
            use_filename: true,
            unique_filename: true,
          }
        );
    } finally {
      deleteLocalFile(req.file.path);
    }

    // =================================================
    // RESUBMISSION
    // =================================================

    if (existingSubmission) {
      const oldPublicId =
        existingSubmission.publicId;

      const oldFileType =
        existingSubmission.fileType;

      existingSubmission.fileUrl =
        result.secure_url;

      existingSubmission.publicId =
        result.public_id;

      existingSubmission.originalName =
        req.file.originalname;

      existingSubmission.fileType =
        req.file.mimetype;

      existingSubmission.status =
        "pending";

      existingSubmission.feedback = "";

      existingSubmission.reviewedAt =
        null;

      existingSubmission.submittedAt =
        new Date();

      await existingSubmission.save();

      // Delete old Cloudinary file
      if (oldPublicId) {
        await deleteCloudinaryFile(
          oldPublicId,
          oldFileType
        );
      }

      // =============================================
      // NOTIFY ADMINS
      // =============================================

      await notifyAdmins({
        sender: req.user._id,

        type: "assignment_resubmitted",

        title: "Assignment Resubmitted",

        message: `${req.user.name || "A student"} resubmitted "${assignment.title}".`,

        assignment: assignment._id,

        course: course._id,

        link: "/admin/assignments",

        metadata: {
          assignmentId:
            assignment._id,

          assignmentTitle:
            assignment.title,

          studentId:
            req.user._id,

          studentName:
            req.user.name,

          courseId:
            course._id,

          courseTitle:
            course.title,

          submissionId:
            existingSubmission._id,

          action: "resubmitted",
        },
      });

      return res.status(200).json({
        success: true,
        message:
          "Assignment resubmitted successfully",
        submission: existingSubmission,
      });
    }

    // =================================================
    // FIRST SUBMISSION
    // =================================================

    const submission =
      await AssignmentSubmission.create({
        assignment: assignmentId,

        student: req.user._id,

        fileUrl: result.secure_url,

        publicId: result.public_id,

        originalName:
          req.file.originalname,

        fileType:
          req.file.mimetype,

        status: "pending",

        feedback: "",

        reviewedAt: null,

        submittedAt: new Date(),
      });

    // =============================================
    // NOTIFY ADMINS
    // =============================================

    await notifyAdmins({
      sender: req.user._id,

      type: "assignment_submitted",

      title: "New Assignment Submission",

      message: `${req.user.name || "A student"} submitted "${assignment.title}".`,

      assignment: assignment._id,

      course: course._id,

      link: "/admin/assignments",

      metadata: {
        assignmentId:
          assignment._id,

        assignmentTitle:
          assignment.title,

        studentId:
          req.user._id,

        studentName:
          req.user.name,

        courseId:
          course._id,

        courseTitle:
          course.title,

        submissionId:
          submission._id,

        action: "submitted",
      },
    });

    return res.status(201).json({
      success: true,
      message:
        "Assignment submitted successfully",
      submission,
    });
  } catch (error) {
    console.error(
      "SUBMIT ASSIGNMENT ERROR:",
      error
    );

    if (req.file?.path) {
      deleteLocalFile(req.file.path);
    }

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to submit assignment",
    });
  }
};

// =====================================================
// STUDENT - UPDATE / RESUBMIT SUBMISSION
// =====================================================

const updateSubmission = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    // -----------------------------------------------
    // FILE REQUIRED
    // -----------------------------------------------

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message:
          "Please select a new file",
      });
    }

    // -----------------------------------------------
    // FIND SUBMISSION
    // -----------------------------------------------

    const submission =
      await AssignmentSubmission.findById(id);

    if (!submission) {
      deleteLocalFile(req.file.path);

      return res.status(404).json({
        success: false,
        message:
          "Submission not found",
      });
    }

    // -----------------------------------------------
    // SECURITY
    // -----------------------------------------------

    if (
      submission.student.toString() !==
      req.user._id.toString()
    ) {
      deleteLocalFile(req.file.path);

      return res.status(403).json({
        success: false,
        message:
          "You are not allowed to edit this submission",
      });
    }

    // -----------------------------------------------
    // STATUS CHECK
    // -----------------------------------------------

    if (
      submission.status !== "pending" &&
      submission.status !== "rejected"
    ) {
      deleteLocalFile(req.file.path);

      return res.status(400).json({
        success: false,
        message:
          "Only pending or rejected submissions can be edited",
      });
    }

    // -----------------------------------------------
    // UPLOAD NEW FILE
    // -----------------------------------------------

    const newResourceType =
      getResourceType(
        req.file.mimetype
      );

    let result;

    try {
      result =
        await cloudinary.uploader.upload(
          req.file.path,
          {
            resource_type:
              newResourceType,
            folder:
              "assignments/submissions",
            use_filename: true,
            unique_filename: true,
          }
        );
    } finally {
      deleteLocalFile(req.file.path);
    }

    // -----------------------------------------------
    // OLD CLOUDINARY FILE
    // -----------------------------------------------

    const oldPublicId =
      submission.publicId;

    const oldFileType =
      submission.fileType;

    // -----------------------------------------------
    // UPDATE SUBMISSION
    // -----------------------------------------------

    submission.fileUrl =
      result.secure_url;

    submission.publicId =
      result.public_id;

    submission.originalName =
      req.file.originalname;

    submission.fileType =
      req.file.mimetype;

    submission.status =
      "pending";

    submission.feedback = "";

    submission.reviewedAt =
      null;

    submission.submittedAt =
      new Date();

    await submission.save();

    // -----------------------------------------------
    // DELETE OLD FILE
    // -----------------------------------------------

    if (oldPublicId) {
      await deleteCloudinaryFile(
        oldPublicId,
        oldFileType
      );
    }

    // =============================================
    // NOTIFY ADMINS
    // =============================================

    await notifyAdmins({
      sender: req.user._id,

      type: "assignment_resubmitted",

      title: "Assignment Resubmitted",

      message: `${req.user.name || "A student"} resubmitted an assignment.`,

      assignment: submission.assignment,

      link: "/admin/assignments",

      metadata: {
        assignmentId:
          submission.assignment,

        studentId:
          req.user._id,

        studentName:
          req.user.name,

        submissionId:
          submission._id,

        action: "resubmitted",
      },
    });

    return res.status(200).json({
      success: true,
      message:
        "Assignment resubmitted successfully",
      submission,
    });
  } catch (error) {
    console.error(
      "UPDATE SUBMISSION ERROR:",
      error
    );

    if (req.file?.path) {
      deleteLocalFile(req.file.path);
    }

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to update submission",
    });
  }
};

// =====================================================
// STUDENT - DELETE SUBMISSION
// =====================================================

const deleteSubmission = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const submission =
      await AssignmentSubmission.findById(id);

    if (!submission) {
      return res.status(404).json({
        success: false,
        message:
          "Submission not found",
      });
    }

    // -----------------------------------------------
    // SECURITY
    // -----------------------------------------------

    if (
      submission.student.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not allowed to delete this submission",
      });
    }

    // -----------------------------------------------
    // STATUS CHECK
    // -----------------------------------------------

    if (
      submission.status !== "pending" &&
      submission.status !== "rejected"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Approved submissions cannot be deleted",
      });
    }

    // -----------------------------------------------
    // DELETE CLOUDINARY FILE
    // -----------------------------------------------

    if (submission.publicId) {
      await deleteCloudinaryFile(
        submission.publicId,
        submission.fileType
      );
    }

    // -----------------------------------------------
    // DELETE DATABASE RECORD
    // -----------------------------------------------

    await AssignmentSubmission.findByIdAndDelete(
      id
    );

    return res.status(200).json({
      success: true,
      message:
        "Submission deleted successfully",
    });
  } catch (error) {
    console.error(
      "DELETE SUBMISSION ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to delete submission",
    });
  }
};

// =====================================================
// ADMIN - APPROVE SUBMISSION
// =====================================================

const approveSubmission = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const submission =
      await AssignmentSubmission.findById(
        id
      );

    if (!submission) {
      return res.status(404).json({
        success: false,
        message:
          "Submission not found",
      });
    }

    // -----------------------------------------------
    // ONLY PENDING
    // -----------------------------------------------

    if (
      submission.status !== "pending"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Only pending submissions can be approved",
      });
    }

    submission.status =
      "approved";

    submission.feedback =
      req.body.feedback?.trim() ||
      "Assignment approved";

    submission.reviewedAt =
      new Date();

    await submission.save();

    await submission.populate([
      {
        path: "assignment",
        populate: {
          path: "course",
          select: "title",
        },
      },
      {
        path: "student",
        select: "name email",
      },
    ]);

    // =============================================
    // NOTIFY STUDENT
    // =============================================

    const studentId =
      submission.student?._id ||
      submission.student;

    const assignmentTitle =
      submission.assignment?.title ||
      "your assignment";

    const courseTitle =
      submission.assignment?.course?.title ||
      "";

    const assignmentId =
      submission.assignment?._id ||
      submission.assignment;

    await createNotification({
      recipient: studentId,

      sender: req.user._id,

      type: "assignment_approved",

      title: "Assignment Approved",

      message: courseTitle
        ? `Your assignment "${assignmentTitle}" for "${courseTitle}" has been approved.`
        : `Your assignment "${assignmentTitle}" has been approved.`,

      assignment: assignmentId,

      link: `/student/assignments/${assignmentId}`,

      metadata: {
        assignmentId,

        assignmentTitle,

        courseTitle,

        submissionId:
          submission._id,

        status: "approved",

        feedback:
          submission.feedback,

        action: "approved",
      },
    });

    return res.status(200).json({
      success: true,
      message:
        "Assignment approved successfully",
      submission,
    });
  } catch (error) {
    console.error(
      "APPROVE SUBMISSION ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to approve submission",
    });
  }
};

// =====================================================
// ADMIN - REJECT SUBMISSION
// =====================================================

const rejectSubmission = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const submission =
      await AssignmentSubmission.findById(
        id
      );

    if (!submission) {
      return res.status(404).json({
        success: false,
        message:
          "Submission not found",
      });
    }

    // -----------------------------------------------
    // ONLY PENDING
    // -----------------------------------------------

    if (
      submission.status !== "pending"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Only pending submissions can be rejected",
      });
    }

    const feedback =
      req.body.feedback?.trim();

    submission.status =
      "rejected";

    submission.feedback =
      feedback ||
      "Assignment rejected. Please resubmit.";

    submission.reviewedAt =
      new Date();

    await submission.save();

    await submission.populate([
      {
        path: "assignment",
        populate: {
          path: "course",
          select: "title",
        },
      },
      {
        path: "student",
        select: "name email",
      },
    ]);

    // =============================================
    // NOTIFY STUDENT
    // =============================================

    const studentId =
      submission.student?._id ||
      submission.student;

    const assignmentTitle =
      submission.assignment?.title ||
      "your assignment";

    const courseTitle =
      submission.assignment?.course?.title ||
      "";

    const assignmentId =
      submission.assignment?._id ||
      submission.assignment;

    await createNotification({
      recipient: studentId,

      sender: req.user._id,

      type: "assignment_rejected",

      title: "Assignment Needs Resubmission",

      message: courseTitle
        ? `Your assignment "${assignmentTitle}" for "${courseTitle}" was rejected. Please review the feedback and resubmit.`
        : `Your assignment "${assignmentTitle}" was rejected. Please review the feedback and resubmit.`,

      assignment: assignmentId,

      link: `/student/assignments/${assignmentId}`,

      metadata: {
        assignmentId,

        assignmentTitle,

        courseTitle,

        submissionId:
          submission._id,

        status: "rejected",

        feedback:
          submission.feedback,

        action: "rejected",
      },
    });

    return res.status(200).json({
      success: true,
      message:
        "Assignment rejected successfully",
      submission,
    });
  } catch (error) {
    console.error(
      "REJECT SUBMISSION ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to reject submission",
    });
  }
};

// =====================================================
// ADMIN - DELETE ASSIGNMENT
// =====================================================

const deleteAssignment = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    // -----------------------------------------------
    // FIND ASSIGNMENT
    // -----------------------------------------------

    const assignment =
      await Assignment.findById(id);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }

    // -----------------------------------------------
    // GET COURSE + STUDENTS
    // -----------------------------------------------

    const course =
      await Course.findById(
        assignment.course
      ).select("title students");

    // =================================================
    // NOTIFY STUDENTS BEFORE DELETE
    // =================================================

    if (course?.students?.length > 0) {
      await notifyCourseStudents({
        courseId: course._id,

        sender: req.user._id,

        type: "assignment_deleted",

        title: "Assignment Removed",

        message: `The assignment "${assignment.title}" from "${course.title}" has been removed.`,

        course: course._id,

        assignment: assignment._id,

        link: "/student/assignments",

        metadata: {
          assignmentId: assignment._id,
          assignmentTitle: assignment.title,
          courseId: course._id,
          courseTitle: course.title,
          action: "deleted",
        },
      });
    }

    // -----------------------------------------------
    // DELETE ADMIN ATTACHMENT
    // -----------------------------------------------

    if (assignment.attachmentPublicId) {
      await deleteCloudinaryFile(
        assignment.attachmentPublicId,
        assignment.attachmentType
      );
    }

    // -----------------------------------------------
    // FIND ALL SUBMISSIONS
    // -----------------------------------------------

    const submissions =
      await AssignmentSubmission.find({
        assignment: id,
      });

    // -----------------------------------------------
    // DELETE STUDENT SUBMISSION FILES
    // -----------------------------------------------

    for (const submission of submissions) {
      if (submission.publicId) {
        await deleteCloudinaryFile(
          submission.publicId,
          submission.fileType
        );
      }
    }

    // -----------------------------------------------
    // DELETE ALL SUBMISSIONS
    // -----------------------------------------------

    await AssignmentSubmission.deleteMany({
      assignment: id,
    });

    // -----------------------------------------------
    // DELETE ASSIGNMENT
    // -----------------------------------------------

    await Assignment.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message:
        "Assignment deleted successfully",
    });
  } catch (error) {
    console.error(
      "DELETE ASSIGNMENT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to delete assignment",
    });
  }
};

// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  createAssignment,
  getAssignments,
  getAvailableAssignments,
  getMyAssignments,
  getAssignmentById,
  submitAssignment,
  updateSubmission,
  deleteSubmission,
  approveSubmission,
  rejectSubmission,
  deleteAssignment,
};