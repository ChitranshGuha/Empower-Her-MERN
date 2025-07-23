// models/Application.js
import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
  },
  jobSeeker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: { // This is the key field for tracking status
    type: String,
    enum: ['pending', 'reviewed', 'interview', 'rejected', 'hired'],
    default: 'pending',
  },
  appliedAt: {
    type: Date,
    default: Date.now,
  },
  // Add provider field to application for easier querying for providers to see applications
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true
});

const Application = mongoose.models.Application || mongoose.model('Application', applicationSchema);

export default Application;