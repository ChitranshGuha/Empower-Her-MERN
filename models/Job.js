import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  city: { type: String, required: true },
  salary: { type: Number, required: true },
  deadline: { type: String, required: true },
  provider: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  providerName: { type: String, required: true }, 
    createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Job || mongoose.model('Job', jobSchema);