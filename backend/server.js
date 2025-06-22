// // 📁 backend/server.js

// const express = require('express');
// const cors = require('cors');
// require('dotenv').config();

// const chatRoute = require('./routes/chat'); 
// const authRoutes = require('./routes/auth'); 
// const taskRoutes = require('./routes/tasks');
// const automationRoute = require('./routes/automation');
// const parseResumeRoute = require("./routes/parseResume");
// const reminderRoutes = require('./routes/reminder');
// require('./reminderScheduler'); // ⬅️ Make sure this is included

// const app = express();
// const PORT = process.env.PORT || 5000;

// // ✅ Global Middleware
// app.use(express.json()); // Parse JSON request bodies first

// // ✅ CORS config
// const corsOptions = {
//   origin: 'http://localhost:3000',
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   credentials: true,
//   optionsSuccessStatus: 200
// };
// app.use(cors(corsOptions));

// // ✅ Routes
// app.use('/api/chat', chatRoute);
// app.use('/api/auth', authRoutes);
// app.use('/api/tasks', taskRoutes);
// app.use('/api/automation', automationRoute);
// app.use("/api/parse-resume", parseResumeRoute);
// app.use('/api/reminder', reminderRoutes);

// // ✅ Global fallback for unknown routes (optional)
// app.use((req, res) => {
//   res.status(404).json({ error: 'Route not found' });
// });

// // ✅ Start server
// app.listen(PORT, () => {
//   console.log(`✅ Server running at http://localhost:${PORT}`);
// });


// <!----------------------------------------------------------------------------------------------------------------!>




// 📁 backend/server.js

const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Load environment variables

// 🔁 Routes
const chatRoute = require('./routes/chat'); 
const authRoutes = require('./routes/auth'); 
const taskRoutes = require('./routes/tasks');
const automationRoute = require('./routes/automation');
const parseResumeRoute = require('./routes/parseResume');
const reminderRoutes = require('./routes/reminder');

// ⏰ Start reminder email scheduler (runs in background)
require('./reminderScheduler');

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Global Middleware
app.use(express.json()); // for parsing application/json

// ✅ CORS configuration
const corsOptions = {
  origin: 'http://localhost:3000', // Adjust as per frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// ✅ Mount routes
app.use('/api/chat', chatRoute);
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/automation', automationRoute);
app.use('/api/parse-resume', parseResumeRoute);
app.use('/api/reminder', reminderRoutes);

// ✅ Catch-all for undefined routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
