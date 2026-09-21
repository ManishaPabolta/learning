// =====================================================
// ENVIRONMENT CONFIG
// =====================================================

require("dotenv").config();

// =====================================================
// IMPORTS
// =====================================================

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");

// =====================================================
// DATABASE
// =====================================================

const connectDB = require("./config/db");

// =====================================================
// ROUTES
// =====================================================

// -----------------------------------------------------
// AUTHENTICATION
// -----------------------------------------------------

const authRoutes = require("./routes/authRoutes");

// -----------------------------------------------------
// LMS
// -----------------------------------------------------

const courseRoutes = require("./routes/courseRoutes");
const assignmentRoutes = require("./routes/assignmentRoutes");

// -----------------------------------------------------
// USERS
// -----------------------------------------------------

const userRoutes = require("./routes/userRoutes");

// -----------------------------------------------------
// NOTIFICATIONS
// -----------------------------------------------------

const notificationRoutes = require("./routes/notificationRoutes");

// -----------------------------------------------------
// AI
// -----------------------------------------------------

const aiRoutes = require("./routes/aiRoutes");

// =====================================================
// COLLABSPHERE ROUTES
// =====================================================

// -----------------------------------------------------
// PROJECTS
// -----------------------------------------------------

const projectRoutes = require("./routes/projectRoutes");

// -----------------------------------------------------
// PROJECT INVITATIONS
// -----------------------------------------------------

const projectInvitationRoutes = require(
  "./routes/projectInvitationRoutes"
);

// -----------------------------------------------------
// PROJECT FILES
// -----------------------------------------------------

const projectFileRoutes = require(
  "./routes/projectFileRoutes"
);

// -----------------------------------------------------
// NOTES
// -----------------------------------------------------

const noteRoutes = require("./routes/noteRoutes");

// -----------------------------------------------------
// ANALYTICS
// -----------------------------------------------------

const analyticsRoutes = require(
  "./routes/analyticsRoutes"
);

// =====================================================
// APP INITIALIZATION
// =====================================================

const app = express();

// =====================================================
// DATABASE CONNECTION
// =====================================================

connectDB();

// =====================================================
// GLOBAL MIDDLEWARE
// =====================================================

// -----------------------------------------------------
// CORS
// -----------------------------------------------------

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://learning-amber-six.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests without an origin.
      // Examples:
      // - Postman
      // - Server-to-server requests
      // - Some development tools

      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.warn(
        `CORS blocked origin: ${origin}`
      );

      return callback(
        new Error("Not allowed by CORS")
      );
    },

    credentials: true,

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);

// -----------------------------------------------------
// JSON BODY
// -----------------------------------------------------

app.use(
  express.json({
    limit: "10mb",
  })
);

// -----------------------------------------------------
// URL ENCODED BODY
// -----------------------------------------------------

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);

// -----------------------------------------------------
// LOGGER
// -----------------------------------------------------

app.use(
  morgan("dev")
);

// =====================================================
// STATIC UPLOADS
// =====================================================
//
// Project files are physically stored inside:
//
// backend/src/uploads/
//
// They can be accessed through:
//
// GET /uploads/<filename>
//
// =====================================================

app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);

// =====================================================
// ROOT API
// =====================================================

app.get(
  "/",
  (req, res) => {
    res.status(200).json({
      success: true,

      message:
        "NGSkillForge / CollabSphere Backend API is running",

      status: "OK",

      environment:
        process.env.NODE_ENV ||
        "development",

      timestamp:
        new Date().toISOString(),
    });
  }
);

// =====================================================
// API HEALTH
// =====================================================

app.get(
  "/api/health",
  (req, res) => {
    res.status(200).json({
      success: true,

      message:
        "API is healthy",

      timestamp:
        new Date().toISOString(),
    });
  }
);

// =====================================================
// AUTH ROUTES
// =====================================================
//
// POST /api/auth/send-otp
// POST /api/auth/verify-otp
// POST /api/auth/register
// POST /api/auth/login
// POST /api/auth/refresh-token
// POST /api/auth/logout
// GET  /api/auth/me
//
// =====================================================

