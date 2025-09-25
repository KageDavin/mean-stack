import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
  questionIndex: { type: Number, required: true },
  selectedOption: { type: Number, required: true }
}, { _id: false });

const responseSchema = new mongoose.Schema({
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  studentId: { type: String, required: true },
  answers: [answerSchema],
  score: { type: Number, required: true },
  submittedAt: { type: Date, default: Date.now }
});

export const Response = mongoose.model('Response', responseSchema);
