const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    // =========================
    // BASIC PROJECT INFORMATION
    // =========================
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    // =========================
    // PROJECT OWNER
    // =========================
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // =========================
    // PROJECT MEMBERS
    // =========================
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // =========================
    // VISIBILITY
    // =========================
    visibility: {
      type: String,
      enum: ["private", "public"],
      default: "private",
    },

    // =========================
    // ADMIN MODERATION
    // =========================
    moderationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    adminReview: {
      type: String,
      default: "",
      trim: true,
    },

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    reviewedAt: {
      type: Date,
      default: null,
    },

    // =========================
    // PUBLIC PROJECT SLUG
    // =========================
    slug: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },

    // =========================
    // README
    // =========================
    readme: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Project", projectSchema);