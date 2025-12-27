// // 📁 backend/reminderScheduler.js

// const cron = require('node-cron');
// const nodemailer = require('nodemailer');
// const db = require('./config/db');
// require('dotenv').config();

// // 🔐 Setup Nodemailer
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL_USER,   // e.g., your_email@gmail.com
//     pass: process.env.EMAIL_PASS    // App password
//   }
// });

// // ⏰ Cron job runs every minute
// cron.schedule('* * * * *', async () => {
//   const now = new Date();
//   const reminderTime = new Date(now.getTime() + 30 * 60000); // 30 minutes later

//   const formattedTime = reminderTime.toISOString().slice(0, 19).replace('T', ' ');

//   try {
//     const [reminders] = await db.query(
//       'SELECT * FROM reminders WHERE remind_at = ? AND email_sent = 0',
//       [formattedTime]
//     );

//     for (const reminder of reminders) {
//       const mailOptions = {
//         from: process.env.EMAIL_USER,
//         to: reminder.email,
//         subject: '⏰ Reminder: ' + reminder.message,
//         text: `This is a reminder you scheduled for ${reminder.remind_at}:\n\n"${reminder.message}"\n\n~ Vyommitra`
//       };

//       await transporter.sendMail(mailOptions);

//       // ✅ Mark as sent
//       await db.query(
//         'UPDATE reminders SET email_sent = 1 WHERE id = ?',
//         [reminder.id]
//       );

//       console.log(`📨 Email sent to ${reminder.email} for reminder: ${reminder.message}`);
//     }
//   } catch (err) {
//     console.error('❌ Error sending reminder emails:', err);
//   }
// });


// 📁 backend/reminderScheduler.js

const cron = require('node-cron');
const nodemailer = require('nodemailer');
const db = require('./config/db');
require('dotenv').config();

/* =========================
   Nodemailer Setup
========================= */
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

/* =========================
   Cron Job (Every Minute)
========================= */
cron.schedule('* * * * *', async () => {
  try {
    /**
     * Fetch reminders:
     * - Due within last 1 minute
     * - Not sent yet
     */
    const [reminders] = await db.query(`
      SELECT *
      FROM reminders
      WHERE email_sent = 0
        AND remind_at <= NOW()
        AND remind_at >= DATE_SUB(NOW(), INTERVAL 1 MINUTE)
      LIMIT 10
    `);

    for (const reminder of reminders) {
      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: reminder.email,
          subject: `⏰ Reminder`,
          text: `Hi,\n\nThis is your reminder:\n\n📌 ${reminder.message}\n📅 Scheduled at: ${reminder.remind_at}\n\n~ Vyommitra`
        });

        // ✅ Mark as sent
        await db.query(
          'UPDATE reminders SET email_sent = 1 WHERE id = ?',
          [reminder.id]
        );

        console.log(`📨 Reminder sent to ${reminder.email}`);
      } catch (mailError) {
        console.error(`❌ Failed to send reminder ID ${reminder.id}`, mailError);
      }
    }
  } catch (err) {
    console.error('❌ Scheduler error:', err);
  }
});
