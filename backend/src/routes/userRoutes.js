const express = require("express");

const router = express.Router();

// =====================================================
// CONTROLLERS
// =====================================================

const {
  getAllUsers,
  getUserById,
  deleteUser,
  updateUserRole,
} = require("../controllers/userController");

// =====================================================
// MIDDLEWARE
// =====================================================

const auth = require("../middleware/auth");
const role = require("../middleware/role");

// =====================================================
// USER MANAGEMENT ROUTES
// ADMIN ONLY
// =====================================================


// -----------------------------------------------------
// GET ALL USERS
// GET /api/users
// -----------------------------------------------------

router.get(
  "/",
  auth,
  role("admin"),
  getAllUsers
);


// -----------------------------------------------------
// GET SINGLE USER
// GET /api/users/:id
// -----------------------------------------------------

router.get(
  "/:id",
  auth,
  role("admin"),
  getUserById
);


// -----------------------------------------------------
// UPDATE USER ROLE
// PATCH /api/users/:id/role
// -----------------------------------------------------

router.patch(
  "/:id/role",
  auth,
  role("admin"),
  updateUserRole
);


// -----------------------------------------------------
// DELETE USER
// DELETE /api/users/:id
// -----------------------------------------------------

router.delete(
  "/:id",
  auth,
  role("admin"),
  deleteUser
);


// =====================================================
// EXPORT ROUTER
// =====================================================

module.exports = router;