import { Injectable, NgZone } from '@angular/core';

export interface GridConfig {
  rows: number;
  cols: number;
  gap: number;
}

@Injectable({
  providedIn: 'root'
})
export class CanvasService {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private currentGridConfig: GridConfig = { rows: 3, cols: 3, gap: 10 };
  private brushImage: HTMLImageElement | null = null;
  private brushSize: number = 60;
  private coverImage: HTMLImageElement | null = null;

  constructor(private ngZone: NgZone) {}

  initializeCanvas(canvasElement: HTMLCanvasElement, gridConfig: GridConfig, urlImage: string): void {
    this.canvas = canvasElement;
    const ctx = this.canvas.getContext('2d');
    if (!ctx) throw new Error('Cannot get 2D context from canvas');

    this.ctx = ctx;
    this.currentGridConfig = gridConfig;

    this.resizeCanvas();
    this.loadBrushTexture('/images/brush.png');
    this.loadCoverImage(urlImage, () => this.drawCoverImage());
  }

  private loadCoverImage(url: string, callback?: () => void): void {
    const img = new Image();
    img.src = url;
    img.onload = () => {
      this.coverImage = img;
      console.log('Cover image carregada');
      callback?.();
    };
    img.onerror = () => {
      console.error('Erro ao carregar cover image');
      this.coverImage = null;
      this.drawFallbackBackground();
    };
  }

  private loadBrushTexture(url: string): void {
    const img = new Image();
    img.src = url;
    img.onload = () => {
      this.brushImage = img;
      console.log('Brush image carregada');
    };
    img.onerror = () => {
      console.error('Erro ao carregar brush image');
    };
  }

  updateGridConfig(gridConfig: GridConfig): void {
    this.currentGridConfig = gridConfig;
    this.resizeCanvas();
    this.drawCoverImage();
  }

  setupResizeObserver(onResize: () => void): void {
    if (!this.canvas) return;

    this.resizeObserver = new ResizeObserver(() => {
      this.ngZone.runOutsideAngular(() => {
        this.resizeCanvas();
        this.drawCoverImage();
        onResize();
      });
    });

    const wrapper = this.canvas.parentElement;
    if (wrapper) this.resizeObserver.observe(wrapper);
  }

 private drawCoverImage(padding: number = 8): void {
  if (!this.ctx || !this.canvas) return;

  const { cols, rows, gap } = this.currentGridConfig;
  const borderRadius = 16;

  this.ctx.globalCompositeOperation = 'source-over';
  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);


  const availableWidth = this.canvas.width - padding * 2;
  const availableHeight = this.canvas.height - padding * 2;

  const totalGapWidth = gap * (cols - 1);
  const totalGapHeight = gap * (rows - 1);
  const slotWidth = (availableWidth - totalGapWidth) / cols;
  const slotHeight = (availableHeight - totalGapHeight) / rows;

  if (!this.coverImage) {
    this.drawFallbackBackground();
    return;
  }

  const image = this.coverImage;
  const srcSlotWidth = image.width / cols;
  const srcSlotHeight = image.height / rows;

