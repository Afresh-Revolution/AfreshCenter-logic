import mongoose from 'mongoose';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// MongoDB Connection
export const connectMongoDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`[db] MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`[db] MongoDB Connection Error: ${error.message}`);
        process.exit(1);
    }
};

// PostgreSQL Connection
export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export const connectPostgres = async () => {
    try {
        const client = await pool.connect();
        console.log('[db] PostgreSQL Connected');
        client.release();
    } catch (error) {
        console.error(`[db] PostgreSQL Connection Error: ${error.message}`);
        // Not exiting process here because MongoDB might still be needed
    }
};
