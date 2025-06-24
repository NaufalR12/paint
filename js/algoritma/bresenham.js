/**
 * Implementasi algoritma Bresenham
 * untuk menggambar garis pada canvas
 */
class AlgoritmaBresenham {
  /**
   * Menggambar garis menggunakan algoritma Bresenham dan fungsi plotter kustom.
   * @param {function(number, number): void} plotter - Fungsi untuk menggambar satu titik (x, y).
   * @param {number} x1 - Koordinat x awal.
   * @param {number} y1 - Koordinat y awal.
   * @param {number} x2 - Koordinat x akhir.
   * @param {number} y2 - Koordinat y akhir.
   * @param {string} jenisGaris - Tipe garis ('solid', 'dashed', 'dotted', 'dashdot').
   */
  static gambarGaris(plotter, x1, y1, x2, y2, jenisGaris = "solid") {
    x1 = Math.round(x1);
    y1 = Math.round(y1);
    x2 = Math.round(x2);
    y2 = Math.round(y2);

    let dx = Math.abs(x2 - x1);
    let dy = Math.abs(y2 - y1);
    let sx = x1 < x2 ? 1 : -1;
    let sy = y1 < y2 ? 1 : -1;
    let err = dx - dy;
    let counter = 0; // Counter untuk pola garis

    while (true) {
      counter++;
      let draw = false;
      switch (jenisGaris) {
        case "solid":
          draw = true;
          break;
        case "dashed":
          draw = counter % 10 < 7; // 7 piksel gambar, 3 piksel kosong
          break;
        case "dotted":
          draw = counter % 4 < 2; // 2 piksel gambar, 2 piksel kosong
          break;
        case "dashdot":
          // Pola: Dash (7px), space (3px), dot (2px), space (3px) -> total 15
          const patternPos = counter % 15;
          draw = patternPos < 7 || (patternPos >= 10 && patternPos < 12);
          break;
        default:
          draw = true;
      }

      if (draw) {
        plotter(x1, y1);
      }

      if (x1 === x2 && y1 === y2) break;
      let e2 = 2 * err;
      if (e2 > -dy) {
        err -= dy;
        x1 += sx;
      }
      if (e2 < dx) {
        err += dx;
        y1 += sy;
      }
    }
  }
}
