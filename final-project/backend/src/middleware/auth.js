// src/middleware/auth.middleware.js
import { verifyAccessToken } from '../services/token.service.js';

export function authMiddleware(req, res, next) {
  // DEV TOGGLE: if set, bypass auth in development
  if (process.env.DISABLE_AUTH === 'true') {
    // set a fake admin user for dev flows. Use a clear id so it's obvious.
    req.user = { id: 'dev-admin', role: 'admin' };
    return next();
  }

  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: 'Missing Authorization header' });
  const token = auth.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Missing token' });

  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.id, role: payload.role }; // normal flow
    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}
