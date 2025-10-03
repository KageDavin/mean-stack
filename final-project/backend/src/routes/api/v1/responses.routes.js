import express from 'express';
import { attemptQuiz, getResponses } from '../../../controllers/responses.control.js';
import { authMiddleware } from '../../../middleware/auth.js';

const router = express.Router();

router.post('/quizzes/:id/attempt',  attemptQuiz);
router.get('/', getResponses);

// router.post('/quizzes/:id/attempt', authMiddleware, attemptQuiz);
// router.get('/', authMiddleware, getResponses);

export default router;
