class Shear {
  /**
   * Menerapkan shear pada sebuah titik.
   * @param {number} x - Koordinat x titik.
   * @param {number} y - Koordinat y titik.
   * @param {number} shx - Faktor shear pada sumbu x.
   * @param {number} shy - Faktor shear pada sumbu y.
   * @param {number} xPusat - Koordinat x pusat shear.
   * @param {number} yPusat - Koordinat y pusat shear.
   * @returns {Object} Titik hasil shear.
   */
  static titik(x, y, shx, shy, xPusat, yPusat) {
    // Translasi ke titik pusat
    const tx = x - xPusat;
    const ty = y - yPusat;

    // Terapkan shear
    const xBaru = tx + shx * ty;
    const yBaru = shy * tx + ty;

    // Translasi kembali
    return {
      x: xBaru + xPusat,
      y: yBaru + yPusat,
    };
  }

  /**
   * Menerapkan shear pada sebuah array titik.
   * @param {Array<Array<number>>} titik - Array titik [[x1, y1], [x2, y2], ...].
   * @param {number} shx - Faktor shear x.
   * @param {number} shy - Faktor shear y.
   * @param {number} xPusat - Koordinat x pusat shear.
   * @param {number} yPusat - Koordinat y pusat shear.
   * @returns {Array<Array<number>>} Array titik hasil shear.
   */
  static arrayTitik(titik, shx, shy, xPusat, yPusat) {
    return titik.map(([x, y]) => {
      const hasil = this.titik(x, y, shx, shy, xPusat, yPusat);
      return [hasil.x, hasil.y];
    });
  }

  /**
   * Menerapkan shear pada sebuah objek.
   * @param {Object} objek - Objek yang akan di-shear.
   * @param {number} shx - Faktor shear x.
   * @param {number} shy - Faktor shear y.
   */
  static objek(objek, shx, shy) {
    if (!objek) return;

    let xPusat, yPusat;

    // Tentukan titik pusat
    if (objek.jenis === "titik") {
      return; // Shear tidak berlaku untuk satu titik
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

    // Terapkan shear berdasarkan jenis objek
    if (objek.jenis === "garis") {
      const titik1 = this.titik(objek.x1, objek.y1, shx, shy, xPusat, yPusat);
      const titik2 = this.titik(objek.x2, objek.y2, shx, shy, xPusat, yPusat);
      objek.x1 = titik1.x;
      objek.y1 = titik1.y;
      objek.x2 = titik2.x;
      objek.y2 = titik2.y;
    } else if (objek.jenis === "lingkaran" || objek.jenis === "elips") {
      // Shear pada lingkaran/elips akan mengubahnya menjadi poligon
      // Untuk simplifikasi, kita ubah objeknya menjadi poligon
      console.warn(
        "Shear pada lingkaran/elips mengubahnya menjadi bentuk lain. Implementasi ini disederhanakan."
      );
      // Untuk sekarang, kita tidak melakukan apa-apa pada lingkaran/elips
    } else if (objek.jenis === "poligon") {
      objek.titik = this.arrayTitik(objek.titik, shx, shy, xPusat, yPusat);
    }
  }
}
