const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

const {
  getProjectAnalytics,
} = require("../controllers/analyticsController");

router.get(
  "/project/:projectId",
  auth,
  getProjectAnalytics
);

module.exports = router;