import { validateLogin } from '../schemas/loginSchema.js';

/**
 * Express middleware that validates request body with login schema.
 * On failure, responds with 400 and validation error details.
 */
function validateLoginBody(req, res, next) {
  const { error, value } = validateLogin(req.body || {});

  if (error) {
    const details = error.details.map((d) => ({ field: d.path[0], message: d.message }));
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: details,
    });
  }

  req.validated = value;
  next();
}

export { validateLoginBody };
