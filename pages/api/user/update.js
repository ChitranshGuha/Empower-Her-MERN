// pages/api/user/update.js
import connectDB from '@/utils/connectDB';
import User from '@/models/User';
import * as formidable from 'formidable';
import cloudinary from 'cloudinary'; // <--- You'll need Cloudinary or a similar service

// Configure Cloudinary (add your credentials securely in .env.local)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


export const config = {
  api: {
    bodyParser: false, // Disable Next.js default body parser
  },
};

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  await connectDB(); // Connect to your database

  try {
    const form = new formidable.IncomingForm(); // Initialize formidable

    // Parse the incoming request
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Formidable parsing error:', err);
        return res.status(500).json({ message: 'Error parsing form data.' });
      }

      // formidable parses fields as arrays, so extract the first element
      const _id = Array.isArray(fields._id) ? fields._id[0] : fields._id;
      const name = Array.isArray(fields.name) ? fields.name[0] : fields.name;
      const email = Array.isArray(fields.email) ? fields.email[0] : fields.email;
      const phone = Array.isArray(fields.phone) ? fields.phone[0] : fields.phone;
      const role = Array.isArray(fields.role) ? fields.role[0] : fields.role;

      // Access the uploaded file (assuming the input name is 'profilePicture' on frontend)
      const profilePictureFile = files.profilePicture ? (Array.isArray(files.profilePicture) ? files.profilePicture[0] : files.profilePicture) : null;

      let imageUrlToSave = Array.isArray(fields.imageUrl) ? fields.imageUrl[0] : fields.imageUrl; // Keep existing URL if no new file is uploaded

      if (!_id) {
        return res.status(400).json({ message: 'User ID is required' });
      }

      if (profilePictureFile) {
        // Step 3: Upload the file to cloud storage (e.g., Cloudinary)
        try {
          const result = await cloudinary.uploader.upload(profilePictureFile.filepath, {
            folder: 'empowerher_profile_pics', // Organize uploads
            public_id: `user-${_id}-${Date.now()}`, // Unique ID for the image
          });
          imageUrlToSave = result.secure_url; // Get the URL of the uploaded image
        } catch (uploadError) {
          console.error('Cloudinary upload error:', uploadError);
          return res.status(500).json({ message: 'Failed to upload profile picture.' });
        }
      }

      // Update user in MongoDB
      try {
        const updateData = { name, email, phone, role };
        if (imageUrlToSave) { // Only update imageUrl if a new one was uploaded or passed
          updateData.imageUrl = imageUrlToSave;
        }

        const updatedUser = await User.findByIdAndUpdate(
          _id,
          updateData,
          { new: true, runValidators: true } // `runValidators` ensures model validations apply
        );

        if (!updatedUser) {
          return res.status(404).json({ message: 'User not found' });
        }

        // Exclude password from the response for security
        const { password, ...userWithoutPassword } = updatedUser._doc;

        res.status(200).json({
          message: 'User updated successfully',
          user: userWithoutPassword,
        });
      } catch (dbError) {
        console.error('Database update error:', dbError);
        res.status(500).json({ message: 'Failed to update user profile in database.' });
      }
    });
  } catch (outerError) {
    console.error('General API error:', outerError);
    res.status(500).json({ message: 'An unexpected server error occurred.' });
  }
}