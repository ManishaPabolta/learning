const express = require("express");

const router = express.Router();

// Controllers
const {
  sendOTP,
  verifyOTP,
  loginUser,
  refreshToken,
  logoutUser,
  getCurrentUser,
} = require("../controllers/authController");

// Middleware
const auth = require("../middleware/auth");

// =====================================================
// AUTH ROUTES
// =====================================================

// -----------------------------------------------------
// PUBLIC ROUTES
// -----------------------------------------------------

// 1. Send OTP
// POST /api/auth/send-otp
router.post("/send-otp", sendOTP);

// 2. Verify OTP
// POST /api/auth/verify-otp
router.post("/verify-otp", verifyOTP);

// 3. Login
// POST /api/auth/login
router.post("/login", loginUser);

// 4. Refresh Access Token
// POST /api/auth/refresh-token
router.post("/refresh-token", refreshToken);

// -----------------------------------------------------
// PROTECTED ROUTES
// -----------------------------------------------------

// 5. Logout
// POST /api/auth/logout
router.post("/logout", auth, logoutUser);

// 6. Get Current Logged-in User
// GET /api/auth/me
router.get("/me", auth, getCurrentUser);

// =====================================================
// EXPORT ROUTER
// =====================================================

module.exports = router;