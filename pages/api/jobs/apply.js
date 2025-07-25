import connectDB from '@/utils/connectDB';
import Application from '@/models/Application';
import Job from '@/models/Job';
import User from '@/models/User';
import Notification from '@/models/Notification';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { jobId, jobSeekerId } = req.body;

  if (!jobId || !jobSeekerId) {
    return res.status(400).json({ message: 'Job ID and Job Seeker ID are required.' });
  }

  try {
    await connectDB();

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found.' });
    }

    const jobSeeker = await User.findById(jobSeekerId);
    if (!jobSeeker || jobSeeker.role !== 'job-seeker') {
      return res.status(403).json({ message: 'Invalid job seeker or user not authorized to apply.' });
    }

    const existingApplication = await Application.findOne({ job: jobId, jobSeeker: jobSeekerId });
    if (existingApplication) {
      return res.status(409).json({ message: 'You have already applied for this job.' });
    }

    const newApplication = new Application({
      job: jobId,
      jobSeeker: jobSeekerId,
      provider: job.provider,
      status: 'pending',
      appliedAt: new Date(),
    });

    await newApplication.save();

    const providerNotification = new Notification({
      recipient: job.provider,
      type: 'new_applicant',
      message: `New applicant for your job: "${job.title}" from ${jobSeeker.name}.`,
      relatedEntity: newApplication._id,
      relatedEntityType: 'Application',
    });

    await providerNotification.save();

    res.status(201).json({ message: 'Application submitted successfully!', application: newApplication });
  } catch (error) {
    console.error('Error submitting application:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error: Failed to submit application.' });
  }
}
