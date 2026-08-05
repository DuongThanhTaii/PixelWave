# PIXELWAVE — Canvas Engine Specification

> **For:** Frontend Engineers & Game Logic Agents  
> **Scope:** r/place canvas implementation, pixel mechanics, real-time sync  
> **Performance Target:** 60fps at 1000×1000 canvas, 10k+ concurrent pixels

---

## 1. ARCHITECTURE OVERVIEW

```
┌─────────────────────────────────────────────────────────────┐
│                    Canvas Engine                             │
├─────────────────────────────────────────────────────────────┤
│  Render Layer          │  Logic Layer        │  Sync Layer  │
│  (HTML5 Canvas 2D)     │  (State Machine)    │  (WebSocket) │
├─────────────────────────────────────────────────────────────┤
│  - Grid rendering      │  - Pixel placement  │  - Broadcast │
│  - Pixel drawing       │  - Cost validation  │  - Delta sync│
│  - Territory borders   │  - Cooldown logic   │  - Conflict  │
│  - Minimap render      │  - Override rules   │   resolution │
│  - Cursor rendering    │  - Zoom/Pan math    │  - Presence  │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. DATA MODELS

### 2.1 Canvas Config
```typescript
interface CanvasConfig {
  width: number;           // Default: 1000
  height: number;          // Default: 1000
  maxPixels: number;       // width * height
  pixelGap: number;        // Default: 1px
  defaultPixelSize: number; // Default: 12px (display)
  minZoom: number;         // 0.25 (3px per pixel)
  maxZoom: number;         // 4.0 (48px per pixel)
  gridThreshold: number;   // Show grid lines when pixelSize >= 8px
}
```

### 2.2 Pixel
```typescript
interface Pixel {
  x: number;              // 0 <= x < canvas.width
  y: number;              // 0 <= y < canvas.height
  color: string;          // Hex: #RRGGBB
  fandomId: string;       // Owner fandom reference
  userId: string;         // Placer user reference
  placedAt: number;       // Unix timestamp (ms)
  shielded: boolean;      // Protected from override
  shieldExpiresAt?: number; // Unix timestamp
  isSuper: boolean;       // 2×2 pixel block
  version: number;        // Increment on each update (conflict resolution)
}

// Pixel ID: `${x}:${y}` — unique by coordinate
```

### 2.3 Territory
```typescript
interface Territory {
  id: string;
  fandomId: string;
  name: string;
  bounds: {
    x: number;            // Top-left X
    y: number;            // Top-left Y
    width: number;
    height: number;
  };
  color: string;          // Border color
  pixelCount: number;     // Current pixels in territory
  maxSize: number;        // Expandable limit
  isWildZone: boolean;    // True = public war zone
}

// Territory overlap: Không cho phép. Admin defines initial zones.
// Wild Zone: bounds = full canvas, isWildZone = true
```

### 2.4 Viewport
```typescript
interface Viewport {
  x: number;              // Top-left canvas coordinate (pixels)
  y: number;
  zoom: number;           // 0.25 - 4.0
  width: number;          // Viewport width in px (DOM element width)
  height: number;         // Viewport height in px
}

// Visible pixel range:
// startX = Math.floor(viewport.x / displayPixelSize)
// endX = Math.ceil((viewport.x + viewport.width) / displayPixelSize)
// Same for Y
```

### 2.5 User Cursor (Live)
```typescript
interface LiveCursor {
  userId: string;
  username: string;
  fandomId: string;
  fandomColor: string;
  x: number;              // Canvas coordinate
  y: number;
  lastUpdate: number;     // Timestamp
}
```

---

## 3. RENDER ENGINE

### 3.1 Rendering Strategy
```
Priority 1: Visible pixels only (culling)
Priority 2: Dirty rect updates (không full redraw mỗi frame)
Priority 3: Background grid (static, cache to offscreen canvas)
Priority 4: Territory borders (cache path, redraw only on change)
```

### 3.2 Render Loop
```typescript
class CanvasRenderer {
  private ctx: CanvasRenderingContext2D;
  private offscreenGrid: HTMLCanvasElement; // Cached grid
  private offscreenTerritory: HTMLCanvasElement; // Cached borders
  private dirtyRects: Set<string>; // "x,y,w,h" dirty regions

