const express = require('express');
const router = express.Router();
const achievementController = require('../controllers/achievementController');
const uploadToCloud = require('../middlewares/uploadCloudinary'); 
const { body } = require('express-validator');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware'); // <-- WAJIB ADA

// 1. Skema Validasi
const validateAchievement = [
    body('title').notEmpty().withMessage('Judul prestasi wajib diisi!'),
    body('tingkat').isIn(['Nasional', 'Internasional', 'Provinsi', 'Kota'])
        .withMessage('Tingkat harus antara: Nasional, Internasional, Provinsi, atau Kota'),
    body('kategoriLomba').notEmpty().withMessage('Kategori lomba wajib diisi!'),
    body('pemenang').notEmpty().withMessage('Nama pemenang wajib diisi!')
];

// ===== ROUTES =====

// PUBLIK (Siapa saja bisa lihat)
router.get('/', achievementController.getAchievements);
router.get('/:id', achievementController.getAchievementById);

// PRIVATE (Cuma Admin yang bisa modifikasi)
// Urutan Middleware: Cek Login -> Cek Admin -> Upload Gambar -> Validasi Teks -> Controller
router.post('/', 
    verifyToken, 
    isAdmin, 
    uploadToCloud('achievements').single('image'), 
    validateAchievement, 
    achievementController.createAchievement
);

router.put('/:id', 
    verifyToken, 
    isAdmin, 
    uploadToCloud('achievements').single('image'), 
    validateAchievement, 
    achievementController.updateAchievement
);

router.delete('/:id', 
    verifyToken, 
    isAdmin, 
    achievementController.deleteAchievement
);

module.exports = router;