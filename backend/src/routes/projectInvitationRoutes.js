const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

const {
  getMyInvitations,
  acceptInvitation,
  declineInvitation,
} = require("../controllers/projectInvitationController");

// ======================================================
// MY PROJECT INVITATIONS
// ======================================================

// GET /api/project-invitations
router.get(
  "/",
  auth,
  getMyInvitations
);

// ======================================================
// ACCEPT INVITATION
// ======================================================

// PATCH /api/project-invitations/:invitationId/accept
router.patch(
  "/:invitationId/accept",
  auth,
  acceptInvitation
);

// ======================================================
// DECLINE INVITATION
// ======================================================

// PATCH /api/project-invitations/:invitationId/decline
router.patch(
  "/:invitationId/decline",
  auth,
  declineInvitation
);

module.exports = router;