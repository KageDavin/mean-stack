import express from 'express';
import { attemptQuiz, getResponses } from '../../controllers/responses.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';

const router = express.Router();

router.post('/quizzes/:id/attempt', authMiddleware, attemptQuiz);
router.get('/', authMiddleware, getResponses); // admin or student (filter by studentId)

export default router;