  render() {
    // 1. Clear viewport
    this.ctx.clearRect(0, 0, viewport.width, viewport.height);

    // 2. Draw cached grid (if visible)
    if (pixelSize >= config.gridThreshold) {
      this.ctx.drawImage(this.offscreenGrid, ...);
    }

    // 3. Draw pixels in visible range
    const visible = this.getVisiblePixels();
    for (const pixel of visible) {
      this.drawPixel(pixel);
    }

    // 4. Draw territory borders
    this.ctx.drawImage(this.offscreenTerritory, ...);

    // 5. Draw live cursors
    for (const cursor of liveCursors) {
      if (this.isVisible(cursor.x, cursor.y)) {
        this.drawCursor(cursor);
      }
    }

    // 6. Draw hover highlight
    if (hoverCoord) {
      this.drawHoverCell(hoverCoord.x, hoverCoord.y);
    }

    requestAnimationFrame(() => this.render());
  }
}
```

### 3.3 Pixel Drawing
```typescript
drawPixel(pixel: Pixel) {
  const displaySize = config.defaultPixelSize * viewport.zoom;
  const gap = config.pixelGap * viewport.zoom;
  const drawSize = displaySize - gap;

  const screenX = (pixel.x * displaySize) - viewport.x;
  const screenY = (pixel.y * displaySize) - viewport.y;

  // Skip if outside viewport
  if (screenX + drawSize < 0 || screenX > viewport.width) return;
  if (screenY + drawSize < 0 || screenY > viewport.height) return;

  // Fill
  this.ctx.fillStyle = pixel.color;
  this.ctx.fillRect(screenX, screenY, drawSize, drawSize);

  // Effects
  if (pixel.shielded) {
    this.ctx.strokeStyle = '#00F0FF';
    this.ctx.lineWidth = 2 * viewport.zoom;
    this.ctx.strokeRect(screenX, screenY, drawSize, drawSize);
  }

  if (pixel.isSuper) {
    // 2×2 block handled at coordinate level
    this.ctx.shadowColor = pixel.color;
    this.ctx.shadowBlur = 10 * viewport.zoom;
  }

  // Fresh pixel glow (< 2 minutes)
  const age = Date.now() - pixel.placedAt;
  if (age < 120000) {
    const intensity = 1 - (age / 120000);
    this.ctx.shadowColor = pixel.color;
    this.ctx.shadowBlur = 15 * intensity * viewport.zoom;
    this.ctx.fillRect(screenX, screenY, drawSize, drawSize);
    this.ctx.shadowBlur = 0;
  }
}
```

### 3.4 Grid Cache
```typescript
buildGridCache() {
  const canvas = document.createElement('canvas');
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  const ctx = canvas.getContext('2d');

  const displaySize = config.defaultPixelSize * viewport.zoom;

  ctx.strokeStyle = '#E6E6F5';
  ctx.lineWidth = 1;

  // Draw vertical lines
  for (let x = 0; x <= viewport.width; x += displaySize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, viewport.height);
    ctx.stroke();
  }

  // Draw horizontal lines
  for (let y = 0; y <= viewport.height; y += displaySize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(viewport.width, y);
    ctx.stroke();
  }

  return canvas;
}

// Rebuild when: zoom changes, viewport size changes
```

### 3.5 Territory Border Cache
```typescript
buildTerritoryCache(territories: Territory[]) {
  const canvas = document.createElement('canvas');
  canvas.width = config.width * config.defaultPixelSize;
  canvas.height = config.height * config.defaultPixelSize;
  const ctx = canvas.getContext('2d');

  for (const territory of territories) {
    if (territory.isWildZone) continue;

    const { x, y, width, height } = territory.bounds;
    const pxSize = config.defaultPixelSize;

    ctx.strokeStyle = territory.color;
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 4]);

    ctx.strokeRect(
      x * pxSize, 
      y * pxSize, 
      width * pxSize, 
      height * pxSize
    );

    // Label
    ctx.fillStyle = territory.color;
    ctx.font = '14px "Space Grotesk"';
    ctx.fillText(
      territory.name, 
      x * pxSize + 8, 
      y * pxSize + 20
    );
  }

  return canvas;
}

// Rebuild when: territory bounds change, new territory added
```

---

## 4. INTERACTION HANDLING

### 4.1 Coordinate Mapping
```typescript
screenToCanvas(screenX: number, screenY: number): { x: number; y: number } {
  const displaySize = config.defaultPixelSize * viewport.zoom;

  const canvasX = Math.floor((screenX + viewport.x) / displaySize);
  const canvasY = Math.floor((screenY + viewport.y) / displaySize);

  return {
    x: Math.max(0, Math.min(canvasX, config.width - 1)),
    y: Math.max(0, Math.min(canvasY, config.height - 1))
  };
}

