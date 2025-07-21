// D:\Projects\2.Working\Empower Her Revamp\project\models\User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {type: String, required: true},
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['job-seeker', 'job-provider'], required: true }
},{
    timestamps: true
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;