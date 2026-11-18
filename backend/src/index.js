const express = require('express');
const cors = require('cors');
const { PORT, NODE_ENV } = require('./config/env');
const { initDb } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const animalRoutes = require('./routes/animalRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const followUpRoutes = require('./routes/followUpRoutes');
const petUpdateRoutes = require('./routes/petUpdateRoutes');
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
        googleLogin: 'GET /api/v1/auth/google',
        googleCallback: 'GET /api/v1/auth/google/callback',
      },
      animals: {
        list: 'GET /api/v1/animals',
        detail: 'GET /api/v1/animals/:id',
        create: 'POST /api/v1/animals',
        claim: 'PATCH /api/v1/animals/:id/claim',
      },
      adoptionApplications: {
        submit: 'POST /api/v1/adoption-applications',
        myApplications: 'GET /api/v1/adoption-applications/me',
        updateStatus: 'PATCH /api/v1/adoption-applications/:id/status',
      },
      followUps: {
        create: 'POST /api/v1/follow-ups',
        list: 'GET /api/v1/follow-ups',
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
app.use('/api/v1/pet-updates', petUpdateRoutes);

// 404 & Centralized Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start Server only when run directly
if (require.main === module) {
  async function startServer() {
    await initDb();

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`========================================`);
      console.log(`Adopt-me Backend API running on port ${PORT}`);
      console.log(`Environment: ${NODE_ENV}`);
      console.log(`Routes:`);
      console.log(`  POST  /api/v1/auth/register`);
      console.log(`  POST  /api/v1/auth/login`);
      console.log(`  GET   /api/v1/auth/google`);
      console.log(`  GET   /api/v1/auth/google/callback`);
      console.log(`  POST  /api/v1/animals`);
      console.log(`  GET   /api/v1/animals`);
      console.log(`  GET   /api/v1/animals/:id`);
      console.log(`  PATCH /api/v1/animals/:id/claim`);
      console.log(`  POST  /api/v1/adoption-applications`);
      console.log(`  GET   /api/v1/adoption-applications/me`);
      console.log(`  PATCH /api/v1/adoption-applications/:id/status`);
      console.log(`  POST  /api/v1/follow-ups`);
      console.log(`  GET   /api/v1/follow-ups`);
      console.log(`========================================`);
    });
  }

  startServer();
}

module.exports = app;