canvasToScreen(canvasX: number, canvasY: number): { x: number; y: number } {
  const displaySize = config.defaultPixelSize * viewport.zoom;

  return {
    x: (canvasX * displaySize) - viewport.x,
    y: (canvasY * displaySize) - viewport.y
  };
}
```

### 4.2 Mouse/Touch Events
```typescript
// Pan
onPointerDown(e) {
  isDragging = true;
  lastPointer = { x: e.clientX, y: e.clientY };
  canvas.style.cursor = 'grabbing';
}

onPointerMove(e) {
  // Update hover coordinate
  const coord = screenToCanvas(e.offsetX, e.offsetY);
  hoverCoord = coord;

  // Broadcast cursor position (throttled 30fps)
  throttleCursorBroadcast(coord);

  if (isDragging) {
    const dx = e.clientX - lastPointer.x;
    const dy = e.clientY - lastPointer.y;

    viewport.x -= dx;
    viewport.y -= dy;

    // Clamp
    viewport.x = Math.max(0, Math.min(viewport.x, maxPanX));
    viewport.y = Math.max(0, Math.min(viewport.y, maxPanY));

    lastPointer = { x: e.clientX, y: e.clientY };
  }
}

onPointerUp() {
  isDragging = false;
  canvas.style.cursor = 'crosshair';
}

// Zoom (wheel)
onWheel(e) {
  e.preventDefault();

  const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
  const newZoom = Math.max(minZoom, Math.min(maxZoom, viewport.zoom * zoomFactor));

  // Zoom toward mouse pointer
  const mouseX = e.offsetX;
  const mouseY = e.offsetY;

  const worldX = (mouseX + viewport.x) / viewport.zoom;
  const worldY = (mouseY + viewport.y) / viewport.zoom;

  viewport.zoom = newZoom;
  viewport.x = worldX * newZoom - mouseX;
  viewport.y = worldY * newZoom - mouseY;

  // Rebuild caches
  rebuildGridCache();
}

// Place pixel (click)
onClick(e) {
  if (isDragging) return; // Ignore if was dragging

  const coord = screenToCanvas(e.offsetX, e.offsetY);

  if (selectedTool === 'place') {
    placePixel(coord.x, coord.y, selectedColor);
  } else if (selectedTool === 'shield') {
    shieldPixel(coord.x, coord.y);
  } else if (selectedTool === 'bomb') {
    placeBomb(coord.x, coord.y);
  }
}
```

### 4.3 Mobile Touch Gestures
```typescript
// Pinch to zoom
onTouchStart(e) {
  if (e.touches.length === 2) {
    initialPinchDistance = getDistance(e.touches[0], e.touches[1]);
    initialZoom = viewport.zoom;
  }
}

onTouchMove(e) {
  if (e.touches.length === 2) {
    const distance = getDistance(e.touches[0], e.touches[1]);
    const scale = distance / initialPinchDistance;
    viewport.zoom = Math.max(minZoom, Math.min(maxZoom, initialZoom * scale));
  }
}

// Two-finger pan (if not pinching)
// Single tap = place pixel
// Long press = context menu
```

---

## 5. PIXEL MECHANICS

### 5.1 Placement Rules
```typescript
function canPlacePixel(x: number, y: number, userId: string, fandomId: string): {
  allowed: boolean;
  cost: number;
  reason?: string;
} {
  // 1. Check bounds
  if (x < 0 || x >= config.width || y < 0 || y >= config.height) {
    return { allowed: false, cost: 0, reason: 'Out of bounds' };
  }

  // 2. Check existing pixel
  const existing = pixelMap.get(`${x}:${y}`);

  if (existing) {
    // Cannot place on same color same fandom
    if (existing.color === selectedColor && existing.fandomId === fandomId) {
      return { allowed: false, cost: 0, reason: 'Same pixel' };
    }

    // Cannot override shielded pixel
    if (existing.shielded && existing.shieldExpiresAt > Date.now()) {
      return { allowed: false, cost: 0, reason: 'Shielded' };
    }

    // Override cost = 3 pixels
    return { allowed: true, cost: 3, reason: 'Override' };
  }

  // 3. Check territory
  const territory = getTerritoryAt(x, y);
  if (territory && !territory.isWildZone && territory.fandomId !== fandomId) {
    return { allowed: false, cost: 0, reason: 'Enemy territory' };
  }

  // 4. Check cooldown (5s between placements)
  const lastPlace = userLastPlacement.get(userId);
  if (lastPlace && Date.now() - lastPlace < 5000) {
    return { allowed: false, cost: 0, reason: 'Cooldown' };
  }

  // 5. New pixel cost = 1
  return { allowed: true, cost: 1 };
}
```

### 5.2 Shield Mechanic
```typescript
function canShieldPixel(x: number, y: number, userId: string): {
  allowed: boolean;
  cost: number;
  reason?: string;
} {
  const existing = pixelMap.get(`${x}:${y}`);

  if (!existing) {
    return { allowed: false, cost: 0, reason: 'No pixel to shield' };
  }

  if (existing.fandomId !== userFandomId) {
    return { allowed: false, cost: 0, reason: 'Not your fandom pixel' };
  }

  if (existing.shielded) {
    return { allowed: false, cost: 0, reason: 'Already shielded' };
  }

  return { allowed: true, cost: 5 };
}

