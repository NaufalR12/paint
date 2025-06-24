/**
 * Menangani semua logika yang berhubungan dengan menggambar di kanvas.
 */

let titikPenaSementara = [];

function mulaiMenggambar(e) {
  sedangMenggambar = true;
  const rect = kanvas.getBoundingClientRect();
  titikAwal.x = e.clientX - rect.left;
  titikAwal.y = e.clientY - rect.top;

  if (jenisObjek === "pena") {
    titikPenaSementara = [{ x: titikAwal.x, y: titikAwal.y }];
  }
}

function sedangMenggambarObjek(e) {
  if (!sedangMenggambar) return;

  const rect = kanvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  if (jenisObjek === "pena") {
    titikPenaSementara.push({ x, y });
  }

  gambarUlangSemuaObjek();

  switch (jenisObjek) {
    case "garis":
      // Buat plotter dari state global untuk preview
      const plotterGaris = createPlotterForObject({
        warnaGaris: warnaGaris,
        ketebalan: ketebalanGaris,
        jenisBrush: jenisBrush,
        jenisGaris: jenisGaris,
      });
      if (algoritmaTerpilih === "dda") {
        AlgoritmaDDA.gambarGaris(
          plotterGaris,
          titikAwal.x,
          titikAwal.y,
          x,
          y,
          jenisGaris
        );
      } else {
        AlgoritmaBresenham.gambarGaris(
          plotterGaris,
          titikAwal.x,
          titikAwal.y,
          x,
          y,
          jenisGaris
        );
      }
      break;
    case "persegi":
      // Buat plotter dari state global untuk preview
      const plotterPersegi = createPlotterForObject({
        warnaGaris: warnaGaris,
        ketebalan: ketebalanGaris,
        jenisBrush: jenisBrush,
        jenisGaris: jenisGaris,
      });
      const titikPersegi = hitungTitikPersegi(
        titikAwal.x,
        titikAwal.y,
        x - titikAwal.x,
        y - titikAwal.y
      );
      gambarPoligon(
        plotterPersegi,
        titikPersegi,
        warnaGaris,
        null,
        "bresenham"
      );
      break;
    case "segitiga":
      // Buat plotter dari state global untuk preview
      const plotterSegitiga = createPlotterForObject({
        warnaGaris: warnaGaris,
        ketebalan: ketebalanGaris,
        jenisBrush: jenisBrush,
      });
      const titikSegitiga = hitungTitikSegitiga(titikAwal.x, titikAwal.y, x, y);
      gambarPoligon(
        plotterSegitiga,
        titikSegitiga,
        warnaGaris,
        warnaIsi,
        "bresenham"
      );
      break;
    case "jajargenjang":
      // Buat plotter dari state global untuk preview
      const plotterJajargenjang = createPlotterForObject({
        warnaGaris: warnaGaris,
        ketebalan: ketebalanGaris,
        jenisBrush: jenisBrush,
      });
      const titikJajargenjang = hitungTitikJajargenjang(
        titikAwal.x,
        titikAwal.y,
        x,
        y
      );
      gambarPoligon(
        plotterJajargenjang,
        titikJajargenjang,
        warnaGaris,
        warnaIsi,
        "bresenham"
      );
      break;
    case "trapesium":
      // Buat plotter dari state global untuk preview
      const plotterTrapesium = createPlotterForObject({
        warnaGaris: warnaGaris,
        ketebalan: ketebalanGaris,
        jenisBrush: jenisBrush,
      });
      const titikTrapesium = hitungTitikTrapesium(
        titikAwal.x,
        titikAwal.y,
        x,
        y
      );
      gambarPoligon(
        plotterTrapesium,
        titikTrapesium,
        warnaGaris,
        warnaIsi,
        "bresenham"
      );
      break;
    case "lingkaran":
      const radius = Math.sqrt(
        Math.pow(x - titikAwal.x, 2) + Math.pow(y - titikAwal.y, 2)
      );
      // Buat plotter dari state global untuk preview
      const plotterPreview = createPlotterForObject({
        warnaGaris: warnaGaris,
        ketebalan: ketebalanGaris,
        jenisBrush: jenisBrush,
      });
      if (algoritmaTerpilih === "midpoint") {
        AlgoritmaMidpointLingkaran.gambarLingkaran(
          plotterPreview,
          titikAwal.x,
          titikAwal.y,
          radius
        );
      } else if (algoritmaTerpilih === "simetris") {
        AlgoritmaSimetrisDelapanTitik.gambarLingkaran(
          ctx,
          titikAwal.x,
          titikAwal.y,
          radius,
          warnaGaris,
          null,
          jenisGaris
        );
      }
      break;
    case "elips":
      const rx = Math.abs(x - titikAwal.x);
      const ry = Math.abs(y - titikAwal.y);
      if (algoritmaTerpilih === "midpoint_elips") {
        AlgoritmaMidpointElips.gambarElips(
          ctx,
          titikAwal.x,
          titikAwal.y,
          rx,
          ry,
          warnaGaris,
          warnaIsi,
          jenisGaris
        );
      } else {
        // simetris_empat_elips
        AlgoritmaSimetrisEmpatTitikElips.gambarElips(
          ctx,
          titikAwal.x,
          titikAwal.y,
          rx,
          ry,
          warnaGaris,
          warnaIsi,
          jenisGaris
        );
      }
      break;
    case "pena":
      const plotterPena = createPlotterForObject({
        warnaGaris: warnaGaris,
        ketebalan: ketebalanGaris,
        jenisBrush: jenisBrush,
      });
      gambarGoresanPena(plotterPena, titikPenaSementara);
      break;
  }
}

