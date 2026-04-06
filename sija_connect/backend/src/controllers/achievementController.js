const Achievement = require('../models/Achievement');
const { successResponse, errorResponse } = require('../utils/response');
const { validationResult } = require('express-validator'); // <-- Tambah import ini

// ===== CREATE PRESTASI =====
exports.createAchievement = async (req, res) => {
  // --- CEK VALIDASI DI SINI ---
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false, 
      message: 'Validasi Gagal', 
      errors: errors.array() 
    });
  }
  // ----------------------------

  try {
    const achievementData = req.body;

    if (req.file) {
      achievementData.image = req.file.path; // URL Cloudinary
    }

    const achievement = new Achievement(achievementData);
    await achievement.save();

    return successResponse(res, 'Prestasi berhasil ditambahkan', achievement);
  } catch (err) {
    return errorResponse(res, 'Gagal menambahkan prestasi', err);
  }
};

// ===== GET ALL PRESTASI =====
exports.getAchievements = async (req, res) => {
  try {
    const achievements = await Achievement.find().sort({ date: -1 }); 
    return successResponse(res, 'Data prestasi berhasil diambil', achievements);
  } catch (err) {
    return errorResponse(res, 'Gagal mengambil data prestasi', err);
  }
};

// GET PRESTASI BY ID 
exports.getAchievementById = async (req, res) => {
  try {
    const achievement = await Achievement.findById(req.params.id)
      .populate('students', 'namaLengkap kelas');

    if (!achievement) {
      return errorResponse(res, 'Prestasi tidak ditemukan');
    }

    return successResponse(res, 'Data prestasi berhasil diambil', achievement);
  } catch (err) {
    return errorResponse(res, 'Gagal mengambil prestasi', err);
  }
};

// ===== UPDATE PRESTASI =====
exports.updateAchievement = async (req, res) => {
  // --- CEK VALIDASI DI SINI ---
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false, 
      message: 'Validasi Gagal', 
      errors: errors.array() 
    });
  }
  // ----------------------------

  try {
    const achievementData = req.body;

    if (req.file) {
      achievementData.image = req.file.path; // URL Cloudinary
    }

    const updatedAchievement = await Achievement.findByIdAndUpdate(
      req.params.id,
      achievementData,
      { new: true } 
    );

    if (!updatedAchievement) {
      return errorResponse(res, 'Prestasi tidak ditemukan');
    }

    return successResponse(res, 'Prestasi berhasil diupdate', updatedAchievement);
  } catch (err) {
    return errorResponse(res, 'Gagal mengupdate prestasi', err);
  }
};

// ===== DELETE PRESTASI =====
exports.deleteAchievement = async (req, res) => {
  try {
    const deletedAchievement = await Achievement.findByIdAndDelete(req.params.id);
    if (!deletedAchievement) {
      return errorResponse(res, 'Prestasi tidak ditemukan');
    }
    return successResponse(res, 'Prestasi berhasil dihapus', deletedAchievement);
  } catch (err) {
    return errorResponse(res, 'Gagal menghapus prestasi', err);
  }
};