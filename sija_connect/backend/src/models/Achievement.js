const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },          
  fullDescription: { type: String },      
  date: { type: Date, required: true },
  image: { type: String },
  pemenang: { type: String }, 
  tingkat: { 
    type: String, 
    enum: ['Kota', 'Provinsi', 'Nasional', 'Internasional'],
    default: 'Kota'
  },
  kategoriLomba: { 
    type: String, 
    default: 'Lainnya'
  },
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  }]
}, { timestamps: true });

module.exports = mongoose.model('Achievement', achievementSchema);