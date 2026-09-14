require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");

const connectDB = require("./config/db");

// =====================================================
// ROUTES
// =====================================================

const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");
const assignmentRoutes = require("./routes/assignmentRoutes");
const userRoutes = require("./routes/userRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

// =====================================================
// APP
// =====================================================

const app = express();

// =====================================================
// DATABASE
// =====================================================

connectDB();

// =====================================================
// MIDDLEWARE
// =====================================================

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://learning-amber-six.vercel.app",
    ],
    credentials: true,
  })
);
app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(morgan("dev"));

// =====================================================
// STATIC FILES
// =====================================================

app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);

// =====================================================
// HEALTH CHECK
// =====================================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "LMS Backend API Running Successfully",
  });
});

// =====================================================
// AUTH ROUTES
// =====================================================

app.use(
  "/api/auth",
  authRoutes
);

// =====================================================
// COURSE ROUTES
// =====================================================

app.use(
  "/api/courses",
  courseRoutes
);

// =====================================================
// ASSIGNMENT ROUTES
// =====================================================

// CREATE ASSIGNMENT
// POST /api/assignments

// GET ALL ASSIGNMENTS
// GET /api/assignments

// DELETE ASSIGNMENT
// DELETE /api/assignments/:id

// STUDENT AVAILABLE ASSIGNMENTS
// GET /api/assignments/available

// STUDENT MY ASSIGNMENTS
// GET /api/assignments/my

// SUBMIT ASSIGNMENT
// POST /api/assignments/:assignmentId/submit

// UPDATE SUBMISSION
// PUT /api/assignments/submissions/:id

// DELETE SUBMISSION
// DELETE /api/assignments/submissions/:id

// APPROVE SUBMISSION
// PATCH /api/assignments/submissions/:id/approve

// REJECT SUBMISSION
// PATCH /api/assignments/submissions/:id/reject

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

app.use(
  "/api/notifications",
  notificationRoutes
);

// =====================================================
// 404 HANDLER
// =====================================================

app.use((req, res) => {
  console.log(
    `404 - ${req.method} ${req.originalUrl}`
  );

  res.status(404).json({
    success: false,
    message: "Route Not Found",
    path: req.originalUrl,
    method: req.method,
  });
});

// =====================================================
// GLOBAL ERROR HANDLER
// =====================================================

app.use(
  (err, req, res, next) => {
    console.error(
      "GLOBAL ERROR:",
      err
    );

    res.status(
      err.status || 500
    ).json({
      success: false,
      message:
        err.message ||
        "Internal Server Error",
    });
  }
);

// =====================================================
// SERVER START
// =====================================================

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    "===================================="
  );

  console.log(
    "       LMS BACKEND SERVER"
  );

  console.log(
    "===================================="
  );

  console.log(
    `Server Running Port : ${PORT}`
  );

  console.log(
    `API URL : http://localhost:${PORT}`
  );

  console.log(
    `Uploads : http://localhost:${PORT}/uploads`
  );

  console.log(
    "===================================="
  );
});