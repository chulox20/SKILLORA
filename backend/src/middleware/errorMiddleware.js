import { config } from '../config/config.js';

/**
 * Central Error Handler Middleware (Section 36)
 */
export function errorMiddleware(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Error interno del servidor.';

  console.error(`❌ [Error] ${req.method} ${req.originalUrl}:`, err);

  res.status(statusCode).json({
    success: false,
    message,
    ...(config.nodeEnv === 'development' && { stack: err.stack }),
  });
}

/**
 * 404 Route Not Found Handler
 */
export function notFoundMiddleware(req, res) {
  res.status(404).json({
    success: false,
    message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
  });
}
