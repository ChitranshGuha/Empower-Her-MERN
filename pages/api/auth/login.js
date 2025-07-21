// D:\Projects\2.Working\Empower Her Revamp\project\pages\api\auth\login.js
import connectDB from '@/utils/connectDB';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const { phone, password } = req.body;

  if (!phone || !password) {
    return res.status(400).json({ message: 'Phone and password are required' });
  }

  try {
    await connectDB();

    // 1. Find the user
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // 3. Return success (You can issue a JWT or session token here later)
    res.status(200).json({
      message: 'Login successful',
      user: {
        _id: user._id,
        phone: user.phone,
        role: user.role
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}
