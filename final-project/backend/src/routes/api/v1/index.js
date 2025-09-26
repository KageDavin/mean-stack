import express from 'express';
import authRoutes from './auth.routes.js';
import quizRoutes from './quizzes.routes.js';
import responseRoutes from './responses.routes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/quizzes', quizRoutes);
router.use('/responses', responseRoutes);

export default router;
