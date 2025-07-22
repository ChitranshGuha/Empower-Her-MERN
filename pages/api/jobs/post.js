// pages/api/jobs/post.js
import connectDB from "@/utils/connectDB";
import Job from "@/models/Job";
import User from "@/models/User";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    await connectDB(); // Connect to MongoDB

    const { title, description, location, city, salary, deadline, provider } = req.body;
    if (!title || !description || !location || !city || !salary || !deadline || !provider) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const jobProvider = await User.findById(provider);
    if (!jobProvider) {
      return res.status(404).json({ message: "Job provider not found." });
    }
    const providerName = jobProvider.name;
    const job = new Job({
      title,
      description,
      location,
      city,
      salary,
      deadline,
      provider,
      providerName,
    });

    await job.save();

    res.status(201).json({ message: "Job created successfully", job });
  } catch (error) {
    console.error("Job Post Error:", error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Server Error" });
  }
}