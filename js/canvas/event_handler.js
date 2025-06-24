/**
 * Menangani semua event listener untuk kanvas dan UI.
 */

// Fungsi utama untuk memasang semua event listener
function setupEventListeners() {
  // Event listener untuk mode
  const btnModePilih = document.getElementById("btnModePilih");
  const btnModeGambar = document.getElementById("btnModeGambar");
  btnModePilih.addEventListener("click", () => setelMode("pilih"));
  btnModeGambar.addEventListener("click", () => setelMode("gambar"));

  // Event listener untuk pilihan dropdown
  document.getElementById("pilihAlgoritma").addEventListener("change", (e) => {
    algoritmaTerpilih = e.target.value;
  });
  document.getElementById("dropdownBentuk").addEventListener("change", (e) => {
    jenisObjek = e.target.value;
    perbaruiOpsiAlgoritma();
  });
  document.getElementById("jenisGaris").addEventListener("change", (e) => {
    jenisGaris = e.target.value;
    if (objekTerpilih) {
      objekTerpilih.jenisGaris = jenisGaris;
      gambarUlangSemuaObjek();
    }
  });

  // Event listener untuk warna
  document.getElementById("warnaGaris").addEventListener("change", (e) => {
    warnaGaris = e.target.value;
    if (objekTerpilih) {
      objekTerpilih.warnaGaris = warnaGaris;
      gambarUlangSemuaObjek();
    }
  });
  document.getElementById("warnaIsi").addEventListener("change", (e) => {
    warnaIsi = e.target.value;
    if (objekTerpilih) {
      objekTerpilih.warnaIsi = warnaIsi;
      gambarUlangSemuaObjek();
    }
  });

  // Event listener untuk aksi
  document.getElementById("btnDuplikat").addEventListener("click", () => {
    if (objekTerpilih) {
      const objekBaru = { ...objekTerpilih };
      if (objekBaru.jenis === "poligon") {
        objekBaru.titik = [...objekTerpilih.titik];
      }
      objekList.push(objekBaru);
      Translasi.objek(objekBaru, 20, 20);
      gambarUlangSemuaObjek();
    }
  });
  document.getElementById("btnHapus").addEventListener("click", () => {
    if (objekTerpilih) {
      const index = objekList.indexOf(objekTerpilih);
      if (index > -1) {
        objekList.splice(index, 1);
        objekTerpilih = null;
        gambarUlangSemuaObjek();
      }
    }
  });
  document.getElementById("btnReset").addEventListener("click", () => {
    objekList = [];
    objekTerpilih = null;
    ctx.clearRect(0, 0, kanvas.width, kanvas.height);
  });

  // Event listener untuk kanvas
  kanvas.addEventListener("mousedown", handleMouseDown);
  kanvas.addEventListener("mousemove", handleMouseMove);
  kanvas.addEventListener("mouseup", handleMouseUp);

  // Event listener untuk transformasi
  pasangEventFormTransformasi();
}

// Handler event mouse di kanvas
function handleMouseDown(e) {
  if (mode === "gambar") {
    mulaiMenggambar(e);
  } else if (mode === "pilih") {
    pilihObjekDiCanvas(e);
  }
}

function handleMouseMove(e) {
  if (mode === "gambar" && sedangMenggambar) {
    sedangMenggambarObjek(e);
  }
}

function handleMouseUp(e) {
  if (mode === "gambar" && sedangMenggambar) {
    selesaiMenggambar(e);
  }
}
