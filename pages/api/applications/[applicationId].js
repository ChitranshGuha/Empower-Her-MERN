// pages/api/applications/[applicationId].js (Updated)
import connectDB from '@/utils/connectDB';
import Application from '@/models/Application';
import Notification from '@/models/Notification'; // Import Notification model
import Job from '@/models/Job'; // To get job title for notification message

export default async function handler(req, res) {
  const { applicationId } = req.query;
  const { status } = req.body;

  if (!applicationId) {
    return res.status(400).json({ message: 'Application ID is required.' });
  }

  const allowedStatuses = ['pending', 'reviewed', 'interview', 'rejected', 'hired'];

  if (req.method === 'PUT') {
    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid or missing status.' });
    }

    try {
      await connectDB();

      // Find the application *before* updating to get jobSeeker and job data
      const application = await Application.findById(applicationId).populate('jobSeeker').populate('job');

      if (!application) {
        return res.status(404).json({ message: 'Application not found.' });
      }

      // Check if status actually changed to avoid unnecessary notifications
      if (application.status === status) {
          return res.status(200).json({ message: 'Status already updated.', application: application });
      }

      application.status = status;
      await application.save();

      // --- NEW: Create Notification for Job Seeker ---
      const seekerNotification = new Notification({
        recipient: application.jobSeeker._id, // The job seeker who applied
        type: 'application_status_update',
        message: `Your application for "${application.job.title}" has been updated to "${status}".`,
        relatedEntity: application._id, // Link to the application
        relatedEntityType: 'Application',
      });
      await seekerNotification.save();
      // --- END NEW ---

      res.status(200).json({ message: 'Application status updated successfully!', application: application });
    } catch (error) {
      console.error(`Error updating application ${applicationId}:`, error);
      if (error.name === 'ValidationError') {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: 'Server error updating application.' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}