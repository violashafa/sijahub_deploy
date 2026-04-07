const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const uploadToCloud = require('../middlewares/uploadCloudinary'); 
const { verifyToken } = require('../middlewares/authMiddleware');

// Middleware Validasi Register
const validateRegister = [
    body('firstname').notEmpty().withMessage('Nama depan wajib diisi'),
    body('email').isEmail().withMessage('Format email tidak valid'),
    body('password').isLength({ min: 6 }).withMessage('Password minimal 6 karakter'),
];

// Middleware Validasi Login
const validateLogin = [
    body('email').isEmail().withMessage('Format email tidak valid'),
    body('password').notEmpty().withMessage('Password wajib diisi'),
];

// API REGISTER
router.post('/register', validateRegister, async (req, res, next) => { 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
        const { firstname, lastname, email, password, adminCode } = req.body;

        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "Email sudah terdaftar!" });

        const userCount = await User.countDocuments();
        let userRole = (userCount === 0 || adminCode === "SIJA123") ? 'admin' : 'user';

        user = new User({ firstname, lastname, email, password, role: userRole });
        await user.save(); 

        res.status(201).json({ success: true, message: `Berhasil Daftar sebagai ${userRole}!` });
    } catch (err) {
        next(err); 
    }
});

// API LOGIN
router.post('/login', validateLogin, async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Email atau Password salah!" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Email atau Password salah!" });

        const token = jwt.sign(
            { id: user._id, role: user.role }, 
            process.env.JWT_SECRET || 'rahasia_ilahi', 
            { expiresIn: '1d' }
        );

        res.json({ 
            success: true,
            message: "Login Berhasil!",
            token, 
            user: { 
                id: user._id, 
                firstname: user.firstname, 
                role: user.role,
                avatar: user.avatar || "" 
            } 
        });
    } catch (err) {
        next(err);
    }
});

// API GET PROFILE
router.get('/profile', verifyToken, async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json({ success: true, data: user });
    } catch (err) {
        next(err);
    }
});

// API UPDATE PROFILE
router.put('/update-profile', verifyToken, uploadToCloud('profiles').single('avatar'), async (req, res, next) => {
    try {
        const { firstname, lastname, email, oldPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

        if (newPassword && newPassword.trim() !== "") {
            if (!oldPassword) {
                return res.status(400).json({ message: "Masukkan password lama untuk mengganti password baru!" });
            }
            const isMatch = await bcrypt.compare(oldPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: "Password lama salah!" });
            }
            user.password = newPassword; 
        }

        if (firstname) user.firstname = firstname;
        if (lastname) user.lastname = lastname;
        if (email) user.email = email;
        if (req.file) user.avatar = req.file.path;

        await user.save();
        
        res.json({ 
            success: true, 
            message: "Profil diperbarui!",
            user: { 
                firstname: user.firstname, 
                avatar: user.avatar 
            } 
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router;