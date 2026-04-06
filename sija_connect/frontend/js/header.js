function updateNavbarByRole() {
    let rawRole = localStorage.getItem("userRole");
    const role = rawRole ? rawRole.trim().toLowerCase() : 'guest'; 
    const userName = localStorage.getItem("userName") || "User";
    const userAvatar = localStorage.getItem("userAvatar") || `https://ui-avatars.com/api/?name=${userName}&background=random`; 

    const menuNav = document.getElementById('navMenu');
    if (!menuNav) return;

    const profileSection = (role !== 'guest') ? `
        <a href="profile.html" class="profile-link" style="display:flex; align-items:center; gap:10px;">
            <div style="width:32px; height:32px; border-radius:50%; overflow:hidden; border:2px solid #fff; flex-shrink:0;">
                <img src="${userAvatar}" alt="Profile" style="width:100%; height:100%; object-fit:cover;">
            </div>
            <div style="display:flex; flex-direction:column; line-height:1.1;">
                <span style="font-size:12px; color:white; font-weight:bold;">${userName.toUpperCase()}</span>
                <span class="user-badge ${role === 'admin' ? 'admin-badge' : 'user-info-badge'}" style="font-size:9px;">${role.toUpperCase()}</span>
            </div>
        </a>
    ` : "";

    let menuItems = "";

    // Menu Item Dasar (Common)
    const baseMenu = `
        <a href="index.html">Beranda</a>
        <a href="${role === 'admin' ? 'daftar_siswa.html' : 'view_daftarsiswa.html'}">Daftar Siswa</a>
        <a href="${role === 'admin' ? 'prestasi.html' : 'view_prestasi.html'}">Prestasi</a>
        <a href="${role === 'admin' ? 'info_lomba.html' : 'view_infolomba.html'}">Info Lomba</a>
        <a href="${role === 'admin' ? 'info_loker.html' : 'view_infoloker.html'}">Info Loker</a>
    `;

    if (role === 'guest') {
        menuItems = `
            ${baseMenu}
            <a href="login.html" style="background:white; color:#138496 !important; font-weight:bold; text-align:center;">Login</a>
        `;
    } else {
        // Gabungkan: Menu Utama + Profil + Logout
        menuItems = `
            ${baseMenu}
            ${profileSection}
            <a href="javascript:void(0)" onclick="logout()" class="logout-btn">LOGOUT</a>
        `;
    }

    menuNav.innerHTML = menuItems;
    setActiveMenu();
    initMobileMenu();
}

function initMobileMenu() {
    const hamburger = document.getElementById('hamburgerBtn');
    const menu = document.getElementById('navMenu');
    const overlay = document.getElementById('headerOverlay');
    const links = document.querySelectorAll('.menu a');

    hamburger.onclick = (e) => {
        e.stopPropagation();
        hamburger.classList.toggle('open');
        menu.classList.toggle('active');
        overlay.classList.toggle('active');
    };

    overlay.onclick = () => {
        hamburger.classList.remove('open');
        menu.classList.remove('active');
        overlay.classList.remove('active');
    };

    links.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('open');
            menu.classList.remove('active');
            overlay.classList.remove('active');
        });
    });
}

function logout() {
    if (confirm("Halo, yakin ingin logout?")) {
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
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    setTimeout(updateNavbarByRole, 100);
});