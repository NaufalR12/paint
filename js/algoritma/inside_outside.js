/**
 * Algoritma Inside-Outside (Even-Odd Rule) untuk mengisi area poligon.
 * Cocok untuk poligon kompleks dan berlubang.
 */
const AlgoritmaInsideOutside = (() => {
  /**
   * Mengisi area poligon menggunakan prinsip inside-outside (even-odd rule).
   * @param {CanvasRenderingContext2D} ctx - Konteks canvas.
   * @param {Array} titik - Array titik-titik poligon [[x1, y1], [x2, y2], ...].
   * @param {string} warnaIsi - Warna isian.
   */
  function isiPoligon(ctx, titik, warnaIsi) {
    if (titik.length < 3) return;
    ctx.save();
    ctx.fillStyle = warnaIsi;

    // Cari bounding box poligon
    let minX = titik[0][0],
      maxX = titik[0][0];
    let minY = titik[0][1],
      maxY = titik[0][1];
    for (let i = 1; i < titik.length; i++) {
      if (titik[i][0] < minX) minX = titik[i][0];
      if (titik[i][0] > maxX) maxX = titik[i][0];
      if (titik[i][1] < minY) minY = titik[i][1];
      if (titik[i][1] > maxY) maxY = titik[i][1];
    }
    // Batasi bounding box ke ukuran kanvas
    minX = Math.max(0, Math.floor(minX));
    maxX = Math.min(ctx.canvas.width - 1, Math.ceil(maxX));
    minY = Math.max(0, Math.floor(minY));
    maxY = Math.min(ctx.canvas.height - 1, Math.ceil(maxY));

    let countFilled = 0;
    // Untuk setiap piksel dalam bounding box, cek inside-outside
    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        if (isInsidePolygon(x, y, titik)) {
          ctx.fillRect(x, y, 1, 1);
          countFilled++;
        }
      }
    }
    ctx.restore();
    // Log jumlah piksel yang diisi untuk debug
    console.log(
      "[Inside-Outside] Jumlah piksel diisi:",
      countFilled,
      "Bounding box:",
      minX,
      minY,
      maxX,
      maxY
    );
  }

  // Fungsi even-odd rule (ray casting)
  function isInsidePolygon(x, y, titik) {
    let inside = false;
    for (let i = 0, j = titik.length - 1; i < titik.length; j = i++) {
      const xi = titik[i][0],
        yi = titik[i][1];
      const xj = titik[j][0],
        yj = titik[j][1];
      const intersect =
        yi > y !== yj > y &&
        x < ((xj - xi) * (y - yi)) / (yj - yi + 0.00001) + xi;
      if (intersect) inside = !inside;
    }
    return inside;
  }

  return { isiPoligon };
})();
