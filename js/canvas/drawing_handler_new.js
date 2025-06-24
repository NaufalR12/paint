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
      // Isi area terlebih dahulu jika ada warna isi
      if (objek.warnaIsi && objek.warnaIsi !== "#ffffff") {
        if (objek.algoritmaIsi === "flood-fill") {
          AlgoritmaIsiArea.floodFill(
            ctx,
            Math.floor(objek.xc),
            Math.floor(objek.yc),
            objek.warnaIsi
          );
        } else {
          // Inside-Outside Test dan Boundary-Fill menggunakan boundary fill
          AlgoritmaIsiArea.boundaryFill(
            ctx,
            Math.floor(objek.xc),
            Math.floor(objek.yc),
            objek.warnaIsi,
            objek.warnaGaris
          );
        }
      }

      // Gambar garis lingkaran
      let algoritmaGambarLingkaran;
      if (objek.algoritma === "midpoint") {
        algoritmaGambarLingkaran = AlgoritmaMidpointLingkaran.gambarLingkaran;
      } else if (objek.algoritma === "simetris") {
        algoritmaGambarLingkaran =
          AlgoritmaSimetrisDelapanTitik.gambarLingkaran;
      } else {
        // simetris_empat
        algoritmaGambarLingkaran = AlgoritmaSimetrisEmpatTitik.gambarLingkaran;
      }
      algoritmaGambarLingkaran(
        ctx,
        objek.xc,
        objek.yc,
        objek.radius,
        objek.warnaGaris,
        null, // Warna isi diatur ke null karena kita menangani pengisian secara terpisah
        objek.jenisGaris
      );
      break;
    case "elips":
      // Isi area terlebih dahulu jika ada warna isi
      if (objek.warnaIsi && objek.warnaIsi !== "#ffffff") {
        if (objek.algoritmaIsi === "flood-fill") {
          AlgoritmaIsiArea.floodFill(
            ctx,
            Math.floor(objek.xc),
            Math.floor(objek.yc),
            objek.warnaIsi
          );
        } else {
          // Inside-Outside Test dan Boundary-Fill menggunakan boundary fill
          AlgoritmaIsiArea.boundaryFill(
            ctx,
            Math.floor(objek.xc),
            Math.floor(objek.yc),
            objek.warnaIsi,
            objek.warnaGaris
          );
        }
      }

      // Gambar garis elips
      if (objek.algoritma === "midpoint_elips") {
        AlgoritmaMidpointElips.gambarElips(
          ctx,
          objek.xc,
          objek.yc,
          objek.rx,
          objek.ry,
          objek.warnaGaris,
          null, // Warna isi diatur ke null karena kita menangani pengisian secara terpisah
          objek.jenisGaris
        );
      } else {
        // simetris_empat_elips
        AlgoritmaSimetrisEmpatTitikElips.gambarElips(
          ctx,
          objek.xc,
          objek.yc,
          objek.rx,
          objek.ry,
          objek.warnaGaris,
          null, // Warna isi diatur ke null karena kita menangani pengisian secara terpisah
          objek.jenisGaris
        );
      }
      break;
  }
  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;
} 