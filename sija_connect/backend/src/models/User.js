const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' },
    avatar: { type: String, default: '' } 
});

// Middleware: Hashing Password dengan Try-Catch agar Error terdeteksi
UserSchema.pre('save', async function(next) {
    // 1. Jika password tidak diubah, langsung lanjut
    if (!this.isModified('password')) {
        return next();
    }

    try {
        // 2. Proses Hashing
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        
        // 3. Panggil next() tanpa argumen jika sukses
        next();
    } catch (err) {
        // 4. Kirim error ke errorHandler jika gagal
        next(err);
    }
});

module.exports = mongoose.model('User', UserSchema);