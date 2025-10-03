// backend/db.js
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/online_quiz', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
