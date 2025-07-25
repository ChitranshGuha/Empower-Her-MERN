import connectDB from '@/utils/connectDB';
import Job from '@/models/Job';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      await connectDB();

      const { title, location, city, minSalary } = req.query;

      let query = {};

      if (title) {
        query.title = { $regex: title, $options: 'i' };
      }
      if (location) {
        query.location = { $regex: location, $options: 'i' };
      }
      if (city) {
        query.city = { $regex: city, $options: 'i' };
      }
      if (minSalary) {
        try {
          const salaryNum = parseFloat(minSalary);
          if (!isNaN(salaryNum)) {
            query.salary = { $regex: salaryNum.toString(), $options: 'i' };
          }
        } catch (e) {
          console.warn("Invalid minSalary provided:", minSalary);
        }
      }

      const jobs = await Job.find(query)
                            .sort({ createdAt: -1 })
                            .select('_id title description location city salary deadline providerName createdAt');

      res.status(200).json({ success: true, data: jobs });
    } catch (error) {
      console.error('Error fetching jobs with filters:', error);
      res.status(500).json({ success: false, message: 'Server error while fetching jobs with filters.' });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
}
