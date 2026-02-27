import app from './app.js';
import dotenv from 'dotenv';
import { connectMongoDB, connectPostgres } from './config/db.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    // Attempt database connections
    if (process.env.MONGODB_URI) {
        await connectMongoDB();
    } else {
        console.warn('[warning] MONGODB_URI not found in environment variables');
    }

    if (process.env.DATABASE_URL) {
        await connectPostgres();
    } else {
        console.warn('[warning] DATABASE_URL not found in environment variables');
    }

    app.listen(PORT, () => {
        console.log(`[server] Server running on port ${PORT}`);
        console.log(`[server] Health check: http://localhost:${PORT}/health`);
    });
};

startServer();
