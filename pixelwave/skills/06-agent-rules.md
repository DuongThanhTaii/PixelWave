# PIXELWAVE — Agent Rules & Implementation Instructions

> **For:** AI Coding Agents (Cursor, GitHub Copilot, Claude Code, etc.)  
> **Scope:** How to read specs, implement components, and maintain consistency  
> **Framework:** Antigravity (adapted for your stack)

---

## 1. AGENT MANDATES

### 1.1 Read Before Code
**BẮT BUỘC** đọc toàn bộ file trong thư mục `pixelwave-skills/` trước khi viết code:
1. `01-stitch-master-prompt.md` — Hiểu vision và vibe
2. `02-design-system.md` — Lấy tokens, colors, typography
3. `03-component-library.md` — Hiểu component catalog và interfaces
4. `04-canvas-engine.md` — Hiểu canvas logic và performance
5. `05-gamification.md` — Hiểu game mechanics

### 1.2 Source of Truth Priority
```
1. Design System (02) → Colors, spacing, fonts là tuyệt đối
2. Component Library (03) → Props, behavior, composition patterns
3. Canvas Engine (04) → Render logic, coordinate math
4. Gamification (05) → Business logic, calculations
5. Stitch Prompt (01) → Visual references, mood
```

### 1.3 Y2K Consistency Rules
- **KHÔNG** dùng màu ngoài palette đã định nghĩa trong `--pw-*` tokens
- **KHÔNG** dùng font ngoài 4 font đã định (Space Grotesk, Plus Jakarta Sans, VT323, Press Start 2P)
- **KHÔNG** dùng border-radius ngoài scale đã định (4, 8, 16, 24, 9999)
- **KHÔNG** dùng box-shadow tùy tiện — chỉ dùng `--pw-shadow-*` tokens
- **KHÔNG** dùng animation duration > 400ms cho UI interactions
- **PHẢI** dùng neo-brutalism shadow cho MỌI interactive element
- **PHẢI** dùng VT323 cho số liệu, pixel count, coordinates, countdowns
- **PHẢI** dùng glassmorphism với `backdrop-filter` cho overlay panels

### 1.4 Component Implementation Order
```
Phase 1 (Foundation):
  1. Design tokens (CSS variables / Tailwind config)
  2. AppShell layout
  3. Button primitives (all 5 variants)
  4. Card primitives
  5. Typography components

Phase 2 (Music):
  6. PlayerBar
  7. TrackCard / TrackListItem
  8. ProgressBar
  9. AlbumGrid

Phase 3 (Canvas):
  10. CanvasGrid (HTML5 Canvas API)
  11. Pixel data model
  12. Minimap
  13. CanvasTools / ColorPicker
  14. TerritoryOverlay

Phase 4 (Gamification):
  15. PixelCounter
  16. PixelToast
  17. LevelBadge / XPBar
  18. BadgeCard / BadgeGrid
  19. LeaderboardRow
  20. SeasonWarBanner

Phase 5 (Social):
  21. UserProfile
  22. Avatar / AvatarStack
  23. ActivityFeed
  24. FandomCard / FandomHeader

Phase 6 (Overlay):
  25. Modal
  26. Toast system
  27. ScanlineOverlay
  28. CustomCursor
```

---

## 2. CODE PATTERNS

