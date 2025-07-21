// models/Job.js
import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  provider: { type: mongoose.Schema.Types.ObjectId, ref: 'JobProvider', required: true },

  jobType: {
    type: String,
    enum: [
      'beautician', 'caretaker', 'homecook', 'hostel_cook', 'housekeeper',
      'laundry', 'nanny', 'playschool_teacher', 'shop_attendant'
    ],
    required: true
  },

  nameOfOrganization: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  location: { type: String, required: true },
  salary: { type: Number, required: true },
  emailId: { type: String, required: true },

  description: { type: String },
  workHours: { type: String }, // e.g., "Full-time", "Part-time", "Flexible"
  postedAt: { type: Date, default: Date.now }
},{
    timestamps: true
});

export default mongoose.model('Job', jobSchema);
