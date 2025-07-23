// pages/api/jobs/applied/[userId].js
import connectDB from '@/utils/connectDB';
import Application from '@/models/Application';
import User from '@/models/User'; // To verify user and role

export default async function handler(req, res) {
  const { userId } = req.query; // Get userId from the URL query

  if (req.method === 'GET') {
    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID is required.' });
    }

    try {
      await connectDB();

      // Optional: Verify if the user exists and is a job-seeker
      const user = await User.findById(userId);
      if (!user || user.role !== 'job-seeker') {
        return res.status(403).json({ success: false, message: 'Access denied or user not found.' });
      }

      // Find all applications for the given jobSeekerId
      // Use .populate('job') to get the job details directly (only '_id' is stored in Application)
      const applications = await Application.find({ jobSeeker: userId })
                                            .populate({
                                                path: 'job',
                                                select: '_id title providerName' // Only get the necessary job fields
                                            })
                                            .select('job status appliedAt') // Select fields from Application model
                                            .lean(); // Convert Mongoose documents to plain JavaScript objects

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