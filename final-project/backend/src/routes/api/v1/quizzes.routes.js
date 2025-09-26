import express from 'express';
import {
  listQuizzes,
  getQuiz,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  getQuizResults
} from '../../../controllers/quizzes.control.js';
import { authMiddleware } from '../../../middleware/auth.js';
import { requireRole } from '../../../middleware/role.js';

const router = express.Router();

router.get('/', authMiddleware, listQuizzes); // requires auth; could be public if you want
router.get('/:id', authMiddleware, getQuiz);
router.post('/', authMiddleware, requireRole('admin'), createQuiz);
router.put('/:id', authMiddleware, requireRole('admin'), updateQuiz);
router.delete('/:id', authMiddleware, requireRole('admin'), deleteQuiz);
router.get('/:id/results', authMiddleware, requireRole('admin'), getQuizResults);

export default router;
