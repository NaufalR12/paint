function gambarObjek(objek) {
  if (objek === objekTerpilih) {
    ctx.shadowColor = "rgba(0, 0, 255, 0.7)";
    ctx.shadowBlur = 10;
  } else {
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
  }
  ctx.strokeStyle = objek.warnaGaris;
  ctx.fillStyle = objek.warnaIsi;
  switch (objek.jenis) {
    case "garis":
      const algoritmaGambarGaris =
        objek.algoritma === "bresenham"
          ? AlgoritmaBresenham.gambarGaris
          : AlgoritmaDDA.gambarGaris;
      algoritmaGambarGaris(
        ctx,
        objek.x1,
        objek.y1,
        objek.x2,
        objek.y2,
        objek.warnaGaris,
        objek.jenisGaris
      );
      break;
    case "poligon":
      gambarPoligon(
        objek.titik,
        objek.warnaGaris,
        objek.warnaIsi,
        objek.jenisGaris,
        objek.algoritmaGaris,
        objek.algoritmaIsi
      );
      break;
    case "lingkaran":
      // Isi area terlebih dahulu jika ada warna isi
      if (objek.warnaIsi && objek.warnaIsi !== "#ffffff") {
        if (objek.algoritmaIsi === "flood-fill") {
          AlgoritmaIsiArea.floodFill(
            ctx,
            Math.floor(objek.xc),
            Math.floor(objek.yc),
            objek.warnaIsi
          );
        } else {
          // Inside-Outside Test dan Boundary-Fill menggunakan boundary fill
          AlgoritmaIsiArea.boundaryFill(
            ctx,
            Math.floor(objek.xc),
            Math.floor(objek.yc),
            objek.warnaIsi,
            objek.warnaGaris
          );
        }
      }

      // Gambar garis lingkaran
      let algoritmaGambarLingkaran;
      if (objek.algoritma === "midpoint") {
        algoritmaGambarLingkaran = AlgoritmaMidpointLingkaran.gambarLingkaran;
      } else if (objek.algoritma === "simetris") {
        algoritmaGambarLingkaran =
          AlgoritmaSimetrisDelapanTitik.gambarLingkaran;
      } else {
        // simetris_empat
        algoritmaGambarLingkaran = AlgoritmaSimetrisEmpatTitik.gambarLingkaran;
      }
      algoritmaGambarLingkaran(
        ctx,
        objek.xc,
        objek.yc,
        objek.radius,
        objek.warnaGaris,
        null, // Warna isi diatur ke null karena kita menangani pengisian secara terpisah
        objek.jenisGaris
      );
      break;
    case "elips":
      // Isi area terlebih dahulu jika ada warna isi
      if (objek.warnaIsi && objek.warnaIsi !== "#ffffff") {
        if (objek.algoritmaIsi === "flood-fill") {
          AlgoritmaIsiArea.floodFill(
            ctx,
            Math.floor(objek.xc),
            Math.floor(objek.yc),
            objek.warnaIsi
          );
        } else {
          // Inside-Outside Test dan Boundary-Fill menggunakan boundary fill
          AlgoritmaIsiArea.boundaryFill(
            ctx,
            Math.floor(objek.xc),
            Math.floor(objek.yc),
            objek.warnaIsi,
            objek.warnaGaris
          );
        }
      }

      // Gambar garis elips
      if (objek.algoritma === "midpoint_elips") {
        AlgoritmaMidpointElips.gambarElips(
          ctx,
          objek.xc,
          objek.yc,
          objek.rx,
          objek.ry,
          objek.warnaGaris,
          null, // Warna isi diatur ke null karena kita menangani pengisian secara terpisah
          objek.jenisGaris
        );
      } else {
        // simetris_empat_elips
        AlgoritmaSimetrisEmpatTitikElips.gambarElips(
          ctx,
          objek.xc,
          objek.yc,
          objek.rx,
          objek.ry,
          objek.warnaGaris,
          null, // Warna isi diatur ke null karena kita menangani pengisian secara terpisah
          objek.jenisGaris
        );
      }
      break;
  }
  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;
}

