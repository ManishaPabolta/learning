const User = require("../models/User");
const jwt = require("jsonwebtoken");
const sendOTPEmail = require("../utils/sendOTP");
const generateTokens = require("../utils/generateToken");

// =====================================================
// SEND OTP / SIGNUP
// =====================================================

exports.sendOTP = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // -----------------------------
    // Validation
    // -----------------------------

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // -----------------------------
    // Normalize email
    // -----------------------------

    const normalizedEmail = email.trim().toLowerCase();

    // -----------------------------
    // Check existing user
    // -----------------------------

    let user = await User.findOne({
      email: normalizedEmail,
    });

    // -----------------------------
    // If email already verified
    // -----------------------------

    if (user && user.isVerified) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered. Please login.",
      });
    }

    // -----------------------------
    // Generate OTP
    // -----------------------------

    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // OTP valid for 5 minutes

    const otpExpiry = new Date(
      Date.now() + 5 * 60 * 1000
    );

    // -----------------------------
    // Existing unverified user
    // -----------------------------

    if (user && !user.isVerified) {
      user.name = name.trim();
      user.password = password;
      user.role = role || "user";
      user.otp = otp;
      user.otpExpiry = otpExpiry;

      await user.save();
    }

    // -----------------------------
    // New user
    // -----------------------------

    else {
      user = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        password,
        role: role || "user",
        otp,
        otpExpiry,
        isVerified: false,
      });
    }

    // -----------------------------
    // Send OTP Email
    // -----------------------------

    try {
      await sendOTPEmail(normalizedEmail, otp);
    } catch (emailError) {
      console.error(
        "OTP Email Error:",
        emailError.message
      );

      return res.status(500).json({
        success: false,
        message: "Unable to send OTP email",
      });
    }

    // -----------------------------
    // Response
    // -----------------------------

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      userId: user._id,

      // Only for development/testing
      // Production mein remove kar dena
      otp,
    });

  } catch (error) {
    console.error(
      "SEND OTP ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================================
// VERIFY OTP
// =====================================================

exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // -----------------------------
    // Validation
    // -----------------------------

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const normalizedEmail =
      email.trim().toLowerCase();

    // -----------------------------
    // Find user
    // -----------------------------

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // -----------------------------
    // Already verified
    // -----------------------------

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message:
          "Email is already verified. Please login.",
      });
    }

    // -----------------------------
    // Check OTP
    // -----------------------------

    if (user.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // -----------------------------
    // Check OTP expiry
    // -----------------------------

    if (
      !user.otpExpiry ||
      user.otpExpiry < new Date()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "OTP expired. Please request a new OTP.",
      });
    }

    // -----------------------------
    // Verify User
    // -----------------------------

    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    // -----------------------------
    // Response
    // -----------------------------

    return res.status(200).json({
      success: true,
      message:
        "Email verified successfully. You can now login.",
    });

  } catch (error) {
    console.error(
      "VERIFY OTP ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================================
// LOGIN
// =====================================================

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // -----------------------------
    // Validation
    // -----------------------------

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Email and password are required",
      });
    }

    const normalizedEmail =
      email.trim().toLowerCase();

    // -----------------------------
    // Find user
    // -----------------------------

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "No account found with this email",
      });
    }

    // -----------------------------
    // Check verification
    // -----------------------------

    if (!user.isVerified) {
      return res.status(401).json({
        success: false,
        message:
          "Please verify your email first",
      });
    }

    // -----------------------------
    // Check password
    // -----------------------------

    const isMatch =
      await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password",
      });
    }

    // -----------------------------
    // Generate tokens
    // -----------------------------

    const {
      accessToken,
      refreshToken,
    } = generateTokens(user);

    // -----------------------------
    // Save refresh token
    // -----------------------------

    user.refreshToken = refreshToken;

    await user.save();

    // -----------------------------
    // Response
    // -----------------------------

    return res.status(200).json({
      success: true,
      message: "Login successful",

      accessToken,
      refreshToken,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
    });

  } catch (error) {
    console.error(
      "LOGIN ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================================
// REFRESH TOKEN
// =====================================================

exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    // -----------------------------
    // Check token
    // -----------------------------

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token required",
      });
    }

    // -----------------------------
    // Verify JWT
    // -----------------------------

    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );

    // -----------------------------
    // Find user
    // -----------------------------

    const user = await User.findById(
      decoded.id
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // -----------------------------
    // Compare refresh token
    // -----------------------------

    if (
      user.refreshToken !== refreshToken
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    // -----------------------------
    // Generate new tokens
    // -----------------------------

    const tokens =
      generateTokens(user);

    // -----------------------------
    // Save new refresh token
    // -----------------------------

    user.refreshToken =
      tokens.refreshToken;

    await user.save();

    // -----------------------------
    // Response
    // -----------------------------

    return res.status(200).json({
      success: true,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });

  } catch (error) {
    console.error(
      "REFRESH TOKEN ERROR:",
      error
    );

    return res.status(401).json({
      success: false,
      message:
        "Invalid or expired refresh token",
    });
  }
};


// =====================================================
// LOGOUT
// =====================================================

exports.logoutUser = async (req, res) => {
  try {
    // req.user auth middleware se aayega

    const user = await User.findById(
      req.user.id
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Remove refresh token

    user.refreshToken = null;

    await user.save();

    return res.status(200).json({
      success: true,
      message:
        "Logged out successfully",
    });

  } catch (error) {
    console.error(
      "LOGOUT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================================
// GET CURRENT USER
// =====================================================

exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(
      req.user.id
    ).select(
      "-password -refreshToken -otp -otpExpiry"
    );

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
    console.error(
      "GET CURRENT USER ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};