app.use(
  "/api/auth",
  authRoutes
);

// =====================================================
// COURSE ROUTES
// =====================================================
//
// GET    /api/courses
// POST   /api/courses
// GET    /api/courses/:id
// PUT    /api/courses/:id
// DELETE /api/courses/:id
//
// =====================================================

app.use(
  "/api/courses",
  courseRoutes
);

// =====================================================
// ASSIGNMENT ROUTES
// =====================================================
//
// GET    /api/assignments
// POST   /api/assignments
// GET    /api/assignments/:id
// PUT    /api/assignments/:id
// DELETE /api/assignments/:id
//
// =====================================================

app.use(
  "/api/assignments",
  assignmentRoutes
);

// =====================================================
// USER ROUTES
// =====================================================

app.use(
  "/api/users",
  userRoutes
);

// =====================================================
// NOTIFICATION ROUTES
// =====================================================
//
// GET    /api/notifications
// PATCH  /api/notifications/:id/read
// PATCH  /api/notifications/read-all
// DELETE /api/notifications/:id
//
// =====================================================

app.use(
  "/api/notifications",
  notificationRoutes
);

// =====================================================
// AI ROUTES
// =====================================================
//
// POST /api/ai/explain-code
// POST /api/ai/docs
//
// =====================================================

app.use(
  "/api/ai",
  aiRoutes
);

// =====================================================
// COLLABSPHERE
// PROJECT ROUTES
// =====================================================
//
// GET    /api/projects
// POST   /api/projects
// GET    /api/projects/:id
// PUT    /api/projects/:id
// DELETE /api/projects/:id
//
// GET    /api/projects/:id/members
// POST   /api/projects/:id/members
// DELETE /api/projects/:id/members/:userId
//
// =====================================================

app.use(
  "/api/projects",
  projectRoutes
);

// =====================================================
// COLLABSPHERE
// PROJECT INVITATION ROUTES
// =====================================================
//
// GET   /api/project-invitations
//
// PATCH /api/project-invitations/:invitationId/accept
//
// PATCH /api/project-invitations/:invitationId/decline
//
// =====================================================

app.use(
  "/api/project-invitations",
  projectInvitationRoutes
);

// =====================================================
// COLLABSPHERE
// PROJECT FILE ROUTES
// =====================================================
//
// GET
// /api/project-files/:projectId
//
// GET
// /api/project-files/:projectId/:fileId
//
// POST
// /api/project-files/:projectId
//
// PUT
// /api/project-files/:projectId/:fileId
//
// DELETE
// /api/project-files/:projectId/:fileId
//
// =====================================================

app.use(
  "/api/project-files",
  projectFileRoutes
);

// =====================================================
// COLLABSPHERE
// NOTES ROUTES
// =====================================================
//
// GET    /api/notes/project/:projectId
// POST   /api/notes
// GET    /api/notes/:id
// PUT    /api/notes/:id
// DELETE /api/notes/:id
//
// =====================================================

app.use(
  "/api/notes",
  noteRoutes
);

// =====================================================
// COLLABSPHERE
// ANALYTICS ROUTES
// =====================================================
//
// GET /api/analytics/project/:projectId
//
// =====================================================

app.use(
  "/api/analytics",
  analyticsRoutes
);

// =====================================================
// 404 HANDLER
// =====================================================

app.use(
  (req, res) => {
    console.log(
      `404 - ${req.method} ${req.originalUrl}`
    );

    res.status(404).json({
      success: false,

      message:
        "Route Not Found",

      method:
        req.method,

      path:
        req.originalUrl,
    });
  }
);

// =====================================================
// GLOBAL ERROR HANDLER
// =====================================================
//
// IMPORTANT:
// This also handles Multer/file-upload errors.
// =====================================================

