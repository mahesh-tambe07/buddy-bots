// 📁 vyommitra-app/backend/config/db.js

const mysql = require('mysql2/promise');
require('dotenv').config(); // ✅ Load env variables

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// ✅ Optional test connection
(async () => {
  try {
    const conn = await db.getConnection();
    console.log('✅ MySQL connected');
    conn.release();
  } catch (err) {
    console.error('❌ MySQL connection error:', err.message);
  }
})();

module.exports = db;
