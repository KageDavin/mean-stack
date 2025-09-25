                                                                                     const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true }, // hashed
  role: { type: String, enum: ['admin','student'], default: 'student' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
  // questions: this.fb.array([
  //      this.fb.group({
  //        text: '',
  //        options: this.fb.array([
  //          this.fb.control(''),
  //          this.fb.control(''),
  //          this.fb.control(''),
  //          this.fb.control('')
  //        ]),
  //        correctOption: this.fb.control(0)
  //      }) 