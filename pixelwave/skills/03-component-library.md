# PIXELWAVE — Component Library Specification

> **For:** Frontend Engineers & UI Agents  
> **Scope:** React/Vue/Svelte component specs — framework-agnostic logic  
> **Source of Truth:** `02-design-system.md`

---

## Component Catalog

### LAYOUT (Shell)
| Component | File | Description |
|-----------|------|-------------|
| `AppShell` | `layout/AppShell` | Root layout: sidebar + main + player |
| `Sidebar` | `layout/Sidebar` | Navigation, fandom switch, pixel counter |
| `PlayerBar` | `layout/PlayerBar` | Fixed bottom music player |
| `CanvasLayout` | `layout/CanvasLayout` | 3-panel canvas viewport |

### NAVIGATION
| Component | File | Description |
|-----------|------|-------------|
| `NavItem` | `navigation/NavItem` | Sidebar nav link with icon + label |
| `TabGroup` | `navigation/TabGroup` | Horizontal tabs with Y2K underline |
| `Breadcrumb` | `navigation/Breadcrumb` | Path navigation, retro style |
| `BottomNav` | `navigation/BottomNav` | Mobile bottom tab bar |

### MUSIC
| Component | File | Description |
|-----------|------|-------------|
| `TrackCard` | `music/TrackCard` | Album art + track info, neo-brutalism |
| `TrackListItem` | `music/TrackListItem` | Row in playlist/queue |
| `AlbumGrid` | `music/AlbumGrid` | Grid container for TrackCards |
| `NowPlaying` | `music/NowPlaying` | Expanded player view |
| `ProgressBar` | `music/ProgressBar` | Music seek bar with thumb |
| `VolumeControl` | `music/VolumeControl` | Slider + icon |
| `QueuePanel` | `music/QueuePanel` | Up next playlist |

### CANVAS
| Component | File | Description |
|-----------|------|-------------|
| `CanvasGrid` | `canvas/CanvasGrid` | Main pixel grid viewport |
| `Pixel` | `canvas/Pixel` | Single pixel cell |
| `Minimap` | `canvas/Minimap` | Overview map with viewport rect |
| `CanvasTools` | `canvas/CanvasTools` | Toolbar: place, shield, bomb, color |
| `ColorPicker` | `canvas/ColorPicker` | 16-color palette + hex input |
| `CoordinateDisplay` | `canvas/CoordinateDisplay` | Current hover coordinates |
| `TerritoryOverlay` | `canvas/TerritoryOverlay` | Fandom zone borders & labels |
| `LiveCursor` | `canvas/LiveCursor` | Other users' cursors |
| `CanvasChat` | `canvas/CanvasChat` | Fandom chat panel |

### FANDOM
| Component | File | Description |
|-----------|------|-------------|
| `FandomCard` | `fandom/FandomCard` | Territory preview card |
| `FandomHeader` | `fandom/FandomHeader` | Banner + icon + stats |
| `FandomSelector` | `fandom/FandomSelector` | Dropdown to switch active fandom |
| `FandomStats` | `fandom/FandomStats` | Member/pixel/territory stats row |
| `JoinButton` | `fandom/JoinButton` | Join/Leave with member count |
| `TerritoryMap` | `fandom/TerritoryMap` | Focused view of fandom zone |

### GAMIFICATION
| Component | File | Description |
|-----------|------|-------------|
| `PixelCounter` | `gamification/PixelCounter` | Live pixel balance display |
| `PixelToast` | `gamification/PixelToast` | "+2 PX" notification |
| `LevelBadge` | `gamification/LevelBadge` | Wave level display |
| `XPBar` | `gamification/XPBar` | Experience progress |
| `StreakFlame` | `gamification/StreakFlame` | Daily streak indicator |
| `BadgeGrid` | `gamification/BadgeGrid` | Badge showcase grid |
| `BadgeCard` | `gamification/BadgeCard` | Individual badge with states |
| `LeaderboardRow` | `gamification/LeaderboardRow` | Ranking list item |
| `LeaderboardTable` | `gamification/LeaderboardTable` | Full leaderboard |
| `SeasonWarBanner` | `gamification/SeasonWarBanner` | Active war announcement |
| `CountdownTimer` | `gamification/CountdownTimer` | War/event countdown |

