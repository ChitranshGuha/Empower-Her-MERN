// pages/api/notifications/unread/[userId].js
import connectDB from '@/utils/connectDB';
import Notification from '@/models/Notification';
import User from '@/models/User';

export default async function handler(req, res) {
  const { userId } = req.query;

  if (req.method === 'GET') {
    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID is required.' });
    }

    try {
      await connectDB();

      // Optional: Verify the user exists
      const user = await User.findById(userId);
      if (!user) {
        console.warn(`Unread count: User ${userId} not found.`); // Add log
        return res.status(404).json({ success: false, message: 'User not found.' });
      }

      // Count unread notifications for the recipient
      const unreadCount = await Notification.countDocuments({
        recipient: userId,
        isRead: false,
      });

      console.log(`Unread count for user ${userId}: ${unreadCount}`); // Add log
      res.status(200).json({ success: true, count: unreadCount });
    } catch (error) {
      console.error(`Error fetching unread notification count for user ${userId}:`, error);
      if (error.name === 'CastError') {
        return res.status(400).json({ success: false, message: 'Invalid User ID format.' });
      }
      res.status(500).json({ success: false, message: 'Server error fetching unread count.' });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
}