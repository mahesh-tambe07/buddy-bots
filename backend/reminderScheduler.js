// 📁 backend/reminderScheduler.js

const cron = require('node-cron');
const nodemailer = require('nodemailer');
const db = require('./config/db');
require('dotenv').config();

// 🔐 Setup Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,   // e.g., your_email@gmail.com
    pass: process.env.EMAIL_PASS    // App password
  }
});

// ⏰ Cron job runs every minute
cron.schedule('* * * * *', async () => {
  const now = new Date();
  const reminderTime = new Date(now.getTime() + 30 * 60000); // 30 minutes later

  const formattedTime = reminderTime.toISOString().slice(0, 19).replace('T', ' ');

  try {
    const [reminders] = await db.query(
      'SELECT * FROM reminders WHERE remind_at = ? AND email_sent = 0',
      [formattedTime]
    );

    for (const reminder of reminders) {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: reminder.email,
        subject: '⏰ Reminder: ' + reminder.message,
        text: `This is a reminder you scheduled for ${reminder.remind_at}:\n\n"${reminder.message}"\n\n~ Vyommitra`
      };

      await transporter.sendMail(mailOptions);

      // ✅ Mark as sent
      await db.query(
        'UPDATE reminders SET email_sent = 1 WHERE id = ?',
        [reminder.id]
      );

      console.log(`📨 Email sent to ${reminder.email} for reminder: ${reminder.message}`);
    }
  } catch (err) {
    console.error('❌ Error sending reminder emails:', err);
  }
});
