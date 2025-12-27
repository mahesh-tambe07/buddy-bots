// // routes/parseResume.js
// const express = require("express");
// const multer = require("multer");
// const fs = require("fs");
// const pdfParse = require("pdf-parse");
// const textract = require("textract");
// const path = require("path");

// const router = express.Router();
// const upload = multer({ dest: "uploads/" });

// router.post("/", upload.single("resume"), async (req, res) => {
//   try {
//     const file = req.file;

//     if (!file) {
//       return res.status(400).json({ error: "No file uploaded" });
//     }

//     const filePath = path.join(__dirname, "..", file.path);
//     const mimeType = file.mimetype;

//     if (mimeType === "application/pdf") {
//       const dataBuffer = fs.readFileSync(filePath);
//       const pdfData = await pdfParse(dataBuffer);
//       fs.unlinkSync(filePath);
//       return res.json({ text: pdfData.text });
//     }

//     // For Word files (.doc, .docx)
//     textract.fromFileWithPath(filePath, (err, text) => {
//       fs.unlinkSync(filePath);
//       if (err) {
//         return res.status(500).json({ error: "Failed to parse Word file" });
//       }
//       return res.json({ text });
//     });
//   } catch (err) {
//     console.error("Resume parse error:", err);
//     return res.status(500).json({ error: "Error parsing resume" });
//   }
// });

// module.exports = router;


// 📁 routes/parseResume.js

const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");
const textract = require("textract");

const router = express.Router();

/* =========================
   Multer Setup (Safe)
========================= */
const uploadDir = path.join(__dirname, "..", "uploads");

// Ensure uploads folder exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const upload = multer({
  dest: uploadDir,
  limits: {
    fileSize: 5 * 1024 * 1024, // ✅ 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF, DOC, and DOCX files are allowed"));
    }
  },
});

/* =========================
   Parse Resume
========================= */
router.post("/", upload.single("resume"), async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const filePath = file.path;
  const mimeType = file.mimetype;

  try {
    if (mimeType === "application/pdf") {
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(dataBuffer);

      fs.unlink(filePath, () => {}); // ✅ non-blocking delete

      return res.status(200).json({ text: pdfData.text });
    }

    // DOC / DOCX
    textract.fromFileWithPath(filePath, (err, text) => {
      fs.unlink(filePath, () => {}); // ✅ safe cleanup

      if (err) {
        console.error("Word parse error:", err);
        return res.status(500).json({
          error: "Failed to parse Word file",
        });
      }

      return res.status(200).json({ text });
    });
  } catch (err) {
    console.error("Resume parse error:", err);
    fs.unlink(filePath, () => {}); // ensure cleanup

    return res.status(500).json({
      error: "Error parsing resume",
    });
  }
});

module.exports = router;
