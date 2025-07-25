import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  userName: {
    type: String,
    required: false,
  },
  userEmail: {
    type: String,
    required: false,
  },
  subject: {
    type: String,
    required: true,
    trim: true,
  },
  message: {
    type: String,
    required: true,
    trim: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: false,
  },
  status: {
    type: String,
    enum: ['new', 'reviewed', 'archived'],
    default: 'new',
  },
}, {
  timestamps: true,
});

const Feedback = mongoose.models.Feedback || mongoose.model('Feedback', feedbackSchema);

export default Feedback;