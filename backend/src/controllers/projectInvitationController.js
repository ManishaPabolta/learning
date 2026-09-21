const mongoose = require("mongoose");

const Project = require("../models/Project");
const User = require("../models/User");
const ProjectInvitation = require("../models/ProjectInvitation");
const Notification = require("../models/Notification");

// ======================================================
// HELPERS
// ======================================================

const getUserRole = async (userId) => {
  const user = await User.findById(userId)
    .select("role")
    .lean();

  return user?.role || null;
};

const isOwner = (project, userId) => {
  if (!project?.owner || !userId) {
    return false;
  }

  return (
    project.owner.toString() === userId.toString()
  );
};

const getUserId = (req) => {
  return req.user?.id || req.user?._id || null;
};

// ======================================================
// GET REGISTERED USERS FOR PROJECT INVITATION
// ======================================================
//
// GET /api/projects/:id/invitation-users
//
// Only project owner can access this list.
//
// Returns all registered + verified normal users
// with their current project status:
//
// available
// pending
// member
// ======================================================

const getInvitationUsers = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = getUserId(req);

    if (!currentUserId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // --------------------------------------------------
    // Validate project ID
    // --------------------------------------------------

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID",
      });
    }

    // --------------------------------------------------
    // Check role
    // --------------------------------------------------

    const role = await getUserRole(currentUserId);

    if (role === "admin") {
      return res.status(403).json({
        success: false,
        message:
          "Admin cannot invite project members",
      });
    }

    if (role !== "user") {
      return res.status(403).json({
        success: false,
        message:
          "Only normal users can invite members",
      });
    }

    // --------------------------------------------------
    // Get project
    // --------------------------------------------------

    const project = await Project.findById(id)
      .select("owner members name")
      .lean();

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // --------------------------------------------------
    // Only owner can see invitation users
    // --------------------------------------------------

    if (!isOwner(project, currentUserId)) {
      return res.status(403).json({
        success: false,
        message:
          "Only project owner can invite members",
      });
    }

    // --------------------------------------------------
    // Get all registered + verified normal users
    // --------------------------------------------------

    const users = await User.find({
      role: "user",
      isVerified: true,
      _id: {
        $ne: currentUserId,
      },
    })
      .select("_id name email")
      .sort({
        name: 1,
        email: 1,
      })
      .lean();

    // --------------------------------------------------
    // Existing members
    // --------------------------------------------------

    const memberIds = new Set(
      (project.members || []).map((memberId) =>
        memberId.toString()
      )
    );

    // --------------------------------------------------
    // Pending invitations
    // --------------------------------------------------

    const pendingInvitations =
      await ProjectInvitation.find({
        project: id,
        status: "pending",
      })
        .select("invitedUser")
        .lean();

    const pendingIds = new Set(
      pendingInvitations.map((invitation) =>
        invitation.invitedUser.toString()
      )
    );

    // --------------------------------------------------
    // Build result
    // --------------------------------------------------

    const result = users.map((user) => {
      const userId = user._id.toString();

      let status = "available";

      if (memberIds.has(userId)) {
        status = "member";
      } else if (pendingIds.has(userId)) {
        status = "pending";
      }

      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        status,
      };
    });

    // --------------------------------------------------
    // Response
    // --------------------------------------------------

    return res.status(200).json({
      success: true,

      project: {
        _id: project._id,
        name: project.name,
      },

      users: result,

      totalUsers: result.length,

      availableUsers: result.filter(
        (user) => user.status === "available"
      ).length,

      pendingUsers: result.filter(
        (user) => user.status === "pending"
      ).length,

      members: result.filter(
        (user) => user.status === "member"
      ).length,
    });
  } catch (error) {
    console.error(
      "GET INVITATION USERS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to load registered users",
      error: error.message,
    });
  }
};

// ======================================================
// SEND PROJECT INVITATION
// ======================================================
//
// POST /api/projects/:id/invitations
//
// Body:
//
// {
//   "userId": "USER_ID"
// }
//
// IMPORTANT:
//
// User is NOT directly added to project.members.
//
// Flow:
//
// Owner
//   ↓
// Send Invitation
//   ↓
// ProjectInvitation = pending
//   ↓
// Notification sent
//   ↓
// User accepts
//   ↓
// User added to project.members
// ======================================================

