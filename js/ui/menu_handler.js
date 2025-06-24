/**
 * Menangani logika untuk interaksi dengan menu dan UI.
 */

// Fungsi untuk memperbarui opsi dropdown algoritma berdasarkan bentuk yang dipilih
function perbaruiOpsiAlgoritma() {
  const pilihAlgoritma = document.getElementById("pilihAlgoritma");
  const panelAlgoritma = pilihAlgoritma.parentElement;

  pilihAlgoritma.innerHTML = ""; // Kosongkan opsi

  if (jenisObjek === "garis") {
    panelAlgoritma.style.display = "block";
    pilihAlgoritma.innerHTML = `
      <option value="dda">DDA</option>
      <option value="bresenham">Bresenham</option>
    `;
    algoritmaTerpilih = pilihAlgoritma.value;
  } else if (jenisObjek === "lingkaran") {
    panelAlgoritma.style.display = "block";
    pilihAlgoritma.innerHTML = `
      <option value="midpoint">Midpoint</option>
      <option value="simetris">Simetris Delapan Titik</option>
      <option value="simetris_empat">Simetris Empat Titik</option>
    `;
    algoritmaTerpilih = pilihAlgoritma.value;
  } else if (jenisObjek === "elips") {
    panelAlgoritma.style.display = "block";
    pilihAlgoritma.innerHTML = `
      <option value="midpoint_elips">Midpoint</option>
      <option value="simetris_empat_elips">Simetris Empat Titik</option>
    `;
    algoritmaTerpilih = pilihAlgoritma.value;
  } else {
    panelAlgoritma.style.display = "none";
  }
}

// Fungsi untuk mengatur mode aplikasi (pilih atau gambar)
function setelMode(modeBaru) {
  mode = modeBaru;
  const btnModePilih = document.getElementById("btnModePilih");
  const btnModeGambar = document.getElementById("btnModeGambar");

  if (mode === "pilih") {
    kanvas.style.cursor = "default";
    btnModePilih.classList.add("aktif");
    btnModeGambar.classList.remove("aktif");
  } else {
    kanvas.style.cursor = "crosshair";
    btnModeGambar.classList.add("aktif");
    btnModePilih.classList.remove("aktif");
  }
}
