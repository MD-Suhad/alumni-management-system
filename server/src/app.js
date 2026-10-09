import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { config } from './config/env.js';
import { errorHandler, notFoundHandler } from './middleware/error.middleware.js';
import { apiRateLimiter } from './middleware/rateLimiter.middleware.js';

// Route imports
import authRoutes from './modules/auth/auth.routes.js';
import alumniRoutes from './modules/alumni/alumni.routes.js';
import adminRoutes from './modules/admin/admin.routes.js';
import eventRoutes from './modules/events/event.routes.js';
import newsRoutes from './modules/news/news.routes.js';
import jobRoutes from './modules/jobs/job.routes.js';
import membershipRoutes from './modules/memberships/membership.routes.js';
import metadataRoutes from './modules/metadata/metadata.routes.js';
import contactRoutes from './modules/contact/contact.routes.js';

const app = express();

// Security Middlewares
app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || config.clientUrl === '*' || config.env === 'development') {
        return callback(null, true);
      }
      const allowedOrigins = Array.isArray(config.clientUrl)
        ? config.clientUrl
        : config.clientUrl.split(',').map((o) => o.trim());
      if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
        return callback(null, true);
      }
      return callback(null, true); // Allow production origin
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
  })
);

// Logging
if (config.env !== 'test') {
  app.use(morgan(config.env === 'development' ? 'dev' : 'combined'));
}

// Request parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Global Rate Limiting
app.use('/api', apiRateLimiter);

// Liveness / Readiness Health Check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Primary API V1 Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/alumni', alumniRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/events', eventRoutes);
app.use('/api/v1/news', newsRoutes);
app.use('/api/v1/jobs', jobRoutes);
app.use('/api/v1/memberships', membershipRoutes);
app.use('/api/v1/metadata', metadataRoutes);
app.use('/api/v1/contact', contactRoutes);

// 404 & Centralized Error Handlers
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
