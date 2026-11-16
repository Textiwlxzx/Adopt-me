const cloudinary = require('cloudinary').v2;
const { CLOUDINARY } = require('./env');

if (CLOUDINARY && CLOUDINARY.cloud_name) {
  cloudinary.config({
    cloud_name: CLOUDINARY.cloud_name,
    api_key: CLOUDINARY.api_key,
    api_secret: CLOUDINARY.api_secret,
  });
}

module.exports = cloudinary;

