const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema(
  {
    namaLengkap: {
      type: String,
      required: [true, 'Nama lengkap wajib diisi'],
      trim: true,
      minlength: [3, 'Nama minimal 3 karakter']
    },
    kelas: {
      type: String,
      required: [true, 'Kelas wajib diisi'],
      trim: true
    },
    angkatan: {
      type: String,
      required: [true, 'Angkatan wajib diisi'],
      match: [/^\d{2}$/, 'Angkatan harus berupa 2 digit (contoh: 50)']
    },
    status: {
      type: String,
      enum: {
        values: ['siswa', 'alumni'],
        message: 'Status hanya boleh: siswa atau alumni'
      },
      required: [true, 'Status wajib diisi']
    },
    foto: {
      type: String,
      default: 'https://res.cloudinary.com/dbv7mdf4v/image/upload/v123456/default-profile.png'
    },
    tahunLulus: {
      type: Number,
      // Validasi dinamis: tahun lulus tidak boleh lebih kecil dari tahun angkatan
      validate: {
        validator: function(val) {
          return !this.angkatan || val >= parseInt(this.angkatan);
        },
        message: 'Tahun lulus tidak masuk akal!'
      }
    },
    aktivitas: {
      type: String,
      default: '-',
      maxlength: [100, 'Aktivitas maksimal 100 karakter']
    },
    instansi: {
      type: String,
      trim: true,
      default: '-'
    },
    mediaSosial: {
      instagram: {
        type: String,
        trim: true,
        // Validasi format link instagram sederhana
        match: [/^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/, 'Username Instagram tidak valid']
      }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Student', StudentSchema);