  for (let position = 0; position < rows * cols; position++) {
    const col = position % cols;
    const row = Math.floor(position / cols);

    // 🔹 Aplica o padding ao posicionamento dos slots
    const destX = padding + col * (slotWidth + gap);
    const destY = padding + row * (slotHeight + gap);
    const destW = slotWidth;
    const destH = slotHeight;

    const srcX = col * srcSlotWidth;
    const srcY = row * srcSlotHeight;

    const aspectImage = srcSlotWidth / srcSlotHeight;
    const aspectSlot = destW / destH;
    let renderW = destW, renderH = destH, offsetX = 0, offsetY = 0;

    if (aspectImage > aspectSlot) {
      renderW = destW;
      renderH = destW / aspectImage;
      offsetY = (destH - renderH) / 2;
    } else {
      renderH = destH;
      renderW = destH * aspectImage;
      offsetX = (destW - renderW) / 2;
    }

    this.ctx.save();
    this.drawRoundedRect(destX, destY, destW, destH, borderRadius);
    this.ctx.clip();
    this.ctx.drawImage(
      image,
      srcX,
      srcY,
      srcSlotWidth,
      srcSlotHeight,
      destX + offsetX,
      destY + offsetY,
      renderW,
      renderH
    );
    this.ctx.restore();
  }
}


  performScratch(event: MouseEvent | TouchEvent): void {
    if (!this.brushImage || !this.ctx) return;
    const position = this.getMousePosition(event);
    const radius = this.brushSize / 2;
    this.ctx.save();
    this.ctx.globalCompositeOperation = 'destination-out';
    this.ctx.drawImage(this.brushImage, position.x - radius, position.y - radius, this.brushSize, this.brushSize);
    this.ctx.restore();
  }

  getSlotAtPosition(x: number, y: number): { col: number; row: number; position: number } | null {
    if (!this.canvas) return null;
    const { cols, rows, gap } = this.currentGridConfig;
    const totalGapWidth = gap * (cols - 1);
    const totalGapHeight = gap * (rows - 1);
    const slotWidth = (this.canvas.width - totalGapWidth) / cols;
    const slotHeight = (this.canvas.height - totalGapHeight) / rows;

    if (x < 0 || y < 0 || x > this.canvas.width || y > this.canvas.height) return null;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const currentX = col * (slotWidth + gap);
        const currentY = row * (slotHeight + gap);
        const slotRight = currentX + slotWidth;
        const slotBottom = currentY + slotHeight;
        if (x >= currentX && x <= slotRight && y >= currentY && y <= slotBottom) {
          return { col, row, position: row * cols + col };
        }
      }
    }
    return null;
  }

  checkScratchProgress(): boolean {
    if (!this.ctx || !this.canvas) return false;
    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    const totalPixels = this.canvas.width * this.canvas.height;
    let clearedPixels = 0;
    for (let i = 0; i < imageData.data.length; i += 4) {
      if (imageData.data[i + 3] === 0) clearedPixels++;
    }
    return (clearedPixels / totalPixels) * 100 > 70;
  }

  checkSlotScratchProgress(slotPosition: number): boolean {
    if (!this.ctx || !this.canvas) return false;

    const { cols, rows, gap } = this.currentGridConfig;
    if (slotPosition < 0 || slotPosition >= cols * rows) return false;

    const col = slotPosition % cols;
    const row = Math.floor(slotPosition / cols);
    const totalGapWidth = gap * (cols - 1);
    const totalGapHeight = gap * (rows - 1);
    const slotWidth = (this.canvas.width - totalGapWidth) / cols;
    const slotHeight = (this.canvas.height - totalGapHeight) / rows;
    const destX = col * (slotWidth + gap);
    const destY = row * (slotHeight + gap);

    const imageData = this.ctx.getImageData(destX, destY, slotWidth, slotHeight);
    const totalPixels = slotWidth * slotHeight;
    let clearedPixels = 0;
    for (let i = 0; i < imageData.data.length; i += 4) {
      if (imageData.data[i + 3] === 0) clearedPixels++;
    }
    return (clearedPixels / totalPixels) * 100 > 30;
  }

  clearCanvas(): void {
    if (!this.ctx || !this.canvas) return;
    this.ctx.globalCompositeOperation = 'source-over';
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  clearSlot(slotPosition: number): void {
    if (!this.ctx || !this.canvas) return;

    const { cols, rows, gap } = this.currentGridConfig;
    if (slotPosition < 0 || slotPosition >= cols * rows) return;

    const col = slotPosition % cols;
    const row = Math.floor(slotPosition / cols);
    const totalGapWidth = gap * (cols - 1);
    const totalGapHeight = gap * (rows - 1);
    const slotWidth = (this.canvas.width - totalGapWidth) / cols;
    const slotHeight = (this.canvas.height - totalGapHeight) / rows;
    const destX = col * (slotWidth + gap);
    const destY = row * (slotHeight + gap);

    this.ctx.globalCompositeOperation = 'destination-out';
    this.ctx.fillRect(destX, destY, slotWidth, slotHeight);
  }

  cleanup(): void {
    this.resizeObserver?.disconnect();
  }

  private drawRoundedRect(x: number, y: number, width: number, height: number, radius: number): void {
    if (!this.ctx) return;
    const r = Math.min(radius, width / 2, height / 2);
    this.ctx.beginPath();
    this.ctx.moveTo(x + r, y);
    this.ctx.arcTo(x + width, y, x + width, y + height, r);
    this.ctx.arcTo(x + width, y + height, x, y + height, r);
    this.ctx.arcTo(x, y + height, x, y, r);
    this.ctx.arcTo(x, y, x + width, y, r);
    this.ctx.closePath();
  }

  private resizeCanvas(): void {
    if (!this.canvas) return;
    const wrapper = this.canvas.parentElement;
    if (!wrapper) return;
    const rect = wrapper.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
  }

  private getMousePosition(event: MouseEvent | TouchEvent): { x: number; y: number } {
    if (!this.canvas) return { x: 0, y: 0 };
    const rect = this.canvas.getBoundingClientRect();
    const isTouchEvent = typeof TouchEvent !== 'undefined' && event instanceof TouchEvent;

 const clientX = isTouchEvent
  ? (event as TouchEvent).touches[0].clientX
  : (event as MouseEvent).clientX;

const clientY = isTouchEvent
  ? (event as TouchEvent).touches[0].clientY
  : (event as MouseEvent).clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }

  private drawFallbackBackground(): void {
    if (!this.ctx || !this.canvas) return;
    const { cols, rows, gap } = this.currentGridConfig;
    const totalGapWidth = gap * (cols - 1);
    const totalGapHeight = gap * (rows - 1);
    const slotWidth = (this.canvas.width - totalGapWidth) / cols;
    const slotHeight = (this.canvas.height - totalGapHeight) / rows;

    for (let position = 0; position < rows * cols; position++) {
      const col = position % cols;
      const row = Math.floor(position / cols);
      const destX = col * (slotWidth + gap);
      const destY = row * (slotHeight + gap);
      this.ctx.fillStyle = '#8B4513';
      this.ctx.fillRect(destX, destY, slotWidth, slotHeight);
      this.ctx.fillStyle = '#A0522D';
      const patternSize = 10;
      for (let i = 0; i < slotWidth; i += patternSize * 2) {
        for (let j = 0; j < slotHeight; j += patternSize * 2) {
          if ((i + j) % (patternSize * 4) === 0) {
            this.ctx.fillRect(destX + i, destY + j, patternSize, patternSize);
          }
        }
      }
    }
  }
}
