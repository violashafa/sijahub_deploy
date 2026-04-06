const Competition = require('../models/Competition');
const { successResponse, errorResponse } = require('../utils/response');

// ================== CREATE ==================
exports.createCompetition = async (req, res) => {
  try {
    let kategoriPeserta = [];
    if (req.body.kategoriPeserta) {
      if (Array.isArray(req.body.kategoriPeserta)) {
        kategoriPeserta = req.body.kategoriPeserta;
      } else if (typeof req.body.kategoriPeserta === 'string') {
        try {
          kategoriPeserta = JSON.parse(req.body.kategoriPeserta);
        } catch {
          kategoriPeserta = req.body.kategoriPeserta.split(',');
        }
      }
    }

    const competition = new Competition({
      judul: req.body.judul,
      kategoriPeserta,
      kategoriLomba: req.body.kategoriLomba,
      deskripsiSingkat: req.body.deskripsiSingkat,
      deskripsiLengkap: req.body.deskripsiLengkap,
      biaya: req.body.biaya,
      tanggalMulai: req.body.tanggalMulai,
      tanggalSelesai: req.body.tanggalSelesai,
      tempat: req.body.tempat,
      penyelenggara: req.body.penyelenggara,
      linkDaftar: req.body.linkDaftar,
      poster: req.file ? req.file.path : null
    });

    await competition.save();
    return successResponse(res, 'Lomba berhasil ditambahkan', competition, 201);
  } catch (err) {
    return errorResponse(res, err.message, null, 400);
  }
};

// ================== READ ALL (PENTING: Cek isSaved Per User) ==================
exports.getCompetitions = async (req, res) => {
  try {
    const competitions = await Competition.find().sort({ createdAt: -1 });
    
    // JWT kamu menyimpan ID dengan nama 'id'. Kita ambil itu.
    const userId = req.user ? req.user.id : null;

    const data = competitions.map(comp => {
      const compObj = comp.toObject();
      
      // Cek apakah ID user ada di array usersWhoSaved
      compObj.isSaved = userId && comp.usersWhoSaved 
        ? comp.usersWhoSaved.some(uid => uid.toString() === userId.toString()) 
        : false;
        
      return compObj;
    });

    return successResponse(res, 'Daftar lomba', data);
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

// ================== READ DETAIL ==================
exports.getCompetitionById = async (req, res) => {
  try {
    const data = await Competition.findById(req.params.id);
    if (!data) return errorResponse(res, 'Lomba tidak ditemukan', null, 404);

    const userId = req.user ? (req.user._id || req.user.id) : null;
    const dataObj = data.toObject();
    
    dataObj.isSaved = userId 
        ? (data.usersWhoSaved && data.usersWhoSaved.some(uid => uid.toString() === userId.toString())) 
        : false;

    return successResponse(res, 'Detail lomba', dataObj);
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

// ================== UPDATE ==================
exports.updateCompetition = async (req, res) => {
  try {
    let kategoriPeserta = [];
    if (req.body.kategoriPeserta) {
      if (Array.isArray(req.body.kategoriPeserta)) {
        kategoriPeserta = req.body.kategoriPeserta;
      } else if (typeof req.body.kategoriPeserta === 'string') {
        try {
          kategoriPeserta = JSON.parse(req.body.kategoriPeserta);
        } catch {
          kategoriPeserta = req.body.kategoriPeserta.split(',');
        }
      }
    }

    const data = {
      judul: req.body.judul,
      kategoriPeserta,
      kategoriLomba: req.body.kategoriLomba,
      deskripsiSingkat: req.body.deskripsiSingkat,
      deskripsiLengkap: req.body.deskripsiLengkap,
      biaya: req.body.biaya,
      tanggalMulai: req.body.tanggalMulai,
      tanggalSelesai: req.body.tanggalSelesai,
      tempat: req.body.tempat,
      penyelenggara: req.body.penyelenggara,
      linkDaftar: req.body.linkDaftar
    };

    if (req.file) data.poster = req.file.path;

    const updated = await Competition.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!updated) return errorResponse(res, 'Lomba tidak ditemukan', null, 404);

    return successResponse(res, 'Lomba berhasil diperbarui', updated);
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

// ================== DELETE ==================
exports.deleteCompetition = async (req, res) => {
  try {
    const deleted = await Competition.findByIdAndDelete(req.params.id);
    if (!deleted) return errorResponse(res, 'Lomba tidak ditemukan', null, 404);
    return successResponse(res, 'Lomba berhasil dihapus', deleted);
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

// ================== TOGGLE SAVE ==================
exports.toggleSaveCompetition = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id; 
    
    if (!userId) return errorResponse(res, "User ID tidak ditemukan dalam token", null, 401);

    const competition = await Competition.findById(req.params.id);
    if (!competition) return errorResponse(res, 'Lomba tidak ditemukan', null, 404);

    if (!competition.usersWhoSaved) competition.usersWhoSaved = [];

    const userIndex = competition.usersWhoSaved.findIndex(uid => uid.toString() === userId.toString());

    if (userIndex === -1) {
      competition.usersWhoSaved.push(userId);
    } else {
      competition.usersWhoSaved.splice(userIndex, 1);
    }

    await competition.save();
    return successResponse(res, 'Status diperbarui', { isSaved: userIndex === -1 });
  } catch (err) {
    return errorResponse(res, err.message);
  }
};