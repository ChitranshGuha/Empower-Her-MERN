import connectDB from '@/utils/connectDB';
import Application from '@/models/Application';
import User from '@/models/User';

export default async function handler(req, res) {
  const { userId } = req.query;

  if (req.method === 'GET') {
    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID is required.' });
    }

    try {
      await connectDB();

      const user = await User.findById(userId);
      if (!user || user.role !== 'job-seeker') {
        return res.status(403).json({ success: false, message: 'Access denied or user not found.' });
      }

      const applications = await Application.find({ jobSeeker: userId })
                                            .populate({
                                                path: 'job',
                                                select: '_id title providerName'
                                            })
                                            .select('job status appliedAt')
                                            .lean();

      res.status(200).json({ success: true, data: applications });
    } catch (error) {
      console.error(`Error fetching applied jobs for user ${userId}:`, error);
      if (error.name === 'CastError') {
        return res.status(400).json({ success: false, message: 'Invalid User ID format.' });
      }
      res.status(500).json({ success: false, message: 'Server error fetching applied jobs.' });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
}
