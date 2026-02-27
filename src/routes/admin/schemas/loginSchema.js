/**
 * Login form validation schema.
 * Used to validate email and password before DB auth.
 */

import Joi from 'joi';
 
const loginSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.email': 'Please enter a valid email address.',
      'any.required': 'Email is required.',
    }),
  password: Joi.string()
    .min(8)
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters.',
      'any.required': 'Password is required.',
    }),
  rememberMe: Joi.boolean().optional().default(false),
});

/**
 * Validates request body against login schema.
 * @param {object} data - { email, password, rememberMe? }
 * @returns {{ error: Joi.ValidationError | null, value: object }}
 */
function validateLogin(data) {
  return loginSchema.validate(data, { stripUnknown: true, abortEarly: false });
}

export { loginSchema, validateLogin };
