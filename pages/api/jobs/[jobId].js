import connectDB from '@/utils/connectDB';
import Job from '@/models/Job';

export default async function handler(req, res) {
  const { jobId } = req.query;

  console.log(`API call to /api/jobs/${jobId} with method: ${req.method}`);

  if (!jobId) {
    return res.status(400).json({ success: false, message: 'Job ID is required.' });
  }

  if (req.method === 'GET') {
    try {
      await connectDB();

      const job = await Job.findById(jobId)
                           .select('_id title description location city salary deadline providerName createdAt')
                           .lean();

      if (!job) {
        return res.status(404).json({ success: false, message: 'Job not found.' });
      }

      res.status(200).json({ success: true, data: job });
    } catch (error) {
      console.error(`Error fetching single job from API for ID ${jobId}:`, error);
      if (error.name === 'CastError') {
        return res.status(400).json({ success: false, message: 'Invalid Job ID format.' });
      }
      res.status(500).json({ success: false, message: 'Server error while fetching job.' });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
}
