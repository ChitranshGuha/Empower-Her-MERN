// pages/api/jobs/index.js
import connectDB from '@/utils/connectDB';
import Job from '@/models/Job';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      await connectDB();

      const { title, location, city, minSalary } = req.query; // Extract filter parameters from query

      let query = {}; // Initialize an empty query object

      // Add filters if they are provided
      if (title) {
        query.title = { $regex: title, $options: 'i' }; // Case-insensitive title search
      }
      if (location) {
        query.location = { $regex: location, $options: 'i' }; // Case-insensitive location search
      }
      if (city) {
        query.city = { $regex: city, $options: 'i' }; // Case-insensitive city search
      }
      if (minSalary) {
        // Assuming salary is stored as a string like "50000 - 60000" or just "50000"
        // This is a basic way to filter; for more robust salary filtering,
        // you might want to store salary as a number range (e.g., minSalaryNum, maxSalaryNum).
        // For now, we'll try to match if the salary field contains a number >= minSalary.
        // This might require more advanced regex or data transformation in the DB.
        // A more reliable way is to store salary as a number and query by number.
        // For simplicity, if salary is a string, we'll filter on the client side or
        // make salary ranges comparable in the DB.
        // For now, let's assume salary is a string that can be parsed or directly compared.
        // If salary is like "50000", simple $gte might work if it's a number.
        // If it's "50,000 - 60,000", this filtering is complex.
        // Let's assume for now that salary can be compared numerically after parsing.
        // If salary is always a string like "50000", then a direct numerical comparison is hard.
        // Consider if salary string needs to contain the minSalary value.
        // For more robust filtering, you might need to:
        // 1. Store salary as a Number in DB: `salary: { type: Number, required: true }`
        // 2. Or, store as `minSalary: Number, maxSalary: Number`.
        // Given current schema (salary: String), simple direct comparison is tricky.
        // Let's try to convert and compare, but be aware of string formats.

        // A safer way for string salaries is to check if the string *contains* the number,
        // or to ask for a specific format.
        // For simple filtering here, assuming a basic numeric string representation:
        try {
            const salaryNum = parseFloat(minSalary);
            if (!isNaN(salaryNum)) {
                // This regex attempts to find numbers in the salary string
                // and assumes that if salary contains "100000", it's > 50000
                // This is a very rough filter for string salaries, actual implementation
                // depends on salary data format.
                // A better approach for string salaries: client-side filter after fetch or
                // more complex regex / DB aggregation.
                // For direct numerical comparison, salary field must be Number in DB.
                // For demonstration, let's try a regex for numbers greater than or equal to minSalary
                // This is highly imperfect for string fields like "100,000 - 120,000"
                // A simpler, though less precise, string filter:
                query.salary = { $gte: minSalaryNum };// Matches salary strings containing the minSalary
                // For example, if minSalary = "50000", it matches "50000", "50000-60000"
                // If minSalary = "100000", it matches "100000" but not "90000"
                // This doesn't ensure the *value* is greater, just that the string *contains* the number.
                // If your 'salary' field in DB is guaranteed to be a pure number-string,
                // you could use an aggregation pipeline to convert and filter.
                // Example: { $expr: { $gte: [ { $toDouble: "$salary" }, salaryNum ] } }
                // But that requires an aggregation. For simple find(), $regex is the best compromise.
            }
        } catch (e) {
            console.warn("Invalid minSalary provided:", minSalary);
        }
      }

      // Fetch jobs based on the constructed query
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