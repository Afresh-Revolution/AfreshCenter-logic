/**
 * Admin module: routes for admin (login, etc.).
 * Mount at /admin or /api/admin in the main app.
 */

import adminLoginRouter from './login.js';

function mountAdminRoutes(app, options = {}) {
  const prefix = options.prefix ?? '/admin';
  app.use(prefix, adminLoginRouter);
  return app;
}

export { mountAdminRoutes, adminLoginRouter };
