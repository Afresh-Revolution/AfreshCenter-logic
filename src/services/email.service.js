import { Resend } from 'resend';

export const sendEmail = async (subject, body, to = process.env.NOTIFICATION_EMAIL || process.env.EMAIL_USER) => {
    const resend = new Resend(process.env.RESEND_API_KEY);

    try {
        const { data, error } = await resend.emails.send({
            from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
            to: [to],
            subject: subject,
            text: body,
        });

        if (error) {
            throw new Error(`Resend error: ${error.message}`);
        }

        return data;
    } catch (err) {
        console.error('Email sending failed (Resend):', err);
        throw err;
    }
};

export const parseTemplate = (text, data) => {
    let parsed = text;
    Object.keys(data).forEach(key => {
        const regex = new RegExp(`{{${key}}}`, 'g');
        parsed = parsed.replace(regex, data[key] || '');
    });
    return parsed;
};
