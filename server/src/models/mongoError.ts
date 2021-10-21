import mongoose from 'mongoose';

const errorSchema = new mongoose.Schema({
  error: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('errorSchema', errorSchema);
