import dotenv from 'dotenv';
import { sendEmail } from '../src/services/email.service.js';

dotenv.config();

const testEmail = async () => {
    const recipient = process.argv[2] || process.env.NOTIFICATION_EMAIL;

    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 're_your_api_key_here') {
        console.error('ERROR: RESEND_API_KEY is not set in .env');
        process.exit(1);
    }

    console.log(`Attempting to send a test email to: ${recipient}...`);

    try {
        await sendEmail(
            'AfreshCenter Test Email',
            'This is a test email from the AfreshCenter backend to verify your Resend configuration.',
            recipient
        );
        console.log('SUCCESS: Email sent successfully!');
    } catch (err) {
        console.error('FAILED: Could not send email.', err.message);
    }
};

testEmail();