### SOCIAL
| Component | File | Description |
|-----------|------|-------------|
| `UserProfile` | `social/UserProfile` | Profile header + tabs |
| `Avatar` | `social/Avatar` | User image with size variants |
| `AvatarStack` | `social/AvatarStack` | Overlapping avatar group |
| `ActivityFeed` | `social/ActivityFeed` | Real-time activity stream |
| `ActivityItem` | `social/ActivityItem` | Single activity row |
| `UserCard` | `social/UserCard` | Small user info card |

### FEEDBACK
| Component | File | Description |
|-----------|------|-------------|
| `Button` | `feedback/Button` | All button variants |
| `Card` | `feedback/Card` | All card variants |
| `Modal` | `feedback/Modal` | Dialog overlay |
| `Toast` | `feedback/Toast` | Auto-dismiss notification |
| `Tooltip` | `feedback/Tooltip` | Hover info popup |
| `EmptyState` | `feedback/EmptyState` | Illustration + message |
| `LoadingState` | `feedback/LoadingState` | Animated equalizer loader |
| `ErrorState` | `feedback/ErrorState` | Error illustration + retry |

### OVERLAYS
| Component | File | Description |
|-----------|------|-------------|
| `ScanlineOverlay` | `overlays/ScanlineOverlay` | Global retro scanline |
| `GrainOverlay` | `overlays/GrainOverlay` | Subtle noise texture |
| `CustomCursor` | `overlays/CustomCursor` | Pixel art cursor replacement |

---

## Detailed Component Specs

### `AppShell`
```typescript
interface AppShellProps {
  children: React.ReactNode;
  sidebarOpen?: boolean;
  onSidebarToggle?: () => void;
}

// Logic:
// - Renders Sidebar (left), Main (center), PlayerBar (bottom)
// - Main has padding-bottom = player height
// - Sidebar collapses to 80px on tablet, hidden on mobile (becomes drawer)
// - Mobile: BottomNav replaces Sidebar
```

### `PlayerBar`
```typescript
interface PlayerBarProps {
  track: Track | null;
  isPlaying: boolean;
  progress: number; // 0-100
  volume: number; // 0-100
  pixelBalance: number;
  pixelEarnedRecently?: number; // For toast trigger
  onPlayPause: () => void;
  onSkip: (direction: 'prev' | 'next') => void;
  onSeek: (percent: number) => void;
  onVolumeChange: (percent: number) => void;
}

// Logic:
// - Fixed bottom, z-index = 100
// - Glassmorphism background with backdrop-filter
// - Album art: 56×56, neo-brutalism border
// - Progress bar: Click to seek, drag thumb
// - Pixel counter: VT323 font, blinks green when pixelEarnedRecently > 0
// - Shows "+N PX" toast when pixelEarnedRecently changes
```

### `CanvasGrid`
```typescript
interface CanvasGridProps {
  width: number;      // Canvas width in pixels (e.g., 1000)
  height: number;     // Canvas height in pixels (e.g., 1000)
  pixelSize: number;  // Display size per pixel (4-32px)
  pixels: PixelData[]; // Array of {x, y, color, fandomId, timestamp, shielded}
  viewport: { x: number; y: number; zoom: number };
  activeFandomId: string;
  selectedTool: 'place' | 'shield' | 'bomb';
  selectedColor: string;
  pixelBalance: number;
  onPlacePixel: (x: number, y: number) => void;
  onPan: (deltaX: number, deltaY: number) => void;
  onZoom: (delta: number, centerX?: number, centerY?: number) => void;
  liveCursors: CursorData[];
}

// Logic:
// - Render using HTML5 Canvas (preferred) or DOM grid (fallback for small)
// - For >10k pixels: MUST use Canvas API, không dùng DOM elements
// - Grid lines: 1px #E6E6F5, drawn at zoom >= 8px
// - Pixel gap: 1px at all zoom levels
// - Pan: Click-drag (or touch-drag on mobile)
// - Zoom: Wheel (desktop), pinch (mobile), +/- buttons
// - Hover: Show coordinate tooltip, highlight cell
// - Click: Place pixel if tool=place and balance >= cost
// - Right-click: Context menu (shield, bomb, info)
// - Live cursors: Render as small colored triangles with username label
// - Territory borders: Dashed lines, animated dash offset
// - Minimap sync: Two-way binding with Minimap component
```

