import crypto from 'crypto';
import { query } from '../db/database.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { signToken } from '../utils/jwt.js';

export const authService = {
  // Register new user (always role = 'student')
  async register({ fullName, email, password }) {
    const normalizedEmail = email.toLowerCase().trim();

    // 1. Check if user already exists
    const existing = await this.getUserByEmail(normalizedEmail);
    if (existing) {
      const err = new Error('Ya existe una cuenta registrada con este correo electrónico.');
      err.statusCode = 400;
      throw err;
    }

    // 2. Hash password with bcrypt
    const passwordHash = await hashPassword(password);
    const id = `user-${crypto.randomUUID()}`;
    const avatarUrl = `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`;
    const role = 'student'; // Always student

    const result = await query(
      `INSERT INTO users (id, full_name, email, password_hash, avatar_url, role)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, full_name, email, avatar_url, role, created_at`,
      [id, fullName, normalizedEmail, passwordHash, avatarUrl, role]
    );

    const user = result.rows[0];
    const token = signToken(user);
    return { user, token };
  },

  // Login user
  async login({ email, password }) {
    const normalizedEmail = email.toLowerCase().trim();
    const user = await this.getUserByEmail(normalizedEmail);

    if (!user) {
      const err = new Error('Credenciales inválidas. Correo o contraseña incorrectos.');
      err.statusCode = 401;
      throw err;
    }

    // Compare with bcrypt
    const isMatch = await comparePassword(password, user.password_hash);
    if (!isMatch) {
      const err = new Error('Credenciales inválidas. Correo o contraseña incorrectos.');
      err.statusCode = 401;
      throw err;
    }

    const token = signToken(user);
    return {
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        avatar_url: user.avatar_url,
        role: user.role,
        phone: user.phone,
        bio: user.bio,
        created_at: user.created_at,
      },
      token,
    };
  },

  // Get user by ID
  async getUserById(id) {
    const result = await query(
      `SELECT id, full_name, email, avatar_url, role, phone, bio, created_at FROM users WHERE id = $1`,
      [id]
    );
    return result.rows[0] || null;
  },

  // Get user by Email (includes password_hash for comparison)
  async getUserByEmail(email) {
    const result = await query(`SELECT * FROM users WHERE LOWER(email) = LOWER($1)`, [email]);
    return result.rows[0] || null;
  },

  // Update Profile
  async updateProfile(userId, { fullName, avatarUrl, phone, bio }) {
    const result = await query(
      `UPDATE users
       SET full_name = COALESCE($1, full_name),
           avatar_url = COALESCE($2, avatar_url),
           phone = COALESCE($3, phone),
           bio = COALESCE($4, bio),
           updated_at = NOW()
       WHERE id = $5
       RETURNING id, full_name, email, avatar_url, role, phone, bio, updated_at`,
      [fullName, avatarUrl, phone, bio, userId]
    );
    return result.rows[0] || null;
  },
};
