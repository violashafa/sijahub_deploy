const Student = require('../models/Student');
const { successResponse } = require('../utils/response');

exports.createStudent = async (req, res, next) => {
  try {
    const studentData = { ...req.body };

    if (req.file) {
      studentData.foto = req.file.path; // URL otomatis dari Cloudinary
    }

    // Mapping media sosial dari flat body ke object
    if (req.body.instagram) {
      studentData.mediaSosial = { instagram: req.body.instagram };
    }

    const student = new Student(studentData);
    await student.save();

    return successResponse(res, 'Data siswa berhasil ditambahkan', student, 201);
  } catch (error) {
    next(error);
  }
};

exports.getAllStudents = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, status, kelas, angkatan } = req.query;
    const skip = (page - 1) * limit;

    const query = {};
    if (search) query.namaLengkap = { $regex: search, $options: 'i' };
    if (status) query.status = status;
    if (kelas) query.kelas = kelas;
    if (angkatan) query.angkatan = angkatan;

    const total = await Student.countDocuments(query);
    const students = await Student.find(query)
      .sort({ namaLengkap: 1 }) // Urutkan nama A-Z
      .skip(skip)
      .limit(parseInt(limit));

    return successResponse(res, 'Data siswa berhasil diambil', {
      totalData: total,
      currentPage: parseInt(page),
      totalPage: Math.ceil(total / limit),
      data: students
    });
  } catch (error) {
    next(error);
  }
};

// READ siswa by ID
exports.getStudentById = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      const error = new Error('Data siswa tidak ditemukan');
      error.statusCode = 404;
      throw error;
    }
    return successResponse(res, 'Data siswa ditemukan', student);
  } catch (error) {
    next(error);
  }
};

// UPDATE data siswa
exports.updateStudent = async (req, res, next) => {
  try {
    const updateData = { ...req.body };

    if (req.file) {
      // UPDATE: Simpan URL Cloudinary, bukan path lokal
      updateData.foto = req.file.path;
    }

    if (req.body.instagram) {
      updateData.mediaSosial = { instagram: req.body.instagram };
    }

    if (updateData.tahunLulus === "") delete updateData.tahunLulus;

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    );

    if (!student) {
      const error = new Error('Data siswa tidak ditemukan');
      error.statusCode = 404;
      throw error;
    }

    return successResponse(
      res,
      'Data siswa berhasil diupdate',
      student
    );
  } catch (error) {
    next(error);
  }
};

// DELETE data siswa
exports.deleteStudent = async (req, res, next) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      const error = new Error('Data siswa tidak ditemukan');
      error.statusCode = 404;
      throw error;
    }
    return successResponse(res, 'Data siswa berhasil dihapus');
  } catch (error) {
    next(error);
  }
};