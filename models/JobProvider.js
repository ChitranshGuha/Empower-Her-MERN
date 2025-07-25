import mongoose from 'mongoose';

const jobProviderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  companyName: { type: String, required: true },
  contactPhone: { type: String, required: true },
  contactEmail: { type: String },
  address: { type: String },
  description: { type: String },
  jobsPosted: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }]
},{
    timestamps: true
});

export default mongoose.model('JobProvider', jobProviderSchema);