import api from "./api";

const projectService = {
  // ==================================================
  // GET ALL PROJECTS
  // ==================================================
  // Admin:
  //   Gets all projects.
  //
  // User:
  //   Gets own/member projects.
  // ==================================================
  getProjects: () => {
    return api.get("/projects");
  },

  // ==================================================
  // GET SINGLE PROJECT
  // ==================================================
  getProject: (id) => {
    return api.get(`/projects/${id}`);
  },

  // ==================================================
  // CREATE PROJECT
  // ==================================================
  createProject: (data) => {
    return api.post("/projects", data);
  },

  // ==================================================
  // UPDATE PROJECT
  // ==================================================
  // Backend:
  //   Only project owner can update.
  // ==================================================
  updateProject: (id, data) => {
    return api.put(`/projects/${id}`, data);
  },

  // ==================================================
  // DELETE PROJECT
  // ==================================================
  // Backend:
  //   Owner can delete own project.
  //   Admin can delete according to backend rules.
  // ==================================================
  deleteProject: (id) => {
    return api.delete(`/projects/${id}`);
  },

  // ==================================================
  // GET MEMBERS
  // ==================================================
  // Admin:
  //   Can view.
  //
  // Owner/member:
  //   Can view according to backend access rules.
  // ==================================================
  getMembers: (id) => {
    return api.get(`/projects/${id}/members`);
  },

  // ==================================================
  // GET USERS AVAILABLE FOR INVITATION
  // ==================================================
  // Returns registered/verified users that can be
  // invited to this project.
  //
  // Expected backend route:
  // GET /projects/:id/invitation-users
  //
  // Backend response should contain users with
  // status such as:
  //
  // available
  // pending
  // member
  // ==================================================
  getInvitationUsers: (id) => {
    return api.get(
      `/projects/${id}/invitation-users`
    );
  },

  // ==================================================
  // SEND PROJECT INVITATION
  // ==================================================
  // IMPORTANT:
  //
  // This does NOT directly add the user to project.members.
  //
  // Flow:
  //
  // Owner
  //    ↓
  // Send invitation
  //    ↓
  // ProjectInvitation created
  //    ↓
  // User receives notification
  //    ↓
  // User Accepts
  //    ↓
  // User becomes project member
  //
  // Expected backend route:
  // POST /projects/:id/invitations
  // ==================================================
  sendInvitation: (
    id,
    userId
  ) => {
    return api.post(
      `/projects/${id}/invitations`,
      {
        userId,
      }
    );
  },

  // ==================================================
  // REMOVE MEMBER
  // ==================================================
  // Only project owner should be allowed by backend.
  // ==================================================
  removeMember: (
    id,
    userId
  ) => {
    return api.delete(
      `/projects/${id}/members/${userId}`
    );
  },

  // ==================================================
  // ADMIN REVIEW
  // ==================================================
  reviewProject: (
    id,
    status,
    review = ""
  ) => {
    return api.patch(
      `/projects/${id}/review`,
      {
        status,
        review,
      }
    );
  },

  // ==================================================
  // PUBLIC PROJECT
  // ==================================================
  getPublicProject: (
    slug
  ) => {
    return api.get(
      `/projects/public/${slug}`
    );
  },
};

export default projectService;