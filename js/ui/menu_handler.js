/**
 * Menangani logika untuk interaksi dengan menu dan UI.
 */

// Fungsi untuk memperbarui opsi dropdown algoritma berdasarkan bentuk yang dipilih
function perbaruiOpsiAlgoritma() {
  const pilihAlgoritma = document.getElementById("pilihAlgoritma");
  const panelAlgoritma = pilihAlgoritma.parentElement;
  const panelJenisGaris = document.getElementById("jenisGaris").parentElement;

  // Default: sembunyikan semua
  panelAlgoritma.style.display = "none";
  panelJenisGaris.style.display = "none";

  pilihAlgoritma.innerHTML = ""; // Kosongkan opsi

  if (jenisObjek === "garis") {
    panelAlgoritma.style.display = "flex";
    panelJenisGaris.style.display = "flex";
    pilihAlgoritma.innerHTML = `
      <option value="dda">DDA</option>
      <option value="bresenham">Bresenham</option>
    `;
    algoritmaTerpilih = pilihAlgoritma.value;
  } else if (jenisObjek === "lingkaran" || jenisObjek === "elips") {
    panelAlgoritma.style.display = "flex";
    panelJenisGaris.style.display = "flex";
    if (jenisObjek === "lingkaran") {
      pilihAlgoritma.innerHTML = `
        <option value="midpoint">Midpoint</option>
        <option value="simetris">Simetris Delapan Titik</option>
      `;
    } else {
      pilihAlgoritma.innerHTML = `
        <option value="midpoint_elips">Midpoint</option>
        <option value="simetris_empat_elips">Simetris Empat Titik</option>
      `;
    }
    algoritmaTerpilih = pilihAlgoritma.value;
  } else if (
    jenisObjek === "persegi" ||
    jenisObjek === "segitiga" ||
    jenisObjek === "jajargenjang" ||
    jenisObjek === "trapesium"
  ) {
    // Hanya tampilkan jenis garis untuk poligon
    panelJenisGaris.style.display = "flex";
  }
  // Untuk 'pena', kedua panel tetap tersembunyi (default)
}

// Fungsi untuk mengatur mode aplikasi (pilih, gambar, atau isi)
function setelMode(modeBaru) {
  mode = modeBaru;

  // Ambil elemen-elemen UI
  const btnModePilih = document.getElementById("btnModePilih");
  const btnModeGambar = document.getElementById("btnModeGambar");
  const btnModeIsi = document.getElementById("btnModeIsi");
  const panelTransformasi = document.getElementById("panelTransformasi");
  const panelIsi = document.getElementById("panelIsi");

  // Reset semua tombol dan panel
  btnModePilih.classList.remove("aktif");
  btnModeGambar.classList.remove("aktif");
  btnModeIsi.classList.remove("aktif");
  panelTransformasi.classList.add("sembunyi");
  panelIsi.classList.add("sembunyi");
  kanvas.classList.remove("cursor-isi");
  kanvas.style.cursor = "default";

  // Atur status aktif berdasarkan mode
  if (mode === "pilih") {
    btnModePilih.classList.add("aktif");
    panelTransformasi.classList.remove("sembunyi");
  } else if (mode === "gambar") {
    kanvas.style.cursor = "crosshair";
    btnModeGambar.classList.add("aktif");
  } else if (mode === "isi") {
    kanvas.classList.add("cursor-isi");
    btnModeIsi.classList.add("aktif");
    panelIsi.classList.remove("sembunyi");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  // Tombol Mode Utama
  const btnModePilih = document.getElementById("btnModePilih");
  const btnModeGambar = document.getElementById("btnModeGambar");
  const btnModeIsi = document.getElementById("btnModeIsi");

  // Panel Kontrol
  const panelBentuk = document.getElementById("panel-bentuk");
  const panelBrush = document.getElementById("panelBrush");
  const panelIsi = document.getElementById("panelIsi");
  const panelTransformasi = document.getElementById("panelTransformasi");

  // Kontrol Spesifik
  const ketebalanGarisSlider = document.getElementById("ketebalanGaris");
  const nilaiKetebalanSpan = document.getElementById("nilaiKetebalan");
  const jenisBrushDropdown = document.getElementById("jenisBrush");

  // Event Listener untuk Slider Ketebalan
  ketebalanGarisSlider.addEventListener("input", (e) => {
    ketebalanGaris = parseInt(e.target.value, 10);
    nilaiKetebalanSpan.textContent = `${ketebalanGaris}px`;
  });

  // Event Listener untuk Dropdown Jenis Brush
  jenisBrushDropdown.addEventListener("change", (e) => {
    jenisBrush = e.target.value;
  });

  // Fungsi untuk mengatur visibilitas panel berdasarkan mode
  function aturPanelAktif() {
    // Sembunyikan semua panel terlebih dahulu
    panelBentuk.classList.add("sembunyi");
    panelBrush.classList.add("sembunyi");
    panelIsi.classList.add("sembunyi");
    panelTransformasi.classList.add("sembunyi");

    // Tampilkan panel berdasarkan mode saat ini
    if (mode === "gambar") {
      panelBentuk.classList.remove("sembunyi");
      panelBrush.classList.remove("sembunyi"); // Tampilkan juga panel brush saat menggambar
    } else if (mode === "isi") {
      panelIsi.classList.remove("sembunyi");
    } else if (mode === "pilih") {
      // Selalu tampilkan panel transformasi dalam mode pilih
      panelTransformasi.classList.remove("sembunyi");
    }
  }

  // Event Listener untuk Tombol Mode
  btnModePilih.addEventListener("click", () => {
    mode = "pilih";
    perbaruiStatusTombolMode();
  });

  btnModeGambar.addEventListener("click", () => {
    mode = "gambar";
    perbaruiStatusTombolMode();
  });

  btnModeIsi.addEventListener("click", () => {
    mode = "isi";
    perbaruiStatusTombolMode();
  });

  // Fungsi untuk memperbarui tampilan tombol mode dan panel
  function perbaruiStatusTombolMode() {
    // Update kelas 'aktif' pada tombol
    btnModePilih.classList.toggle("aktif", mode === "pilih");
    btnModeGambar.classList.toggle("aktif", mode === "gambar");
    btnModeIsi.classList.toggle("aktif", mode === "isi");

    // Update kursor kanvas
    kanvas.classList.remove("kursor-isi", "kursor-pilih", "kursor-gambar");
    if (mode === "isi") {
      kanvas.classList.add("kursor-isi");
    } else if (mode === "pilih") {
      kanvas.classList.add("kursor-pilih");
    } else {
      kanvas.classList.add("kursor-gambar");
    }

    // Perbarui panel yang terlihat
    aturPanelAktif();
  }

  // Panggil saat objek dipilih atau tidak dipilih untuk memperbarui panel transformasi
  // window.addEventListener("objekterpilihubah", aturPanelAktif);

  // Inisialisasi awal
  perbaruiStatusTombolMode();
});
