const Job = require('../models/Job');
const { successResponse, errorResponse } = require('../utils/response');

// 1. CREATE (Admin Only)
exports.createJob = async (req, res) => {
  try {
    const data = { 
        ...req.body, 
        judul: req.body.posisi, 
        logo: req.file ? req.file.path : null 
    };
    const job = await Job.create(data);
    return successResponse(res, 'Info loker berhasil ditambahkan', job);
  } catch (err) {
    return errorResponse(res, 'Gagal menambahkan info loker', err.message);
  }
};

// 2. READ ALL (Bisa Tamu / User)
exports.getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    
    // Logika IsSaved Dinamis berdasarkan User Login
    const currentUserId = req.user ? (req.user.id || req.user._id) : null;
    const customizedJobs = jobs.map(job => {
      const jobObj = job.toObject();
      jobObj.isSaved = currentUserId ? job.usersWhoSaved.includes(currentUserId) : false;
      delete jobObj.usersWhoSaved; 
      return jobObj;
    });

    return successResponse(res, 'Daftar info loker', customizedJobs);
  } catch (err) {
    return errorResponse(res, 'Gagal mengambil info loker', err.message);
  }
};

// 3. TOGGLE SAVE (User Only) - BAGIAN PALING PENTING!
exports.toggleSaveJob = async (req, res) => {
  try {
    // Ambil ID dari token (support .id atau ._id)
    const userId = req.user.id || req.user._id; 
    
    const job = await Job.findById(req.params.id);
    if (!job) return errorResponse(res, 'Info loker tidak ditemukan', null, 404);

    // Pastikan array usersWhoSaved sudah ada
    if (!job.usersWhoSaved) job.usersWhoSaved = [];

    const index = job.usersWhoSaved.indexOf(userId);
    
    if (index === -1) {
      // Jika belum ada, maka SIMPAN
      job.usersWhoSaved.push(userId);
      await job.save();
      // BALIKIN STATUS isSaved: true BIAR FRONTEND GAK ERROR
      return successResponse(res, 'Loker berhasil disimpan', { isSaved: true });
    } else {
      // Jika sudah ada, maka HAPUS (Unsave)
      job.usersWhoSaved.splice(index, 1);
      await job.save();
      // BALIKIN STATUS isSaved: false
      return successResponse(res, 'Simpanan loker dihapus', { isSaved: false });
    }
  } catch (err) {
    console.error("Error Toggle Save:", err.message);
    return errorResponse(res, 'Gagal memproses simpanan', err.message);
  }
};

// 4. READ SAVED ONLY (Halaman Koleksi Simpanan)
exports.getSavedJobs = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const savedJobs = await Job.find({ usersWhoSaved: userId }).sort({ createdAt: -1 });
    
    // Paksa isSaved jadi true agar UI frontend menampilkan icon tersimpan
    const data = savedJobs.map(job => {
        const jobObj = job.toObject();
        jobObj.isSaved = true;
        return jobObj;
    });

    return successResponse(res, 'Daftar loker yang kamu simpan', data);
  } catch (err) {
    return errorResponse(res, 'Gagal mengambil data', err.message);
  }
};

// 5. READ BY ID (Detail Loker)
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return errorResponse(res, 'Loker tidak ditemukan', null, 404);
    
    const jobObj = job.toObject();
    const currentUserId = req.user ? (req.user.id || req.user._id) : null;
    jobObj.isSaved = currentUserId ? job.usersWhoSaved.includes(currentUserId) : false;
    delete jobObj.usersWhoSaved;

    return successResponse(res, 'Detail info loker', jobObj);
  } catch (err) {
    return errorResponse(res, 'Gagal mengambil detail loker', err.message);
  }
};

// 6. UPDATE (Admin Only)
exports.updateJob = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.body.posisi) data.judul = req.body.posisi; 
    if (req.file) data.logo = req.file.path;

    const job = await Job.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    if (!job) return errorResponse(res, 'Loker tidak ditemukan', null, 404);
    
    return successResponse(res, 'Info loker berhasil diperbarui', job);
  } catch (err) {
    return errorResponse(res, 'Gagal memperbarui info loker', err.message);
  }
};

// 7. DELETE (Admin Only)
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return errorResponse(res, 'Loker tidak ditemukan', null, 404);
    return successResponse(res, 'Info loker berhasil dihapus');
  } catch (err) {
    return errorResponse(res, 'Gagal menghapus info loker', err.message);
  }
};