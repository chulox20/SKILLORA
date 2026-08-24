import { authService } from '../services/authService.js';

export const authController = {
  // POST /api/auth/register
  async register(req, res, next) {
    try {
      const { fullName, email, password } = req.body;
      const result = await authService.register({ fullName, email, password });
      res.status(201).json({
        success: true,
        message: 'Usuario registrado exitosamente.',
        data: result,
      });
    } catch (err) {
      next(err);
    }
  },

  // POST /api/auth/login
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await authService.login({ email, password });
      res.json({
        success: true,
        message: 'Inicio de sesión exitoso.',
        data: result,
      });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/auth/me
  async getMe(req, res, next) {
    try {
      const user = await authService.getUserById(req.user.id);
      res.json({
        success: true,
        data: user,
      });
    } catch (err) {
      next(err);
    }
  },

  // PUT /api/auth/profile
  async updateProfile(req, res, next) {
    try {
      const updated = await authService.updateProfile(req.user.id, req.body);
      res.json({
        success: true,
        message: 'Perfil actualizado exitosamente.',
        data: updated,
      });
    } catch (err) {
      next(err);
    }
  },

  // POST /api/auth/forgot-password
  async forgotPassword(req, res, next) {
    try {
      res.json({
        success: true,
        message: 'Se ha enviado un enlace de recuperación a tu correo.',
      });
    } catch (err) {
      next(err);
    }
  },
};
