import dotenv from 'dotenv';
import dns from 'dns';

// Fix Windows DNS SRV lookup issues for MongoDB Atlas (querySrv ECONNREFUSED)
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (err) {
  // Ignore DNS set errors if restricted
}

dotenv.config();

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/alumni_management_db',
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || 'default_jwt_access_secret_for_dev_mode_only_32_chars',
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'default_jwt_refresh_secret_for_dev_mode_only_32_chars',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    verificationSecret: process.env.JWT_VERIFICATION_SECRET || 'default_verification_secret_dev',
    resetSecret: process.env.JWT_RESET_SECRET || 'default_reset_secret_dev'
  },
  email: {
    host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
    port: parseInt(process.env.SMTP_PORT || '2525', 10),
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from: process.env.EMAIL_FROM || 'University Alumni Association <no-reply@alumni.university.edu>'
  }
};
