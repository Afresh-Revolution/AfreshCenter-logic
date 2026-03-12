import * as bookingModel from '../models/booking.model.js';
import * as contactModel from '../models/contact.model.js'; // Reuse template fetching
import * as emailService from '../services/email.service.js';

// Initialize DB on controller load
bookingModel.initBookingDb().catch(err => console.error('Failed to init booking DB:', err));

export const submitBooking = async (req, res) => {
    try {
        const data = req.validated;

        // Save to DB
        const booking = await bookingModel.createBooking(data);

        // Send Email via Resend
        try {
            const template = await contactModel.getTemplateById('booking_notification');
            if (template) {
                const subject = emailService.parseTemplate(template.subject, data);
                const body = emailService.parseTemplate(template.body, data);
                await emailService.sendEmail(subject, body);
            }
        } catch (emailErr) {
            console.error('Booking email notification failed:', emailErr);
        }

        res.status(201).json({ success: true, message: 'Booking submitted successfully', booking });
    } catch (err) {
        console.error('Booking controller error:', err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

export const getBookingTemplate = async (req, res) => {
    try {
        const template = await contactModel.getTemplateById('booking_notification');
        if (!template) return res.status(404).json({ success: false, message: 'Template not found' });
        res.json(template);
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error retrieving template' });
    }
};

export const updateBookingTemplate = async (req, res) => {
    try {
        const updated = await contactModel.updateTemplateById('booking_notification', req.validated);
        res.json({ success: true, message: 'Booking template updated successfully', template: updated });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error updating template' });
    }
};

export const getBookings = async (req, res) => {
    try {
        const bookings = await bookingModel.getAllBookings();
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error fetching bookings' });
    }
};

export const triggerManualBookingEmail = async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await bookingModel.getBookingById(id);

        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        // Send Email via Resend
        try {
            const template = await contactModel.getTemplateById('booking_notification');
            if (template) {
                const subject = emailService.parseTemplate(template.subject, booking);
                const body = emailService.parseTemplate(template.body, booking);
                await emailService.sendEmail(subject, body);
            }
        } catch (emailErr) {
            console.error('Manual booking email notification failed:', emailErr);
            return res.status(500).json({ success: false, message: 'Failed to send email' });
        }

        res.json({ success: true, message: 'Booking email triggered manually' });
    } catch (err) {
        console.error('Trigger manual booking error:', err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
