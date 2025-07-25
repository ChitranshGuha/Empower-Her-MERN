import mongoose from 'mongoose';

const connectDB = async () => {
  if (mongoose.connections[0].readyState) {
    console.log('✅ Already connected to MongoDB');
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  }
};

export default connectDB;
