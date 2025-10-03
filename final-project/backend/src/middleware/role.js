// src/middleware/role.middleware.js
export function requireRole(role) {
  return (req, res, next) => {
    // Bypass role checks in dev if DISABLE_AUTH is enabled
    if (process.env.DISABLE_AUTH === 'true') {
      return next();
    }

    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    if (req.user.role !== role) return res.status(403).json({ message: 'Forbidden' });
    next();
  };
}