function selesaiMenggambar(e) {
  if (!sedangMenggambar) return;
  sedangMenggambar = false;
  const rect = kanvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  let objekBaru;
  switch (jenisObjek) {
    case "garis":
      objekBaru = {
        jenis: "garis",
        x1: titikAwal.x,
        y1: titikAwal.y,
        x2: x,
        y2: y,
        warnaGaris: warnaGaris,
        algoritma: algoritmaTerpilih,
        ketebalan: ketebalanGaris,
        jenisBrush: jenisBrush,
        jenisGaris: jenisGaris,
      };
      break;
    case "persegi":
      objekBaru = {
        jenis: "poligon",
        titik: hitungTitikPersegi(
          titikAwal.x,
          titikAwal.y,
          x - titikAwal.x,
          y - titikAwal.y
        ),
        warnaGaris: warnaGaris,
        warnaIsi: warnaIsi,
        jenisGaris: jenisGaris,
        algoritmaGaris: "bresenham",
        ketebalan: ketebalanGaris,
        jenisBrush: jenisBrush,
      };
      break;
    case "segitiga":
      objekBaru = {
        jenis: "poligon",
        titik: hitungTitikSegitiga(titikAwal.x, titikAwal.y, x, y),
        warnaGaris: warnaGaris,
        warnaIsi: warnaIsi,
        jenisGaris: jenisGaris,
        algoritmaGaris: "bresenham",
        ketebalan: ketebalanGaris,
        jenisBrush: jenisBrush,
      };
      break;
    case "lingkaran":
      objekBaru = {
        jenis: "lingkaran",
        xc: titikAwal.x,
        yc: titikAwal.y,
        radius: Math.sqrt(
          Math.pow(x - titikAwal.x, 2) + Math.pow(y - titikAwal.y, 2)
        ),
        warnaGaris: warnaGaris,
        warnaIsi: warnaIsi,
        jenisGaris: jenisGaris,
        algoritma: algoritmaTerpilih,
        ketebalan: ketebalanGaris,
        jenisBrush: jenisBrush,
      };
      break;
    case "elips":
      objekBaru = {
        jenis: "elips",
        xc: titikAwal.x,
        yc: titikAwal.y,
        rx: Math.abs(x - titikAwal.x),
        ry: Math.abs(y - titikAwal.y),
        warnaGaris: warnaGaris,
        warnaIsi: warnaIsi,
        jenisGaris: jenisGaris,
        algoritma: algoritmaTerpilih,
        ketebalan: ketebalanGaris,
        jenisBrush: jenisBrush,
      };
      break;
    case "jajargenjang":
      objekBaru = {
        jenis: "poligon",
        titik: hitungTitikJajargenjang(titikAwal.x, titikAwal.y, x, y),
        warnaGaris: warnaGaris,
        warnaIsi: warnaIsi,
        jenisGaris: jenisGaris,
        algoritmaGaris: "bresenham",
        ketebalan: ketebalanGaris,
        jenisBrush: jenisBrush,
      };
      break;
    case "trapesium":
      objekBaru = {
        jenis: "poligon",
        titik: hitungTitikTrapesium(titikAwal.x, titikAwal.y, x, y),
        warnaGaris: warnaGaris,
        warnaIsi: warnaIsi,
        jenisGaris: jenisGaris,
        algoritmaGaris: "bresenham",
        ketebalan: ketebalanGaris,
        jenisBrush: jenisBrush,
      };
      break;
    case "pena":
      objekBaru = {
        jenis: "pena",
        titik: [...titikPenaSementara],
        warnaGaris: warnaGaris,
        ketebalan: ketebalanGaris,
        jenisBrush: jenisBrush,
      };
      titikPenaSementara = [];
      break;
  }
  if (objekBaru) {
    objekList.push(objekBaru);
  }
  gambarUlangSemuaObjek();
}

