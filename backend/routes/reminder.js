// const nodemailer = require('nodemailer');
// require('dotenv').config();

// // Setup email transporter
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS
//   }
// });

// router.post('/', async (req, res) => {
//   const { message, remindAt, email, userId } = req.body;
//   try {
//     await db.query(
//       'INSERT INTO reminders (user_id, message, remind_at, email_sent, email) VALUES (?, ?, ?, ?, ?)',
//       [userId, message, remindAt, 0, email]
//     );

//     // Send confirmation email
//     await transporter.sendMail({
//       from: process.env.EMAIL_USER,
//       to: email,
//       subject: '✅ Reminder Created Successfully',
//       text: `Hi,\n\nYour reminder has been saved:\n\n📌 Message: ${message}\n📅 Time: ${remindAt}\n\n~ Vyommitra`
//     });

//     res.json({ message: "Reminder saved successfully!" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to save reminder" });
//   }
// });

const express = require('express');
const router = express.Router();
const db = require('../config/db');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Setup email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

router.post('/', async (req, res) => {
  const { message, remindAt, email, userId } = req.body;
  try {
    await db.query(
      'INSERT INTO reminders (user_id, message, remind_at, email_sent, email) VALUES (?, ?, ?, ?, ?)',
      [userId, message, remindAt, 0, email]
    );

    // Send confirmation email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: '✅ Reminder Created Successfully',
      text: `Hi,\n\nYour reminder has been saved:\n\n📌 Message: ${message}\n📅 Time: ${remindAt}\n\n~ Vyommitra`
    });

    res.json({ message: "Reminder saved successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save reminder" });
  }
});

module.exports = router;
