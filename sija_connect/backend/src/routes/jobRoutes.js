// backend/src/routes/jobRoutes.js
const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const uploadToCloud = require('../middlewares/uploadCloudinary');
const { verifyToken, optionalAuth, isAdmin } = require('../middlewares/authMiddleware');

// 1. Route Statis / Spesifik (Taruh di Atas)
router.get('/', optionalAuth, jobController.getJobs);
router.get('/my/saved', verifyToken, jobController.getSavedJobs);

// 2. Route dengan ID (Taruh di Tengah/Bawah)
router.get('/:id', optionalAuth, jobController.getJobById); // Sekarang fungsi ini sudah ada
router.patch('/:id/save', verifyToken, jobController.toggleSaveJob);

// 3. Khusus Admin
router.post('/', verifyToken, isAdmin, uploadToCloud('jobs').single('logo'), jobController.createJob);
router.put('/:id', verifyToken, isAdmin, uploadToCloud('jobs').single('logo'), jobController.updateJob);
router.delete('/:id', verifyToken, isAdmin, jobController.deleteJob);

module.exports = router;