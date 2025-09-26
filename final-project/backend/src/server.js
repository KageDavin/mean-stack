

import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import connectDb from './config/db.js';

const PORT = process.env.PORT || 3000;

(async function boot() {
  try {
    await connectDb(process.env.MONGO_URI);
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
})();
