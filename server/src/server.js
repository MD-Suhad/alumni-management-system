import app from './app.js';
import { config } from './config/env.js';
import { connectDB } from './config/db.js';
import { logger } from './utils/logger.js';

const startServer = async () => {
  // Connect Database
  await connectDB();

  const server = app.listen(config.port, () => {
    logger.info(`Alumni Management System Server running in [${config.env}] mode on port ${config.port}`);
    logger.info(`Health check available at http://localhost:${config.port}/health`);
    logger.info(`API Base route at http://localhost:${config.port}/api/v1`);
  });

  // Graceful shutdown handling
  const handleShutdown = (signal) => {
    logger.warn(`${signal} signal received. Closing HTTP server gracefully...`);
    server.close(() => {
      logger.info('HTTP server closed. Exiting process.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => handleShutdown('SIGTERM'));
  process.on('SIGINT', () => handleShutdown('SIGINT'));
};

startServer();
