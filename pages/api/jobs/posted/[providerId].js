import connectDB from '@/utils/connectDB';
import Job from '@/models/Job';
import User from '@/models/User';

export default async function handler(req, res) {
  const { providerId } = req.query;

  if (req.method === 'GET') {
    if (!providerId) {
      return res.status(400).json({ success: false, message: 'Provider ID is required.' });
    }

    try {
      await connectDB();

      const user = await User.findById(providerId);
      if (!user || user.role !== 'job-provider') {
        return res.status(403).json({ success: false, message: 'Access denied or user not authorized to view posted jobs.' });
      }

      const jobs = await Job.find({ provider: providerId })
                            .sort({ createdAt: -1 })
                            .select('_id title description location city salary deadline providerName createdAt');

      res.status(200).json({ success: true, data: jobs });
    } catch (error) {
      console.error(`Error fetching posted jobs for provider ${providerId}:`, error);
      if (error.name === 'CastError') {
        return res.status(400).json({ success: false, message: 'Invalid Provider ID format.' });
      }
      res.status(500).json({ success: false, message: 'Server error fetching posted jobs.' });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
}
