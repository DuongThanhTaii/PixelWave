export interface CanvasConfig {
  width: number;
  height: number;
  maxPixels: number;
  pixelGap: number;
  defaultPixelSize: number;
  minZoom: number;
  maxZoom: number;
  gridThreshold: number;
}

export const CANVAS_CONFIG: CanvasConfig = {
  width: 1000,
  height: 1000,
  maxPixels: 1000000,
  pixelGap: 1,
  defaultPixelSize: 12,
  minZoom: 0.25,
  maxZoom: 4.0,
  gridThreshold: 8,
};

export interface Pixel {
  x: number;
  y: number;
  color: string;
  fandomId: string;
  userId: string;
  placedAt: number;
  shielded: boolean;
  isSuper: boolean;
  version: number;
}

export interface Viewport {
  x: number;
  y: number;
  zoom: number;
  width: number;
  height: number;
}

export class CanvasRenderer {
  private ctx: CanvasRenderingContext2D;
  private offscreenGrid: HTMLCanvasElement;
  private pixels: Map<string, Pixel>;
  private viewport: Viewport;
  private hoverCoord: { x: number; y: number } | null = null;

  constructor(
    canvas: HTMLCanvasElement,
    initialViewport: Viewport,
    pixels: Map<string, Pixel>
  ) {
    const context = canvas.getContext("2d", { alpha: false });
    if (!context) throw new Error("Could not get 2d context");
    this.ctx = context;
    this.viewport = initialViewport;
    this.pixels = pixels;
    
    // Create offscreen canvas for grid
    this.offscreenGrid = document.createElement("canvas");
    this.rebuildGridCache();
  }

  public setViewport(viewport: Viewport) {
    const zoomChanged = this.viewport.zoom !== viewport.zoom;
    const sizeChanged = this.viewport.width !== viewport.width || this.viewport.height !== viewport.height;
    
    this.viewport = viewport;
    
    if (zoomChanged || sizeChanged) {
      this.rebuildGridCache();
    }
  }

  public setHoverCoord(coord: { x: number; y: number } | null) {
    this.hoverCoord = coord;
  }

  public updatePixels(newPixels: Map<string, Pixel>) {
    this.pixels = newPixels;
  }

  private rebuildGridCache() {
    this.offscreenGrid.width = this.viewport.width;
    this.offscreenGrid.height = this.viewport.height;
    const ctx = this.offscreenGrid.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, this.viewport.width, this.viewport.height);
    const displaySize = CANVAS_CONFIG.defaultPixelSize * this.viewport.zoom;

    if (displaySize < CANVAS_CONFIG.gridThreshold) return;

    ctx.strokeStyle = "#E6E6F5";
    ctx.lineWidth = 1;
    ctx.beginPath();

    // The grid must move with the viewport, so we calculate the offset
    const offsetX = -(this.viewport.x % displaySize);
    const offsetY = -(this.viewport.y % displaySize);

    for (let x = offsetX; x <= this.viewport.width; x += displaySize) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.viewport.height);
    }

    for (let y = offsetY; y <= this.viewport.height; y += displaySize) {
      ctx.moveTo(0, y);
      ctx.lineTo(this.viewport.width, y);
    }

    ctx.stroke();
  }

  private getVisiblePixels(): Pixel[] {
    const displaySize = CANVAS_CONFIG.defaultPixelSize * this.viewport.zoom;
    
    const startX = Math.max(0, Math.floor(this.viewport.x / displaySize));
    const startY = Math.max(0, Math.floor(this.viewport.y / displaySize));
    const endX = Math.min(CANVAS_CONFIG.width, Math.ceil((this.viewport.x + this.viewport.width) / displaySize));
    const endY = Math.min(CANVAS_CONFIG.height, Math.ceil((this.viewport.y + this.viewport.height) / displaySize));

    const visible: Pixel[] = [];
    
    // In a real scenario with millions of pixels, we'd use spatial hashing.
    // For now, iterating over the map or checking bounds directly.
    for (let x = startX; x <= endX; x++) {
      for (let y = startY; y <= endY; y++) {
        const p = this.pixels.get(`${x}:${y}`);
        if (p) visible.push(p);
      }
    }
    
    return visible;
  }

  public render() {
    // 1. Clear viewport (draw background)
    this.ctx.fillStyle = "#FAFAFF"; // Canvas background color
    this.ctx.fillRect(0, 0, this.viewport.width, this.viewport.height);

    // 2. Draw cached grid
    const displaySize = CANVAS_CONFIG.defaultPixelSize * this.viewport.zoom;
    if (displaySize >= CANVAS_CONFIG.gridThreshold) {
      this.ctx.drawImage(this.offscreenGrid, 0, 0);
    }

    // 3. Draw pixels
    const visiblePixels = this.getVisiblePixels();
    const gap = CANVAS_CONFIG.pixelGap * this.viewport.zoom;
    const drawSize = Math.max(1, displaySize - gap); // ensure at least 1px

    for (const pixel of visiblePixels) {
      const screenX = (pixel.x * displaySize) - this.viewport.x;
      const screenY = (pixel.y * displaySize) - this.viewport.y;

      this.ctx.fillStyle = pixel.color;
      this.ctx.fillRect(screenX, screenY, drawSize, drawSize);

      if (pixel.shielded) {
        this.ctx.strokeStyle = "#00F0FF";
        this.ctx.lineWidth = 2 * this.viewport.zoom;
        this.ctx.strokeRect(screenX, screenY, drawSize, drawSize);
      }
    }

    // 4. Draw Hover Highlights
    if (this.hoverCoord) {
      const screenX = (this.hoverCoord.x * displaySize) - this.viewport.x;
      const screenY = (this.hoverCoord.y * displaySize) - this.viewport.y;
      
      this.ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      this.ctx.fillRect(screenX, screenY, drawSize, drawSize);
      
      this.ctx.strokeStyle = "rgba(0, 0, 0, 0.5)";
      this.ctx.lineWidth = 1;
      this.ctx.strokeRect(screenX, screenY, drawSize, drawSize);
    }
  }

  // Utility to convert screen pos to canvas pos
  public screenToCanvas(screenX: number, screenY: number) {
    const displaySize = CANVAS_CONFIG.defaultPixelSize * this.viewport.zoom;
    const canvasX = Math.floor((screenX + this.viewport.x) / displaySize);
    const canvasY = Math.floor((screenY + this.viewport.y) / displaySize);

    return {
      x: Math.max(0, Math.min(canvasX, CANVAS_CONFIG.width - 1)),
      y: Math.max(0, Math.min(canvasY, CANVAS_CONFIG.height - 1))
    };
  }
}
