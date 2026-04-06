const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController'); 
const uploadToCloud = require('../middlewares/uploadCloudinary');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

// PUBLIC (Tamu bisa lihat)
router.get('/', studentController.getAllStudents);
router.get('/:id', studentController.getStudentById);

// PRIVATE (Hanya Admin)
router.post(
  '/', 
  verifyToken, 
  isAdmin, 
  uploadToCloud('students').single('foto'), 
  studentController.createStudent
);

router.put(
  '/:id', 
  verifyToken, 
  isAdmin, 
  uploadToCloud('students').single('foto'), 
  studentController.updateStudent
);

router.delete(
  '/:id', 
  verifyToken, 
  isAdmin, 
  studentController.deleteStudent
);

module.exports = router;