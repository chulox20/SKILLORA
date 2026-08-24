import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';

/**
 * Signs a JWT token containing user ID (sub) and role
 */
export function signToken(user) {
  const payload = {
    sub: user.id,
    role: user.role || 'student',
    email: user.email,
  };

  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });
}

/**
 * Verifies a JWT token
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, config.jwtSecret);
  } catch (err) {
    return null;
  }
}
