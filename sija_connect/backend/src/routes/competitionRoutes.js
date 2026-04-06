const express = require('express');
const router = express.Router();
const competitionController = require('../controllers/competitionController');
const uploadToCloud = require('../middlewares/uploadCloudinary'); 
const { body } = require('express-validator');
const { verifyToken, isAdmin, optionalAuth } = require('../middlewares/authMiddleware');

// 1. Skema Validasi Teks
const validateCompetition = [
    body('judul').notEmpty().withMessage('Judul lomba wajib diisi!'),
    body('kategoriLomba').notEmpty().withMessage('Kategori lomba wajib diisi!'),
    body('penyelenggara').notEmpty().withMessage('Penyelenggara wajib diisi!'),
    body('tanggalMulai').notEmpty().withMessage('Tanggal mulai wajib diisi!'),
    body('tanggalSelesai').notEmpty().withMessage('Tanggal selesai wajib diisi!'),
    body('linkDaftar').isURL().withMessage('Link pendaftaran harus berupa URL valid!')
];

// ===== ROUTES =====

// PUBLIK (Bisa diakses Tamu & User Login)
// Menggunakan optionalAuth agar tamu tidak ditolak, tapi user login tetap terbaca isSaved-nya
router.get('/', optionalAuth, competitionController.getCompetitions);
router.get('/:id', optionalAuth, competitionController.getCompetitionById);

// PRIVATE: Hanya Admin
router.post('/', 
    verifyToken, 
    isAdmin, 
    uploadToCloud('competitions').single('poster'), 
    validateCompetition, 
    competitionController.createCompetition
);

router.put('/:id', 
    verifyToken, 
    isAdmin, 
    uploadToCloud('competitions').single('poster'), 
    validateCompetition, 
    competitionController.updateCompetition
);

router.delete('/:id', 
    verifyToken, 
    isAdmin, 
    competitionController.deleteCompetition
);

// Fitur Simpan/Unsave (Wajib Login/verifyToken)
router.patch('/:id/save', verifyToken, competitionController.toggleSaveCompetition);

module.exports = router;