### 2.1 Component Template
```typescript
// Every component MUST follow this structure:

import { type FC, type ReactNode, useState, useCallback, useMemo } from 'react';
import { usePixelwave } from '@/hooks/usePixelwave';
import { cn } from '@/lib/utils'; // Tailwind merge utility

// 1. Interface
interface ComponentNameProps {
  // Required first
  id: string;

  // Optional with defaults
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  isDisabled?: boolean;

  // Callbacks
  onAction?: (value: string) => void;

  // Children
  children?: ReactNode;
}

// 2. Constants
const VARIANT_STYLES = {
  primary: 'bg-[var(--pw-hot-pink)] text-white border-2 border-black shadow-[var(--pw-shadow-brutal)]',
  secondary: 'bg-[var(--pw-surface-200)] text-[var(--pw-deep-purple)] border-2 border-black shadow-[var(--pw-shadow-brutal)]',
  ghost: 'bg-transparent text-[var(--pw-deep-purple)] border-2 border-[var(--pw-deep-purple)]'
} as const;

const SIZE_STYLES = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base'
} as const;

// 3. Component
export const ComponentName: FC<ComponentNameProps> = ({
  id,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  isDisabled = false,
  onAction,
  children
}) => {
  // State
  const [isHovered, setIsHovered] = useState(false);

  // Hooks
  const { theme } = usePixelwave();

  // Memoized values
  const classes = useMemo(() => cn(
    'inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-all',
    VARIANT_STYLES[variant],
    SIZE_STYLES[size],
    isDisabled && 'opacity-50 cursor-not-allowed shadow-none',
    isHovered && !isDisabled && 'hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[var(--pw-shadow-brutal-hover)]',
    isLoading && 'cursor-wait'
  ), [variant, size, isDisabled, isHovered, isLoading]);

  // Callbacks
  const handleClick = useCallback(() => {
    if (isDisabled || isLoading) return;
    onAction?.(id);
  }, [isDisabled, isLoading, onAction, id]);

  // Render
  return (
    <button
      id={id}
      className={classes}
      disabled={isDisabled || isLoading}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isLoading && <LoadingSpinner size="sm" />}
      {children}
    </button>
  );
};

// 4. Display name
ComponentName.displayName = 'ComponentName';
```

### 2.2 CSS Custom Properties Setup
```css
/* MUST be in global CSS file (e.g., globals.css) */
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=VT323&family=Press+Start+2P&display=swap');

:root {
  /* Colors */
  --pw-chrome-start: #E8D5F2;
  --pw-chrome-end: #B8E6F0;
  --pw-hot-pink: #FF6B9D;
  --pw-cyan-glow: #00F0FF;
  --pw-neon-lime: #CCFF00;
  --pw-deep-purple: #6B2D5C;
  --pw-surface-100: #FAFAFF;
  --pw-surface-200: #F0F0FA;
  --pw-surface-300: #E6E6F5;
  --pw-glass: rgba(255, 255, 255, 0.25);
  --pw-glass-border: rgba(255, 255, 255, 0.4);
  --pw-pixel-earned: #CCFF00;
  --pw-war-active: #FF0040;
  --pw-territory-shield: #00F0FF;

  /* Gradients */
  --pw-gradient-chrome: linear-gradient(135deg, #E8D5F2 0%, #B8E6F0 50%, #E8D5F2 100%);
  --pw-gradient-hot: linear-gradient(90deg, #FF6B9D 0%, #FF8E53 100%);
  --pw-gradient-glass: linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 100%);

  /* Typography */
  --pw-font-display: 'Space Grotesk', system-ui, sans-serif;
  --pw-font-body: 'Plus Jakarta Sans', system-ui, sans-serif;
  --pw-font-data: 'VT323', 'Courier New', monospace;
  --pw-font-retro: 'Press Start 2P', monospace;

  /* Shadows */
  --pw-shadow-brutal: 4px 4px 0px 0px #000000;
  --pw-shadow-brutal-hover: 6px 6px 0px 0px #000000;
  --pw-shadow-brutal-active: 2px 2px 0px 0px #000000;
  --pw-shadow-glass: 0 8px 32px 0px rgba(0, 0, 0, 0.1);

  /* Transitions */
  --pw-transition-spring: 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
  --pw-transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
}

/* Global resets for Y2K vibe */
* {
  cursor: none; /* Custom cursor will override */
}

body {
  font-family: var(--pw-font-body);
  background: var(--pw-surface-100);
  color: var(--pw-deep-purple);
  overflow-x: hidden;
}

/* Selection */
::selection {
  background: var(--pw-hot-pink);
  color: white;
}

/* Scrollbar */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: var(--pw-surface-200);
}
::-webkit-scrollbar-thumb {
  background: var(--pw-deep-purple);
  border-radius: 4px;
}
```

