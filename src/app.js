import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from './config/db.js';
import { mountAdminRoutes } from './routes/admin/index.js';
import { adminServices, publicServices } from './routes/adminServices.js';
import { uploadRouter } from './routes/upload.js';
import contactRouter from './routes/contact.route.js';
import teamRouter from './routes/team.route.js';
import bookingRouter from './routes/booking.route.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// Standard Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Uploaded images (served at /uploads)
app.use('/uploads', express.static(path.join(path.dirname(__dirname), 'uploads')));

// Admin Routes (Modular)
mountAdminRoutes(app, { prefix: '/admin' });
mountAdminRoutes(app, { prefix: '/api/admin' });

// Admin Services Routes
app.use('/admin/services', adminServices(pool));
app.use('/api/admin/services', adminServices(pool));

// Admin image upload (single "image" field for services)
app.use('/admin/upload', uploadRouter());
app.use('/api/admin/upload', uploadRouter());

// Public services (visible only) for landing page
app.use('/api/services', publicServices(pool));

// Contact Routes
app.use('/api/contact', contactRouter);

// Team Routes
app.use('/api/teams', teamRouter);

// Booking Routes
app.use('/api/bookings', bookingRouter);

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
