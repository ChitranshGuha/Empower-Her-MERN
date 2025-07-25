import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['application_status_update', 'new_applicant', 'general_message'],
    required: true,
  },
  message: {
    type: String,
    required: true,
    trim: true,
  },
  relatedEntity: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    refPath: 'relatedEntityType',
  },
  relatedEntityType: {
    type: String,
    enum: ['Job', 'Application'],
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
