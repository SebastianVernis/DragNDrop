/**
 * Express Server with Better Auth and Real-Time Collaboration
 * 
 * Main entry point for the backend API
 */

import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { auth } from './auth/config.js';
import { testConnection } from './db/client.js';

// Import API routes
import projectsRouter from './api/projects.js';
import componentsRouter from './api/components.js';
import deploymentsRouter from './api/deployments.js';

// Import collaboration modules
import { initializeSocketServer, getServerStats } from './collaboration/socketServer.js';

// Load environment variables
dotenv.config();

// Validate required environment variables
const requiredEnvVars = [
  'DATABASE_URL',
  'BETTER_AUTH_SECRET',
  'BETTER_AUTH_URL',
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`❌ Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
}

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;

// ================================================
// MIDDLEWARE
// ================================================

// Security headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false, // Disable for development
}));

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8080',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Global rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: {
    error: 'Too many requests',
    message: 'Please try again later',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// Request logging (development only)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// ================================================
// BETTER AUTH ROUTES
// ================================================

// Mount Better Auth routes at /api/auth
app.all('/api/auth/*', (req, res) => {
  return auth.handler(req, res);
});

// ================================================
// API ROUTES
// ================================================

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use('/api/projects', projectsRouter);
app.use('/api/components', componentsRouter);
app.use('/api/deployments', deploymentsRouter);

// Collaboration stats endpoint
app.get('/api/collaboration/stats', (req, res) => {
  try {
    const stats = getServerStats(io);
    res.json({
      success: true,
      stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// API documentation
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'DragNDrop Backend API',
    version: '1.0.0',
    endpoints: {
      auth: {
        signUp: 'POST /api/auth/sign-up',
        signIn: 'POST /api/auth/sign-in',
        signOut: 'POST /api/auth/sign-out',
        session: 'GET /api/auth/session',
        google: 'GET /api/auth/google',
        github: 'GET /api/auth/github',
      },
      projects: {
        list: 'GET /api/projects',
        get: 'GET /api/projects/:id',
        create: 'POST /api/projects',
        update: 'PUT /api/projects/:id',
        delete: 'DELETE /api/projects/:id',
        versions: 'GET /api/projects/:id/versions',
      },
      components: {
        list: 'GET /api/components',
        get: 'GET /api/components/:id',
        create: 'POST /api/components',
        update: 'PUT /api/components/:id',
        delete: 'DELETE /api/components/:id',
        categories: 'GET /api/components/meta/categories',
      },
      deployments: {
        list: 'GET /api/deployments',
        get: 'GET /api/deployments/:id',
        create: 'POST /api/deployments',
        update: 'PUT /api/deployments/:id',
        delete: 'DELETE /api/deployments/:id',
        byProject: 'GET /api/deployments/project/:projectId',
      },
    },
    documentation: 'https://github.com/SebastianVernis/DragNDrop',
  });
});

// ================================================
// ERROR HANDLING
// ================================================

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    error: err.name || 'Error',
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// ================================================
// SERVER STARTUP
// ================================================

// Create HTTP server (needed for Socket.io)
const httpServer = createServer(app);

// Initialize Socket.io server
let io;

async function startServer() {
  try {
    // Test database connection
    console.log('🔌 Testing database connection...');
    const dbConnected = await testConnection();

    if (!dbConnected) {
      console.error('❌ Failed to connect to database');
      process.exit(1);
    }

    // Initialize Socket.io
    console.log('🔌 Initializing Socket.io server...');
    io = initializeSocketServer(httpServer, {
      corsOrigin: process.env.FRONTEND_URL || 'http://localhost:8080'
    });

    // Start server
    httpServer.listen(PORT, () => {
      console.log('');
      console.log('🚀 ========================================');
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log('🚀 ========================================');
      console.log('');
      console.log('📚 API Documentation: http://localhost:' + PORT + '/api');
      console.log('🔐 Auth Endpoints: http://localhost:' + PORT + '/api/auth');
      console.log('💾 Projects API: http://localhost:' + PORT + '/api/projects');
      console.log('🧩 Components API: http://localhost:' + PORT + '/api/components');
      console.log('🚀 Deployments API: http://localhost:' + PORT + '/api/deployments');
      console.log('🔗 Collaboration: WebSocket enabled');
      console.log('📊 Collaboration Stats: http://localhost:' + PORT + '/api/collaboration/stats');
      console.log('');
      console.log('🌍 Environment:', process.env.NODE_ENV || 'development');
      console.log('🔗 Frontend URL:', process.env.FRONTEND_URL || 'http://localhost:8080');
      console.log('');

      // Log OAuth providers status
      if (process.env.GOOGLE_CLIENT_ID) {
        console.log('✅ Google OAuth: Enabled');
      } else {
        console.log('⚠️  Google OAuth: Disabled (missing credentials)');
      }

      if (process.env.GITHUB_CLIENT_ID) {
        console.log('✅ GitHub OAuth: Enabled');
      } else {
        console.log('⚠️  GitHub OAuth: Disabled (missing credentials)');
      }

      console.log('');
      console.log('✨ Ready to accept requests!');
      console.log('✨ Real-time collaboration enabled!');
      console.log('');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('👋 SIGINT received, shutting down gracefully...');
  process.exit(0);
});

// Start the server
startServer();

export default app;