app.use(
  (
    err,
    req,
    res,
    next
  ) => {
    console.error("");

    console.error(
      "=============================================="
    );

    console.error(
      "GLOBAL SERVER ERROR"
    );

    console.error(
      "=============================================="
    );

    console.error(
      err
    );

    console.error(
      "=============================================="
    );

    console.error("");

    // -------------------------------------------------
    // MULTER ERRORS
    // -------------------------------------------------

    if (err?.name === "MulterError") {
      if (
        err.code === "LIMIT_FILE_SIZE"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "File size cannot exceed 100 MB",
        });
      }

      return res.status(400).json({
        success: false,
        message:
          err.message ||
          "File upload error",
      });
    }

    // -------------------------------------------------
    // FILE UPLOAD ERRORS
    // -------------------------------------------------

    if (
      err?.message &&
      (
        err.message.includes("file") ||
        err.message.includes("File")
      )
    ) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    // -------------------------------------------------
    // NORMAL ERROR
    // -------------------------------------------------

    const statusCode =
      err.statusCode ||
      err.status ||
      500;

    return res.status(
      statusCode
    ).json({
      success: false,

      message:
        err.message ||
        "Internal Server Error",

      ...(process.env.NODE_ENV ===
        "development" && {
        stack: err.stack,
      }),
    });
  }
);

// =====================================================
// SERVER CONFIG
// =====================================================

const PORT =
  process.env.PORT || 5000;

// =====================================================
// START SERVER
// =====================================================

const server =
  app.listen(
    PORT,
    () => {
      console.log("");

      console.log(
        "=================================================="
      );

      console.log(
        "       NGSKILLFORGE / COLLABSPHERE API"
      );

      console.log(
        "=================================================="
      );

      console.log(
        `Server Running : http://localhost:${PORT}`
      );

      console.log(
        `Environment    : ${
          process.env.NODE_ENV ||
          "development"
        }`
      );

      console.log(
        `Health Check   : http://localhost:${PORT}/api/health`
      );

      console.log(
        `Uploads        : http://localhost:${PORT}/uploads`
      );

      console.log("");

      console.log(
        "API ROUTES"
      );

      console.log(
        `Auth           : http://localhost:${PORT}/api/auth`
      );

      console.log(
        `Courses        : http://localhost:${PORT}/api/courses`
      );

      console.log(
        `Assignments    : http://localhost:${PORT}/api/assignments`
      );

      console.log(
        `Users          : http://localhost:${PORT}/api/users`
      );

      console.log(
        `Notifications  : http://localhost:${PORT}/api/notifications`
      );

      console.log(
        `AI             : http://localhost:${PORT}/api/ai`
      );

      console.log(
        `Projects       : http://localhost:${PORT}/api/projects`
      );

      console.log(
        `Invitations    : http://localhost:${PORT}/api/project-invitations`
      );

      console.log(
        `Project Files  : http://localhost:${PORT}/api/project-files`
      );

      console.log(
        `Notes          : http://localhost:${PORT}/api/notes`
      );

      console.log(
        `Analytics      : http://localhost:${PORT}/api/analytics`
      );

      console.log("");

      console.log(
        "=================================================="
      );

      console.log("");
    }
  );

// =====================================================
// SERVER ERROR HANDLING
// =====================================================

server.on(
  "error",
  (error) => {
    if (
      error.code ===
      "EADDRINUSE"
    ) {
      console.error(
        `Port ${PORT} is already in use.`
      );

      console.error(
        "Stop the existing server and try again."
      );

      process.exit(1);
    }

    console.error(
      "Server Error:",
      error
    );
  }
);

// =====================================================
// UNHANDLED PROMISE
// =====================================================

process.on(
  "unhandledRejection",
  (reason) => {
    console.error(
      "Unhandled Promise Rejection:",
      reason
    );
  }
);

// =====================================================
// UNCAUGHT EXCEPTION
// =====================================================

process.on(
  "uncaughtException",
  (error) => {
    console.error(
      "Uncaught Exception:",
      error
    );
  }
);