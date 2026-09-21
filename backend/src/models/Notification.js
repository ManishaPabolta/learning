const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    // =====================================================
    // NOTIFICATION RECIPIENT
    // =====================================================

    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // =====================================================
    // WHO CAUSED THE NOTIFICATION
    // =====================================================

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // =====================================================
    // NOTIFICATION TYPE
    // =====================================================

    type: {
      type: String,
      enum: [
        // -----------------------------------------------
        // USER
        // -----------------------------------------------

        "user_registered",

        // -----------------------------------------------
        // COURSE
        // -----------------------------------------------

        "course_created",
        "course_updated",
        "course_deleted",
        "course_enrolled",

        // -----------------------------------------------
        // ASSIGNMENT
        // -----------------------------------------------

        "assignment_created",
        "assignment_updated",
        "assignment_deleted",

        "assignment_submitted",
        "assignment_resubmitted",

        "assignment_approved",
        "assignment_rejected",

        // -----------------------------------------------
        // PROJECT
        // -----------------------------------------------

        "project_created",
        "project_updated",
        "project_deleted",

        "project_approved",
        "project_rejected",

        // -----------------------------------------------
        // PROJECT INVITATIONS
        // -----------------------------------------------

        "project_invitation",
        "project_invitation_accepted",
        "project_invitation_declined",
      ],

      required: true,
      index: true,
    },

    // =====================================================
    // NOTIFICATION TITLE
    // =====================================================

    title: {
      type: String,
      required: true,
      trim: true,
    },

    // =====================================================
    // NOTIFICATION MESSAGE
    // =====================================================

    message: {
      type: String,
      required: true,
      trim: true,
    },

    // =====================================================
    // RELATED COURSE
    // =====================================================

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      default: null,
    },

    // =====================================================
    // RELATED ASSIGNMENT
    // =====================================================

    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      default: null,
    },

    // =====================================================
    // RELATED PROJECT
    // =====================================================

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      default: null,
    },

    // =====================================================
    // RELATED PROJECT INVITATION
    // =====================================================

    invitation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProjectInvitation",
      default: null,
    },

    // =====================================================
    // FRONTEND NAVIGATION LINK
    // =====================================================

    link: {
      type: String,
      default: null,
      trim: true,
    },

    // =====================================================
    // EXTRA DATA
    // =====================================================

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    // =====================================================
    // READ STATUS
    // =====================================================

    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },

    // =====================================================
    // WHEN NOTIFICATION WAS READ
    // =====================================================

    readAt: {
      type: Date,
      default: null,
    },
  },

  {
    timestamps: true,
  }
);

// =====================================================
// INDEXES
// =====================================================

// Fast unread notification query
notificationSchema.index({
  recipient: 1,
  isRead: 1,
  createdAt: -1,
});

// Fast notification listing
notificationSchema.index({
  recipient: 1,
  createdAt: -1,
});

// =====================================================
// EXPORT
// =====================================================

module.exports = mongoose.model(
  "Notification",
  notificationSchema
);