class DrawingTools {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.isDrawing = false;
    this.lastX = 0;
    this.lastY = 0;
    this.currentTool = "pen";
    this.size = 1;
    this.opacity = 1;
    this.texture = "solid";
    this.color = "#000000";

    // Binding methods
    this.startDrawing = this.startDrawing.bind(this);
    this.draw = this.draw.bind(this);
    this.stopDrawing = this.stopDrawing.bind(this);

    // Initialize event listeners
    this.initializeEventListeners();
  }

  initializeEventListeners() {
    this.canvas.addEventListener("mousedown", this.startDrawing);
    this.canvas.addEventListener("mousemove", this.draw);
    this.canvas.addEventListener("mouseup", this.stopDrawing);
    this.canvas.addEventListener("mouseout", this.stopDrawing);
  }

  startDrawing(e) {
    this.isDrawing = true;
    [this.lastX, this.lastY] = this.getMousePos(e);

    // Mulai path baru
    this.ctx.beginPath();
    this.ctx.moveTo(this.lastX, this.lastY);
  }

  draw(e) {
    if (!this.isDrawing) return;

    const [x, y] = this.getMousePos(e);

    this.ctx.globalAlpha = this.opacity;
    this.ctx.strokeStyle = this.color;
    this.ctx.fillStyle = this.color;
    this.ctx.lineWidth = this.size;
    this.ctx.lineCap = "round";
    this.ctx.lineJoin = "round";

    if (this.currentTool === "pen") {
      this.drawPen(x, y);
    } else if (this.currentTool === "brush") {
      this.drawBrush(x, y);
    }

    [this.lastX, this.lastY] = [x, y];
  }

  drawPen(x, y) {
    this.ctx.lineTo(x, y);
    this.ctx.stroke();
  }

  drawBrush(x, y) {
    switch (this.texture) {
      case "soft":
        this.drawSoftBrush(x, y);
        break;
      case "scatter":
        this.drawScatterBrush(x, y);
        break;
      case "square":
        this.drawSquareBrush(x, y);
        break;
      case "circle":
        this.drawCircleBrush(x, y);
        break;
      default:
        this.drawPen(x, y);
    }
  }

  drawSoftBrush(x, y) {
    const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, this.size);
    gradient.addColorStop(0, this.color);
    gradient.addColorStop(1, "rgba(0,0,0,0)");
    this.ctx.fillStyle = gradient;
    this.ctx.beginPath();
    this.ctx.arc(x, y, this.size, 0, Math.PI * 2);
    this.ctx.fill();
  }

  drawScatterBrush(x, y) {
    const points = 10;
    const spread = this.size;

    for (let i = 0; i < points; i++) {
      const offsetX = (Math.random() - 0.5) * spread * 2;
      const offsetY = (Math.random() - 0.5) * spread * 2;
      const radius = (Math.random() * this.size) / 4;

      this.ctx.beginPath();
      this.ctx.arc(x + offsetX, y + offsetY, radius, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  drawSquareBrush(x, y) {
    const size = this.size;
    this.ctx.fillRect(x - size / 2, y - size / 2, size, size);
  }

  drawCircleBrush(x, y) {
    this.ctx.beginPath();
    this.ctx.arc(x, y, this.size / 2, 0, Math.PI * 2);
    this.ctx.fill();
  }

  stopDrawing() {
    this.isDrawing = false;
    this.ctx.globalAlpha = 1;
  }

  getMousePos(e) {
    const rect = this.canvas.getBoundingClientRect();
    return [e.clientX - rect.left, e.clientY - rect.top];
  }

  // Setter methods
  setTool(tool) {
    this.currentTool = tool;
  }

  setSize(size) {
    this.size = size;
  }

  setOpacity(opacity) {
    this.opacity = opacity;
  }

  setTexture(texture) {
    this.texture = texture;
  }

  setColor(color) {
    this.color = color;
  }
}

// Export class
if (typeof module !== "undefined" && module.exports) {
  module.exports = DrawingTools;
}
