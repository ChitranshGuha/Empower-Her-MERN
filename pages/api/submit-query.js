import connectDB from '@/utils/connectDB';
import Query from '@/models/Query';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { name, phone, email, query } = req.body;

  if (!name || !phone || !email || !query) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    await connectDB();
    const newQuery = new Query({
      name,
      phone,
      email,
      query,
    });

    await newQuery.save();

    res.status(201).json({ message: 'Query submitted successfully!', query: newQuery });
  } catch (error) {
    console.error('Error submitting query:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error: Failed to submit query.' });
  }
}
