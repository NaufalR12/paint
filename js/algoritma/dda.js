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
   * @param {string} jenisGaris - Tipe garis ('solid', 'dashed', 'dotted', 'dashdot').
   */
  static gambarGaris(plotter, x1, y1, x2, y2, jenisGaris = "solid") {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const steps = Math.abs(dx) > Math.abs(dy) ? Math.abs(dx) : Math.abs(dy);

    const xIncrement = dx / steps;
    const yIncrement = dy / steps;

    let x = x1;
    let y = y1;

    for (let i = 0; i <= steps; i++) {
      let draw = false;
      switch (jenisGaris) {
        case "solid":
          draw = true;
          break;
        case "dashed":
          draw = i % 10 < 7;
          break;
        case "dotted":
          draw = i % 4 < 2;
          break;
        case "dashdot":
          const patternPos = i % 15;
          draw = patternPos < 7 || (patternPos >= 10 && patternPos < 12);
          break;
        default:
          draw = true;
      }

      if (draw) {
        plotter(Math.round(x), Math.round(y));
      }

      x += xIncrement;
      y += yIncrement;
    }
  }
}