### 2.3 Tailwind Config Extension
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'pw-chrome-start': '#E8D5F2',
        'pw-chrome-end': '#B8E6F0',
        'pw-hot-pink': '#FF6B9D',
        'pw-cyan-glow': '#00F0FF',
        'pw-neon-lime': '#CCFF00',
        'pw-deep-purple': '#6B2D5C',
        'pw-surface-100': '#FAFAFF',
        'pw-surface-200': '#F0F0FA',
        'pw-surface-300': '#E6E6F5',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        body: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        data: ['VT323', '"Courier New"', 'monospace'],
        retro: ['"Press Start 2P"', 'monospace'],
      },
      boxShadow: {
        'brutal': '4px 4px 0px 0px #000000',
        'brutal-hover': '6px 6px 0px 0px #000000',
        'brutal-active': '2px 2px 0px 0px #000000',
        'brutal-lg': '8px 8px 0px 0px #000000',
        'glass': '0 8px 32px 0px rgba(0, 0, 0, 0.1)',
        'glow-cyan': '0 0 20px rgba(0, 240, 255, 0.4)',
        'glow-pink': '0 0 20px rgba(255, 107, 157, 0.4)',
      },
      borderRadius: {
        'pw-sm': '4px',
        'pw-md': '8px',
        'pw-lg': '16px',
        'pw-xl': '24px',
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      }
    }
  }
};
```

---

## 3. CANVAS IMPLEMENTATION RULES

### 3.1 MUST Use Canvas API (Not DOM)
```typescript
// ❌ WRONG — Too many DOM elements
<div className="grid" style={{ gridTemplateColumns: `repeat(${width}, 1fr)` }}>
  {pixels.map(p => <div key={p.id} style={{ background: p.color }} />)}
</div>

// ✅ CORRECT — Canvas API
const canvasRef = useRef<HTMLCanvasElement>(null);

useEffect(() => {
  const canvas = canvasRef.current;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Render loop
  let animationId: number;
  const render = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw visible pixels only
    const visible = getVisiblePixels(viewport);
    for (const pixel of visible) {
      const screenX = pixel.x * pixelSize - viewport.x;
      const screenY = pixel.y * pixelSize - viewport.y;
      ctx.fillStyle = pixel.color;
      ctx.fillRect(screenX, screenY, pixelSize - 1, pixelSize - 1);
    }

    animationId = requestAnimationFrame(render);
  };

  render();
  return () => cancelAnimationFrame(animationId);
}, [viewport, pixels]);
```

### 3.2 Coordinate Math
```typescript
// MUST use these exact formulas:

// Screen (mouse) → Canvas coordinate
function screenToCanvas(
  screenX: number, 
  screenY: number, 
  viewport: Viewport, 
  pixelSize: number
): { x: number; y: number } {
  const canvasX = Math.floor((screenX + viewport.x) / pixelSize);
  const canvasY = Math.floor((screenY + viewport.y) / pixelSize);
  return {
    x: Math.max(0, Math.min(canvasX, CANVAS_WIDTH - 1)),
    y: Math.max(0, Math.min(canvasY, CANVAS_HEIGHT - 1))
  };
}

// Canvas → Screen
function canvasToScreen(
  canvasX: number, 
  canvasY: number, 
  viewport: Viewport, 
  pixelSize: number
): { x: number; y: number } {
  return {
    x: canvasX * pixelSize - viewport.x,
    y: canvasY * pixelSize - viewport.y
  };
}
```

### 3.3 Performance Checklist
- [ ] Dùng `requestAnimationFrame`, không dùng `setInterval`
- [ ] Chỉ draw pixels trong viewport + 1 chunk buffer
- [ ] Cache grid lines vào offscreen canvas
- [ ] Cache territory borders vào offscreen canvas
- [ ] Dùng `Map<string, Pixel>` thay vì `Pixel[][]` (sparse efficiency)
- [ ] Throttle cursor broadcast tới 30fps (33ms)
- [ ] Không dùng React state cho viewport trong render loop
- [ ] Dùng `useRef` cho canvas context và animation frame ID

---

## 4. STATE MANAGEMENT RULES

### 4.1 Store Architecture
```typescript
// Zustand stores (recommended) hoặc Redux slices

// 1. Player Store (Global)
interface PlayerStore {
  currentTrack: Track | null;
  isPlaying: boolean;
  progress: number; // 0-100
  volume: number;
  queue: Track[];
  history: Track[];

  play: (track: Track) => void;
  pause: () => void;
  resume: () => void;
  skip: (direction: 'prev' | 'next') => void;
  seek: (percent: number) => void;
  setVolume: (percent: number) => void;
}

