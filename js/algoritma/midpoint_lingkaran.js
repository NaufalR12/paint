/**
 * Implementasi algoritma Midpoint untuk menggambar lingkaran
 */
class AlgoritmaMidpointLingkaran {
  /**
   * Menggambar delapan titik simetris untuk lingkaran.
   * @param {function(number, number): void} plotter - Fungsi untuk menggambar satu titik (x, y).
   * @param {number} xc - Koordinat x pusat.
   * @param {number} yc - Koordinat y pusat.
   * @param {number} x - Offset x dari pusat.
   * @param {number} y - Offset y dari pusat.
   */
  static gambarDelapanTitik(plotter, xc, yc, x, y) {
    plotter(xc + x, yc + y);
    plotter(xc - x, yc + y);
    plotter(xc + x, yc - y);
    plotter(xc - x, yc - y);
    plotter(xc + y, yc + x);
    plotter(xc - y, yc + x);
    plotter(xc + y, yc - x);
    plotter(xc - y, yc - x);
  }

  /**
   * Menggambar lingkaran menggunakan algoritma Midpoint dan plotter kustom.
   * @param {function(number, number): void} plotter - Fungsi untuk menggambar satu titik (x, y).
   * @param {number} xc - Koordinat x pusat.
   * @param {number} yc - Koordinat y pusat.
   * @param {number} r - Radius lingkaran.
   */
  static gambarLingkaran(plotter, xc, yc, r) {
    let x = 0;
    let y = Math.round(r);
    let p = 1 - y;

    this.gambarDelapanTitik(plotter, xc, yc, x, y);

    while (x < y) {
      x++;
      if (p < 0) {
        p += 2 * x + 1;
      } else {
        y--;
        p += 2 * (x - y) + 1;
      }
      this.gambarDelapanTitik(plotter, xc, yc, x, y);
    }
  }
}
