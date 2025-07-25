import connectDB from '@/utils/connectDB';
import Notification from '@/models/Notification';
import User from '@/models/User';

export default async function handler(req, res) {
  const { userId } = req.query;

  console.log(`API hit: /api/notifications/${userId} with method: ${req.method}`);
  console.log(`Requested user ID: ${userId}`); 

  if (req.method === 'GET') {
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required.' });
    }

    try {
      await connectDB();

      const user = await User.findById(userId);
      if (!user) {
        console.warn(`Main notifications fetch: User ${userId} not found in DB.`);
        return res.status(404).json({ message: 'User not found.' });
      }
      console.log(`User found in DB for ID: ${userId}`);

      const queryConditions = { recipient: userId };
      console.log('MongoDB find query conditions:', queryConditions);

      const notifications = await Notification.find(queryConditions)
        .sort({ createdAt: -1 })
        .lean();

      console.log(`Notifications found for user ${userId}: ${notifications.length} notifications.`);
      if (notifications.length > 0) {
        console.log('First notification found (full object):', notifications[0]);
        console.log('Recipient ID of first notification:', notifications[0].recipient ? notifications[0].recipient.toString() : 'N/A');
        console.log('isRead status of first notification:', notifications[0].isRead);
      }

      res.status(200).json({ success: true, data: notifications });
    } catch (error) {
      console.error(`Error fetching notifications for user ${userId}:`, error);
      if (error.name === 'CastError') {
        return res.status(400).json({ success: false, message: 'Invalid User ID format.' });
      }
      res.status(500).json({ success: false, message: 'Server error fetching notifications.' });
    }
  } else if (req.method === 'PUT') {
    const { notificationIds, markAllAsRead } = req.body;

    try {
        await connectDB();

        let updateResult;
        if (markAllAsRead) {
            updateResult = await Notification.updateMany(
                { recipient: userId, isRead: false },
                { $set: { isRead: true } }
            );
            console.log(`PUT: Marked all unread for user ${userId} as read. Count: ${updateResult.modifiedCount}`);
        } else if (Array.isArray(notificationIds) && notificationIds.length > 0) {
            updateResult = await Notification.updateMany(
                { _id: { $in: notificationIds }, recipient: userId },
                { $set: { isRead: true } }
            );
            console.log(`PUT: Marked specific notifications for user ${userId} as read. Count: ${updateResult.modifiedCount}`);
        } else {
            return res.status(400).json({ message: 'No notification IDs or markAllAsRead flag provided.' });
        }

        res.status(200).json({ success: true, message: 'Notifications updated.', updatedCount: updateResult.modifiedCount });

    } catch (error) {
        console.error(`PUT: Error updating notification status for user ${userId}:`, error);
        res.status(500).json({ success: false, message: 'Server error updating notifications.' });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
}