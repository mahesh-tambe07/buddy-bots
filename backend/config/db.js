// 📁 vyommitra-app/backend/config/db.js

const mysql = require('mysql2/promise');  // ✅ Use promise-based mysql2

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'vyommitra',
});

// ✅ Optional test connection block
(async () => {
  try {
    const conn = await db.getConnection();
    console.log('✅ MySQL connected');
    conn.release(); // Always release the connection after use
  } catch (err) {
    console.error('❌ MySQL connection error:', err.message);
  }
})();

module.exports = db;
