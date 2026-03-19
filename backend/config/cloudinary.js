const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary with credentials from .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Tell multer to store uploaded files in Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    // Detect file type to set correct resource type
    const isPDF = file.mimetype === 'application/pdf';
    return {
      folder: 'studenthub/notes',  // Cloudinary folder
      resource_type: isPDF ? 'raw' : 'image', // raw = PDF, image = jpg/png
      allowed_formats: ['pdf', 'jpg', 'jpeg', 'png', 'webp'],
      public_id: `note_${Date.now()}`, // Unique file name
    };
  },
});

// File filter — only allow specific types
const fileFilter = (req, file, cb) => {
  const allowed = [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
  ];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF and image files are allowed'), false);
  }
};

// Final multer upload middleware
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // Max 10MB
});

module.exports = { upload, cloudinary };