// 2. Canvas Store (Global)
interface CanvasStore {
  pixels: Map<string, Pixel>; // Key: "x:y"
  viewport: Viewport;
  selectedTool: 'place' | 'shield' | 'bomb';
  selectedColor: string;
  activeFandomId: string;
  liveCursors: Map<string, LiveCursor>;

  placePixel: (x: number, y: number) => void;
  setViewport: (v: Partial<Viewport>) => void;
  setTool: (tool: string) => void;
  setColor: (color: string) => void;
}

// 3. User Store (Global)
interface UserStore {
  user: User | null;
  pixelBalance: number;
  waveLevel: number;
  xp: number;
  streak: number;
  badges: Badge[];
  activeFandomId: string | null;

  earnPixels: (amount: number) => void;
  spendPixels: (amount: number) => boolean;
  addXp: (amount: number) => void;
}

// 4. War Store (Global)
interface WarStore {
  activeWar: SeasonWar | null;
  warScores: Map<string, WarScore>;
  warEvents: WarEvent[];

  joinWar: (fandomId: string) => void;
  updateScore: (fandomId: string, score: number) => void;
}
```

### 4.2 Local State Only For
- Hover states
- Form inputs (before submit)
- Modal open/close
- Sidebar collapse
- Animation triggers
- Tooltip visibility

### 4.3 Global State For
- Player state
- Canvas pixels + viewport
- User data (balance, level, badges)
- Active war
- Authentication

---

## 5. API INTEGRATION RULES

### 5.1 API Client Setup
```typescript
// api/client.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor: Add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('pw_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### 5.2 WebSocket Setup
```typescript
// api/socket.ts
import { io } from 'socket.io-client';

const socket = io(process.env.NEXT_PUBLIC_WS_URL, {
  autoConnect: false,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5
});

// Auth on connect
socket.on('connect', () => {
  const token = localStorage.getItem('pw_token');
  socket.emit('auth', { token });
});

// Canvas events
export function subscribeToPixels(callback: (pixel: Pixel) => void) {
  socket.on('pixel:placed', callback);
  return () => socket.off('pixel:placed', callback);
}

export function subscribeToCursorUpdates(callback: (cursors: LiveCursor[]) => void) {
  socket.on('cursor:update', callback);
  return () => socket.off('cursor:update', callback);
}

export function placePixel(x: number, y: number, color: string, fandomId: string) {
  socket.emit('pixel:place', { x, y, color, fandomId });
}

export function moveCursor(x: number, y: number) {
  socket.volatile.emit('cursor:move', { x, y }); // volatile = no retry, fire-and-forget
}

export default socket;
```

---

## 6. TESTING RULES

### 6.1 Component Tests
```typescript
// Every component MUST have:
// 1. Render test
// 2. Props test
// 3. Interaction test
// 4. Accessibility test

import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    fireEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when isDisabled is true', () => {
    render(<Button isDisabled>Disabled</Button>);
    expect(screen.getByText('Disabled')).toBeDisabled();
  });

  it('has correct aria attributes', () => {
    render(<Button aria-label="Submit">Submit</Button>);
    expect(screen.getByLabelText('Submit')).toBeInTheDocument();
  });
});
```

### 6.2 Canvas Tests
```typescript
// Canvas-specific tests:
describe('CanvasGrid', () => {
  it('renders canvas element', () => {
    render(<CanvasGrid width={100} height={100} />);
    expect(screen.getByRole('img', { name: /pixel canvas/i })).toBeInTheDocument();
  });

  it('converts screen coordinates correctly', () => {
    const { screenToCanvas } = canvasUtils;
    const result = screenToCanvas(100, 100, { x: 0, y: 0, zoom: 1 }, 12);
    expect(result).toEqual({ x: 8, y: 8 });
  });

  it('clamps coordinates to canvas bounds', () => {
    const result = screenToCanvas(-10, -10, { x: 0, y: 0, zoom: 1 }, 12);
    expect(result).toEqual({ x: 0, y: 0 });
  });
});
```

---

## 7. COMMON MISTAKES TO AVOID

