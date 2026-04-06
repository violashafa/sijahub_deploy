const jwt = require('jsonwebtoken');

// 1. Middleware untuk mengecek apakah user sudah login (WAJIB LOGIN)
// Digunakan untuk fitur simpan, tambah lomba, dll.
exports.verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Akses ditolak! Anda belum login." });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET || 'rahasia_ilahi');
        req.user = verified; 
        next();
    } catch (err) {
        res.status(403).json({ message: "Token tidak valid atau sudah kadaluwarsa!" });
    }
};

// 2. Middleware OPSIONAL (BISA TAMU, BISA USER)
// Digunakan untuk view_infolomba agar tamu tetap bisa lihat data tapi isSaved false
exports.optionalAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        // Jika tidak ada token, lanjut sebagai tamu (req.user kosong)
        return next();
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET || 'rahasia_ilahi');
        req.user = verified; 
        next();
    } catch (err) {
        // Jika token error, tetap lanjut sebagai tamu
        next();
    }
};

// 3. Middleware khusus untuk mengecek apakah user adalah Admin
exports.isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: "Akses khusus Admin! Anda tidak diizinkan." });
    }
};