const sendInvitation = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const currentUserId = getUserId(req);

    // --------------------------------------------------
    // Authentication
    // --------------------------------------------------

    if (!currentUserId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // --------------------------------------------------
    // Validate project ID
    // --------------------------------------------------

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID",
      });
    }

    // --------------------------------------------------
    // Validate user ID
    // --------------------------------------------------

    if (
      !userId ||
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid userId is required",
      });
    }

    // --------------------------------------------------
    // Check inviter role
    // --------------------------------------------------

    const role = await getUserRole(currentUserId);

    if (role === "admin") {
      return res.status(403).json({
        success: false,
        message:
          "Admin cannot invite project members",
      });
    }

    if (role !== "user") {
      return res.status(403).json({
        success: false,
        message:
          "Only normal users can invite members",
      });
    }

    // --------------------------------------------------
    // Get project
    // --------------------------------------------------

    const project = await Project.findById(id)
      .select("name owner members")
      .lean();

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // --------------------------------------------------
    // Only project owner can invite
    // --------------------------------------------------

    if (!isOwner(project, currentUserId)) {
      return res.status(403).json({
        success: false,
        message:
          "Only project owner can invite members",
      });
    }

    // --------------------------------------------------
    // Cannot invite yourself
    // --------------------------------------------------

    if (
      currentUserId.toString() ===
      userId.toString()
    ) {
      return res.status(400).json({
        success: false,
        message: "You cannot invite yourself",
      });
    }

    // --------------------------------------------------
    // Check existing project member
    // --------------------------------------------------

    const alreadyMember = (
      project.members || []
    ).some(
      (memberId) =>
        memberId.toString() ===
        userId.toString()
    );

    if (alreadyMember) {
      return res.status(400).json({
        success: false,
        message:
          "User is already a project member",
      });
    }

    // --------------------------------------------------
    // Check invited user
    // --------------------------------------------------

    const invitedUser =
      await User.findOne({
        _id: userId,
        role: "user",
        isVerified: true,
      })
        .select("_id name email")
        .lean();

    if (!invitedUser) {
      return res.status(404).json({
        success: false,
        message:
          "Registered and verified user not found",
      });
    }

    // --------------------------------------------------
    // Check pending invitation
    // --------------------------------------------------

    const existingInvitation =
      await ProjectInvitation.findOne({
        project: id,
        invitedUser: userId,
        status: "pending",
      });

    if (existingInvitation) {
      return res.status(400).json({
        success: false,
        message:
          "Invitation is already pending",
        invitation: {
          _id: existingInvitation._id,
          status: existingInvitation.status,
        },
      });
    }

    // --------------------------------------------------
    // Get inviter
    // --------------------------------------------------

    const inviter =
      await User.findById(currentUserId)
        .select("_id name email")
        .lean();

    if (!inviter) {
      return res.status(404).json({
        success: false,
        message: "Inviter account not found",
      });
    }

    // --------------------------------------------------
    // Create invitation
    // --------------------------------------------------

    let invitation;

    try {
      invitation =
        await ProjectInvitation.create({
          project: id,
          invitedUser: userId,
          invitedBy: currentUserId,
          status: "pending",
        });
    } catch (error) {
      // ----------------------------------------------
      // Handle duplicate pending invitation race
      // ----------------------------------------------

      if (error?.code === 11000) {
        return res.status(400).json({
          success: false,
          message:
            "Invitation is already pending",
        });
      }

      throw error;
    }

    // --------------------------------------------------
    // Create notification
    // --------------------------------------------------

    const notification =
      await Notification.create({
        recipient: userId,

        sender: currentUserId,

        type: "project_invitation",

        title: "Project Invitation",

        message:
          `${inviter.name} invited you to join project "${project.name}".`,

        project: id,

        invitation: invitation._id,

        link: "/notifications",

        metadata: {
          invitationId:
            invitation._id.toString(),

          projectId: id.toString(),

          projectName: project.name,

          invitedBy: currentUserId.toString(),

          inviterName:
            inviter.name,

          inviterEmail:
            inviter.email,

          invitedUserId:
            userId.toString(),
        },

        isRead: false,
      });

    // --------------------------------------------------
    // Success
    // --------------------------------------------------

    return res.status(201).json({
      success: true,

      message:
        "Project invitation sent successfully",

      invitation: {
        _id: invitation._id,
        project: invitation.project,
        invitedUser:
          invitation.invitedUser,
        invitedBy:
          invitation.invitedBy,
        status:
          invitation.status,
        createdAt:
          invitation.createdAt,
      },

      notification: {
        _id: notification._id,
        title: notification.title,
        message:
          notification.message,
        type: notification.type,
      },
    });
  } catch (error) {
    console.error(
      "SEND PROJECT INVITATION ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to send project invitation",
      error: error.message,
    });
  }
};

