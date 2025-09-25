import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import YAML from 'yamljs';
import swaggerUi from 'swagger-ui-express';

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/quizapp';
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

// ---- Mongo models ----
import { User } from './src/models/User.js';
import { Quiz } from './src/models/Quiz.js';
import { Response as QuizResponse } from './src/models/Response.js';

// ---- Swagger ----
try {
  const swaggerDocument = YAML.load('./swagger.yml');
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} catch (e) {
  console.warn('Swagger not loaded:', e.message);
}

// ---- Utilities ----
const authMiddleware = (req, res, next) => {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Missing token' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// ---- Routes ----

// Health
app.get('/api/health', (req,res)=>res.json({status:'ok'}));

// Auth
app.post('/api/auth/register', async (req,res)=>{
  const { username, password, role } = req.body;
  if (!username || !password) return res.status(400).json({message:'username/password required'});
  const exists = await User.findOne({ username });
  if (exists) return res.status(409).json({message:'Username already exists'});
  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ username, password: hash, role: role || 'student' });
  res.status(201).json({ id: user._id, username: user.username, role: user.role });
});

app.post('/api/auth/login', async (req,res)=>{
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(401).json({message:'Invalid credentials'});
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({message:'Invalid credentials'});
  const token = jwt.sign({ sub:user._id.toString(), username:user.username, role:user.role }, JWT_SECRET, { expiresIn: '2h' });
  res.json({ token, user: { id: user._id, username: user.username, role: user.role } });
});

// Quizzes (admin)
app.post('/api/quizzes', authMiddleware, async (req,res)=>{
  if (req.user.role !== 'admin') return res.status(403).json({message:'Forbidden'});
  const { title, description, duration, questions } = req.body;
  const quiz = await Quiz.create({ title, description, duration, questions, createdBy: req.user.sub });
  res.status(201).json(quiz);
});

app.get('/api/quizzes', authMiddleware, async (req,res)=>{
  // both roles can list
  const list = await Quiz.find().select('title description duration createdAt');
  res.json(list);
});

app.get('/api/quizzes/:id', authMiddleware, async (req,res)=>{
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) return res.status(404).json({message:'Not found'});
  res.json(quiz);
});

app.put('/api/quizzes/:id', authMiddleware, async (req,res)=>{
  if (req.user.role !== 'admin') return res.status(403).json({message:'Forbidden'});
  const updated = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

app.delete('/api/quizzes/:id', authMiddleware, async (req,res)=>{
  if (req.user.role !== 'admin') return res.status(403).json({message:'Forbidden'});
  await Quiz.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

// Submit quiz (student)
app.post('/api/quizzes/:id/submit', authMiddleware, async (req,res)=>{
  if (req.user.role !== 'student') return res.status(403).json({message:'Students only'});
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) return res.status(404).json({message:'Quiz not found'});
  const { answers } = req.body; // [{questionIndex:number, selectedOption:number}]
  let score = 0;
  (answers || []).forEach(a => {
    const q = quiz.questions[a.questionIndex];
    if (q && a.selectedOption === q.correctOption) score++;
  });
  const resp = await QuizResponse.create({
    quizId: quiz._id,
    studentId: req.user.sub,
    answers,
    score,
    submittedAt: new Date()
  });
  res.json({ score, total: quiz.questions.length, responseId: resp._id });
});

// Results (admin)
app.get('/api/results', authMiddleware, async (req,res)=>{
  if (req.user.role !== 'admin') return res.status(403).json({message:'Forbidden'});
  const list = await QuizResponse.find().sort({ submittedAt:-1 }).limit(100);
  res.json(list);
});

// My results (student)
app.get('/api/my/results', authMiddleware, async (req,res)=>{
  const list = await QuizResponse.find({ studentId: req.user.sub }).sort({ submittedAt:-1 });
  res.json(list);
});

// DB connect & start
mongoose.connect(MONGO_URI).then(()=>{
  console.log('Mongo connected');
  app.listen(PORT, ()=>console.log(`API on http://localhost:${PORT}`));
}).catch(err => {
  console.error('Mongo error', err);
  process.exit(1);
});
