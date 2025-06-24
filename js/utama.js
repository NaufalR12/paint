/**
 * File JavaScript utama untuk aplikasi Paint 2D
 * Bertanggung jawab untuk inisialisasi dan variabel global.
 */

// Variabel Global
let kanvas;
let ctx;
let objekTerpilih = null;
let objekList = [];
let sedangMenggambar = false;
let titikAwal = { x: 0, y: 0 };
let mode = "pilih"; // Mode: 'pilih', 'gambar', atau 'isi'
let jenisObjek = "garis";
let algoritmaTerpilih = "dda";
let algoritmaIsi = "inside-outside";
let jenisBrush = "pena"; // 'pena', 'pensil', 'spidol', 'cat-air'
let warnaGaris = "#000000";
let warnaIsi = "#ffffff";
let titikKontrolDipilih = null;
let ketebalanGaris = 1;

// Fungsi inisialisasi utama
function init() {
  // Inisialisasi kanvas
  kanvas = document.getElementById("kanvas");
  ctx = kanvas.getContext("2d");

  // Set ukuran kanvas
  kanvas.width = window.innerWidth - 380;
  kanvas.height = window.innerHeight - 40;

  // Event listener untuk resize window
  window.addEventListener("resize", () => {
    kanvas.width = window.innerWidth - 380;
    kanvas.height = window.innerHeight - 40;
    gambarUlangSemuaObjek();
  });

  // Ambil state awal dari UI
  jenisObjek = document.getElementById("dropdownBentuk").value;

  // Pasang semua event listener untuk UI dan kanvas
  setupEventListeners();

  // Setup UI awal
  perbaruiOpsiAlgoritma();
  setelMode(mode);
  setupWarnaPreview();

  // Setup form transformasi
  setupDropdownsAndDynamicForm();
}

// Panggil init saat DOM siap
document.addEventListener("DOMContentLoaded", init);

// NOTE: Semua fungsi lain telah dipindahkan ke file terpisah:
// - js/ui/menu_handler.js (untuk logika UI)
// - js/canvas/drawing_handler.js (untuk logika gambar)
// - js/canvas/event_handler.js (untuk event listener)

// Fungsi setupDropdownsAndDynamicForm dan pasangEventFormTransformasi tetap di sini
// karena mereka terkait erat dengan inisialisasi dan belum dipisahkan.

function setupDropdownsAndDynamicForm() {
  const dropdownTransformasi = document.getElementById("dropdownTransformasi");
  const formTransformasi = document.getElementById("formTransformasi");

  function tampilkanFormTransformasi() {
    const jenisTransformasi = dropdownTransformasi.value;
    formTransformasi.innerHTML = "";
    if (jenisTransformasi === "translasi") {
      formTransformasi.innerHTML = `<input type="number" id="dx" placeholder="dx" value="10"><input type="number" id="dy" placeholder="dy" value="10"><button id="btnTerapkanTranslasi">Terapkan</button>`;
    } else if (jenisTransformasi === "rotasi") {
      formTransformasi.innerHTML = `<input type="number" id="sudut" placeholder="Sudut (°)" value="45"><input type="number" id="cx" placeholder="Pusat X (opsional)"><input type="number" id="cy" placeholder="Pusat Y (opsional)"><button id="btnTerapkanRotasi">Terapkan</button>`;
    } else if (jenisTransformasi === "skala") {
      formTransformasi.innerHTML = `<input type="number" id="sx" placeholder="sx" value="1.5" step="0.1"><input type="number" id="sy" placeholder="sy" value="1.5" step="0.1"><input type="number" id="cx" placeholder="Pusat X (opsional)"><input type="number" id="cy" placeholder="Pusat Y (opsional)"><button id="btnTerapkanSkala">Terapkan</button>`;
    } else if (jenisTransformasi === "refleksi") {
      formTransformasi.innerHTML = `<select id="jenisRefleksi"><option value="x">Sumbu X</option><option value="y">Sumbu Y</option><option value="origin">Titik Asal</option></select><button id="btnTerapkanRefleksi">Terapkan</button>`;
    } else if (jenisTransformasi === "shear") {
      formTransformasi.innerHTML = `<input type="number" id="shx" placeholder="shx" value="0.1" step="0.1"><input type="number" id="shy" placeholder="shy" value="0" step="0.1"><button id="btnTerapkanShear">Terapkan</button>`;
    }
    pasangEventFormTransformasi();
  }
  dropdownTransformasi.addEventListener("change", tampilkanFormTransformasi);
  tampilkanFormTransformasi();
}