### `Pixel` (Data Model)
```typescript
interface PixelData {
  id: string;           // "x:y" or UUID
  x: number;            // 0 to canvasWidth-1
  y: number;            // 0 to canvasHeight-1
  color: string;        // Hex color
  fandomId: string;     // Owner fandom
  userId: string;       // Placer user
  placedAt: Date;
  shielded: boolean;    // Cannot be overridden
  shieldExpiresAt?: Date;
  isSuper: boolean;     // 2×2 pixel
}

// Rendering States:
// - Normal: fillRect with color, 1px gap
// - Fresh (< 2min): Scale bounce animation, glow shadow
// - Under attack: Pulsing red border
// - Shielded: Cyan border, subtle rotation
// - Super: 2×2 size, animated gradient border
```

### `PixelCounter`
```typescript
interface PixelCounterProps {
  balance: number;
  earnedDelta?: number; // Positive or negative change
  compact?: boolean; // If true, hide label, show number only
}

// Logic:
// - Font: VT323, 24px (compact: 16px)
// - Color: --pw-neon-lime
// - When earnedDelta > 0: Number ticks up with spring animation, green glow
// - When earnedDelta < 0: Number ticks down, brief red flash
// - Always show "PX" suffix (Press Start 2P, 10px)
```

### `SeasonWarBanner`
```typescript
interface SeasonWarBannerProps {
  war: {
    id: string;
    name: string;
    objective: string;
    endsAt: Date;
    topFandoms: { fandomId: string; name: string; score: number; color: string }[];
  } | null;
}

// Logic:
// - If no active war: Show "Next war starts in: [countdown]" or collapse
// - If active: Full banner with gradient-hot background
// - Countdown: VT323, updates every second
// - Top 3: Mini progress bars with fandom colors
// - Click: Expand to full war modal
// - Animation: Drop from top (translateY -100%→0) with shake on mount
```

### `TrackCard`
```typescript
interface TrackCardProps {
  track: {
    id: string;
    title: string;
    artist: string;
    albumArt: string;
    duration: number;
    fandomId?: string;
  };
  isPlaying?: boolean;
  isLiked?: boolean;
  onPlay: () => void;
  onLike: () => void;
  onAddToQueue: () => void;
}

// Logic:
// - Size: 200×240 container
// - Album art: 180×180, centered, radius-lg, neo-brutalism shadow
// - Title: Body bold, 1 line truncate
// - Artist: Caption, 1 line truncate
// - Hover: Album art scale 1.05, shadow increase, play button overlay
// - Play overlay: 48px circle, --hot-pink, center of album art
// - If isPlaying: Album art has subtle pulse animation, border = --cyan-glow
```

### `FandomCard`
```typescript
interface FandomCardProps {
  fandom: {
    id: string;
    name: string;
    icon: string;
    color: string;
    memberCount: number;
    territorySize: number;
    pixelCount: number;
    isJoined: boolean;
    previewCanvas: string; // Data URL of territory snapshot
  };
  onJoin: () => void;
  onLeave: () => void;
  onView: () => void;
}

// Logic:
// - Size: 280×160
// - Border: 2px solid fandom.color
// - Shadow: 4px 4px 0px darken(fandom.color, 20%)
// - Preview: 80×80 canvas snapshot, bottom-right
// - Join button: Full width, --hot-pink if not joined, --surface-300 if joined
// - Territory size: VT323 font, "45.2M px"
```

