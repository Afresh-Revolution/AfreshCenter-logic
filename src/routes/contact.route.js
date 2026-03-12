import { Router } from 'express';
import * as contactController from '../controllers/contact.controller.js';
import * as contactMiddleware from '../middleware/contact.middleware.js';

const router = Router();

// GET /api/contact - List all messages (for admin)
router.get('/', contactController.getMessages);

// POST /api/contact - Submit form
router.post('/', contactMiddleware.validateContactSubmission, contactController.submitContactForm);

// GET /api/contact/template - Get current template
router.get('/template', contactController.getTemplate);

// PATCH /api/contact/template - Update template
router.patch('/template', contactMiddleware.validateTemplateUpdate, contactController.updateTemplate);

// POST /api/contact/:id/trigger-email - Manually trigger email for a message
router.post('/:id/trigger-email', contactController.triggerManualContactEmail);

export default router;
