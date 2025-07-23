// models/Notification.js
import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  recipient: { // The user (job-seeker or job-provider) who receives the notification
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: { // e.g., 'application_status_update', 'new_applicant', 'general_message'
    type: String,
    enum: ['application_status_update', 'new_applicant', 'general_message'],
    required: true,
  },
  message: { // The actual message to display
    type: String,
    required: true,
    trim: true,
  },
  relatedEntity: { // Optional: Link to the job or application ID
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    refPath: 'relatedEntityType', // Dynamic reference based on relatedEntityType
  },
  relatedEntityType: { // Stores the model name for refPath
    type: String,
    enum: ['Job', 'Application'], // Models it can refer to
    required: false,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Notification = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);

export default Notification;