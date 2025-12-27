// // routes/chat.js
// const express = require('express');
// const axios = require('axios');
// const router = express.Router();
// const db = require('../config/db');

// // POST /api/chat
// router.post('/', async (req, res) => {
//   const { messages } = req.body;

//   if (!messages || messages.length === 0) {
//     console.warn('⚠️ No messages received in request body.');
//     return res.status(400).json({ error: 'No messages received' });
//   }

//   try {
//     const openRouterMessages = [
//       { role: "system", content: "You are a helpful assistant." },
//       ...messages.map(msg => ({
//         role: msg.from === 'user' ? 'user' : 'assistant',
//         content: msg.text
//       }))
//     ];

//     const response = await axios.post(
//       'https://openrouter.ai/api/v1/chat/completions',
//       {
//         model: 'openai/gpt-3.5-turbo',
//         messages: openRouterMessages
//       },
//       {
//         headers: {
//           'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
//           'Content-Type': 'application/json'
//         }
//       }
//     );

//     const reply = response?.data?.choices?.[0]?.message?.content || '⚠️ No reply';

//     // Save to DB
//     await db.query(
//       'INSERT INTO chat_history (user_message, bot_reply) VALUES (?, ?)',
//       [messages[messages.length - 1].text, reply]
//     );

//     console.log("✅ REPLY SENT TO FRONTEND:", reply);
//     return res.status(200).json({ reply });

//   } catch (err) {
//   console.error('❌ BACKEND ERROR:', err?.response?.data || err.message, err);
//   return res.status(200).json({ reply: `⚠️ Assistant could not respond: ${err?.response?.data?.error || err.message}` });
// }

// });

// module.exports = router;


// 📁 routes/chat.js

const express = require('express');
const axios = require('axios');
const router = express.Router();
const db = require('../config/db');
require('dotenv').config();

router.post('/', async (req, res) => {
  const { messages } = req.body;

  if (!messages || messages.length === 0) {
    return res.status(400).json({ error: 'No messages received' });
  }

  try {
    // Convert frontend messages to OpenRouter format
    const openRouterMessages = [
      { role: 'system', content: 'You are a helpful assistant.' },
      ...messages.map(msg => ({
        role: msg.from === 'user' ? 'user' : 'assistant',
        content: msg.text,
      })),
    ];

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openai/gpt-4o-mini', // ✅ Supported & cheap
        messages: openRouterMessages,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.CLIENT_URL, // ✅ ENV
          'X-Title': 'VyomMitra Chat',              // ✅ Recommended
        },
      }
    );

    const reply =
      response?.data?.choices?.[0]?.message?.content ||
      '⚠️ No reply from assistant';

    // ✅ Save last user message + reply
    await db.query(
      'INSERT INTO chat_history (user_message, bot_reply) VALUES (?, ?)',
      [messages[messages.length - 1].text, reply]
    );

    return res.status(200).json({ reply });
  } catch (err) {
    console.error(
      '❌ Chat error:',
      err.response?.data || err.message
    );

    return res.status(500).json({
      error: 'Assistant could not respond',
    });
  }
});

module.exports = router;
