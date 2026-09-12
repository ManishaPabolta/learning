const User = require("../models/User");

// =====================================================
// GET ALL USERS
// ADMIN ONLY
// GET /api/users
// =====================================================

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password -otp -otpExpiry -refreshToken")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("GET ALL USERS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};


// =====================================================
// GET SINGLE USER
// ADMIN ONLY
// GET /api/users/:id
// =====================================================

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id)
      .select("-password -otp -otpExpiry -refreshToken");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("GET USER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch user",
    });
  }
};


// =====================================================
// DELETE USER
// ADMIN ONLY
// DELETE /api/users/:id
// =====================================================

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // -------------------------------------------------
    // Admin apne aap ko delete nahi kar sakta
    // -------------------------------------------------

    if (req.user._id.toString() === id) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own admin account",
      });
    }

    // -------------------------------------------------
    // Find user
    // -------------------------------------------------

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // -------------------------------------------------
    // Admin account delete nahi hoga
    // -------------------------------------------------

    if (user.role === "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin account cannot be deleted",
      });
    }

    // -------------------------------------------------
    // Delete student
    // -------------------------------------------------

    await User.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("DELETE USER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete user",
    });
  }
};


// =====================================================
// UPDATE USER ROLE
// ADMIN ONLY
// PATCH /api/users/:id/role
// =====================================================
//
// IMPORTANT:
// Sirf existing admin ko "user" banaya ja sakta hai.
// Kisi student ko "admin" nahi banaya ja sakta.
// Isse exactly ONE admin maintain rahega.
// =====================================================

exports.updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role: newRole } = req.body;

    // -------------------------------------------------
    // Only user role is allowed
    // -------------------------------------------------

    if (newRole !== "user") {
      return res.status(400).json({
        success: false,
        message:
          "New admin accounts cannot be created. Only user role is allowed.",
      });
    }

    // -------------------------------------------------
    // Admin apna role change nahi kar sakta
    // -------------------------------------------------

    if (req.user._id.toString() === id) {
      return res.status(400).json({
        success: false,
        message: "You cannot change your own role",
      });
    }

    // -------------------------------------------------
    // Find user
    // -------------------------------------------------

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // -------------------------------------------------
    // Change role
    // -------------------------------------------------

    user.role = "user";

    await user.save();

    return res.status(200).json({
      success: true,
      message: "User role updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error("UPDATE USER ROLE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update user role",
    });
  }
};