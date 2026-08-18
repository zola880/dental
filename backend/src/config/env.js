const dotenv = require('dotenv');

dotenv.config();

const envVars = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  JWT_COOKIE_EXPIRES_IN: parseInt(process.env.JWT_COOKIE_EXPIRES_IN, 10) || 7,
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
};

// Validate required environment variables
const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET'];
for (const envVar of requiredEnvVars) {
  if (!envVars[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

module.exports = envVars;