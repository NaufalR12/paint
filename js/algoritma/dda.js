/**
 * Implementasi algoritma DDA (Digital Differential Analyzer)
 * untuk menggambar garis pada canvas
 */
class AlgoritmaDDA {
  /**
   * Menggambar garis menggunakan algoritma DDA dan fungsi plotter kustom.
   * @param {function(number, number): void} plotter - Fungsi untuk menggambar satu titik (x, y).
   * @param {number} x1 - Koordinat x awal.
   * @param {number} y1 - Koordinat y awal.
   * @param {number} x2 - Koordinat x akhir.
   * @param {number} y2 - Koordinat y akhir.
   */
  static gambarGaris(plotter, x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const steps = Math.abs(dx) > Math.abs(dy) ? Math.abs(dx) : Math.abs(dy);

    const xIncrement = dx / steps;
    const yIncrement = dy / steps;

    let x = x1;
    let y = y1;

    for (let i = 0; i <= steps; i++) {
      plotter(Math.round(x), Math.round(y));
      x += xIncrement;
      y += yIncrement;
    }
  }
}