### `BadgeCard`
```typescript
interface BadgeCardProps {
  badge: {
    id: string;
    name: string;
    description: string;
    icon: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    unlockedAt?: Date;
    progress?: number; // 0-100 for in-progress
  };
}

// Logic:
// - Size: 64×64
// - Unlocked: Full color, subtle float on hover
// - Locked: Grayscale, opacity 0.4, lock icon overlay
// - Rarity effects:
//   - Legendary: Animated rainbow border (3s loop)
//   - Epic: Pulsing glow, fandom color
//   - Rare: Static glow
//   - Common: No glow
// - Tooltip on hover: Name, description, unlock condition, date
```

### `LeaderboardRow`
```typescript
interface LeaderboardRowProps {
  rank: number;
  fandom: {
    id: string;
    name: string;
    icon: string;
    color: string;
  };
  score: number;
  trend: number; // Positive = up, negative = down
  isCurrentUserFandom?: boolean;
}

// Logic:
// - Height: 56px
// - Rank 1-3: Gold/Silver/Bronze background tint
// - Rank >3: --surface-100
// - Current user fandom: Left border 4px fandom color
// - Score: VT323, 18px
// - Trend: ▲/▼ + number, green/red
// - Click: Navigate to fandom page
```

### `Button` (All Variants)
```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost' | 'glass' | 'retro' | 'danger';
  size: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  icon?: string; // Icon name, rendered left of text
  iconRight?: string;
  isLoading?: boolean;
  isDisabled?: boolean;
  fullWidth?: boolean;
  onClick?: () => void;
}

// Logic:
// - Loading state: Show spinner (equalizer animation), disable interaction
// - Disabled: Opacity 0.5, no shadow, no hover transform
// - Full width: width: 100%
// - Icon only: size square (width = height)
// - Retro variant: Font = Press Start 2P, 12px
```

---

## Component Composition Patterns

### Pattern 1: Compound Component (Canvas)
```
<CanvasLayout>
  <CanvasTools slot="left" />
  <CanvasGrid slot="center" />
  <Minimap slot="left-bottom" />
  <CanvasChat slot="left-bottom" />
  <ActivityFeed slot="right" />
</CanvasLayout>
```

### Pattern 2: Render Props (Leaderboard)
```
<LeaderboardTable data={fandoms}>
  {(item, index) => (
    <LeaderboardRow 
      rank={index + 1} 
      fandom={item} 
      isCurrentUserFandom={item.id === userFandomId}
    />
  )}
</LeaderboardTable>
```

### Pattern 3: Slot Pattern (Modal)
```
<Modal isOpen={true} onClose={close}>
  <Modal.Header>Confirm Action</Modal.Header>
  <Modal.Body>Are you sure?</Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={close}>Cancel</Button>
    <Button variant="primary" onClick={confirm}>Confirm</Button>
  </Modal.Footer>
</Modal>
```

---

## State Management per Component

| Component | Local State | Global State | Notes |
|-----------|-------------|--------------|-------|
| `AppShell` | sidebarOpen | — | Persist to localStorage |
| `PlayerBar` | isExpanded | track, isPlaying, progress, volume | Global player store |
| `CanvasGrid` | viewport, hoverCoord | pixels, pixelBalance | Canvas store (optimistic) |
| `PixelCounter` | displayValue | pixelBalance | Animate from prev to current |
| `SeasonWarBanner` | isExpanded | activeWar | War store |
| `TrackCard` | isHovered | — | Pure presentational |
| `FandomCard` | isHovered | — | Pure presentational |
| `BadgeCard` | showTooltip | — | Pure presentational |
| `LeaderboardRow` | — | — | Pure presentational |

---

## Performance Rules

1. **CanvasGrid:** Sử dụng `requestAnimationFrame` cho render loop. Không dùng React state cho viewport trong render loop.
2. **PixelCounter:** Dùng `useSpring` hoặc CSS transition cho number animation. Không setState mỗi frame.
3. **ActivityFeed:** Virtual scroll nếu >50 items. Dùng `IntersectionObserver` cho lazy load.
4. **AlbumGrid:** `will-change: transform` trên TrackCard hover. Dùng CSS Grid thay vì Flex cho consistent sizing.
5. **LiveCursors:** Throttle cursor updates tới 30fps. Dùng CSS transform thay vì left/top.
6. **Re-renders:** Tất cả list items phải có `key` stable. Dùng `React.memo` cho pure components.
