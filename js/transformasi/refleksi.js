class Refleksi {
  /**
   * Merefleksikan sebuah titik terhadap sumbu.
   * @param {number} x - Koordinat x titik.
   * @param {number} y - Koordinat y titik.
   * @param {string} jenis - Jenis refleksi ('x', 'y', atau 'origin').
   * @param {number} xPusat - Koordinat x pusat refleksi.
   * @param {number} yPusat - Koordinat y pusat refleksi.
   * @returns {Object} Titik hasil refleksi.
   */
  static titik(x, y, jenis, xPusat, yPusat) {
    let xBaru = x;
    let yBaru = y;

    if (jenis === "x") {
      yBaru = yPusat - (y - yPusat);
    } else if (jenis === "y") {
      xBaru = xPusat - (x - xPusat);
    } else if (jenis === "origin") {
      xBaru = xPusat - (x - xPusat);
      yBaru = yPusat - (y - yPusat);
    }

    return { x: xBaru, y: yBaru };
  }

  /**
   * Merefleksikan sebuah array titik.
   * @param {Array<Array<number>>} titik - Array titik [[x1, y1], [x2, y2], ...].
   * @param {string} jenis - Jenis refleksi.
   * @param {number} xPusat - Koordinat x pusat refleksi.
   * @param {number} yPusat - Koordinat y pusat refleksi.
   * @returns {Array<Array<number>>} Array titik hasil refleksi.
   */
  static arrayTitik(titik, jenis, xPusat, yPusat) {
    return titik.map(([x, y]) => {
      const hasil = this.titik(x, y, jenis, xPusat, yPusat);
      return [hasil.x, hasil.y];
    });
  }

  /**
   * Merefleksikan sebuah objek.
   * @param {Object} objek - Objek yang akan direfleksikan.
   * @param {string} jenis - Jenis refleksi ('x', 'y', 'origin').
   */
  static objek(objek, jenis) {
    if (!objek) return;

    let xPusat, yPusat;

    // Tentukan titik pusat refleksi
    if (objek.jenis === "titik") {
      xPusat = objek.x;
      yPusat = objek.y;
    } else if (objek.jenis === "garis") {
      xPusat = (objek.x1 + objek.x2) / 2;
      yPusat = (objek.y1 + objek.y2) / 2;
    } else if (objek.jenis === "lingkaran" || objek.jenis === "elips") {
      xPusat = objek.xc;
      yPusat = objek.yc;
    } else if (objek.jenis === "poligon") {
      const sumX = objek.titik.reduce((sum, [x]) => sum + x, 0);
      const sumY = objek.titik.reduce((sum, [_, y]) => sum + y, 0);
      xPusat = sumX / objek.titik.length;
      yPusat = sumY / objek.titik.length;
    } else {
      return; // Jenis objek tidak dikenal
    }

    // Terapkan refleksi berdasarkan jenis objek
    if (objek.jenis === "titik") {
      // Titik tidak berubah jika direfleksikan terhadap dirinya sendiri
    } else if (objek.jenis === "garis") {
      const titik1 = this.titik(objek.x1, objek.y1, jenis, xPusat, yPusat);
      const titik2 = this.titik(objek.x2, objek.y2, jenis, xPusat, yPusat);
      objek.x1 = titik1.x;
      objek.y1 = titik1.y;
      objek.x2 = titik2.x;
      objek.y2 = titik2.y;
    } else if (objek.jenis === "lingkaran" || objek.jenis === "elips") {
      // Refleksi lingkaran/elips hanya memindahkan pusatnya
      const pusatBaru = this.titik(objek.xc, objek.yc, jenis, xPusat, yPusat);
      objek.xc = pusatBaru.x;
      objek.yc = pusatBaru.y;
    } else if (objek.jenis === "poligon") {
      objek.titik = this.arrayTitik(objek.titik, jenis, xPusat, yPusat);
    }
  }
}
