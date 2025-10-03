// backend/src/config.db.js
import mongoose from 'mongoose';

export default async function connectDb(uri = 'mongodb://localhost:27017/online_quiz') {
  mongoose.set('strictQuery', false);
  await mongoose.connect(uri, { dbName: 'online_quiz' });
  console.log('MongoDB connected');
}
