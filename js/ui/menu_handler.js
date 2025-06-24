/**
 * Menangani logika untuk interaksi dengan menu dan UI.
 */

let drawingTools;

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

// Fungsi untuk mengatur mode aplikasi (pilih, gambar, isi, pen, atau brush)
function setelMode(modeBaru) {
  mode = modeBaru;

  // Ambil elemen-elemen UI
  const btnModePilih = document.getElementById("btnModePilih");
  const btnModeGambar = document.getElementById("btnModeGambar");
  const btnModeIsi = document.getElementById("btnModeIsi");
  const btnModePen = document.getElementById("btnModePen");
  const btnModeBrush = document.getElementById("btnModeBrush");
  const panelTransformasi = document.getElementById("panelTransformasi");
  const panelIsi = document.getElementById("panelIsi");
  const panelPenBrush = document.getElementById("panelPenBrush");

  // Reset semua tombol dan panel
  btnModePilih.classList.remove("aktif");
  btnModeGambar.classList.remove("aktif");
  btnModeIsi.classList.remove("aktif");
  btnModePen.classList.remove("aktif");
  btnModeBrush.classList.remove("aktif");
  panelTransformasi.classList.add("sembunyi");
  panelIsi.classList.add("sembunyi");
  panelPenBrush.classList.add("sembunyi");
  kanvas.classList.remove("cursor-isi");
  document.body.classList.remove("mode-brush");
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
  } else if (mode === "pen") {
    kanvas.style.cursor = "crosshair";
    btnModePen.classList.add("aktif");
    panelPenBrush.classList.remove("sembunyi");
    if (drawingTools) drawingTools.setTool("pen");
  } else if (mode === "brush") {
    kanvas.style.cursor = "crosshair";
    btnModeBrush.classList.add("aktif");
    panelPenBrush.classList.remove("sembunyi");
    document.body.classList.add("mode-brush");
    if (drawingTools) drawingTools.setTool("brush");
  }
}

// Inisialisasi event listener untuk pengaturan pen dan brush
function inisialisasiPenBrush() {
  drawingTools = new DrawingTools(kanvas, ctx);

  // Event listener untuk ukuran
  const ukuranGaris = document.getElementById("ukuranGaris");
  const ukuranGarisValue = document.getElementById("ukuranGarisValue");

  ukuranGaris.addEventListener("input", (e) => {
    const value = e.target.value;
    ukuranGarisValue.textContent = value + "px";
    drawingTools.setSize(parseInt(value));
  });

  // Event listener untuk opacity
  const opacityGaris = document.getElementById("opacityGaris");
  const opacityGarisValue = document.getElementById("opacityGarisValue");

  opacityGaris.addEventListener("input", (e) => {
    const value = e.target.value;
    opacityGarisValue.textContent = value + "%";
    drawingTools.setOpacity(value / 100);
  });

  // Event listener untuk tekstur brush
  const teksturBrush = document.getElementById("teksturBrush");
  teksturBrush.addEventListener("change", (e) => {
    drawingTools.setTexture(e.target.value);
  });

  // Event listener untuk warna
  const warnaGaris = document.getElementById("warnaGaris");
  warnaGaris.addEventListener("input", (e) => {
    drawingTools.setColor(e.target.value);
  });

  // Event listener untuk tombol mode
  document
    .getElementById("btnModePen")
    .addEventListener("click", () => setelMode("pen"));
  document
    .getElementById("btnModeBrush")
    .addEventListener("click", () => setelMode("brush"));
}

// Panggil fungsi inisialisasi setelah DOM dimuat
document.addEventListener("DOMContentLoaded", inisialisasiPenBrush);
