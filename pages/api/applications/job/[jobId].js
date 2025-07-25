import connectDB from '@/utils/connectDB';
import Application from '@/models/Application';
import Job from '@/models/Job';

export default async function handler(req, res) {
  const { jobId } = req.query;

  if (req.method === 'GET') {
    if (!jobId) {
      return res.status(400).json({ success: false, message: 'Job ID is required.' });
    }

    try {
      await connectDB();

      const job = await Job.findById(jobId);
      if (!job) {
        return res.status(404).json({ success: false, message: 'Job not found.' });
      }

      const applications = await Application.find({ job: jobId })
                                            .populate({
                                                path: 'jobSeeker',
                                                select: '_id name email phone'
                                            })
                                            .select('_id status appliedAt jobSeeker')
                                            .sort({ appliedAt: 1 })
                                            .lean();

      res.status(200).json({ success: true, data: applications });
    } catch (error) {
      console.error(`Error fetching applications for job ${jobId}:`, error);
      if (error.name === 'CastError') {
        return res.status(400).json({ success: false, message: 'Invalid Job ID format.' });
      }
      res.status(500).json({ success: false, message: 'Server error fetching applications.' });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
}