function gambarUlangSemuaObjek() {
  ctx.clearRect(0, 0, kanvas.width, kanvas.height);
  objekList.forEach((objek) => {
    gambarObjek(objek);
  });
}

function gambarObjek(objek) {
  if (objek === objekTerpilih) {
    ctx.shadowColor = "rgba(0, 0, 255, 0.7)";
    ctx.shadowBlur = 10;
  } else {
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
  }
  ctx.strokeStyle = objek.warnaGaris;
  ctx.fillStyle = objek.warnaIsi;
  const plotter = createPlotterForObject(objek);

  switch (objek.jenis) {
    case "garis":
      const algoritmaGambarGaris =
        objek.algoritma === "bresenham"
          ? AlgoritmaBresenham.gambarGaris
          : AlgoritmaDDA.gambarGaris;
      algoritmaGambarGaris(
        plotter,
        objek.x1,
        objek.y1,
        objek.x2,
        objek.y2,
        objek.jenisGaris
      );
      break;
    case "poligon":
      gambarPoligon(
        plotter,
        objek.titik,
        objek.warnaGaris,
        objek.warnaIsi,
        objek.algoritmaGaris,
        objek.algoritmaIsi
      );
      break;
    case "lingkaran":
      const plotterFinal = createPlotterForObject(objek);

      if (objek.warnaIsi && objek.warnaIsi !== "#ffffff") {
        // Gambar batas solid dulu untuk pengisian
        const plotterBatasIsi = createPlotterForObject({
          ...objek,
          jenisBrush: "pena",
          ketebalan: 1,
        });
        if (objek.algoritma === "midpoint") {
          AlgoritmaMidpointLingkaran.gambarLingkaran(
            plotterBatasIsi,
            objek.xc,
            objek.yc,
            objek.radius
          );
        } else if (objek.algoritma === "simetris") {
          AlgoritmaSimetrisDelapanTitik.gambarLingkaran(
            ctx,
            objek.xc,
            objek.yc,
            objek.radius,
            objek.warnaGaris,
            null,
            objek.jenisGaris
          );
        }

        // Lakukan pengisian
        const startX = Math.floor(objek.xc);
        const startY = Math.floor(objek.yc);
        if (objek.algoritmaIsi === "flood-fill") {
          AlgoritmaIsiArea.floodFill(ctx, startX, startY, objek.warnaIsi);
        } else {
          AlgoritmaIsiArea.boundaryFill(
            ctx,
            startX,
            startY,
            objek.warnaIsi,
            objek.warnaGaris
          );
        }
      }

      // Gambar garis batas akhir dengan brush yang benar
      if (objek.algoritma === "midpoint") {
        AlgoritmaMidpointLingkaran.gambarLingkaran(
          plotterFinal,
          objek.xc,
          objek.yc,
          objek.radius
        );
      } else if (objek.algoritma === "simetris") {
        AlgoritmaSimetrisDelapanTitik.gambarLingkaran(
          ctx,
          objek.xc,
          objek.yc,
          objek.radius,
          objek.warnaGaris,
          null,
          objek.jenisGaris
        );
      }
      break;
    case "elips":
      let algoritmaGambarElips;
      if (objek.algoritma === "midpoint_elips") {
        algoritmaGambarElips = AlgoritmaMidpointElips.gambarElips;
      } else {
        algoritmaGambarElips = AlgoritmaSimetrisEmpatTitikElips.gambarElips;
      }

      // Selalu gambar batas solid terlebih dahulu
      algoritmaGambarElips(
        ctx,
        objek.xc,
        objek.yc,
        objek.rx,
        objek.ry,
        objek.warnaGaris,
        null,
        "solid"
      );

      // Kemudian, lakukan pengisian
      if (objek.warnaIsi && objek.warnaIsi !== "#ffffff") {
        const startX = Math.floor(objek.xc);
        const startY = Math.floor(objek.yc);
        if (objek.algoritmaIsi === "flood-fill") {
          AlgoritmaIsiArea.floodFill(ctx, startX, startY, objek.warnaIsi);
        } else {
          // boundary-fill dan inside-outside
          AlgoritmaIsiArea.boundaryFill(
            ctx,
            startX,
            startY,
            objek.warnaIsi,
            objek.warnaGaris
          );
        }
      }
      // Gambar ulang batas dengan style yang benar jika bukan solid
      if (objek.jenisGaris !== "solid") {
        algoritmaGambarElips(
          ctx,
          objek.xc,
          objek.yc,
          objek.rx,
          objek.ry,
          objek.warnaGaris,
          null,
          objek.jenisGaris
        );
      }
      break;
    case "pena":
      gambarGoresanPena(plotter, objek.titik);
      break;
  }
  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;
}

