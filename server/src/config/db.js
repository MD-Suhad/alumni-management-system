import mongoose from 'mongoose';
import { config } from './env.js';
import { logger } from '../utils/logger.js';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongodbUri, {
      autoIndex: true,
    });
    logger.info(`MongoDB Connected successfully: ${conn.connection.host}`);

    mongoose.connection.on('error', (err) => {
      logger.error(`MongoDB runtime connection error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected. Reconnecting...');
    });
  } catch (error) {
    logger.error(`Database initial connection error: ${error.message}`);
    // In production we exit on failure; in dev we log
    if (config.env === 'production') {
      process.exit(1);
    }
  }
};