function shieldPixel(x: number, y: number) {
  const pixel = pixelMap.get(`${x}:${y}`);
  pixel.shielded = true;
  pixel.shieldExpiresAt = Date.now() + 3600000; // 1 hour

  // Schedule unshield
  setTimeout(() => {
    pixel.shielded = false;
    pixel.shieldExpiresAt = undefined;
    broadcastPixelUpdate(pixel);
  }, 3600000);
}
```

### 5.3 Bomb Mechanic
```typescript
function placeBomb(centerX: number, centerY: number) {
  const radius = 1; // 3×3 area
  const cost = 50;

  for (let dx = -radius; dx <= radius; dx++) {
    for (let dy = -radius; dy <= radius; dy++) {
      const x = centerX + dx;
      const y = centerY + dy;

      const key = `${x}:${y}`;
      const existing = pixelMap.get(key);

      if (existing && !existing.shielded) {
        pixelMap.delete(key);
        broadcastPixelDelete(x, y);
      }
    }
  }

  // Visual: Explosion animation at center
  triggerExplosionAnimation(centerX, centerY);
}

// Limit: 1 bomb per user per day
const userBombCount = new Map<string, number>(); // Reset at midnight UTC
```

### 5.4 Super Pixel
```typescript
function placeSuperPixel(x: number, y: number, color: string) {
  // Occupies 2×2 block: (x,y), (x+1,y), (x,y+1), (x+1,y+1)
  // Counts as 5 normal pixels in effect
  // Visual: 2×2 size with animated border
  // Cooldown: 24h per user
}
```

---

## 6. REAL-TIME SYNC

### 6.1 WebSocket Events
```typescript
// Client → Server
interface ClientEvents {
  'pixel:place': { x: number; y: number; color: string; fandomId: string };
  'pixel:shield': { x: number; y: number };
  'pixel:bomb': { x: number; y: number };
  'cursor:move': { x: number; y: number };
  'viewport:update': { x: number; y: number; zoom: number }; // For presence
}

// Server → Client
interface ServerEvents {
  'pixel:placed': Pixel;
  'pixel:deleted': { x: number; y: number };
  'pixel:shielded': { x: number; y: number; expiresAt: number };
  'pixel:bomb': { x: number; y: number; radius: number };
  'cursor:update': LiveCursor[];
  'territory:update': Territory;
  'war:started': SeasonWar;
  'war:ended': { warId: string; winnerFandomId: string };
  'batch:update': Pixel[]; // Initial load or large changes
}
```

### 6.2 Optimistic Updates
```typescript
function placePixelOptimistic(x: number, y: number, color: string) {
  // 1. Deduct pixel balance immediately (optimistic)
  pixelBalance -= cost;

  // 2. Add pixel to local canvas immediately
  const tempPixel: Pixel = { x, y, color, ... };
  pixelMap.set(`${x}:${y}`, tempPixel);

  // 3. Send to server
  socket.emit('pixel:place', { x, y, color, fandomId: activeFandomId });

  // 4. Handle response
  socket.on('pixel:placed', (confirmedPixel) => {
    if (confirmedPixel.x === x && confirmedPixel.y === y) {
      // Success: Update with server data (version, timestamp)
      pixelMap.set(`${x}:${y}`, confirmedPixel);
    }
  });

  // 5. Handle rejection
  socket.on('pixel:rejected', ({ x, y, reason }) => {
    if (x === tempPixel.x && y === tempPixel.y) {
      // Rollback: Restore old pixel or delete
      pixelMap.delete(`${x}:${y}`);
      pixelBalance += cost; // Refund
      showErrorToast(reason);
    }
  });
}
```

### 6.3 Delta Sync (Efficiency)
```typescript
// Instead of sending full canvas, send only changes
// Server maintains: lastSyncVersion per client
// On reconnect: Client sends lastVersion, server sends diff