function pilihObjekDiCanvas(e) {
  const rect = kanvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  objekTerpilih = null;
  for (let i = objekList.length - 1; i >= 0; i--) {
    if (apakahTitikDalamObjek(x, y, objekList[i])) {
      objekTerpilih = objekList[i];
      document.getElementById("warnaGaris").value = objekTerpilih.warnaGaris;
      document.getElementById("jenisGaris").value = objekTerpilih.jenisGaris;
      if (objekTerpilih.warnaIsi) {
        document.getElementById("warnaIsi").value = objekTerpilih.warnaIsi;
      }
      gambarUlangSemuaObjek();
      return;
    }
  }
  gambarUlangSemuaObjek();
}

function apakahTitikDalamObjek(x, y, objek) {
  const toleransi = 5;
  switch (objek.jenis) {
    case "garis":
      return (
        jarakTitikKeGaris(x, y, objek.x1, objek.y1, objek.x2, objek.y2) <
        toleransi
      );
    case "poligon":
      if (apakahTitikDalamPoligon(x, y, objek.titik)) {
        return true;
      }
      for (
        let i = 0, j = objek.titik.length - 1;
        i < objek.titik.length;
        j = i++
      ) {
        const [x1, y1] = objek.titik[j];
        const [x2, y2] = objek.titik[i];
        if (jarakTitikKeGaris(x, y, x1, y1, x2, y2) < toleransi) {
          return true;
        }
      }
      return false;
    case "lingkaran":
      const jarakKePusat = Math.sqrt(
        Math.pow(x - objek.xc, 2) + Math.pow(y - objek.yc, 2)
      );
      return jarakKePusat < objek.radius + toleransi;
    case "elips":
      const p =
        Math.pow(x - objek.xc, 2) / Math.pow(objek.rx, 2) +
        Math.pow(y - objek.yc, 2) / Math.pow(objek.ry, 2);
      return p < 1.1;
  }
  return false;
}

function jarakTitikKeGaris(x, y, x1, y1, x2, y2) {
  const A = x - x1;
  const B = y - y1;
  const C = x2 - x1;
  const D = y2 - y1;
  const dot = A * C + B * D;
  const len_sq = C * C + D * D;
  let param = -1;
  if (len_sq !== 0) {
    param = dot / len_sq;
  }
  let xx, yy;
  if (param < 0) {
    xx = x1;
    yy = y1;
  } else if (param > 1) {
    xx = x2;
    yy = y2;
  } else {
    xx = x1 + param * C;
    yy = y1 + param * D;
  }
  const dx = x - xx;
  const dy = y - yy;
  return Math.sqrt(dx * dx + dy * dy);
}

