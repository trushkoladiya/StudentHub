const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Load env vars first
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// ─── Core Middleware ───────────────────────────────────────
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── API Routes ────────────────────────────────────────────
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/notes', require('./routes/notesRoutes'));
app.use('/api/questions', require('./routes/questionsRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/study', require('./routes/studyRoutes'));
app.use('/api/flashcards', require('./routes/flashcardRoutes'));

// ─── Health Check ──────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    message: '🚀 StudentHub API is running',
    version: '1.0.0',
    endpoints: [
      '/api/auth',
      '/api/notes',
      '/api/questions',
      '/api/admin',
      '/api/tasks',
      '/api/study',
      '/api/flashcards',
    ],
  });
});

// ─── Error Handling (must be last) ────────────────────────
app.use(notFound);
app.use(errorHandler);

// ─── Start Server ──────────────────────────────────────────
// Refactored logging to show startup timestamp and environment setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n✅ Server running → http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
});
// daily refactor check: 2026-03-19

// daily refactor check: 2026-03-20
