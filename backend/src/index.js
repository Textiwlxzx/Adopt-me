const express = require('express');
const cors = require('cors');
const { PORT, NODE_ENV } = require('./config/env');
const { initDb } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const animalRoutes = require('./routes/animalRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const followUpRoutes = require('./routes/followUpRoutes');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const app = express();

// Global Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${req.method}] ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Root endpoint (Welcome & API Overview)
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Adopt-Me Backend API',
    version: 'v1',
    endpoints: {
      health: 'GET /health',
      auth: {
        register: 'POST /api/v1/auth/register',
        login: 'POST /api/v1/auth/login',
      },
      animals: {
        list: 'GET /api/v1/animals',
        detail: 'GET /api/v1/animals/:id',
        create: 'POST /api/v1/animals',
      },
    },
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/animals', animalRoutes);
app.use('/api/v1/adoption-applications', applicationRoutes);
app.use('/api/v1/follow-ups', followUpRoutes);

// 404 & Centralized Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start Server
async function startServer() {
  await initDb();

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`========================================`);
    console.log(`Adopt-me Backend API running on port ${PORT}`);
    console.log(`Environment: ${NODE_ENV}`);
    console.log(`Routes:`);
    console.log(`  POST /api/v1/auth/register`);
    console.log(`  POST /api/v1/auth/login`);
    console.log(`  POST /api/v1/animals`);
    console.log(`  GET  /api/v1/animals`);
    console.log(`  GET  /api/v1/animals/:id`);
    console.log(`========================================`);
  });
}

startServer();

module.exports = app;
