const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();

// 1. Konfigurasi Kredensial Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// 2. Setting Tempat Penyimpanan di Cloud
const storage = (folderName) => new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: `siconnect/${folderName}`, // Akan otomatis buat folder di Cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    transformation: [{ width: 800, height: 800, crop: 'limit' }] // Otomatis resize biar gak kegedean
  },
});

// 3. Fungsi Helper untuk dipanggil di Route
const uploadToCloud = (folder) => multer({ storage: storage(folder) });

module.exports = uploadToCloud;