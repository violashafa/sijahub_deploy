function updateNavbarByRole() {
    let rawRole = localStorage.getItem("userRole");
    const role = rawRole ? rawRole.trim().toLowerCase() : 'guest'; 
    const userName = localStorage.getItem("userName") || "User";
    
    // AMBIL URL LANGSUNG DARI CLOUDINARY (yang disimpan di localStorage)
    // Jika tidak ada, pakai foto default dari UI Avatar agar tetap online/cloud-based
    const userAvatar = localStorage.getItem("userAvatar") || `https://ui-avatars.com/api/?name=${userName}&background=random`; 

    const menuNav = document.getElementById('navMenu');
    
    if (!menuNav) return;
    menuNav.innerHTML = ""; 

    // Template Badge dengan Foto Profil Cloudinary
    const profileSection = `
        <a href="profile.html" style="text-decoration:none; display:flex; align-items:center; gap:10px;">
            <div class="profile-pic-container" style="width:35px; height:35px; border-radius:50%; overflow:hidden; border:2px solid #fff; box-shadow: 0 2px 5px rgba(0,0,0,0.2);">
                <img src="${userAvatar}" alt="Profile" style="width:100%; height:100%; object-fit:cover;">
            </div>
            <span class="user-badge ${role === 'admin' ? 'admin-badge' : 'user-info-badge'}">
                ${role.toUpperCase()} - ${userName.toUpperCase()}
            </span>
        </a>
    `;

    if (role === 'admin') {
        menuNav.innerHTML = `
            <a href="index.html">Beranda</a>
            <a href="daftar_siswa.html">Kelola Siswa</a>
            <a href="prestasi.html">Kelola Prestasi</a>
            <a href="info_lomba.html">Kelola Lomba</a>
            <a href="info_loker.html">Kelola Loker</a>
            ${profileSection}
            <a href="javascript:void(0)" onclick="logout()" class="logout-btn">LOGOUT</a>
        `;
    } else if (role === 'user') {
        menuNav.innerHTML = `
            <a href="index.html">Beranda</a>
            <a href="view_daftarsiswa.html">Daftar Siswa</a>
            <a href="view_prestasi.html">Prestasi</a>
            <a href="view_infolomba.html">Info Lomba</a>
            <a href="view_infoloker.html">Info Loker</a>
            ${profileSection}
            <a href="javascript:void(0)" onclick="logout()" class="logout-btn">LOGOUT</a>
        `;
    } else {
        menuNav.innerHTML = `
            <a href="index.html">Beranda</a>
            <a href="view_daftarsiswa.html">Daftar Siswa</a>
            <a href="view_prestasi.html">Prestasi</a>
            <a href="view_infolomba.html">Info Lomba</a>
            <a href="view_infoloker.html">Info Loker</a>
            <span class="user-badge guest-badge">GUEST</span>
            <a href="login.html" class="login-btn">Login</a>
        `;
    }
    setActiveMenu();
}

// Bagian logout & active menu tetap sama (tidak diubah)
function logout() {
    if (confirm("Halo " + (localStorage.getItem("userName") || "Admin") + ", yakin ingin logout?")) {
        localStorage.clear();
        window.location.href = "index.html";
    }
}

function setActiveMenu() {
    const currentPage = window.location.pathname.split('/').pop();
    const menuLinks = document.querySelectorAll('#navMenu a');
    menuLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (currentPage === href || (currentPage === "" && href === "index.html")) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Auto-hide scroll tetap sama
let lastScrollTop = 0;
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar'); 
    if (!navbar) return;
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop > 80) {
        if (scrollTop > lastScrollTop) navbar.classList.add('hidden');
        else navbar.classList.remove('hidden');
    } else navbar.classList.remove('hidden');
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});

document.addEventListener("DOMContentLoaded", () => {
    setTimeout(updateNavbarByRole, 100);
});