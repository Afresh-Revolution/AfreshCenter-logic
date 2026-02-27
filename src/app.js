import express from 'express';
import cors from 'cors';
import { pool } from './config/db.js';
import { mountAdminRoutes } from './routes/admin/index.js';
import { adminServices } from './routes/adminServices.js';

const app = express();

// Standard Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Admin Routes (Modular)
mountAdminRoutes(app, { prefix: '/admin' });
mountAdminRoutes(app, { prefix: '/api/admin' });

// Admin Services Routes
app.use('/admin/services', adminServices(pool));
app.use('/api/admin/services', adminServices(pool));

// Health Check Routes
const healthHandler = async (req, res) => {
    try {
        await pool.query('SELECT 1');
        res.status(200).json({ status: 'OK', service: 'AfreshCenter-logic', database: 'connected' });
    } catch (e) {
        console.error('Health check failed:', e);
        res.status(500).json({ status: 'ERROR', message: 'Database not reachable' });
    }
};

app.get('/health', healthHandler);
app.get('/api/health', healthHandler);

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

export default app;
