// middleware/auth.js
const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const h = req.headers.authorization;
  if (!h) return res.status(401).send({ message: 'No token' });
  const token = h.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // includes id, role
    next();
  } catch (err) {
    return res.status(401).send({ message: 'Invalid token' });
  }
}

function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).send({ message: 'Unauthorized' });
    if (req.user.role !== role) return res.status(403).send({ message: 'Forbidden' });
    next();
  };
}

module.exports = { authMiddleware, requireRole };
// export { authMiddleware, requireRole };