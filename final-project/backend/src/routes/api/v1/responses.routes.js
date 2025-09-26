import express from 'express';
import { attemptQuiz, getResponses } from '../../../controllers/responses.control.js';
import { authMiddleware } from '../../../middleware/auth.js';

const router = express.Router();

router.post('/quizzes/:id/attempt', authMiddleware, attemptQuiz);
router.get('/', authMiddleware, getResponses); // admin or student (filter by studentId)

export default router;
