# Eksplora - Aplikasi Pemesanan Tiket Wisata 🌏

**Eksplora** adalah aplikasi frontend berbasis web yang memudahkan pengguna untuk menelusuri destinasi wisata, melihat detail fasilitas, membaca ulasan, dan melakukan pemesanan tiket secara online. Proyek ini dibangun dengan pendekatan modern menggunakan **Vanilla JavaScript** (ES Modules) dan **Tailwind CSS 4**.

## 🚀 Fitur Utama

- **Jelajahi Destinasi**: Temukan berbagai tempat wisata menarik dengan tampilan visual yang memukau.
- **Detail Lengkap**: Lihat galeri foto, deskripsi, fasilitas, dan lokasi destinasi.
- **Sistem Ulasan**: Baca pengalaman pengunjung lain atau tulis ulasan Anda sendiri (memerlukan login).
- **Pemesanan Tiket**: Pilih tanggal kunjungan dan jumlah tiket dengan mudah.
- **Pembayaran**: Simulasi metode pembayaran transfer bank dan QRIS.
- **Desain Responsif**: Tampilan yang optimal di perangkat desktop, tablet, dan mobile.

## 🛠️ Teknologi yang Digunakan

![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white) ![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white) ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=F7DF1E)

- **HTML5**: Struktur semantik halaman web.
- **Tailwind CSS v4.1**: Framework CSS <i>utility-first</i> untuk styling yang cepat dan modern.
- **Vanilla JavaScript (ES Modules)**: Logika aplikasi yang modular tanpa framework JS berat.
- **Google Fonts**: Menggunakan _Plus Jakarta Sans_ dan _Playfair Display_.

## 📂 Struktur Proyek

Proyek ini menggunakan struktur modular untuk memudahkan pengembangan:

```
res-fe-user/
├── src/
│   ├── features/       # Komponen logika per fitur (navbar, hero, booking, dll)
│   ├── css/            # Konfigurasi dan output CSS
│   └── js/             # Utilitas global
├── assets/             # Gambar dan aset statis
├── index.html          # Halaman Utama
├── detail.html         # Halaman Detail Wisata
├── booking.html        # Halaman Konfirmasi Pesanan
├── profile.html        # Halaman Profil Pengguna
└── ...
```

## 💻 Cara Menjalankan Proyek

Ikuti langkah-langkah berikut untuk menjalankan proyek ini di komputer lokal Anda:

### 1. Prasyarat

Pastikan Anda telah menginstal **Node.js** (untuk manajemen paket Tailwind CSS).

### 2. Instalasi Dependensi

Buka terminal di direktori proyek dan jalankan perintah berikut untuk menginstal Tailwind CSS:

```bash
npm install
```

### 3. Generate CSS

Jalankan perintah berikut untuk memantau perubahan file dan men-generate file CSS secara otomatis:

```bash
npm run dev
```

### 4. Buka Aplikasi

Karena proyek ini menggunakan ES Modules, Anda disarankan menggunakan **Live Server** (ekstensi VS Code) atau server lokal lainnya untuk membuka file `index.html`. Membuka file secara langsung (file protocol) mungkin akan menyebabkan error CORS pada modul module script.

## 📝 Skrip Tersedia

- `npm run dev`: Menjalankan Tailwind CSS dalam mode _watch_ (pengembangan).
- `npm run build`: Membuild Tailwind CSS untuk produksi (minify).

## 📄 Lisensi

Proyek ini dibuat untuk keperluan tugas responsi Pemrograman Web Dinamis.

---

_Dibuat dengan ❤️ oleh Tim Pengembang Eksplora._