// ======================================================
// GET MY PENDING INVITATIONS
// ======================================================
//
// GET /api/project-invitations
//
// Logged-in user sees invitations sent to them.
// ======================================================

const getMyInvitations = async (req, res) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication required",
      });
    }

    const invitations =
      await ProjectInvitation.find({
        invitedUser: userId,
        status: "pending",
      })
        .populate(
          "project",
          "name description owner"
        )
        .populate(
          "invitedBy",
          "name email"
        )
        .sort({
          createdAt: -1,
        })
        .lean();

    return res.status(200).json({
      success: true,
      invitations,
      count: invitations.length,
    });
  } catch (error) {
    console.error(
      "GET MY INVITATIONS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to load invitations",
      error: error.message,
    });
  }
};

// ======================================================
// ACCEPT INVITATION
// ======================================================
//
// PATCH /api/project-invitations/:invitationId/accept
//
// Only invited user can accept.
// User is added to project.members here.
// ======================================================

const acceptInvitation = async (req, res) => {
  try {
    const { invitationId } =
      req.params;

    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication required",
      });
    }

    // --------------------------------------------------
    // Validate invitation ID
    // --------------------------------------------------

    if (
      !mongoose.Types.ObjectId.isValid(
        invitationId
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid invitation ID",
      });
    }

    // --------------------------------------------------
    // Find pending invitation belonging to user
    // --------------------------------------------------

    const invitation =
      await ProjectInvitation.findOne({
        _id: invitationId,
        invitedUser: userId,
        status: "pending",
      });

    if (!invitation) {
      return res.status(404).json({
        success: false,
        message:
          "Pending invitation not found",
      });
    }

    // --------------------------------------------------
    // Get project
    // --------------------------------------------------

    const project =
      await Project.findById(
        invitation.project
      );

    if (!project) {
      // Project deleted/no longer exists.
      // Close invitation safely.

      invitation.status =
        "declined";

      invitation.respondedAt =
        new Date();

      await invitation.save();

      return res.status(404).json({
        success: false,
        message:
          "Project no longer exists",
      });
    }

    // --------------------------------------------------
    // Check if already member
    // --------------------------------------------------

    const alreadyMember =
      (project.members || []).some(
        (memberId) =>
          memberId.toString() ===
          userId.toString()
      );

    // --------------------------------------------------
    // Add member
    // --------------------------------------------------

    if (!alreadyMember) {
      project.members.push(userId);

      await project.save();
    }

    // --------------------------------------------------
    // Mark invitation accepted
    // --------------------------------------------------

    invitation.status =
      "accepted";

    invitation.respondedAt =
      new Date();

    await invitation.save();

    // --------------------------------------------------
    // Get accepted user's information
    // --------------------------------------------------

    const acceptedUser =
      await User.findById(userId)
        .select("_id name email")
        .lean();

    const acceptedUserName =
      acceptedUser?.name ||
      acceptedUser?.email ||
      "A user";

    // --------------------------------------------------
    // Notify project owner
    // --------------------------------------------------

    const ownerNotification =
      await Notification.create({
        recipient: project.owner,

        sender: userId,

        type:
          "project_invitation_accepted",

        title:
          "Invitation Accepted",

        message:
          `${acceptedUserName} accepted your invitation to join "${project.name}".`,

        project:
          project._id,

        invitation:
          invitation._id,

        link:
          `/projects/${project._id}/members`,

        metadata: {
          invitationId:
            invitation._id.toString(),

          projectId:
            project._id.toString(),

          projectName:
            project.name,

          acceptedUserId:
            userId.toString(),

          acceptedUserName,
        },

        isRead: false,
      });

    // --------------------------------------------------
    // Success
    // --------------------------------------------------

    return res.status(200).json({
      success: true,

      message:
        "Project invitation accepted successfully",

      project: {
        _id:
          project._id,

        name:
          project.name,
      },

      invitation: {
        _id:
          invitation._id,

        status:
          invitation.status,

        respondedAt:
          invitation.respondedAt,
      },

      notification: {
        _id:
          ownerNotification._id,

        title:
          ownerNotification.title,

        message:
          ownerNotification.message,

        type:
          ownerNotification.type,
      },
    });
  } catch (error) {
    console.error(
      "ACCEPT INVITATION ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to accept invitation",
      error: error.message,
    });
  }
};

