/**
 * Implementasi algoritma pengisian area Scan-Line.
 */
const AlgoritmaScanLine = (() => {
  /**
   * Mengisi poligon menggunakan algoritma scan-line.
   * @param {CanvasRenderingContext2D} ctx - Konteks kanvas.
   * @param {Array} titik - Array titik-titik poligon [[x1,y1], [x2,y2], ...].
   * @param {string} warna - Warna isian.
   */
  function isiPoligon(ctx, titik, warna) {
    if (titik.length < 3) return;

    ctx.fillStyle = warna;

    // Temukan y min dan y max dari poligon
    let yMin = titik[0][1];
    let yMax = titik[0][1];
    for (let i = 1; i < titik.length; i++) {
      if (titik[i][1] < yMin) yMin = titik[i][1];
      if (titik[i][1] > yMax) yMax = titik[i][1];
    }

    // Loop untuk setiap baris scan (scan-line) dari yMin ke yMax
    for (let y = Math.floor(yMin); y <= Math.ceil(yMax); y++) {
      let nodeX = [];
      let j = titik.length - 1;
      for (let i = 0; i < titik.length; i++) {
        const [px_i, py_i] = titik[i];
        const [px_j, py_j] = titik[j];

        // Cek apakah scan-line (y) memotong tepi poligon (i, j)
        if ((py_i < y && py_j >= y) || (py_j < y && py_i >= y)) {
          // Hitung koordinat x dari titik potong
          const x = px_i + ((y - py_i) / (py_j - py_i)) * (px_j - px_i);
          nodeX.push(x);
        }
        j = i;
      }

      // Urutkan titik potong dari kiri ke kanan
      nodeX.sort((a, b) => a - b);

      // Isi piksel di antara pasangan titik potong
      for (let i = 0; i < nodeX.length; i += 2) {
        if (i + 1 < nodeX.length) {
          const x1 = Math.round(nodeX[i]);
          const x2 = Math.round(nodeX[i + 1]);
          for (let px = x1; px < x2; px++) {
            ctx.fillRect(px, y, 1, 1);
          }
        }
      }
    }
  }

  return {
    isiPoligon,
  };
})();
