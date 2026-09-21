const Project = require("../models/Project");
const User = require("../models/User");

const {
  createNotification,
} = require("../services/notificationService");

// =====================================================
// HELPER - CHECK ADMIN
// =====================================================

const isAdmin = async (userId) => {
  try {
    const user = await User.findById(userId)
      .select("role")
      .lean();

    return Boolean(
      user && user.role === "admin"
    );
  } catch (error) {
    console.error(
      "Check Admin Error:",
      error
    );

    return false;
  }
};

// =====================================================
// HELPER - CHECK NORMAL USER
// =====================================================

const isNormalUser = async (userId) => {
  try {
    const user = await User.findById(userId)
      .select("role")
      .lean();

    return Boolean(
      user && user.role === "user"
    );
  } catch (error) {
    console.error(
      "Check Normal User Error:",
      error
    );

    return false;
  }
};

// =====================================================
// GET PROJECTS
// =====================================================

const getProjects = async (req, res) => {
  try {
    const userId = req.user.id;

    const admin = await isAdmin(userId);

    console.log(
      "================================="
    );
    console.log("GET PROJECTS");
    console.log("User ID:", userId);
    console.log("Is Admin:", admin);
    console.log(
      "================================="
    );

    let query;

    // ===================================================
    // ADMIN
    // ===================================================

    if (admin) {
      query = {};
    }

    // ===================================================
    // NORMAL USER
    // ===================================================

    else {
      query = {
        $or: [
          {
            owner: userId,
          },
          {
            members: userId,
          },
        ],
      };
    }

    const projects =
      await Project.find(query)
        .populate(
          "owner",
          "name email avatar profileImage"
        )
        .populate(
          "members",
          "name email avatar profileImage"
        )
        .populate(
          "reviewedBy",
          "name email"
        )
        .sort({
          createdAt: -1,
        });

    console.log(
      "Projects Found:",
      projects.length
    );

    return res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    console.error(
      "Get Projects Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch projects",
    });
  }
};

// =====================================================
// GET SINGLE PROJECT
// =====================================================

const getProject = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const admin = await isAdmin(userId);

    let query;

    // ===================================================
    // ADMIN
    // ===================================================

    if (admin) {
      query = {
        _id: id,
      };
    }

    // ===================================================
    // USER
    // ===================================================

    else {
      query = {
        _id: id,
        $or: [
          {
            owner: userId,
          },
          {
            members: userId,
          },
        ],
      };
    }

    const project =
      await Project.findOne(query)
        .populate(
          "owner",
          "name email avatar profileImage"
        )
        .populate(
          "members",
          "name email avatar profileImage"
        )
        .populate(
          "reviewedBy",
          "name email"
        );

    if (!project) {
      return res.status(404).json({
        success: false,
        message:
          "Project not found or you do not have access",
      });
    }

    return res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error(
      "Get Project Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch project",
    });
  }
};

// =====================================================
// CREATE PROJECT
// =====================================================

const createProject = async (req, res) => {
  try {
    const {
      name,
      description,
      visibility,
      readme,
    } = req.body;

    // ===================================================
    // VALIDATE NAME
    // ===================================================

    if (
      !name ||
      typeof name !== "string" ||
      !name.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Project name is required",
      });
    }

    // ===================================================
    // VALIDATE VISIBILITY
    // ===================================================

    const projectVisibility =
      visibility === "public"
        ? "public"
        : "private";

    // ===================================================
    // PUBLIC PROJECT NEEDS REVIEW
    // ===================================================

    const moderationStatus =
      projectVisibility === "public"
        ? "pending"
        : "approved";

    // ===================================================
    // CREATE PROJECT
    // ===================================================

    const project =
      await Project.create({
        name: name.trim(),

        description:
          typeof description === "string"
            ? description.trim()
            : "",

        visibility:
          projectVisibility,

        owner: req.user.id,

        members: [req.user.id],

        readme:
          typeof readme === "string"
            ? readme
            : "",

        moderationStatus,

        adminReview: "",

        reviewedBy: null,

        reviewedAt: null,
      });

    // ===================================================
    // NOTIFY ADMINS
    // ===================================================

    const admins = await User.find({
      role: "admin",
      isVerified: true,
    }).select("_id");

    if (admins.length > 0) {
      await Promise.all(
        admins.map((admin) =>
          createNotification({
            recipient: admin._id,

            sender: req.user.id,

            type: "project",

            title:
              projectVisibility === "public"
                ? "New Project Requires Review"
                : "New Project Created",

            message:
              projectVisibility === "public"
                ? `A new public project "${project.name}" has been submitted for review.`
                : `A new project "${project.name}" has been created.`,

            link: `/admin/projects`,

            metadata: {
              projectId: project._id,
              projectName: project.name,
              ownerId: req.user.id,
              visibility:
                projectVisibility,
              moderationStatus,
              action: "created",
            },
          })
        )
      );
    }

    // ===================================================
    // POPULATE CREATED PROJECT
    // ===================================================

    const populatedProject =
      await Project.findById(
        project._id
      )
        .populate(
          "owner",
          "name email avatar profileImage"
        )
        .populate(
          "members",
          "name email avatar profileImage"
        );

    return res.status(201).json({
      success: true,

      message:
        projectVisibility === "public"
          ? "Project created and sent for admin review"
          : "Project created successfully",

      data: populatedProject,
    });
  } catch (error) {
    console.error(
      "Create Project Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to create project",
    });
  }
};

