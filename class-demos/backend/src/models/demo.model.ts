// backend/src/models/demo.model.ts
import { Schema, model } from 'mongoose';

const demoSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const Demo = model('Demo', demoSchema);

export default Demo;