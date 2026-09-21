const multer = require("multer");
const path = require("path");
const fs = require("fs");

// =====================================================
// UPLOAD DIRECTORY
// =====================================================

const uploadDir = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// =====================================================
// SAFE FILE NAME
// =====================================================

const sanitizeFileName = (fileName) => {
  return fileName
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .replace(/_+/g, "_");
};

// =====================================================
// STORAGE
// =====================================================

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },

  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);

    const safeName = sanitizeFileName(baseName);

    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}-${safeName}${ext}`;

    cb(null, uniqueName);
  },
});

// =====================================================
// FILE FILTER
// =====================================================
// IMPORTANT:
// Project files can be code, documents, images, PDFs etc.
// So DON'T unnecessarily block extensions.
// =====================================================

const fileFilter = (req, file, cb) => {
  if (!file) {
    return cb(new Error("No file received"));
  }

  cb(null, true);
};

// =====================================================
// MULTER
// =====================================================

const upload = multer({
  storage,

  fileFilter,

  limits: {
    fileSize: 100 * 1024 * 1024, // 100 MB
  },
});

module.exports = upload;