// =====================================================
// UPDATE PROJECT
// =====================================================

const updateProject = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      description,
      visibility,
      readme,
    } = req.body;

    // ===================================================
    // ONLY OWNER CAN UPDATE
    // ===================================================

    const project =
      await Project.findOne({
        _id: id,
        owner: req.user.id,
      });

    if (!project) {
      return res.status(404).json({
        success: false,
        message:
          "Project not found or unauthorized",
      });
    }

    // ===================================================
    // SAVE OLD VALUES
    // ===================================================

    const oldName = project.name;
    const oldVisibility =
      project.visibility;

    // ===================================================
    // NAME
    // ===================================================

    if (name !== undefined) {
      if (
        typeof name !== "string" ||
        !name.trim()
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Project name cannot be empty",
        });
      }

      project.name = name.trim();
    }

    // ===================================================
    // DESCRIPTION
    // ===================================================

    if (
      description !== undefined
    ) {
      project.description =
        typeof description === "string"
          ? description.trim()
          : "";
    }

    // ===================================================
    // README
    // ===================================================

    if (readme !== undefined) {
      project.readme =
        typeof readme === "string"
          ? readme
          : "";
    }

    // ===================================================
    // VISIBILITY
    // ===================================================

    if (
      visibility !== undefined
    ) {
      if (
        ![
          "private",
          "public",
        ].includes(visibility)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Visibility must be private or public",
        });
      }

      project.visibility =
        visibility;

      // -----------------------------------------------
      // PUBLIC
      // -----------------------------------------------

      if (
        visibility === "public"
      ) {
        project.moderationStatus =
          "pending";

        project.adminReview =
          "";

        project.reviewedBy =
          null;

        project.reviewedAt =
          null;
      }

      // -----------------------------------------------
      // PRIVATE
      // -----------------------------------------------

      if (
        visibility === "private"
      ) {
        project.moderationStatus =
          "approved";
      }
    }

    // ===================================================
    // SAVE
    // ===================================================

    await project.save();

    // ===================================================
    // NOTIFY PROJECT MEMBERS
    // ===================================================

    const members = [
      ...(project.members || []),
    ].filter(
      (memberId) =>
        memberId.toString() !==
        req.user.id.toString()
    );

    if (members.length > 0) {
      await Promise.all(
        members.map((memberId) =>
          createNotification({
            recipient: memberId,

            sender: req.user.id,

            type: "project",

            title: "Project Updated",

            message: `The project "${oldName}" has been updated by its owner.`,

            link: `/projects/${project._id}`,

            metadata: {
              projectId: project._id,
              projectName: project.name,
              oldName,
              oldVisibility,
              newVisibility:
                project.visibility,
              action: "updated",
            },
          })
        )
      );
    }

    // ===================================================
    // IF PUBLIC -> ADMIN REVIEW NOTIFICATION
    // ===================================================

    const becamePublic =
      project.visibility === "public" &&
      oldVisibility !== "public";

    if (becamePublic) {
      const admins = await User.find({
        role: "admin",
        isVerified: true,
      }).select("_id");

      if (admins.length > 0) {
        await Promise.all(
          admins.map((admin) =>
            createNotification({
              recipient: admin._id,

              sender: req.user.id,

              type: "project_review",

              title:
                "Project Requires Review",

              message: `The project "${project.name}" has been changed to public and requires admin review.`,

              link: `/admin/projects`,

              metadata: {
                projectId:
                  project._id,

                projectName:
                  project.name,

                action:
                  "review_required",
              },
            })
          )
        );
      }
    }

    // ===================================================
    // GET UPDATED PROJECT
    // ===================================================

    const updatedProject =
      await Project.findById(
        project._id
      )
        .populate(
          "owner",
          "name email avatar profileImage"
        )
        .populate(
          "members",
          "name email avatar profileImage"
        )
        .populate(
          "reviewedBy",
          "name email"
        );

    return res.status(200).json({
      success: true,
      message:
        "Project updated successfully",
      data: updatedProject,
    });
  } catch (error) {
    console.error(
      "Update Project Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update project",
    });
  }
};

