import { verifyAccessToken } from '../services/token.service.js';

export function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: 'Missing Authorization header' });
  const token = auth.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Invalid Authorization header' });
  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.id, role: payload.role };
    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

// export { authMiddleware, requireRole };