interface DeltaSync {
  sinceVersion: number;
  currentVersion: number;
  added: Pixel[];
  modified: Pixel[];
  deleted: { x: number; y: number }[];
}

// Batch updates: Server batches changes every 100ms
// Max batch size: 100 pixels per message
```

### 6.4 Presence (Live Cursors)
```typescript
// Throttle cursor updates to 30fps (33ms)
// Only broadcast if cursor moved > 5 pixels
// Remove cursor if no update for 30 seconds

const cursorThrottle = throttle((coord) => {
  socket.emit('cursor:move', coord);
}, 33);

// Render: Show cursor + username label
// Cursors outside viewport: Show edge indicators (minimap style)
```

---

## 7. MINIMAP

### 7.1 Spec
```typescript
interface MinimapProps {
  canvasWidth: number;
  canvasHeight: number;
  pixels: Map<string, Pixel>; // Or compressed bitmap
  territories: Territory[];
  viewport: Viewport;
  onViewportChange: (x: number, y: number) => void;
}

// Size: 150×150px fixed
// Each canvas pixel = minimap pixel (or downsampled if canvas > 150)
// Viewport rect: Overlay showing current view
// Click: Center viewport on clicked position
// Drag rect: Pan viewport
```

### 7.2 Render
```typescript
// Use separate small canvas element
// Draw all pixels as 1px dots (compressed by color)
// Territory borders: 1px solid lines
// Viewport rect: 2px white border with shadow
// Background: #FAFAFF
```

---

## 8. PERFORMANCE OPTIMIZATIONS

### 8.1 Rendering
- [ ] **Object pooling:** Reuse Pixel objects, không tạo mới mỗi frame
- [ ] **Spatial hashing:** Chia canvas thành chunks 100×100 để query nhanh
- [ ] **Dirty regions:** Chỉ redraw vùng thay đổi, không full clear
- [ ] **Offscreen canvas:** Cache grid, territories, static elements
- [ ] **RequestAnimationFrame:** Không dùng setInterval cho render loop
- [ ] **Visible culling:** Chỉ draw pixels trong viewport + 1 chunk buffer

### 8.2 Memory
- [ ] **Pixel store:** Dùng Map thay vì Array 2D (sparse efficiency)
- [ ] **Image cache:** Album art lazy load với LRU cache
- [ ] **Cursor cleanup:** Auto-remove inactive cursors sau 30s

### 8.3 Network
- [ ] **Delta compression:** Chỉ sync pixels thay đổi
- [ ] **Batching:** Gom 100ms changes thành 1 message
- [ ] **Binary protocol:** Dùng MessagePack thay vì JSON cho pixel data
- [ ] **Rate limiting:** Client max 10 pixel events/giây

---

## 9. TESTING SCENARIOS

### 9.1 Unit Tests
- [ ] Coordinate mapping: screen→canvas→screen round-trip
- [ ] Zoom clamp: min/max bounds
- [ ] Pan clamp: không cho pan ra ngoài canvas
- [ ] Pixel placement: all validation rules
- [ ] Cooldown: 5s timer accuracy
- [ ] Shield expiry: 1h timer accuracy

### 9.2 Integration Tests
- [ ] 2 users place pixel cùng coordinate: Conflict resolution
- [ ] Override shielded pixel: Should fail
- [ ] Bomb 3×3: Correct pixels deleted
- [ ] Daily bomb limit: Reset at midnight
- [ ] Reconnect: Delta sync correctness

### 9.3 Performance Tests
- [ ] 1000×1000 canvas, 500k pixels: Render >30fps
- [ ] 100 concurrent cursors: No frame drop
- [ ] Rapid placement (10/s): Smooth optimistic updates
- [ ] Mobile pinch-zoom: 60fps on mid-tier device

---

## 10. ERROR HANDLING

| Error | User Feedback | Recovery |
|-------|---------------|----------|
| Out of bounds | Shake canvas edge + red flash | None |
| Insufficient pixels | Toast "Need N more pixels!" | None |
| Cooldown active | Show countdown on cursor | Auto-retry after cooldown |
| Shielded pixel | Cyan flash + "Shielded!" toast | None |
| Network error | "Connection lost" banner | Auto-reconnect with exponential backoff |
| Server rejection | Toast with reason | Rollback optimistic update |
| Canvas full | "Canvas full!" modal | Suggest other territory |
