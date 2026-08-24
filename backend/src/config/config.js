import dotenv from 'dotenv';
dotenv.config();

// Strict Environment Validation (No hardcoded fallback secrets)
if (!process.env.JWT_SECRET) {
  throw new Error('[Config Error] JWT_SECRET is required. Please define it in your backend/.env file.');
}

if (!process.env.DATABASE_URL) {
  throw new Error('[Config Error] DATABASE_URL is required. Please define it in your backend/.env file.');
}

export const config = {
  port: parseInt(process.env.PORT || '4000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  frontendUrls: (process.env.FRONTEND_URL || 'http://localhost:3000,http://localhost:5173')
    .split(',')
    .map((url) => url.trim()),
};
