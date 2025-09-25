const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: { type: [String], validate: v => v.length === 4 },
  correctOption: { type: Number, min: 0, max: 3, required: true }
});

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  duration: { type: Number, default: 15 }, // minutes
  questions: [questionSchema],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  published: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Quiz', quizSchema);



// const Quiz = require('./Quiz');
// const QuizResponse = require('./Response');