// routes/parseResume.js
const express = require("express");
const multer = require("multer");
const fs = require("fs");
const pdfParse = require("pdf-parse");
const textract = require("textract");
const path = require("path");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("resume"), async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = path.join(__dirname, "..", file.path);
    const mimeType = file.mimetype;

    if (mimeType === "application/pdf") {
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(dataBuffer);
      fs.unlinkSync(filePath);
      return res.json({ text: pdfData.text });
    }

    // For Word files (.doc, .docx)
    textract.fromFileWithPath(filePath, (err, text) => {
      fs.unlinkSync(filePath);
      if (err) {
        return res.status(500).json({ error: "Failed to parse Word file" });
      }
      return res.json({ text });
    });
  } catch (err) {
    console.error("Resume parse error:", err);
    return res.status(500).json({ error: "Error parsing resume" });
  }
});

module.exports = router;