function apakahTitikDalamPoligon(x, y, titik) {
  let inside = false;
  for (let i = 0, j = titik.length - 1; i < titik.length; j = i++) {
    const xi = titik[i][0],
      yi = titik[i][1];
    const xj = titik[j][0],
      yj = titik[j][1];
    const intersect =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

function hitungTitikPersegi(x, y, width, height) {
  return [
    [x, y],
    [x + width, y],
    [x + width, y + height],
    [x, y + height],
  ];
}
function hitungTitikSegitiga(x1, y1, x2, y2) {
  const x3 = x1 - (x2 - x1);
  const y3 = y2;
  return [
    [x1, y1],
    [x2, y2],
    [x3, y3],
  ];
}
function hitungTitikJajargenjang(x1, y1, x2, y2) {
  const width = x2 - x1;
  const height = y2 - y1;
  const offset = width / 4;
  return [
    [x1, y1],
    [x1 + width, y1],
    [x1 + width - offset, y1 + height],
    [x1 - offset, y1 + height],
  ];
}
function hitungTitikTrapesium(x1, y1, x2, y2) {
  const width = x2 - x1;
  const height = y2 - y1;
  const offset = width / 4;
  return [
    [x1, y1],
    [x1 + width, y1],
    [x1 + width - offset, y1 + height],
    [x1 + offset, y1 + height],
  ];
}

function gambarPersegi(x, y, width, height) {
  const titik = hitungTitikPersegi(x, y, width, height);
  gambarPoligon(titik, warnaGaris, warnaIsi, jenisGaris, "bresenham");
}
function gambarSegitiga(x1, y1, x2, y2) {
  const titik = hitungTitikSegitiga(x1, y1, x2, y2);
  gambarPoligon(titik, warnaGaris, warnaIsi, jenisGaris, "bresenham");
}
function gambarJajargenjang(x1, y1, x2, y2) {
  const titik = hitungTitikJajargenjang(x1, y1, x2, y2);
  gambarPoligon(titik, warnaGaris, warnaIsi, jenisGaris, "bresenham");
}
function gambarTrapesium(x1, y1, x2, y2) {
  const titik = hitungTitikTrapesium(x1, y1, x2, y2);
  gambarPoligon(titik, warnaGaris, warnaIsi, jenisGaris, "bresenham");
}

function gambarPoligon(
  plotter,
  titik,
  warnaGaris,
  warnaIsi,
  algoritma,
  algoritmaIsi = "inside-outside"
) {
  const algoritmaGambar =
    algoritma === "bresenham"
      ? AlgoritmaBresenham.gambarGaris
      : AlgoritmaDDA.gambarGaris;

  // Jika perlu diisi, gambar batas sementara dan panggil algoritma isi
  if (warnaIsi && warnaIsi !== "#ffffff" && titik.length > 2) {
    if (algoritmaIsi === "inside-outside") {
      AlgoritmaInsideOutside.isiPoligon(ctx, titik, warnaIsi);
    } else if (algoritmaIsi !== "scan-line") {
      // Gambar batas solid sementara untuk boundary/flood fill
      const plotterBatasIsi = createPlotterForObject({
        warnaGaris: warnaGaris,
        ketebalan: 1,
        jenisBrush: "pena",
      });
      for (let i = 0; i < titik.length; i++) {
        const j = (i + 1) % titik.length;
        algoritmaGambar(
          plotterBatasIsi,
          titik[i][0],
          titik[i][1],
          titik[j][0],
          titik[j][1]
        );
      }
    }

    // Hitung titik tengah untuk memulai pengisian
    let cx = 0,
      cy = 0;
    titik.forEach((p) => {
      cx += p[0];
      cy += p[1];
    });
    cx = Math.floor(cx / titik.length);
    cy = Math.floor(cy / titik.length);

    // Lakukan pengisian
    switch (algoritmaIsi) {
      case "scan-line":
        AlgoritmaScanLine.isiPoligon(ctx, titik, warnaIsi);
        break;
      case "boundary-fill":
        AlgoritmaIsiArea.boundaryFill(ctx, cx, cy, warnaIsi, warnaGaris);
        break;
      case "flood-fill":
        AlgoritmaIsiArea.floodFill(ctx, cx, cy, warnaIsi);
        break;
    }
  }

  // Gambar garis batas akhir menggunakan plotter yang diberikan
  for (let i = 0; i < titik.length; i++) {
    const j = (i + 1) % titik.length;
    algoritmaGambar(
      plotter,
      titik[i][0],
      titik[i][1],
      titik[j][0],
      titik[j][1]
    );
  }
}

function isiArea(e) {
  const rect = kanvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  let objekDitemukan = null;
  for (let i = objekList.length - 1; i >= 0; i--) {
    if (apakahTitikDalamObjek(x, y, objekList[i])) {
      objekDitemukan = objekList[i];
      break;
    }
  }

  if (objekDitemukan) {
    // Validasi algoritma untuk jenis objek
    if (algoritmaIsi === "scan-line" && objekDitemukan.jenis !== "poligon") {
      alert("Algoritma Scan-Line hanya dapat digunakan untuk objek poligon.");
      return;
    }

    // Untuk objek non-poligon, hanya Inside-Outside Test yang menggunakan boundary fill
    if (objekDitemukan.jenis !== "poligon") {
      if (algoritmaIsi === "boundary-fill") {
        alert(
          "Algoritma Boundary-Fill sebaiknya digunakan untuk objek poligon."
        );
      } else if (algoritmaIsi === "flood-fill") {
        alert("Algoritma Flood-Fill sebaiknya digunakan untuk objek poligon.");
      }
      // Tetap lanjutkan dengan pengisian, tapi gunakan Inside-Outside Test
      objekDitemukan.algoritmaIsi = "inside-outside";
    } else {
      objekDitemukan.algoritmaIsi = algoritmaIsi;
    }

    objekDitemukan.warnaIsi = warnaIsi;
    gambarUlangSemuaObjek();
  }
}

/**
 * Membuat fungsi plotter yang dikonfigurasi dengan properti brush dari sebuah objek.
 * @param {object} objek - Objek yang akan digambar (harus memiliki properti warnaGaris, ketebalan, jenisBrush).
 * @returns {function(number, number): void} - Fungsi plotter yang siap digunakan.
 */
function createPlotterForObject(objek) {
  const tebal = objek.ketebalan || 1;
  const warna = objek.warnaGaris || "#000000";
  const brush = objek.jenisBrush || "pena";
  const warnaRgb = hexToRgb(warna);

  return function (x, y) {
    ctx.fillStyle = warna;
    ctx.beginPath();

    switch (brush) {
      case "spidol":
        ctx.fillRect(x - tebal / 2, y - tebal / 2, tebal, tebal);
        break;

      case "pensil":
        for (let i = 0; i < tebal * 2; i++) {
          const offsetX = (Math.random() - 0.5) * tebal;
          const offsetY = (Math.random() - 0.5) * tebal;
          const alpha = 0.5 - Math.random() * 0.3;
          ctx.fillStyle = `rgba(${warnaRgb.join(",")}, ${alpha})`;
          ctx.fillRect(x + offsetX, y + offsetY, 1, 1);
        }
        break;

      case "cat-air":
        ctx.globalAlpha = 0.1;
        ctx.arc(x, y, tebal * (Math.random() * 0.5 + 0.5), 0, 2 * Math.PI);
        ctx.fill();
        ctx.globalAlpha = 1.0;
        break;

      case "pena":
      default:
        ctx.arc(x, y, tebal / 2, 0, 2 * Math.PI);
        ctx.fill();
        break;
    }
  };
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
      ]
    : [0, 0, 0];
}

function gambarGoresanPena(plotter, titik) {
  if (titik.length < 2) return;
  for (let i = 0; i < titik.length - 1; i++) {
    const p1 = titik[i];
    const p2 = titik[i + 1];
    AlgoritmaBresenham.gambarGaris(plotter, p1.x, p1.y, p2.x, p2.y, "solid");
  }
}
