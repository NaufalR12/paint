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
   */
  static gambarGaris(plotter, x1, y1, x2, y2) {
    x1 = Math.round(x1);
    y1 = Math.round(y1);
    x2 = Math.round(x2);
    y2 = Math.round(y2);

    let dx = Math.abs(x2 - x1);
    let dy = Math.abs(y2 - y1);
    let sx = x1 < x2 ? 1 : -1;
    let sy = y1 < y2 ? 1 : -1;
    let err = dx - dy;

    while (true) {
      plotter(x1, y1);

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
