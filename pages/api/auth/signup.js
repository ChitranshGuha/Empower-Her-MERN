// D:\Projects\2.Working\Empower Her Revamp\project\pages\api\auth\signup.js
import connectDB from '@/utils/connectDB';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const { name, phone, password, role } = req.body;

  if (!phone || !password || !role) {
    return res.status(400).json({ message: 'Phone, password, and role are required' });
  }

  try {
    await connectDB();

    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ message: 'Phone number already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      phone,
      password: hashedPassword,
      role
    });

    res.status(201).json({
      message: 'Signup successful',
      user: {
        _id: newUser._id,
        phone: newUser.phone,
        role: newUser.role
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}
