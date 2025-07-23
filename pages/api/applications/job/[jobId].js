// pages/api/applications/job/[jobId].js
import connectDB from '@/utils/connectDB';
import Application from '@/models/Application';
import Job from '@/models/Job'; // To verify job exists and its provider

export default async function handler(req, res) {
  const { jobId } = req.query;

  if (req.method === 'GET') {
    if (!jobId) {
      return res.status(400).json({ success: false, message: 'Job ID is required.' });
    }

    try {
      await connectDB();

      // Optional: Verify the job exists
      const job = await Job.findById(jobId);
      if (!job) {
        return res.status(404).json({ success: false, message: 'Job not found.' });
      }
      // Future: Add authorization here to ensure only the job's provider can view applicants

      // Find all applications for the given job ID
      // Populate jobSeeker details to show applicant's name, email, phone etc.
      const applications = await Application.find({ job: jobId })
                                            .populate({
                                                path: 'jobSeeker',
                                                select: '_id name email phone' // Select specific job seeker fields
                                            })
                                            .select('_id status appliedAt jobSeeker') // Select fields from Application model
                                            .sort({ appliedAt: 1 }) // Sort by application date
                                            .lean(); // Convert Mongoose documents to plain JavaScript objects

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