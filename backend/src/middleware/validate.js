/**
 * Request Validation Middleware using Zod schemas
 */
export function validate(schema) {
  return (req, res, next) => {
    try {
      const validated = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      // Replace with sanitized/validated data if desired
      if (validated.body) req.body = validated.body;
      if (validated.query) req.query = validated.query;
      if (validated.params) req.params = validated.params;

      next();
    } catch (err) {
      if (err.errors) {
        const errorMessages = err.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
        return res.status(400).json({
          success: false,
          message: errorMessages,
          errors: err.errors,
        });
      }
      return res.status(400).json({
        success: false,
        message: err.message || 'Datos de entrada inválidos.',
      });
    }
  };
}
