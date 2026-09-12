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
// DATABASE CONNECTION
// =====================================================

connectDB();

// =====================================================
// MIDDLEWARES
// =====================================================

// CORS
app.use(cors());

// JSON data
app.use(express.json());

// Form data
app.use(express.urlencoded({ extended: true }));

// HTTP request logger
app.use(morgan("dev"));

// =====================================================
// STATIC FILES
// =====================================================

// Upload folder access
// Example:
// http://localhost:5000/uploads/filename.pdf

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
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
// API ROUTES
// =====================================================

// -----------------------------
// AUTH ROUTES
// -----------------------------

// POST /api/auth/send-otp
// POST /api/auth/verify-otp
// POST /api/auth/login
// POST /api/auth/refresh-token
// POST /api/auth/logout
// GET  /api/auth/me

app.use("/api/auth", authRoutes);

// -----------------------------
// COURSE ROUTES
// -----------------------------

// GET    /api/courses
// GET    /api/courses/:id
// POST   /api/courses
// PATCH  /api/courses/:id
// DELETE /api/courses/:id
// POST   /api/courses/enroll/:id

app.use("/api/courses", courseRoutes);

// -----------------------------
// ASSIGNMENT ROUTES
// -----------------------------

// POST  /api/assignments/upload
// GET   /api/assignments/my
// GET   /api/assignments
// PATCH /api/assignments/:id/approve
// PATCH /api/assignments/:id/reject

app.use("/api/assignments", assignmentRoutes);

// -----------------------------
// USER MANAGEMENT ROUTES
// -----------------------------

// GET    /api/users
// GET    /api/users/:id
// PATCH  /api/users/:id/role
// DELETE /api/users/:id

app.use("/api/users", userRoutes);



app.use(
  "/api/notifications",
  notificationRoutes
);

// =====================================================
// 404 HANDLER
// =====================================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
    path: req.originalUrl,
  });
});

// =====================================================
// GLOBAL ERROR HANDLER
// =====================================================

app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// =====================================================
// SERVER START
// =====================================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("====================================");
  console.log("LMS BACKEND SERVER");
  console.log("====================================");
  console.log(`Server Running Port : ${PORT}`);
  console.log(`API URL : http://localhost:${PORT}`);
  console.log(`Uploads : http://localhost:${PORT}/uploads`);
  console.log("====================================");
});