### ❌ DON'T
1. Dùng `position: absolute` tùy tiện — dùng CSS Grid/Flexbox
2. Hardcode colors — LUÔN dùng CSS variables
3. Dùng `!important` trong CSS
4. Inline styles cho component styling — dùng className
5. Quên `key` prop trong list renders
6. Dùng `any` type trong TypeScript
7. Quên cleanup `useEffect` (event listeners, intervals, animation frames)
8. Dùng `setState` trong render loop của Canvas
9. Không handle loading/error states
10. Quên accessibility (aria-label, role, focus management)

### ✅ DO
1. Dùng `cn()` utility để merge Tailwind classes
2. Extract constants ra ngoài component
3. Dùng `useMemo` cho expensive calculations
4. Dùng `useCallback` cho event handlers passed to children
5. Split large components thành smaller sub-components
6. Dùng `React.memo` cho pure presentational components
7. Handle edge cases (empty states, errors, loading)
8. Dùng `prefers-reduced-motion` cho animations
9. Lazy load heavy components (Canvas, charts)
10. Comment complex logic với "WHY" not "WHAT"

---

## 8. FILE NAMING CONVENTION

```
components/
  layout/
    AppShell.tsx
    Sidebar.tsx
    PlayerBar.tsx
    CanvasLayout.tsx

  music/
    TrackCard.tsx
    TrackListItem.tsx
    AlbumGrid.tsx
    ProgressBar.tsx
    VolumeControl.tsx

  canvas/
    CanvasGrid.tsx
    Minimap.tsx
    CanvasTools.tsx
    ColorPicker.tsx
    TerritoryOverlay.tsx
    LiveCursor.tsx

  gamification/
    PixelCounter.tsx
    PixelToast.tsx
    LevelBadge.tsx
    XPBar.tsx
    BadgeCard.tsx
    BadgeGrid.tsx
    LeaderboardRow.tsx
    SeasonWarBanner.tsx
    CountdownTimer.tsx

  social/
    UserProfile.tsx
    Avatar.tsx
    AvatarStack.tsx
    ActivityFeed.tsx
    FandomCard.tsx

  feedback/
    Button.tsx
    Card.tsx
    Modal.tsx
    Toast.tsx
    Tooltip.tsx
    EmptyState.tsx
    LoadingState.tsx

  overlays/
    ScanlineOverlay.tsx
    GrainOverlay.tsx
    CustomCursor.tsx

hooks/
  usePixelwave.ts       # Global context hook
  usePlayer.ts          # Player state hook
  useCanvas.ts          # Canvas interaction hook
  usePixelBalance.ts    # Pixel economy hook
  useStreak.ts          # Streak tracking hook
  useWar.ts             # War participation hook
  useViewport.ts        # Canvas viewport hook
  useWebSocket.ts       # Socket connection hook

stores/
  playerStore.ts
  canvasStore.ts
  userStore.ts
  warStore.ts

lib/
  utils.ts              # cn(), formatters, helpers
  canvasMath.ts         # Coordinate conversion, viewport math
  pixelEngine.ts        # Canvas render loop, pixel drawing
  antiFarm.ts           # Anti-cheat validation
  gamification.ts       # XP, level, badge calculations

api/
  client.ts             # Axios instance
  socket.ts             # Socket.io setup
  tracks.ts             # Track API endpoints
  pixels.ts             # Pixel API endpoints
  fandoms.ts            # Fandom API endpoints
  wars.ts               # War API endpoints
  users.ts              # User API endpoints

types/
  index.ts              # All TypeScript interfaces
```

---

## 9. IMPLEMENTATION CHECKLIST (Per Component)

Before marking any component as "done", verify:
- [ ] Follows design system tokens (colors, fonts, spacing, shadows)
- [ ] Has all 3 states: default, hover, active (where applicable)
- [ ] Has loading state (if async)
- [ ] Has error state (if applicable)
- [ ] Has empty state (if list/data)
- [ ] Accessible: keyboard navigable, screen reader friendly
- [ ] Responsive: works on desktop, tablet, mobile
- [ ] Animated: uses spring/bounce transitions (respects reduced-motion)
- [ ] Typed: full TypeScript interfaces, no `any`
- [ ] Tested: render + interaction + accessibility tests
- [ ] Documented: JSDoc for props and behavior
