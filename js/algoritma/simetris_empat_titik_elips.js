/**
 * Implementasi algoritma elips menggunakan Simetris Empat Titik.
 * Logika perhitungan identik dengan Midpoint, karena keduanya menghasilkan
 * titik di satu kuadran yang kemudian dipetakan ke kuadran lain.
 */
const AlgoritmaSimetrisEmpatTitikElips = (() => {
  /**
   * Menggambar 4 titik simetris pada elips.
   */
  function gambarTitikSimetris(ctx, xc, yc, x, y, warna) {
    ctx.fillStyle = warna;
    ctx.fillRect(xc + x, yc + y, 1, 1);
    ctx.fillRect(xc - x, yc + y, 1, 1);
    ctx.fillRect(xc + x, yc - y, 1, 1);
    ctx.fillRect(xc - x, yc - y, 1, 1);
  }

  /**
   * Menggambar elips menggunakan algoritma Midpoint/4-way symmetry.
   */
  function gambarElips(ctx, xc, yc, rx, ry, warnaGaris, warnaIsi) {
    let x = 0;
    let y = ry;

    // Parameter keputusan untuk region 1
    let d1 = ry * ry - rx * rx * ry + 0.25 * rx * rx;
    let dx = 2 * ry * ry * x;
    let dy = 2 * rx * rx * y;

    // Region 1
    while (dx < dy) {
      gambarTitikSimetris(ctx, xc, yc, x, y, warnaGaris);
      if (d1 < 0) {
        x++;
        dx = dx + 2 * ry * ry;
        d1 = d1 + dx + ry * ry;
      } else {
        x++;
        y--;
        dx = dx + 2 * ry * ry;
        dy = dy - 2 * rx * rx;
        d1 = d1 + dx - dy + ry * ry;
      }
    }

    // Parameter keputusan untuk region 2
    let d2 =
      ry * ry * ((x + 0.5) * (x + 0.5)) +
      rx * rx * ((y - 1) * (y - 1)) -
      rx * rx * ry * ry;

    // Region 2
    while (y >= 0) {
      gambarTitikSimetris(ctx, xc, yc, x, y, warnaGaris);
      if (d2 > 0) {
        y--;
        dy = dy - 2 * rx * rx;
        d2 = d2 + rx * rx - dy;
      } else {
        y--;
        x++;
        dx = dx + 2 * ry * ry;
        dy = dy - 2 * rx * rx;
        d2 = d2 + dx - dy + rx * rx;
      }
    }

    if (warnaIsi && warnaIsi !== "#ffffff") {
      IsiArea.floodFill(ctx, Math.floor(xc), Math.floor(yc), warnaIsi);
    }
  }

  return {
    gambarElips,
  };
})();
