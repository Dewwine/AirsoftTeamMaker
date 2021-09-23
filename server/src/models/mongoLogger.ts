import mongoose from 'mongoose';

const logSchema = new mongoose.Schema({
  method: {
    type: String,
    required: true
  },
  request: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  } 
})

export default mongoose.model('logSchema', logSchema);