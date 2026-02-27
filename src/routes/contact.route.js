import { Router } from 'express';
import * as contactController from '../controllers/contact.controller.js';
import * as contactMiddleware from '../middleware/contact.middleware.js';

const router = Router();

// POST /api/contact - Submit form
router.post('/', contactMiddleware.validateContactSubmission, contactController.submitContactForm);

// GET /api/contact/template - Get current template
router.get('/template', contactController.getTemplate);

// PATCH /api/contact/template - Update template
router.patch('/template', contactMiddleware.validateTemplateUpdate, contactController.updateTemplate);

export default router;
