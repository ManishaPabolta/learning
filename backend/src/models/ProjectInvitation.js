const mongoose = require("mongoose");

const projectInvitationSchema = new mongoose.Schema(
  {
    // Project jisme user ko invite kiya gaya
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    // Jisko invitation bheja gaya
    invitedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Invitation kisne bheja
    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Invitation status
    status: {
      type: String,
      enum: ["pending", "accepted", "declined"],
      default: "pending",
    },

    // User ne kab response diya
    respondedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

/*
 * Same project me same user ke liye
 * multiple pending invitations prevent karne ke liye.
 */
projectInvitationSchema.index(
  {
    project: 1,
    invitedUser: 1,
    status: 1,
  },
  {
    unique: true,
    partialFilterExpression: {
      status: "pending",
    },
  }
);

module.exports = mongoose.model(
  "ProjectInvitation",
  projectInvitationSchema
);