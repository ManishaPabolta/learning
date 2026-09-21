const express = require("express");

const router = express.Router();

const projectController = require("../controllers/projectController");

const {
  getInvitationUsers,
  sendInvitation,
} = require("../controllers/projectInvitationController");

const auth = require("../middleware/auth");

// ======================================================
// DEBUG
// ======================================================

console.log("PROJECT CONTROLLER:", {
  getProjects:
    typeof projectController.getProjects,

  getProject:
    typeof projectController.getProject,

  createProject:
    typeof projectController.createProject,

  updateProject:
    typeof projectController.updateProject,

  deleteProject:
    typeof projectController.deleteProject,

  getMembers:
    typeof projectController.getMembers,

  addMember:
    typeof projectController.addMember,

  removeMember:
    typeof projectController.removeMember,

  reviewProject:
    typeof projectController.reviewProject,

  getPublicProject:
    typeof projectController.getPublicProject,
});

console.log(
  "INVITATION CONTROLLER:",
  {
    getInvitationUsers:
      typeof getInvitationUsers,

    sendInvitation:
      typeof sendInvitation,
  }
);

console.log(
  "AUTH:",
  typeof auth
);

// ======================================================
// PUBLIC PROJECT
// ======================================================

// IMPORTANT:
// This route MUST come before /:id

router.get(
  "/public/:slug",
  projectController.getPublicProject
);

// ======================================================
// PROJECT LIST
// ======================================================

router.get(
  "/",
  auth,
  projectController.getProjects
);

// ======================================================
// CREATE PROJECT
// ======================================================

router.post(
  "/",
  auth,
  projectController.createProject
);

// ======================================================
// ADMIN REVIEW
// ======================================================

router.patch(
  "/:id/review",
  auth,
  projectController.reviewProject
);

// ======================================================
// PROJECT INVITATION USERS
// ======================================================
//
// Owner gets registered users that can be invited.
//
// GET /api/projects/:id/invitation-users
//
// IMPORTANT:
// Put this before generic /:id routes.
// ======================================================

router.get(
  "/:id/invitation-users",
  auth,
  getInvitationUsers
);

// ======================================================
// SEND PROJECT INVITATION
// ======================================================
//
// POST /api/projects/:id/invitations
//
// Body:
// {
//   "userId": "USER_ID"
// }
//
// User is NOT directly added.
// Invitation is created instead.
// ======================================================

router.post(
  "/:id/invitations",
  auth,
  sendInvitation
);

// ======================================================
// PROJECT MEMBERS - VIEW
// ======================================================

router.get(
  "/:id/members",
  auth,
  projectController.getMembers
);

// ======================================================
// OLD PROJECT MEMBERS - ADD
// ======================================================
//
// IMPORTANT:
// New frontend invitation flow should NOT use this.
//
// This route is kept temporarily so existing code
// does not immediately break.
//
// Later we can remove it completely.
// ======================================================

router.post(
  "/:id/members",
  auth,
  projectController.addMember
);

// ======================================================
// PROJECT MEMBERS - REMOVE
// ======================================================

router.delete(
  "/:id/members/:userId",
  auth,
  projectController.removeMember
);

// ======================================================
// SINGLE PROJECT
// ======================================================

router.get(
  "/:id",
  auth,
  projectController.getProject
);

// ======================================================
// UPDATE PROJECT
// ======================================================

router.put(
  "/:id",
  auth,
  projectController.updateProject
);

// ======================================================
// DELETE PROJECT
// ======================================================

router.delete(
  "/:id",
  auth,
  projectController.deleteProject
);

module.exports = router;