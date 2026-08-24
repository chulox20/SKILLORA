import { verifyToken } from '../utils/jwt.js';
import { authService } from '../services/authService.js';

/**
 * Authentication Middleware: Extracts Bearer token, verifies JWT, attaches req.user
 */
export async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Acceso no autorizado. Token no proporcionado.',
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded || !decoded.sub) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido o expirado.',
      });
    }

    const user = await authService.getUserById(decoded.sub);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario asociado al token no encontrado.',
      });
    }

    req.user = {
      id: user.id,
      email: user.email,
      fullName: user.full_name,
      role: user.role,
      avatarUrl: user.avatar_url,
    };

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Fallo en la autenticación.',
    });
  }
}

/**
 * Optional Auth Middleware: If token is present, attaches user; otherwise continues as guest
 */
export async function optionalAuthMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = verifyToken(token);
      if (decoded?.sub) {
        const user = await authService.getUserById(decoded.sub);
        if (user) {
          req.user = {
            id: user.id,
            email: user.email,
            fullName: user.full_name,
            role: user.role,
            avatarUrl: user.avatar_url,
          };
        }
      }
    }
  } catch (err) {
    // Ignore error for optional auth
  }
  next();
}
