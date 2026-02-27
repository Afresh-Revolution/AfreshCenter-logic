import { pool } from '../config/db.js';

export const initBookingDb = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS bookings (
                id SERIAL PRIMARY KEY,
                full_name TEXT NOT NULL,
                email TEXT NOT NULL,
                phone_number TEXT NOT NULL,
                company TEXT,
                project_details TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Add default booking template if not exists
        await pool.query(`
            INSERT INTO email_templates (id, subject, body)
            VALUES ('booking_notification', 'New Session Booking: {{full_name}}', 'A new session has been booked.\n\nName: {{full_name}}\nEmail: {{email}}\nPhone: {{phone_number}}\nCompany: {{company}}\n\nProject Details:\n{{project_details}}')
            ON CONFLICT (id) DO NOTHING
        `);
    } catch (err) {
        console.error('Error initializing booking DB:', err);
        throw err;
    }
};

export const createBooking = async (data) => {
    const { full_name, email, phone_number, company, project_details } = data;
    const query = 'INSERT INTO bookings (full_name, email, phone_number, company, project_details) VALUES ($1, $2, $3, $4, $5) RETURNING *';
    const values = [full_name, email, phone_number, company, project_details];
    const { rows } = await pool.query(query, values);
    return rows[0];
};

export const getAllBookings = async () => {
    const { rows } = await pool.query('SELECT * FROM bookings ORDER BY created_at DESC');
    return rows;
};
