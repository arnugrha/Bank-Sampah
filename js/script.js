// Fungsi untuk inisialisasi saat halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
    // Inisialisasi semua komponen
    initMobileMenu();
    initScrollAnimation();
    highlightActiveMenu();
    initHoverEffects();
    
    // Jika di halaman harga, inisialisasi kalkulator
    if (window.location.pathname.includes('harga.html')) {
        initKalkulator();
    }
    
    // Jika di halaman layanan, inisialisasi tombol info
    if (window.location.pathname.includes('layanan.html')) {
        initInfoButtons();
    }
    
    console.log('Website Bank Sampah siap digunakan!');
});

// Fungsi untuk menu mobile (hamburger)
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            // Ubah ikon hamburger menjadi X ketika aktif
            const icon = hamburger.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
        
        // Tutup menu mobile saat mengklik link di dalamnya
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                const icon = hamburger.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });
    }
}

// Fungsi untuk animasi saat scroll
function initScrollAnimation() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Untuk elemen dengan kelas slide-up, tambahkan animasi
                if (entry.target.classList.contains('slide-up')) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            }
        });
    }, observerOptions);
    
    // Amati semua elemen dengan kelas slide-up
    const slideUpElements = document.querySelectorAll('.slide-up');
    slideUpElements.forEach(el => {
        // Setel properti awal untuk animasi
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        
        observer.observe(el);
    });
    
    // Amati elemen dengan kelas fade-in
    const fadeInElements = document.querySelectorAll('.fade-in');
    fadeInElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transition = 'opacity 1s ease';
        
        observer.observe(el);
        
        // Trigger animasi setelah sedikit delay untuk hero section
        if (el.classList.contains('hero-content')) {
            setTimeout(() => {
                el.style.opacity = '1';
            }, 300);
        }
    });
}

// Fungsi untuk highlight menu aktif berdasarkan halaman saat ini
function highlightActiveMenu() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        // Hapus kelas aktif dari semua link
        link.classList.remove('active');
        
        // Periksa apakah link mengarah ke halaman saat ini
        const linkHref = link.getAttribute('href');
        
        // Jika link mengarah ke halaman saat ini, tambahkan kelas aktif
        if (linkHref === currentPage) {
            link.classList.add('active');
        }
        
        // Untuk halaman index (beranda)
        if (currentPage === '' || currentPage === 'index.html') {
            const homeLink = document.querySelector('a[href="index.html"]');
            if (homeLink) {
                homeLink.classList.add('active');
            }
        }
    });
}

// Fungsi untuk efek hover pada card dan tombol
function initHoverEffects() {
    // Efek hover untuk semua card
    const cards = document.querySelectorAll('.card, .layanan-card, .kategori-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Efek hover untuk tombol
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            if (this.classList.contains('btn-primary') || this.classList.contains('btn-large')) {
                this.style.transform = 'translateY(-3px)';
            }
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Efek hover untuk baris tabel
    const tableRows = document.querySelectorAll('.harga-table tbody tr');
    tableRows.forEach(row => {
        row.addEventListener('mouseenter', function() {
            this.style.backgroundColor = 'rgba(76, 175, 80, 0.05)';
        });
        
        row.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '';
        });
    });
}

// Fungsi untuk kalkulator di halaman harga
function initKalkulator() {
    // Setel hasil kalkulator ke hidden secara default
    const hasilKalkulasi = document.getElementById('hasilKalkulasi');
    if (hasilKalkulasi) {
        hasilKalkulasi.style.display = 'none';
    }
}

// Fungsi untuk menghitung nilai sampah
function hitungNilai() {
    const jenisSampah = document.getElementById('jenisSampah');
    const beratSampah = document.getElementById('beratSampah');
    const hasilKalkulasi = document.getElementById('hasilKalkulasi');
    const nilaiSampah = document.getElementById('nilaiSampah');
    
    if (!jenisSampah || !beratSampah || !hasilKalkulasi || !nilaiSampah) {
        console.error('Elemen kalkulator tidak ditemukan!');
        return;
    }
    
    // Ambil nilai dari input
    const hargaPerKg = parseInt(jenisSampah.value);
    const berat = parseFloat(beratSampah.value);
    
    // Validasi input
    if (isNaN(berat) || berat <= 0) {
        alert('Masukkan berat sampah yang valid (lebih dari 0 kg)');
        beratSampah.focus();
        return;
    }
    
    // Hitung nilai sampah
    const totalNilai = hargaPerKg * berat;
    
    // Format angka ke Rupiah
    const formatter = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    });
    
    // Tampilkan hasil
    nilaiSampah.textContent = formatter.format(totalNilai);
    hasilKalkulasi.style.display = 'block';
    
    // Tambahkan animasi pada hasil
    hasilKalkulasi.style.opacity = '0';
    hasilKalkulasi.style.transform = 'translateY(10px)';
    
    setTimeout(() => {
        hasilKalkulasi.style.opacity = '1';
        hasilKalkulasi.style.transform = 'translateY(0)';
        hasilKalkulasi.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    }, 10);
}

// Fungsi untuk menampilkan info detail layanan
function showInfo(layanan) {
    let judul = '';
    let deskripsi = '';
    
    switch(layanan) {
        case 'setor':
            judul = 'Setor Sampah';
            deskripsi = 'Sistem setor sampah kami menerima berbagai jenis sampah yang telah dipilah. Anda dapat membawa sampah ke lokasi bank sampah terdekat pada jam operasional. Pastikan sampah sudah dalam kondisi bersih dan kering.';
            break;
        case 'timbang':
            judul = 'Penimbangan Sampah';
            deskripsi = 'Penimbangan dilakukan dengan timbangan digital yang terkalibrasi untuk memastikan keakuratan. Hasil penimbangan akan dicatat dalam buku tabungan atau sistem digital kami. Proses ini dilakukan secara transparan di depan nasabah.';
            break;
        case 'edukasi':
            judul = 'Edukasi Lingkungan';
            deskripsi = 'Kami menyelenggarakan workshop, seminar, dan program edukasi tentang pengelolaan sampah, daur ulang, dan lingkungan hidup. Program ini terbuka untuk umum, sekolah, dan komunitas. Jadwal dapat dilihat di informasi terbaru kami.';
            break;
        case 'tukar':
            judul = 'Penukaran Sampah';
            deskripsi = 'Setelah sampah ditimbang, nilai sampah akan dikonversi menjadi poin atau uang tunai. Poin dapat ditukar dengan berbagai barang kebutuhan sehari-hari di koperasi bank sampah atau dikonversi menjadi uang.';
            break;
        default:
            judul = 'Informasi Layanan';
            deskripsi = 'Informasi detail tentang layanan ini.';
    }
    
    // Tampilkan alert dengan informasi
    alert(`${judul}\n\n${deskripsi}\n\nUntuk informasi lebih lanjut, silakan hubungi kami di (021) 1234-5678 atau kunjungi langsung bank sampah terdekat.`);
}

// Fungsi untuk menangani scroll halus
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scroll untuk link anchor (jika ada di masa depan)
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
});