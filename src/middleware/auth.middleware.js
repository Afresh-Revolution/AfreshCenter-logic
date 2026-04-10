import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.warn('[auth] Authorization header missing or malformed');
            return res.status(401).json({ success: false, message: 'Authentication required' });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            console.warn('[auth] Bearer token missing');
            return res.status(401).json({ success: false, message: 'Authentication token missing' });
        }

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            console.error('JWT_SECRET is not configured');
            return res.status(503).json({ success: false, message: 'Server configuration error' });
        }

        const decoded = jwt.verify(token, secret);
        req.user = decoded; // Attach decoded token payload to the request
        next();
    } catch (err) {
        console.warn('[auth] Authentication failure:', {
            name: err.name,
            message: err.message,
            path: req.originalUrl,
            ip: req.ip
        });
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: 'Token expired' });
        }
        return res.status(401).json({ success: false, message: 'Invalid token' });
    }
};
