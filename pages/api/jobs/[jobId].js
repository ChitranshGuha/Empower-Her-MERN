// pages/api/jobs/[jobId].js
import connectDB from '@/utils/connectDB';
import Job from '@/models/Job';

export default async function handler(req, res) {
  const { jobId } = req.query; // Get jobId from the URL query

  // Optional: Log to server terminal to confirm API hit and jobId received
  console.log(`API call to /api/jobs/${jobId} with method: ${req.method}`);


  if (!jobId) {
    return res.status(400).json({ success: false, message: 'Job ID is required.' });
  }

  if (req.method === 'GET') {
    try {
      await connectDB();

      // Find the job by its ID, selecting specific fields
      // Use .lean() for faster query if you don't need Mongoose document methods later
      const job = await Job.findById(jobId)
                            .select('_id title description location city salary deadline providerName createdAt')
                            .lean(); // Add .lean() for plain JavaScript object

      if (!job) {
        // Return 404 JSON if job not found in DB
        return res.status(404).json({ success: false, message: 'Job not found.' });
      }

      // Return job data as JSON
      res.status(200).json({ success: true, data: job });
    } catch (error) {
      console.error(`Error fetching single job from API for ID ${jobId}:`, error);
      // More specific error handling could be added here, e.g., if ID format is invalid
      if (error.name === 'CastError') { // Common Mongoose error for invalid ID format
          return res.status(400).json({ success: false, message: 'Invalid Job ID format.' });
      }
      res.status(500).json({ success: false, message: 'Server error while fetching job.' });
    }
  } else {
    // Return 405 Method Not Allowed for unsupported HTTP methods
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
}