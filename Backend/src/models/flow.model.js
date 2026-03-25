import mongoose from 'mongoose';

const flowSchema = new mongoose.Schema(
  {
    prompt:   { type: String, required: true },
    response: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model('Flow', flowSchema);