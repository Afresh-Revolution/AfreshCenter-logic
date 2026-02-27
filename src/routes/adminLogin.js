import { Router } from 'express';

const router = Router();

// Stub: accept any email/password and return success (replace with real auth when needed)
router.post('/', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required',
      errors: [
        { field: 'email', message: !email ? 'Email is required' : '' },
        { field: 'password', message: !password ? 'Password is required' : '' },
      ].filter((e) => e.message),
    });
  }
  res.status(200).json({
    success: true,
    message: 'Signed in successfully',
    session: {
      access_token: 'stub-token-' + Date.now(),
      expires_in: '86400',
    },
    user: {
      id: 'stub-user-id',
      email: String(email).trim(),
    },
  });
});

export { router as adminLogin };
