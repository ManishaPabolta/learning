const mongoose = require("mongoose");

const projectFileSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    originalName: {
      type: String,
      required: true,
      trim: true,
    },

    fileName: {
      type: String,
      required: true,
      trim: true,
    },

    mimeType: {
      type: String,
      default: "application/octet-stream",
      trim: true,
    },

    size: {
      type: Number,
      default: 0,
    },

    path: {
      type: String,
      required: true,
    },

    url: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

projectFileSchema.index({
  project: 1,
  createdAt: -1,
});

module.exports =
  mongoose.model(
    "ProjectFile",
    projectFileSchema
  );