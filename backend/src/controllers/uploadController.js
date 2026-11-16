const fs = require('fs');
const path = require('path');
const cloudinary = require('../config/cloudinary');

const uploadDir = path.join(__dirname, '../../public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/**
 * Upload image (buffer or file path) to Cloudinary
 * @param {Buffer|string} input - File buffer or file path
 * @param {string} folder - Destination folder on Cloudinary
 * @returns {Promise<Object>} Cloudinary upload result
 */
function uploadToCloudinary(input, folder = 'adopt-me/animals') {
  if (Buffer.isBuffer(input)) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder, resource_type: 'image' },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      uploadStream.end(input);
    });
  } else {
    return cloudinary.uploader.upload(input, {
      folder,
      resource_type: 'image',
    });
  }
}

// POST /api/v1/upload (Upload single image to Cloudinary or Local)
async function uploadImage(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: { message: 'No image file uploaded. Please provide a file in the "image" field.' },
      });
    }

    const { CLOUDINARY } = require('../config/env');
    let finalUrl = '';

    if (CLOUDINARY && CLOUDINARY.cloud_name && CLOUDINARY.api_key && CLOUDINARY.api_secret) {
      const result = await uploadToCloudinary(req.file.buffer, 'adopt-me/general');
      finalUrl = result.secure_url;
    } else {
      // Save buffer to local disk
      const ext = path.extname(req.file.originalname) || '.jpg';
      const filename = `image-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
      const filePath = path.join(uploadDir, filename);
      fs.writeFileSync(filePath, req.file.buffer);
      finalUrl = `http://localhost:5000/uploads/${filename}`;
    }

    return res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        url: finalUrl,
      },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  uploadToCloudinary,
  uploadImage,
};
