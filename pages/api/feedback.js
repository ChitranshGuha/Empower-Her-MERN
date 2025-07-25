import connectDB from '@/utils/connectDB';
import Feedback from '@/models/Feedback';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { userId, userName, userEmail, subject, message, rating } = req.body;

  if (!subject || !message) {
    return res.status(400).json({ message: 'Subject and message are required for feedback.' });
  }

  try {
    await connectDB();

    const newFeedback = new Feedback({
      userId: userId || null,
      userName: userName || 'Anonymous',
      userEmail: userEmail || 'N/A',
      subject,
      message,
      rating: rating ? Number(rating) : undefined,
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
