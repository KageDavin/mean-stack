import express from 'express';
import rateLimit from 'express-rate-limit';
import { register, login, refresh, logout } from '../../../controllers/auth.control.js';

const router = express.Router();



// rate limiter for auth endpoints
const authLimiter = rateLimit({ windowMs: 60 * 1000, max: 10 });

router.get('/quiz', (req, res) => {
  res.send('Auth router is alive');
});
router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/refresh', refresh);
router.post('/logout', logout);

export default router;
