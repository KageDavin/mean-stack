import Quiz from '../models/Quiz.js';
import Response from '../models/Response.js';

export async function listQuizzes(req, res, next) {
  try {
    // only published quizzes (or admins can see unpublished)
    if (req.user && req.user.role === 'admin') {
      const all = await Quiz.find().populate('createdBy', 'username');
      return res.json(all);
    }
    const quizzes = await Quiz.find({ published: true }).select('-questions.correctOption');
    return res.json(quizzes);
  } catch (err) {
    next(err);
  }
}

export async function getQuiz(req, res, next) {
  try {
    const quiz = await Quiz.findById(req.params.id).lean();
    if (!quiz) return res.status(404).json({ message: 'Not found' });

    // strip correctOption for student endpoints
    if (!req.user || req.user.role !== 'admin') {
      quiz.questions = quiz.questions.map(q => ({
        questionText: q.questionText,
        options: q.options
      }));
    }

    return res.json(quiz);
  } catch (err) {
    next(err);
  }
}

export async function createQuiz(req, res, next) {
  try {
    const { title, description, duration, questions, published } = req.body;
    const doc = await Quiz.create({
      title,
      description,
      duration,
      questions,
      published: Boolean(published),
      createdBy: req.user.id
    });
    res.status(201).json(doc);
  } catch (err) {
    next(err);
  }
}

export async function updateQuiz(req, res, next) {
  try {
    const patch = req.body;
    const updated = await Quiz.findByIdAndUpdate(req.params.id, patch, { new: true });
    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

export async function deleteQuiz(req, res, next) {
  try {
    const removed = await Quiz.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ message: 'Not found' });
    // optionally remove associated responses
    await Response.deleteMany({ quizId: req.params.id });
    res.json({ message: 'deleted' });
  } catch (err) {
    next(err);
  }
}

export async function getQuizResults(req, res, next) {
  try {
    const quizId = req.params.id;
    const results = await Response.find({ quizId }).populate('studentId', 'username');
    res.json(results);
  } catch (err) {
    next(err);
  }
}
// export async function getQuizResults(req, res, next) {
//   try {
//     const quizId = req.params.id;
//     const results = await Response.find({ quizId }).populate('studentId', 'username');
//     res.json(results);
//   } catch (err) {
//     next(err);
//   }
// }