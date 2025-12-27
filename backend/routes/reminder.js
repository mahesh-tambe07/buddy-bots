// // const nodemailer = require('nodemailer');
// // require('dotenv').config();

// // // Setup email transporter
// // const transporter = nodemailer.createTransport({
// //   service: 'gmail',
// //   auth: {
// //     user: process.env.EMAIL_USER,
// //     pass: process.env.EMAIL_PASS
// //   }
// // });

// // router.post('/', async (req, res) => {
// //   const { message, remindAt, email, userId } = req.body;
// //   try {
// //     await db.query(
// //       'INSERT INTO reminders (user_id, message, remind_at, email_sent, email) VALUES (?, ?, ?, ?, ?)',
// //       [userId, message, remindAt, 0, email]
// //     );

// //     // Send confirmation email
// //     await transporter.sendMail({
// //       from: process.env.EMAIL_USER,
// //       to: email,
// //       subject: '✅ Reminder Created Successfully',
// //       text: `Hi,\n\nYour reminder has been saved:\n\n📌 Message: ${message}\n📅 Time: ${remindAt}\n\n~ Vyommitra`
// //     });

// //     res.json({ message: "Reminder saved successfully!" });
// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).json({ error: "Failed to save reminder" });
// //   }
// // });

// const express = require('express');
// const router = express.Router();
// const db = require('../config/db');
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

// module.exports = router;


// 📁 routes/reminder.js

const express = require('express');
const router = express.Router();
const db = require('../config/db');
const nodemailer = require('nodemailer');
require('dotenv').config();

/* =========================
   Email Transporter
========================= */
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Optional: verify transporter on startup
transporter.verify((err) => {
  if (err) {
    console.error('❌ Email transporter error:', err.message);
  } else {
    console.log('✅ Email transporter ready');
  }
});

/* =========================
   Create Reminder
========================= */
router.post('/', async (req, res) => {
  const { message, remindAt, email, userId } = req.body;

  // ✅ Basic validation
  if (!message || !remindAt || !email || !userId) {
    return res.status(400).json({
      error: 'All fields are required',
    });
  }

  const remindDate = new Date(remindAt);
  if (isNaN(remindDate.getTime()) || remindDate <= new Date()) {
    return res.status(400).json({
      error: 'Reminder time must be a future date',
    });
  }

  try {
    // Save reminder
    await db.query(
      `INSERT INTO reminders
       (user_id, message, remind_at, email_sent, email)
       VALUES (?, ?, ?, ?, ?)`,
      [userId, message, remindAt, 0, email]
    );

    // Send confirmation email
    await transporter.sendMail({
      from: `"VyomMitra" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '✅ Reminder Created Successfully',
      text: `Hi,

Your reminder has been saved successfully.

📌 Message: ${message}
📅 Time: ${remindAt}

— VyomMitra`,
    });

    res.status(201).json({
      message: 'Reminder saved successfully!',
    });
  } catch (err) {
    console.error('❌ Reminder error:', err.message);
    res.status(500).json({
      error: 'Failed to save reminder',
    });
  }
});

module.exports = router;
