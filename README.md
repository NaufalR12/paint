# Aplikasi Paint 2D - Grafika Komputer

Aplikasi web paint sederhana yang dibuat sebagai bagian dari tugas mata kuliah Grafika Komputer. Aplikasi ini memungkinkan pengguna untuk menggambar berbagai bentuk geometris dasar, menerapkan transformasi, dan menggunakan berbagai algoritma grafika komputer langsung di browser.

## Fitur Utama

- **Menggambar Bentuk Dasar**: Pengguna dapat menggambar objek seperti:

  - Pen (Menggambar bebas mengikuti kursor)
  - Garis
  - Persegi
  - Segitiga
  - Lingkaran
  - Elips
  - Jajargenjang
  - Trapesium

- **Pilihan Algoritma**: Aplikasi ini mengimplementasikan beberapa algoritma klasik grafika komputer:

  - **Garis**: DDA dan Bresenham.
  - **Lingkaran**: Midpoint Circle dan Simetris 8 Titik.
  - **Elips**: Midpoint Ellipse dan Simetris 4 Titik.

- **Kustomisasi Garis dan Brush**:

  - **Jenis Garis**: Garis Biasa (Solid), Garis Putus-putus (Dashed), Garis Titik-titik (Dotted), dan Garis Kombinasi (Dash-dot).
  - **Ketebalan Garis**: Dapat disesuaikan menggunakan slider.
  - **Jenis Brush**: Berbagai jenis kuas seperti Pena, Pensil, Spidol, dan Cat Air.

- **Transformasi Objek**:

  - Pilih objek yang sudah ada di kanvas.
  - Terapkan transformasi 2D: Translasi, Rotasi, Skala, Refleksi, dan Shear.

- **Manajemen Objek**:

  - **Mode Pilih**: Memungkinkan pengguna untuk memilih, memindahkan, dan memodifikasi objek.
  - **Duplikat**: Menggandakan objek yang dipilih.
  - **Hapus**: Menghapus objek yang dipilih.

- **Fitur Lainnya**:
  - **Pewarnaan**: Pilih warna garis dan warna isi untuk objek.
  - **Isi Area (Fill)**: Mengisi area tertutup menggunakan beberapa algoritma (misalnya, Scan-Line, Boundary Fill).
  - **Reset Kanvas**: Menghapus semua objek dari kanvas.

## Teknologi yang Digunakan

Proyek ini dibangun sepenuhnya menggunakan teknologi web dasar:

- **HTML5**: Untuk struktur dan markup konten.
- **CSS3**: Untuk styling dan layout.
- **JavaScript (ES6+)**: Untuk semua logika fungsional, interaktivitas, dan implementasi algoritma.

Tidak ada framework atau library eksternal yang digunakan.

## Cara Menjalankan Aplikasi

Aplikasi ini adalah proyek statis dan tidak memerlukan instalasi atau proses build.

1.  Pastikan Anda memiliki semua file proyek dalam satu direktori.
2.  Buka file `index.html` langsung di browser web modern (seperti Google Chrome, Mozilla Firefox, atau Microsoft Edge).
3.  Aplikasi siap digunakan.

## Struktur Proyek

```
TA-grafkom/
├── css/
│   └── gaya.css         # File styling utama
├── js/
│   ├── algoritma/       # Implementasi algoritma (Bresenham, DDA, dll.)
│   ├── canvas/          # Logika event dan penggambaran di kanvas
│   ├── transformasi/    # Logika untuk transformasi objek
│   ├── ui/              # Handler untuk interaksi menu dan UI
│   └── utama.js         # Titik masuk utama, inisialisasi global
├── index.html           # File HTML utama
└── README.md            # Dokumentasi proyek
```

## Pembuat

Dibuat oleh Naufal Rafid Muhammad Faddila (123220052) © 2025