// =====================================================
// DELETE PROJECT
// =====================================================

const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const admin =
      await isAdmin(userId);

    let query;

    // ===================================================
    // ADMIN CAN DELETE ANY PROJECT
    // ===================================================

    if (admin) {
      query = {
        _id: id,
      };
    }

    // ===================================================
    // NORMAL USER - OWNER ONLY
    // ===================================================

    else {
      query = {
        _id: id,
        owner: userId,
      };
    }

    const project =
      await Project.findOne(query);

    if (!project) {
      return res.status(404).json({
        success: false,
        message:
          "Project not found or unauthorized",
      });
    }

    // ===================================================
    // SAVE USERS BEFORE DELETE
    // ===================================================

    const recipients = [
      ...(project.members || []),
    ].filter(
      (memberId) =>
        memberId.toString() !==
        userId.toString()
    );

    // Owner should also receive notification
    // when admin deletes the project.
    if (
      admin &&
      project.owner &&
      project.owner.toString() !==
        userId.toString()
    ) {
      recipients.push(
        project.owner
      );
    }

    // Remove duplicate user IDs
    const uniqueRecipients = [
      ...new Map(
        recipients.map((id) => [
          id.toString(),
          id,
        ])
      ).values(),
    ];

    // ===================================================
    // DELETE PROJECT
    // ===================================================

    await Project.findByIdAndDelete(id);

    // ===================================================
    // NOTIFY AFFECTED USERS
    // ===================================================

    if (
      uniqueRecipients.length > 0
    ) {
      await Promise.all(
        uniqueRecipients.map(
          (recipientId) =>
            createNotification({
              recipient:
                recipientId,

              sender: userId,

              type: "project",

              title:
                "Project Deleted",

              message: `The project "${project.name}" has been deleted.`,

              link: "/projects",

              metadata: {
                projectId:
                  project._id,

                projectName:
                  project.name,

                action: "deleted",

                deletedByAdmin:
                  admin,
              },
            })
        )
      );
    }

    return res.status(200).json({
      success: true,
      message:
        "Project deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete Project Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to delete project",
    });
  }
};

// =====================================================
// GET PROJECT MEMBERS
// =====================================================

const getMembers = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const admin =
      await isAdmin(userId);

    let query;

    // ===================================================
    // ADMIN
    // ===================================================

    if (admin) {
      query = {
        _id: id,
      };
    }

    // ===================================================
    // USER
    // ===================================================

    else {
      query = {
        _id: id,
        $or: [
          {
            owner: userId,
          },
          {
            members: userId,
          },
        ],
      };
    }

    const project =
      await Project.findOne(query)
        .populate(
          "owner",
          "name email avatar profileImage"
        )
        .populate(
          "members",
          "name email avatar profileImage"
        );

    if (!project) {
      return res.status(404).json({
        success: false,
        message:
          "Project not found or you do not have access",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        owner: project.owner,
        members:
          project.members || [],
      },
    });
  } catch (error) {
    console.error(
      "Get Project Members Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to get project members",
    });
  }
};

// =====================================================
// ADD MEMBER
// ONLY NORMAL USER + PROJECT OWNER
// ADMIN = VIEW ONLY
// =====================================================

const addMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.body;

    // ===================================================
    // CHECK ADMIN
    // ===================================================

    const admin =
      await isAdmin(req.user.id);

    if (admin) {
      return res.status(403).json({
        success: false,
        message:
          "Admin cannot add project members",
      });
    }

    // ===================================================
    // CHECK NORMAL USER
    // ===================================================

    const normalUser =
      await isNormalUser(
        req.user.id
      );

    if (!normalUser) {
      return res.status(403).json({
        success: false,
        message:
          "Only normal users can add project members",
      });
    }

    // ===================================================
    // VALIDATE EMAIL
    // ===================================================

    if (
      !email ||
      typeof email !== "string" ||
      !email.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Email is required",
      });
    }

    // ===================================================
    // FIND PROJECT
    // ===================================================

    const project =
      await Project.findOne({
        _id: id,
        owner: req.user.id,
      });

    if (!project) {
      return res.status(404).json({
        success: false,
        message:
          "Project not found or you are not the project owner",
      });
    }

    // ===================================================
    // NORMALIZE EMAIL
    // ===================================================

    const normalizedEmail =
      email
        .toLowerCase()
        .trim();

    // ===================================================
    // FIND USER
    // ===================================================

    const user =
      await User.findOne({
        email:
          normalizedEmail,
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "Registered user not found",
      });
    }

    // ===================================================
    // OWNER CHECK
    // ===================================================

    if (
      user._id.toString() ===
      project.owner.toString()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Project owner is already a member",
      });
    }

    // ===================================================
    // CHECK ALREADY MEMBER
    // ===================================================

    const alreadyMember =
      (project.members || []).some(
        (memberId) =>
          memberId.toString() ===
          user._id.toString()
      );

    if (alreadyMember) {
      return res.status(400).json({
        success: false,
        message:
          "User is already a project member",
      });
    }

    // ===================================================
    // ADD MEMBER
    // ===================================================

    project.members.push(
      user._id
    );

    await project.save();

    // ===================================================
    // NOTIFY ADDED USER
    // ===================================================

    await createNotification({
      recipient: user._id,

      sender: req.user.id,

      type: "project",

      title:
        "Added to Project",

      message: `You have been added to the project "${project.name}".`,

      link: `/projects/${project._id}`,

      metadata: {
        projectId:
          project._id,

        projectName:
          project.name,

        action:
          "member_added",
      },
    });

    // ===================================================
    // GET UPDATED PROJECT
    // ===================================================

    const updatedProject =
      await Project.findById(
        project._id
      )
        .populate(
          "owner",
          "name email avatar profileImage"
        )
        .populate(
          "members",
          "name email avatar profileImage"
        );

    return res.status(200).json({
      success: true,
      message:
        "Member added successfully",
      data: updatedProject,
    });
  } catch (error) {
    console.error(
      "Add Member Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to add member",
    });
  }
};

// =====================================================
// REMOVE MEMBER
// ONLY NORMAL USER + PROJECT OWNER
// ADMIN = VIEW ONLY
// =====================================================

const removeMember = async (req, res) => {
  try {
    const {
      id,
      userId,
    } = req.params;

    // ===================================================
    // CHECK ADMIN
    // ===================================================

    const admin =
      await isAdmin(req.user.id);

    if (admin) {
      return res.status(403).json({
        success: false,
        message:
          "Admin cannot remove project members",
      });
    }

    // ===================================================
    // CHECK NORMAL USER
    // ===================================================

    const normalUser =
      await isNormalUser(
        req.user.id
      );

    if (!normalUser) {
      return res.status(403).json({
        success: false,
        message:
          "Only normal users can remove project members",
      });
    }

    // ===================================================
    // VALIDATE USER ID
    // ===================================================

    if (!userId) {
      return res.status(400).json({
        success: false,
        message:
          "Member user ID is required",
      });
    }

    // ===================================================
    // FIND PROJECT
    // ===================================================

    const project =
      await Project.findOne({
        _id: id,
        owner: req.user.id,
      });

    if (!project) {
      return res.status(404).json({
        success: false,
        message:
          "Project not found or you are not the project owner",
      });
    }

    // ===================================================
    // OWNER CANNOT BE REMOVED
    // ===================================================

    if (
      userId.toString() ===
      req.user.id.toString()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Project owner cannot be removed",
      });
    }

    // ===================================================
    // CHECK MEMBER
    // ===================================================

    const isMember =
      (project.members || []).some(
        (memberId) =>
          memberId.toString() ===
          userId.toString()
      );

    if (!isMember) {
      return res.status(404).json({
        success: false,
        message:
          "User is not a member of this project",
      });
    }

    // ===================================================
    // REMOVE MEMBER
    // ===================================================

    project.members =
      (project.members || []).filter(
        (memberId) =>
          memberId.toString() !==
          userId.toString()
      );

    await project.save();

    // ===================================================
    // NOTIFY REMOVED USER
    // ===================================================

    await createNotification({
      recipient: userId,

      sender: req.user.id,

      type: "project",

      title:
        "Removed from Project",

      message: `You have been removed from the project "${project.name}".`,

      link: "/projects",

      metadata: {
        projectId:
          project._id,

        projectName:
          project.name,

        action:
          "member_removed",
      },
    });

    // ===================================================
    // GET UPDATED PROJECT
    // ===================================================

    const updatedProject =
      await Project.findById(
        project._id
      )
        .populate(
          "owner",
          "name email avatar profileImage"
        )
        .populate(
          "members",
          "name email avatar profileImage"
        );

    return res.status(200).json({
      success: true,
      message:
        "Member removed successfully",
      data: updatedProject,
    });
  } catch (error) {
    console.error(
      "Remove Member Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to remove member",
    });
  }
};

