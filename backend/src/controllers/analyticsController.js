const Project = require("../models/Project");
const Note = require("../models/Note");
const User = require("../models/User");

// =====================================================
// CHECK ADMIN
// =====================================================

const isAdminUser = async (userId) => {
  const user = await User
    .findById(userId)
    .select("role");

  return user?.role === "admin";
};

// =====================================================
// PROJECT ANALYTICS
// =====================================================

const getProjectAnalytics = async (
  req,
  res
) => {
  try {
    const { projectId } = req.params;

    const admin = await isAdminUser(
      req.user.id
    );

    let project;

    // =================================================
    // ADMIN CAN VIEW ANY PROJECT
    // USER CAN VIEW OWN/MEMBER PROJECT
    // =================================================

    if (admin) {
      project =
        await Project.findById(projectId)
          .populate(
            "owner",
            "name email"
          )
          .populate(
            "members",
            "name email"
          );
    } else {
      project =
        await Project.findOne({
          _id: projectId,

          $or: [
            { owner: req.user.id },
            { members: req.user.id },
          ],
        })
          .populate(
            "owner",
            "name email"
          )
          .populate(
            "members",
            "name email"
          );
    }

    if (!project) {
      return res.status(404).json({
        success: false,
        message:
          "Project not found or access denied.",
      });
    }

    // =================================================
    // NOTES
    // =================================================

    const notes =
      await Note.find({
        project: projectId,
      }).populate(
        "author",
        "name email"
      );

    // =================================================
    // NOTE CONTRIBUTIONS
    // =================================================

    const contributionMap = {};

    notes.forEach((note) => {
      if (!note.author) return;

      const userId =
        note.author._id.toString();

      if (!contributionMap[userId]) {
        contributionMap[userId] = {
          user: note.author,
          notesCreated: 0,
        };
      }

      contributionMap[userId]
        .notesCreated += 1;
    });

    // =================================================
    // MEMBERS
    // =================================================

    const members = [];

    if (project.owner) {
      members.push(project.owner);
    }

    project.members?.forEach(
      (member) => {
        if (
          !members.some(
            (item) =>
              item._id.toString() ===
              member._id.toString()
          )
        ) {
          members.push(member);
        }
      }
    );

    // =================================================
    // MEMBER STATS
    // =================================================

    const memberStats =
      members.map((member) => {
        const id =
          member._id.toString();

        return {
          user: member,

          notesCreated:
            contributionMap[id]
              ?.notesCreated || 0,

          filesUploaded: 0,
        };
      });

    return res.status(200).json({
      success: true,

      data: {
        project: {
          _id: project._id,
          name: project.name,
        },

        totalMembers:
          members.length,

        totalNotes:
          notes.length,

        totalFiles: 0,

        contributions:
          memberStats,
      },
    });
  } catch (error) {
    console.error(
      "Project Analytics Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to load project analytics.",
    });
  }
};

module.exports = {
  getProjectAnalytics,
};