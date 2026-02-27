import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../../config/db.js';
import { validateLoginBody } from './middleware/validateLogin.js';

const router = Router();

/**
 * POST /admin/login
 * Body: { email, password, rememberMe? }
 * Validates with login schema, then checks admin_users in Postgres and issues a JWT.
 */
router.post('/login', validateLoginBody, async (req, res) => {
  try {
    const { email, password } = req.validated;

    const result = await pool.query(
      'SELECT id, email, password_hash FROM admin_users WHERE email = $1 LIMIT 1',
      [email]
    );
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('JWT_SECRET is not set');
      return res.status(503).json({
        success: false,
        message: 'Auth not configured',
      });
    }

    const expiresIn = req.validated.rememberMe ? '7d' : '24h';
    const access_token = jwt.sign(
      { sub: user.id, email: user.email },
      secret,
      { expiresIn }
    );

    res.status(200).json({
      success: true,
      message: 'Signed in successfully',
      session: {
        access_token,
        expires_in: expiresIn,
      },
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (err) {
    console.error('Admin login error:', err);
    res.status(500).json({
      success: false,
      message: 'An error occurred during sign in',
    });
  }
});

export default router;
