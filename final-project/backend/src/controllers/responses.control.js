import Quiz from '../models/Quiz.js';
import Response from '../models/Response.js';

export async function attemptQuiz(req, res, next) {
  try {
    const quizId = req.params.id;
    const quiz = await Quiz.findById(quizId).lean();
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    const answers = req.body.answers || [];
    // compute correct count
    let correct = 0;
    for (const a of answers) {
      const q = quiz.questions[a.questionIndex];
      if (!q) continue;
      if (q.correctOption === a.selectedOption) correct++;
    }
    const score = Math.round((correct / quiz.questions.length) * 100);

    const saved = await Response.create({
      quizId,
      studentId: req.user.id,
      answers,
      score
    });

    return res.json({
      id: saved._id,
      score,
      total: quiz.questions.length,
      correct
    });
  } catch (err) {
    next(err);
  }
}

export async function getResponses(req, res, next) {
  try {
    // admin can query all; students only their own
    const q = {};
    if (req.query.studentId) q.studentId = req.query.studentId;
    if (req.user.role === 'student') q.studentId = req.user.id;

    const responses = await Response.find(q).populate('quizId', 'title').populate('studentId', 'username');
    res.json(responses);
  } catch (err) {
    next(err);
  }
}
