/**
 * Menangani semua logika yang berhubungan dengan menggambar di kanvas.
 */

function mulaiMenggambar(e) {
  sedangMenggambar = true;
  const rect = kanvas.getBoundingClientRect();
  titikAwal.x = e.clientX - rect.left;
  titikAwal.y = e.clientY - rect.top;
}

function sedangMenggambarObjek(e) {
  if (!sedangMenggambar) return;

  const rect = kanvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  gambarUlangSemuaObjek();

  switch (jenisObjek) {
    case "garis":
      if (algoritmaTerpilih === "dda") {
        AlgoritmaDDA.gambarGaris(
          ctx,
          titikAwal.x,
          titikAwal.y,
          x,
          y,
          warnaGaris,
          jenisGaris
        );
      } else {
        AlgoritmaBresenham.gambarGaris(
          ctx,
          titikAwal.x,
          titikAwal.y,
          x,
          y,
          warnaGaris,
          jenisGaris
        );
      }
      break;
    case "persegi":
      gambarPersegi(titikAwal.x, titikAwal.y, x - titikAwal.x, y - titikAwal.y);
      break;
    case "segitiga":
      gambarSegitiga(titikAwal.x, titikAwal.y, x, y);
      break;
    case "jajargenjang":
      gambarJajargenjang(titikAwal.x, titikAwal.y, x, y);
      break;
    case "trapesium":
      gambarTrapesium(titikAwal.x, titikAwal.y, x, y);
      break;
    case "lingkaran":
      const radius = Math.sqrt(
        Math.pow(x - titikAwal.x, 2) + Math.pow(y - titikAwal.y, 2)
      );
      let algoritmaLingkaranPreview;
      if (algoritmaTerpilih === "midpoint") {
        algoritmaLingkaranPreview = AlgoritmaMidpointLingkaran.gambarLingkaran;
      } else if (algoritmaTerpilih === "simetris") {
        algoritmaLingkaranPreview =
          AlgoritmaSimetrisDelapanTitik.gambarLingkaran;
      } else {
        // simetris_empat
        algoritmaLingkaranPreview = AlgoritmaSimetrisEmpatTitik.gambarLingkaran;
      }
      algoritmaLingkaranPreview(
        ctx,
        titikAwal.x,
        titikAwal.y,
        radius,
        warnaGaris,
        warnaIsi,
        jenisGaris
      );
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
        warnaGaris,
        jenisGaris,
        algoritma: algoritmaTerpilih,
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
        warnaGaris,
        warnaIsi,
        jenisGaris,
        algoritmaGaris: "bresenham",
      };
      break;
    case "segitiga":
      objekBaru = {
        jenis: "poligon",
        titik: hitungTitikSegitiga(titikAwal.x, titikAwal.y, x, y),
        warnaGaris,
        warnaIsi,
        jenisGaris,
        algoritmaGaris: "bresenham",
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
        warnaGaris,
        warnaIsi,
        jenisGaris,
        algoritma: algoritmaTerpilih,
      };
      break;
    case "elips":
      objekBaru = {
        jenis: "elips",
        xc: titikAwal.x,
        yc: titikAwal.y,
        rx: Math.abs(x - titikAwal.x),
        ry: Math.abs(y - titikAwal.y),
        warnaGaris,
        warnaIsi,
        jenisGaris,
        algoritma: algoritmaTerpilih,
      };
      break;
    case "jajargenjang":
      objekBaru = {
        jenis: "poligon",
        titik: hitungTitikJajargenjang(titikAwal.x, titikAwal.y, x, y),
        warnaGaris,
        warnaIsi,
        jenisGaris,
        algoritmaGaris: "bresenham",
      };
      break;
    case "trapesium":
      objekBaru = {
        jenis: "poligon",
        titik: hitungTitikTrapesium(titikAwal.x, titikAwal.y, x, y),
        warnaGaris,
        warnaIsi,
        jenisGaris,
        algoritmaGaris: "bresenham",
      };
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
  switch (objek.jenis) {
    case "garis":
      const algoritmaGambarGaris =
        objek.algoritma === "bresenham"
          ? AlgoritmaBresenham.gambarGaris
          : AlgoritmaDDA.gambarGaris;
      algoritmaGambarGaris(
        ctx,
        objek.x1,
        objek.y1,
        objek.x2,
        objek.y2,
        objek.warnaGaris,
        objek.jenisGaris
      );
      break;
    case "poligon":
      gambarPoligon(
        objek.titik,
        objek.warnaGaris,
        objek.warnaIsi,
        objek.jenisGaris,
        objek.algoritmaGaris,
        objek.algoritmaIsi
      );
      break;
    case "lingkaran":
      let algoritmaGambarLingkaran;
      if (objek.algoritma === "midpoint") {
        algoritmaGambarLingkaran = AlgoritmaMidpointLingkaran.gambarLingkaran;
      } else if (objek.algoritma === "simetris") {
        algoritmaGambarLingkaran =
          AlgoritmaSimetrisDelapanTitik.gambarLingkaran;
      } else {
        algoritmaGambarLingkaran = AlgoritmaSimetrisEmpatTitik.gambarLingkaran;
      }

      // Selalu gambar batas solid terlebih dahulu untuk pengisian yang andal
      algoritmaGambarLingkaran(
        ctx,
        objek.xc,
        objek.yc,
        objek.radius,
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
        algoritmaGambarLingkaran(
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
  titik,
  warnaGaris,
  warnaIsi,
  jenisGaris,
  algoritma,
  algoritmaIsi = "inside-outside"
) {
  const algoritmaGambar =
    algoritma === "bresenham"
      ? AlgoritmaBresenham.gambarGaris
      : AlgoritmaDDA.gambarGaris;

  // Jika perlu diisi, gambar batas terlebih dahulu
  if (warnaIsi && warnaIsi !== "#ffffff" && titik.length > 2) {
    // Untuk algoritma yang memerlukan batas (boundary/flood), gambar batas solid sementara
    if (
      algoritmaIsi === "boundary-fill" ||
      algoritmaIsi === "flood-fill" ||
      algoritmaIsi === "inside-outside"
    ) {
      gambarGarisBatasSementara(titik, warnaGaris, algoritma);
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
      case "inside-outside": // Menggunakan boundary fill
        AlgoritmaIsiArea.boundaryFill(ctx, cx, cy, warnaIsi, warnaGaris);
        break;
      case "flood-fill":
        AlgoritmaIsiArea.floodFill(ctx, cx, cy, warnaIsi);
        break;
    }
  }

  // Gambar garis batas akhir di atas isian dengan style yang benar
  for (let i = 0; i < titik.length; i++) {
    const j = (i + 1) % titik.length;
    algoritmaGambar(
      ctx,
      titik[i][0],
      titik[i][1],
      titik[j][0],
      titik[j][1],
      warnaGaris,
      jenisGaris
    );
  }
}

// Fungsi helper untuk menggambar garis batas sementara (solid) untuk boundary fill
function gambarGarisBatasSementara(titik, warnaGaris, algoritma) {
  const algoritmaGambar =
    algoritma === "bresenham"
      ? AlgoritmaBresenham.gambarGaris
      : AlgoritmaDDA.gambarGaris;
  for (let i = 0; i < titik.length; i++) {
    const j = (i + 1) % titik.length;
    algoritmaGambar(
      ctx,
      titik[i][0],
      titik[i][1],
      titik[j][0],
      titik[j][1],
      warnaGaris,
      "solid" // Gunakan solid untuk boundary fill
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
