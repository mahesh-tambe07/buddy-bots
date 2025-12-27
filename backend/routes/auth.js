// const express = require('express');
// const bcrypt = require('bcrypt');
// const db = require('../config/db');
// const { OAuth2Client } = require('google-auth-library');

// const router = express.Router();
// const client = new OAuth2Client("380766267990-n0mvq5qd9383rei6tllonpdrb05ve4t6.apps.googleusercontent.com");

// // ✅ Register Route
// router.post('/register', async (req, res) => {
//   const { name, email, mobile, password } = req.body;

//   if (!name || !email || !mobile || !password) {
//     return res.status(400).json({ error: 'All fields are required' });
//   }

//   try {
//     const [existingUsers] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

//     if (existingUsers.length > 0) {
//       return res.status(409).json({ error: 'User already exists' });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     await db.query(
//       'INSERT INTO users (name, email, mobile, password) VALUES (?, ?, ?, ?)',
//       [name, email, mobile, hashedPassword]
//     );

//     res.status(201).json({ message: 'User registered successfully' });

//   } catch (err) {
//     console.error("❌ Registration error:", err.message);
//     res.status(500).json({ error: 'Server error during registration' });
//   }
// });

// // ✅ Login Route
// router.post('/login', async (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password) return res.status(400).json({ error: 'All fields are required' });

//   try {
//     const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

//     if (users.length === 0) {
//       return res.status(401).json({ error: 'Invalid credentials' });
//     }

//     const user = users[0];
//     const match = await bcrypt.compare(password, user.password);

//     if (!match) return res.status(401).json({ error: 'Invalid credentials' });

//     const { password: _, ...userWithoutPassword } = user;

//     res.status(200).json({ message: 'Login successful', user: userWithoutPassword });
//   } catch (err) {
//     console.error("❌ Login error:", err.message);
//     res.status(500).json({ error: 'Server error during login' });
//   }
// });

// // ✅ Secure Google Login Route
// router.post('/google-login', async (req, res) => {
//   const { token } = req.body;

//   if (!token) return res.status(400).json({ error: 'No token provided' });

//   try {
//     const ticket = await client.verifyIdToken({
//       idToken: token,
//       audience: "380766267990-n0mvq5qd9383rei6tllonpdrb05ve4t6.apps.googleusercontent.com",
//     });

//     const payload = ticket.getPayload();
//     const { name, email, picture } = payload;

//     let [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
//     let user;

//     if (users.length === 0) {
//       const [result] = await db.query(
//         'INSERT INTO users (name, email, mobile, password, picture) VALUES (?, ?, ?, ?, ?)',
//         [name, email, null, '', picture]
//       );
//       user = { id: result.insertId, name, email, mobile: null, picture };
//     } else {
//       user = users[0];
//     }

//     res.status(200).json({ message: 'Google login successful', user });

//   } catch (error) {
//     console.error('❌ Google login error:', error.message);
//     res.status(401).json({ error: 'Invalid Google token' });
//   }
// });

// module.exports = router;


const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../config/db');
const { OAuth2Client } = require('google-auth-library');

require('dotenv').config();

const router = express.Router();

// ✅ Google OAuth client from ENV
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/* =========================
   REGISTER
========================= */
router.post('/register', async (req, res) => {
  const { name, email, mobile, password } = req.body;

  if (!name || !email || !mobile || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const [existingUsers] = await db.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      'INSERT INTO users (name, email, mobile, password) VALUES (?, ?, ?, ?)',
      [name, email, mobile, hashedPassword]
    );

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('❌ Registration error:', err.message);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

/* =========================
   LOGIN
========================= */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const [users] = await db.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = users[0];

    // ❌ Block password login for Google-only accounts
    if (!user.password) {
      return res.status(401).json({
        error: 'Please login using Google',
      });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const { password: _, ...safeUser } = user;
    res.status(200).json({ message: 'Login successful', user: safeUser });
  } catch (err) {
    console.error('❌ Login error:', err.message);
    res.status(500).json({ error: 'Server error during login' });
  }
});

/* =========================
   GOOGLE LOGIN
========================= */
router.post('/google-login', async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: 'No token provided' });
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { name, email, picture } = payload;

    let [users] = await db.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    let user;

    if (users.length === 0) {
      const [result] = await db.query(
        `INSERT INTO users (name, email, mobile, password, picture)
         VALUES (?, ?, ?, ?, ?)`,
        [name, email, null, null, picture]
      );

      user = {
        id: result.insertId,
        name,
        email,
        mobile: null,
        picture,
      };
    } else {
      user = users[0];
    }

    const { password: _, ...safeUser } = user;
    res.status(200).json({
      message: 'Google login successful',
      user: safeUser,
    });
  } catch (error) {
    console.error('❌ Google login error:', error.message);
    res.status(401).json({ error: 'Invalid Google token' });
  }
});

module.exports = router;