// ======================================================
// DECLINE INVITATION
// ======================================================
//
// PATCH /api/project-invitations/:invitationId/decline
//
// Only invited user can decline.
// User is NOT added to project.members.
// ======================================================

const declineInvitation = async (
  req,
  res
) => {
  try {
    const { invitationId } =
      req.params;

    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication required",
      });
    }

    // --------------------------------------------------
    // Validate invitation ID
    // --------------------------------------------------

    if (
      !mongoose.Types.ObjectId.isValid(
        invitationId
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid invitation ID",
      });
    }

    // --------------------------------------------------
    // Find pending invitation
    // --------------------------------------------------

    const invitation =
      await ProjectInvitation.findOne({
        _id: invitationId,
        invitedUser: userId,
        status: "pending",
      });

    if (!invitation) {
      return res.status(404).json({
        success: false,
        message:
          "Pending invitation not found",
      });
    }

    // --------------------------------------------------
    // Get project
    // --------------------------------------------------

    const project =
      await Project.findById(
        invitation.project
      )
        .select(
          "name owner members"
        )
        .lean();

    // --------------------------------------------------
    // Mark invitation declined
    // --------------------------------------------------

    invitation.status =
      "declined";

    invitation.respondedAt =
      new Date();

    await invitation.save();

    // --------------------------------------------------
    // Notify project owner if project exists
    // --------------------------------------------------

    let ownerNotification =
      null;

    if (project) {
      const declinedUser =
        await User.findById(userId)
          .select("_id name email")
          .lean();

      const declinedUserName =
        declinedUser?.name ||
        declinedUser?.email ||
        "A user";

      ownerNotification =
        await Notification.create({
          recipient:
            project.owner,

          sender:
            userId,

          type:
            "project_invitation_declined",

          title:
            "Invitation Declined",

          message:
            `${declinedUserName} declined your invitation to join "${project.name}".`,

          project:
            project._id,

          invitation:
            invitation._id,

          link:
            `/projects/${project._id}/members`,

          metadata: {
            invitationId:
              invitation._id.toString(),

            projectId:
              project._id.toString(),

            projectName:
              project.name,

            declinedUserId:
              userId.toString(),

            declinedUserName,
          },

          isRead: false,
        });
    }

    // --------------------------------------------------
    // Success
    // --------------------------------------------------

    return res.status(200).json({
      success: true,

      message:
        "Project invitation declined",

      invitation: {
        _id:
          invitation._id,

        status:
          invitation.status,

        respondedAt:
          invitation.respondedAt,
      },

      notification:
        ownerNotification
          ? {
              _id:
                ownerNotification._id,

              title:
                ownerNotification.title,

              message:
                ownerNotification.message,

              type:
                ownerNotification.type,
            }
          : null,
    });
  } catch (error) {
    console.error(
      "DECLINE INVITATION ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to decline invitation",
      error: error.message,
    });
  }
};

// ======================================================
// EXPORTS
// ======================================================

module.exports = {
  getInvitationUsers,
  sendInvitation,
  getMyInvitations,
  acceptInvitation,
  declineInvitation,
};