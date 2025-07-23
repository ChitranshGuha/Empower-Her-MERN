// models/Feedback.js
import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false, // Optional: if feedback can be anonymous
  },
  userName: {
    type: String,
    required: false, // Optional: if feedback can be anonymous, store name if user is logged in
  },
  userEmail: {
    type: String,
    required: false, // Optional: if feedback can be anonymous, store email if user is logged in
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
  rating: { // Optional: if you want a rating system (e.g., 1-5 stars)
    type: Number,
    min: 1,
    max: 5,
    required: false,
  },
  status: { // Optional: to track if feedback has been reviewed
    type: String,
    enum: ['new', 'reviewed', 'archived'],
    default: 'new',
  },
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

const Feedback = mongoose.models.Feedback || mongoose.model('Feedback', feedbackSchema);

export default Feedback;