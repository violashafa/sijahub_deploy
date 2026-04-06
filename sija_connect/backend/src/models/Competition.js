const mongoose = require('mongoose');

const competitionSchema = new mongoose.Schema(
  {
    judul: {
      type: String,
      required: true,
      trim: true
    },

    kategoriPeserta: {
      type: [String], 
      required: true
    },

    kategoriLomba: {
      type: String, 
      required: true
    },

    deskripsiSingkat: {
      type: String,
      required: true
    },

    deskripsiLengkap: {
      type: String,
      required: true
    },

    biaya: {
      type: Number,
      default: 0
    },

    tanggalMulai: {
      type: Date,
      required: true
    },

    tanggalSelesai: {
      type: Date,
      required: true
    },

    tempat: {
      type: String, // Online / Offline / Hybrid
      required: true
    },

    penyelenggara: {
      type: String,
      required: true
    },

    linkDaftar: {
      type: String,
      required: true
    },

    poster: {
      type: String
    },

    usersWhoSaved: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' 
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Competition', competitionSchema);