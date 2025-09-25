import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctOption: { type: Number, required: true }
}, { _id: false });

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  duration: { type: Number, default: 10 },
  questions: [questionSchema],
  createdBy: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export const Quiz = mongoose.model('Quiz', quizSchema);