function pasangEventFormTransformasi() {
  const btnTranslasi = document.getElementById("btnTerapkanTranslasi");
  if (btnTranslasi) {
    btnTranslasi.onclick = () => {
      const dx = parseFloat(document.getElementById("dx").value) || 0;
      const dy = parseFloat(document.getElementById("dy").value) || 0;
      if (objekTerpilih) {
        Translasi.objek(objekTerpilih, dx, dy);
        gambarUlangSemuaObjek();
      }
    };
  }
  const btnRotasi = document.getElementById("btnTerapkanRotasi");
  if (btnRotasi) {
    btnRotasi.onclick = () => {
      const sudut = parseFloat(document.getElementById("sudut").value) || 0;
      const cx =
        document.getElementById("cx").value === ""
          ? undefined
          : parseFloat(document.getElementById("cx").value);
      const cy =
        document.getElementById("cy").value === ""
          ? undefined
          : parseFloat(document.getElementById("cy").value);
      if (objekTerpilih) {
        Rotasi.objek(objekTerpilih, sudut, cx, cy);
        gambarUlangSemuaObjek();
      }
    };
  }
  const btnSkala = document.getElementById("btnTerapkanSkala");
  if (btnSkala) {
    btnSkala.onclick = () => {
      const sx = parseFloat(document.getElementById("sx").value) || 1;
      const sy = parseFloat(document.getElementById("sy").value) || 1;
      const cx =
        document.getElementById("cx").value === ""
          ? undefined
          : parseFloat(document.getElementById("cx").value);
      const cy =
        document.getElementById("cy").value === ""
          ? undefined
          : parseFloat(document.getElementById("cy").value);
      if (objekTerpilih) {
        Skala.objek(objekTerpilih, sx, sy, cx, cy);
        gambarUlangSemuaObjek();
      }
    };
  }
  const btnRefleksi = document.getElementById("btnTerapkanRefleksi");
  if (btnRefleksi) {
    btnRefleksi.onclick = () => {
      const jenis = document.getElementById("jenisRefleksi").value;
      if (objekTerpilih) {
        Refleksi.objek(objekTerpilih, jenis);
        gambarUlangSemuaObjek();
      }
    };
  }
  const btnShear = document.getElementById("btnTerapkanShear");
  if (btnShear) {
    btnShear.onclick = () => {
      const shx = parseFloat(document.getElementById("shx").value) || 0;
      const shy = parseFloat(document.getElementById("shy").value) || 0;
      if (objekTerpilih) {
        Shear.objek(objekTerpilih, shx, shy);
        gambarUlangSemuaObjek();
      }
    };
  }
}

function setupWarnaPreview() {
  const warnaGarisInput = document.getElementById("warnaGaris");
  const warnaGarisPreview = document.getElementById("warnaGarisPreview");
  const warnaIsiInput = document.getElementById("warnaIsi");
  const warnaIsiPreview = document.getElementById("warnaIsiPreview");

  // Atur warna awal
  warnaGarisPreview.style.backgroundColor = warnaGarisInput.value;
  warnaIsiPreview.style.backgroundColor = warnaIsiInput.value;

  warnaGarisInput.addEventListener("input", (e) => {
    warnaGarisPreview.style.backgroundColor = e.target.value;
  });

  warnaIsiInput.addEventListener("input", (e) => {
    warnaIsiPreview.style.backgroundColor = e.target.value;
  });
}
