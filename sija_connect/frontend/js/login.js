/* TRANSISI FORM */
const loginContainer = document.getElementById("login");
const registerContainer = document.getElementById("register");
const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");

function showRegister() {
    loginContainer.style.left = "-100%";
    registerContainer.style.right = "0";
    loginContainer.style.opacity = "0";
    registerContainer.style.opacity = "1";
    loginBtn.classList.remove("white-btn");
    registerBtn.classList.add("white-btn");
}

function showLogin() {
    loginContainer.style.left = "0";
    registerContainer.style.right = "-100%";
    loginContainer.style.opacity = "1";
    registerContainer.style.opacity = "0";
    registerBtn.classList.remove("white-btn");
    loginBtn.classList.add("white-btn");
}

/* INTEGRASI BACKEND */
const API_URL = "https://localhost:5000/api/auth"; 

async function handleLogin() {
    const email = document.getElementById("login-email").value;
    const pass = document.getElementById("login-password").value;
    const errorMsg = document.getElementById("error-msg");

    if (!email || !pass) {
        errorMsg.textContent = "Email dan Password wajib diisi!";
        return;
    }

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email, password: pass })
        });

        const data = await response.json();

        if (response.ok) {
            // Cukup hapus session lama saja
            localStorage.removeItem("token");
            localStorage.removeItem("userRole");
            localStorage.removeItem("userId");
            localStorage.removeItem("userName");
            localStorage.removeItem("userAvatar"); // Hapus avatar lama jika ada

            const role = data.user.role.toLowerCase().trim();

            // --- SIMPAN DATA BARU KE BROWSER ---
            localStorage.setItem("token", data.token); 
            localStorage.setItem("userRole", role); 
            localStorage.setItem("userName", data.user.firstname); 
            localStorage.setItem("userId", data.user.id); 
            localStorage.setItem("isLoggedIn", "true");
            
            // --- BARIS PENTING: SIMPAN FOTO PROFIL DARI CLOUDINARY ---
            if (data.user.avatar) {
                localStorage.setItem("userAvatar", data.user.avatar);
            }

            alert("Login Berhasil! Selamat datang " + data.user.firstname);

            if (role === 'admin') {
                window.location.href = "prestasi.html"; 
            } else {
                window.location.href = "index.html"; 
            }
        } else {
            errorMsg.textContent = data.message; 
        }
    } catch (err) {
        console.error(err);
        errorMsg.textContent = "Gagal terhubung ke server!";
    }
}

async function handleRegister() {
    const firstname = document.getElementById("reg-firstname").value;
    const lastname = document.getElementById("reg-lastname").value;
    const email = document.getElementById("reg-email").value;
    const password = document.getElementById("reg-password").value; 
    
    const adminCodeInput = document.getElementById("reg-admin-code");
    const adminCode = adminCodeInput ? adminCodeInput.value : ""; 

    try {
        const response = await fetch(`${API_URL}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                firstname, 
                lastname, 
                email, 
                password,
                adminCode: adminCode 
            })
        });

        const data = await response.json();

        if (response.ok) {
            alert(data.message); 
            showLogin(); 
        } else {
            alert("Gagal daftar: " + (data.error || "Terjadi kesalahan"));
        }
    } catch (err) {
        alert("Error koneksi ke server!");
    }
}

/* LOGIN SEBAGAI TAMU */
function loginAsGuest() {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userAvatar"); // Tamu tidak punya foto

    localStorage.setItem("userRole", "guest");
    localStorage.setItem("userName", "Tamu");
    localStorage.setItem("token", "GUEST_TOKEN");

    alert("Masuk sebagai Tamu. Akses terbatas.");
    window.location.href = "index.html";
}