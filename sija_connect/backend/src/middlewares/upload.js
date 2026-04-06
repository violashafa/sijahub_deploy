const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {

    // CEK FIELD NAME
    if (file.fieldname === 'poster') {
      cb(null, 'uploads/competitions');
    } else {
      cb(null, 'uploads/students');
    }

  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);

    if (file.fieldname === 'poster') {
      cb(null, `competition-${Date.now()}${ext}`);
    } else {
      cb(null, `student-${Date.now()}${ext}`);
    }

  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('File harus berupa gambar'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }
});

module.exports = upload;
