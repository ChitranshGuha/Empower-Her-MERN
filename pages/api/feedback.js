// pages/api/feedback.js
import connectDB from '@/utils/connectDB';
import Feedback from '@/models/Feedback';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { userId, userName, userEmail, subject, message, rating } = req.body;

  // Basic validation
  if (!subject || !message) {
    return res.status(400).json({ message: 'Subject and message are required for feedback.' });
  }

  try {
    await connectDB(); // Connect to MongoDB

    const newFeedback = new Feedback({
      userId: userId || null, // Store userId if provided (logged-in user)
      userName: userName || 'Anonymous', // Store name or default to Anonymous
      userEmail: userEmail || 'N/A', // Store email or N/A
      subject,
      message,
      rating: rating ? Number(rating) : undefined, // Convert rating to Number if provided
    });

    await newFeedback.save();

    res.status(201).json({ message: 'Feedback submitted successfully!', feedback: newFeedback });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error: Failed to submit feedback.' });
  }
}