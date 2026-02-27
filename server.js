import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { mountAdminRoutes } from './admin/index.js';

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

mountAdminRoutes(app, { prefix: '/admin' });

app.get('/health', (req, res) => {
  res.json({ ok: true, service: 'AfreshCenter-logic' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Admin login: POST http://localhost:${PORT}/admin/login`);
});
