/**
 * Implementasi algoritma lingkaran menggunakan Simetris Delapan Titik (Bresenham's Circle Algorithm).
 */
const AlgoritmaSimetrisDelapanTitik = (() => {
  /**
   * Menggambar 8 titik simetris pada lingkaran.
   * @param {CanvasRenderingContext2D} ctx - Konteks kanvas.
   * @param {number} xc - Koordinat x pusat lingkaran.
   * @param {number} yc - Koordinat y pusat lingkaran.
   * @param {number} x - Jarak x dari pusat.
   * @param {number} y - Jarak y dari pusat.
   * @param {string} warna - Warna titik.
   */
  function gambarTitikSimetris(ctx, xc, yc, x, y, warna, jenisGaris, counter) {
    if (jenisGaris === "solid") {
      // Selalu gambar untuk garis solid
    } else if (jenisGaris === "dashed") {
      if (Math.floor(counter / 10) % 2 === 0) return; // Lewati sebagian titik untuk garis putus-putus
    } else if (jenisGaris === "dotted") {
      if (counter % 10 !== 0) return; // Hanya gambar beberapa titik
    } else if (jenisGaris === "dashdot") {
      const pattern = Math.floor(counter / 10) % 3;
      if (pattern === 1) return; // Lewati segmen kedua dari pola dash-dot-dot
    }

    ctx.fillStyle = warna;
    ctx.fillRect(xc + x, yc + y, 1, 1);
    ctx.fillRect(xc - x, yc + y, 1, 1);
    ctx.fillRect(xc + x, yc - y, 1, 1);
    ctx.fillRect(xc - x, yc - y, 1, 1);
    ctx.fillRect(xc + y, yc + x, 1, 1);
    ctx.fillRect(xc - y, yc + x, 1, 1);
    ctx.fillRect(xc + y, yc - x, 1, 1);
    ctx.fillRect(xc - y, yc - x, 1, 1);
  }

  /**
   * Menggambar lingkaran menggunakan algoritma Bresenham.
   * @param {CanvasRenderingContext2D} ctx - Konteks kanvas.
   * @param {number} xc - Koordinat x pusat lingkaran.
   * @param {number} yc - Koordinat y pusat lingkaran.
   * @param {number} r - Radius lingkaran.
   * @param {string} warnaGaris - Warna garis lingkaran.
   * @param {string} warnaIsi - Warna isi lingkaran (opsional).
   * @param {string} jenisGaris - Jenis garis (solid, dashed, dotted, dashdot).
   */
  function gambarLingkaran(
    ctx,
    xc,
    yc,
    r,
    warnaGaris,
    warnaIsi,
    jenisGaris = "solid"
  ) {
    let x = 0;
    let y = r;
    let d = 3 - 2 * r;
    let counter = 0; // Counter untuk pola garis

    // Gambar titik awal
    gambarTitikSimetris(ctx, xc, yc, x, y, warnaGaris, jenisGaris, counter++);

    while (y >= x) {
      x++;

      if (d > 0) {
        y--;
        d = d + 4 * (x - y) + 10;
      } else {
        d = d + 4 * x + 6;
      }
      gambarTitikSimetris(ctx, xc, yc, x, y, warnaGaris, jenisGaris, counter++);
    }

    if (warnaIsi && warnaIsi !== "#ffffff") {
      // Panggil fungsi isi area jika diperlukan
      IsiArea.floodFill(ctx, Math.floor(xc), Math.floor(yc), warnaIsi);
    }
  }

  return {
    gambarLingkaran,
  };
})();
