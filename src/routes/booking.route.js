import { Router } from 'express';
import * as bookingController from '../controllers/booking.controller.js';
import * as bookingMiddleware from '../middleware/booking.middleware.js';

const router = Router();

// GET /api/bookings - List all bookings (for admin)
router.get('/', bookingController.getBookings);

// POST /api/bookings - Submit a new booking session
router.post('/', bookingMiddleware.validateBooking, bookingController.submitBooking);

// GET /api/bookings/template - Get current booking template
router.get('/template', bookingController.getBookingTemplate);

// PATCH /api/bookings/template - Update booking template
router.patch('/template', bookingMiddleware.validateBookingTemplateUpdate, bookingController.updateBookingTemplate);

export default router;
