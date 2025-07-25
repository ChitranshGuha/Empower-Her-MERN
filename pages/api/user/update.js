import connectDB from '@/utils/connectDB';
import User from '@/models/User';
import * as formidable from 'formidable';
import cloudinary from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  await connectDB();

  try {
    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Formidable parsing error:', err);
        return res.status(500).json({ message: 'Error parsing form data.' });
      }

      const _id = Array.isArray(fields._id) ? fields._id[0] : fields._id;
      const name = Array.isArray(fields.name) ? fields.name[0] : fields.name;
      const email = Array.isArray(fields.email) ? fields.email[0] : fields.email;
      const phone = Array.isArray(fields.phone) ? fields.phone[0] : fields.phone;
      const role = Array.isArray(fields.role) ? fields.role[0] : fields.role;

      const profilePictureFile = files.profilePicture ? (Array.isArray(files.profilePicture) ? files.profilePicture[0] : files.profilePicture) : null;

      let imageUrlToSave = Array.isArray(fields.imageUrl) ? fields.imageUrl[0] : fields.imageUrl;

      if (!_id) {
        return res.status(400).json({ message: 'User ID is required' });
      }

      if (profilePictureFile) {
        try {
          const result = await cloudinary.uploader.upload(profilePictureFile.filepath, {
            folder: 'empowerher_profile_pics',
            public_id: `user-${_id}-${Date.now()}`,
          });
          imageUrlToSave = result.secure_url;
        } catch (uploadError) {
          console.error('Cloudinary upload error:', uploadError);
          return res.status(500).json({ message: 'Failed to upload profile picture.' });
        }
      }

      try {
        const updateData = { name, email, phone, role };
        if (imageUrlToSave) {
          updateData.imageUrl = imageUrlToSave;
        }

        const updatedUser = await User.findByIdAndUpdate(
          _id,
          updateData,
          { new: true, runValidators: true }
        );

        if (!updatedUser) {
          return res.status(404).json({ message: 'User not found' });
        }

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