// =====================================================
// ADMIN REVIEW PROJECT
// =====================================================

const reviewProject = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      status,
      review,
    } = req.body;

    // ===================================================
    // CHECK ADMIN
    // ===================================================

    const admin =
      await isAdmin(req.user.id);

    if (!admin) {
      return res.status(403).json({
        success: false,
        message:
          "Only admin can review projects",
      });
    }

    // ===================================================
    // VALIDATE STATUS
    // ===================================================

    if (
      ![
        "approved",
        "rejected",
      ].includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Status must be approved or rejected",
      });
    }

    // ===================================================
    // FIND PROJECT
    // ===================================================

    const project =
      await Project.findById(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message:
          "Project not found",
      });
    }

    // ===================================================
    // ONLY PUBLIC PROJECT
    // ===================================================

    if (
      project.visibility !==
      "public"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Only public projects can be reviewed",
      });
    }

    // ===================================================
    // UPDATE MODERATION
    // ===================================================

    project.moderationStatus =
      status;

    project.adminReview =
      typeof review === "string"
        ? review.trim()
        : "";

    project.reviewedBy =
      req.user.id;

    project.reviewedAt =
      new Date();

    await project.save();

    // ===================================================
    // NOTIFY PROJECT OWNER
    // ===================================================

    await createNotification({
      recipient:
        project.owner,

      sender:
        req.user.id,

      type:
        "project_review",

      title:
        status === "approved"
          ? "Project Approved"
          : "Project Rejected",

      message:
        status === "approved"
          ? `Your public project "${project.name}" has been approved.`
          : `Your public project "${project.name}" has been rejected.`,

      link:
        `/projects/${project._id}`,

      metadata: {
        projectId:
          project._id,

        projectName:
          project.name,

        status,

        review:
          project.adminReview,

        reviewedBy:
          req.user.id,

        action:
          status === "approved"
            ? "approved"
            : "rejected",
      },
    });

    // ===================================================
    // GET REVIEWED PROJECT
    // ===================================================

    const reviewedProject =
      await Project.findById(
        project._id
      )
        .populate(
          "owner",
          "name email avatar profileImage"
        )
        .populate(
          "members",
          "name email avatar profileImage"
        )
        .populate(
          "reviewedBy",
          "name email"
        );

    return res.status(200).json({
      success: true,

      message:
        status === "approved"
          ? "Project approved successfully"
          : "Project rejected successfully",

      data: reviewedProject,
    });
  } catch (error) {
    console.error(
      "Review Project Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to review project",
    });
  }
};

// =====================================================
// GET PUBLIC APPROVED PROJECT
// =====================================================

const getPublicProject = async (
  req,
  res
) => {
  try {
    const { slug } =
      req.params;

    const project =
      await Project.findOne({
        slug,
        visibility: "public",
        moderationStatus:
          "approved",
      })
        .populate(
          "owner",
          "name email avatar profileImage"
        )
        .populate(
          "members",
          "name email avatar profileImage"
        );

    if (!project) {
      return res.status(404).json({
        success: false,
        message:
          "Public project not found or not approved",
      });
    }

    return res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error(
      "Get Public Project Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch public project",
    });
  }
};

// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,

  getMembers,

  addMember,
  removeMember,

  reviewProject,
  getPublicProject,
};