import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import pkg from 'pg';
import { adminLogin } from './routes/adminLogin.js';
import { adminServices } from './routes/adminServices.js';

const { Pool } = pkg;

const app = express();
const PORT = process.env.PORT || 3001;

// Use DATABASE_URL (standard Postgres connection string)
const connectionString = process.env.DATABASE_URL;
if (typeof connectionString !== 'string' || !connectionString.length) {
  throw new Error('DATABASE_URL is not set or not a string.');
}
const pool = new Pool({ connectionString });

app.use(cors({ origin: true }));
app.use(express.json());

// Existing admin login (stub if you have real auth elsewhere)
// Legacy path (no /api prefix)
app.use('/admin/login', adminLogin);
// Preferred API path with /api prefix
app.use('/api/admin/login', adminLogin);

// Services CRUD + visibility toggle (Postgres)
// Legacy path
app.use('/admin/services', adminServices(pool));
// Preferred API path with /api prefix
app.use('/api/admin/services', adminServices(pool));

// Health check
// Legacy path
app.get('/health', async (_, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: 'DB not reachable' });
  }
});

// Preferred API path with /api prefix
app.get('/api/health', async (_, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: 'DB not reachable' });
  }
});

app.listen(PORT, () => {
  console.log(`AfreshCenter API listening on http://localhost:${PORT}`);
});
