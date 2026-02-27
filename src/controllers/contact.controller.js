import * as contactModel from '../models/contact.model.js';
import * as emailService from '../services/email.service.js';

// Initialize DB on controller load
contactModel.initContactDb().catch(err => console.error('Failed to init contact DB:', err));

export const submitContactForm = async (req, res) => {
    try {
        const data = req.validated;

        // Save to DB
        await contactModel.createMessage(data);

        // Send Email
        try {
            const template = await contactModel.getTemplateById('contact_notification');
            if (template) {
                const subject = emailService.parseTemplate(template.subject, data);
                const body = emailService.parseTemplate(template.body, data);
                await emailService.sendEmail(subject, body);
            }
        } catch (emailErr) {
            console.error('Email notification failed:', emailErr);
        }

        res.status(201).json({ success: true, message: 'Message sent successfully' });
    } catch (err) {
        console.error('Controller error:', err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

export const getTemplate = async (req, res) => {
    try {
        const template = await contactModel.getTemplateById('contact_notification');
        if (!template) return res.status(404).json({ success: false, message: 'Template not found' });
        res.json(template);
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error retrieving template' });
    }
};

export const updateTemplate = async (req, res) => {
    try {
        const updated = await contactModel.updateTemplateById('contact_notification', req.validated);
        res.json({ success: true, message: 'Template updated successfully', template: updated });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error updating template' });
    }
};
