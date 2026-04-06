const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    judul: { type: String, required: true, trim: true }, 
    logo: { type: String },
    perusahaan: { type: String, required: true },
    lokasi: { type: String, required: true },
    posisi: { type: String, required: true },
    jamKerja: { type: String },
    gaji: { type: String },
    kategori: { type: String },
    deadline: { type: String }, 
    tipe: {
      type: String,
      enum: ['Full Time', 'Part Time', 'Internship', 'Freelance'],
      required: true
    },
    deskripsi: { type: String, required: true },
    linkDaftar: { type: String },
    status: { type: String, enum: ['aktif', 'tutup'], default: 'aktif' },
    // PERUBAHAN DISINI: Simpan ID User yang nge-bookmark
    usersWhoSaved: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

jobSchema.virtual('postedDays').get(function () {
  const now = new Date();
  const created = new Date(this.createdAt);
  const diffTime = Math.abs(now - created);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

module.exports = mongoose.model('Job', jobSchema);