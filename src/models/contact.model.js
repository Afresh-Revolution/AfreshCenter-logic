import { pool } from '../config/db.js';

export const initContactDb = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS contact_messages (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                phone TEXT,
                subject TEXT,
                message TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS email_templates (
                id TEXT PRIMARY KEY,
                subject TEXT NOT NULL,
                body TEXT NOT NULL,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await pool.query(`
            INSERT INTO email_templates (id, subject, body)
            VALUES ('contact_notification', 'New Contact Form Submission', 'You have received a new message from {{name}} ({{email}}).\n\nSubject: {{subject}}\nMessage: {{message}}')
            ON CONFLICT (id) DO NOTHING
        `);
    } catch (err) {
        console.error('Error initializing contact DB:', err);
        throw err;
    }
};

export const createMessage = async (data) => {
    const { name, email, phone, subject, message } = data;
    const query = 'INSERT INTO contact_messages (name, email, phone, subject, message) VALUES ($1, $2, $3, $4, $5) RETURNING *';
    const values = [name, email, phone, subject, message];
    const { rows } = await pool.query(query, values);
    return rows[0];
};

export const getTemplateById = async (id) => {
    const { rows } = await pool.query('SELECT * FROM email_templates WHERE id = $1', [id]);
    return rows[0];
};

export const updateTemplateById = async (id, data) => {
    const { subject, body } = data;
    const query = 'UPDATE email_templates SET subject = $1, body = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *';
    const values = [subject, body, id];
    const { rows } = await pool.query(query, values);
    return rows[0];
};
