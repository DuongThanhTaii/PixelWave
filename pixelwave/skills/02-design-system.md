# PIXELWAVE — Design System Specification

> **For:** UI Engineers & Frontend Agents  
> **Scope:** All visual tokens, layout rules, and component primitives  
> **Framework:** Framework-agnostic (CSS custom properties / Tailwind config / etc.)

---

## 1. TOKENS

### 1.1 Colors

#### Primary
```css
--pw-chrome-start: #E8D5F2;
--pw-chrome-end: #B8E6F0;
--pw-hot-pink: #FF6B9D;
--pw-cyan-glow: #00F0FF;
--pw-neon-lime: #CCFF00;
--pw-deep-purple: #6B2D5C;
```

#### Surfaces
```css
--pw-surface-100: #FAFAFF;
--pw-surface-200: #F0F0FA;
--pw-surface-300: #E6E6F5;
--pw-glass: rgba(255, 255, 255, 0.25);
--pw-glass-border: rgba(255, 255, 255, 0.4);
--pw-glass-dark: rgba(0, 0, 0, 0.1);
```

#### Semantic
```css
--pw-pixel-earned: #CCFF00;
--pw-war-active: #FF0040;
--pw-territory-shield: #00F0FF;
--pw-success: #00E676;
--pw-warning: #FFD600;
--pw-error: #FF1744;
```

#### Gradients (CSS)
```css
--pw-gradient-chrome: linear-gradient(135deg, #E8D5F2 0%, #B8E6F0 50%, #E8D5F2 100%);
--pw-gradient-hot: linear-gradient(90deg, #FF6B9D 0%, #FF8E53 100%);
--pw-gradient-cyber: linear-gradient(180deg, #00F0FF 0%, #6B2D5C 100%);
--pw-gradient-glass: linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 100%);
--pw-gradient-war: linear-gradient(90deg, #FF0040 0%, #FF6B9D 50%, #FF0040 100%);
```

#### Fandom Colors (Palette pool — assign on creation)
| ID | Hex | Name |
|----|-----|------|
| fandom-01 | #FF6B9D | Hot Pink |
| fandom-02 | #00F0FF | Cyan |
| fandom-03 | #CCFF00 | Lime |
| fandom-04 | #FF8E53 | Orange |
| fandom-05 | #9D4EDD | Purple |
| fandom-06 | #FF006E | Magenta |
| fandom-07 | #3A86FF | Blue |
| fandom-08 | #FB5607 | Red-Orange |
| fandom-09 | #8338EC | Violet |
| fandom-10 | #06FFB4 | Teal |

---

### 1.2 Typography

#### Font Imports
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=VT323&family=Press+Start+2P&display=swap" rel="stylesheet">
```

#### Font Stack Variables
```css
--pw-font-display: 'Space Grotesk', system-ui, sans-serif;
--pw-font-body: 'Plus Jakarta Sans', system-ui, sans-serif;
--pw-font-data: 'VT323', 'Courier New', monospace;
--pw-font-retro: 'Press Start 2P', monospace;
```

#### Type Scale
```css
--pw-text-display: 48px;   /* line-height: 1.1; letter-spacing: -0.02em; font: display; weight: 700 */
--pw-text-h1: 32px;        /* line-height: 1.2; letter-spacing: -0.01em; font: display; weight: 700 */
--pw-text-h2: 24px;        /* line-height: 1.3; letter-spacing: 0; font: display; weight: 600 */
--pw-text-h3: 18px;        /* line-height: 1.4; letter-spacing: 0; font: body; weight: 600 */
--pw-text-body: 14px;      /* line-height: 1.5; letter-spacing: 0.01em; font: body; weight: 400 */
--pw-text-caption: 12px;   /* line-height: 1.4; letter-spacing: 0.02em; font: body; weight: 500 */
--pw-text-data: 16px;      /* line-height: 1.0; letter-spacing: 0.05em; font: data; weight: 400 */
--pw-text-pixel: 24px;     /* line-height: 1.0; letter-spacing: 0.08em; font: data; weight: 400 */
--pw-text-retro: 12px;     /* line-height: 1.6; letter-spacing: 0; font: retro; weight: 400 */
```

---

### 1.3 Spacing

#### Base Scale (4px grid)
```css
--pw-space-1: 4px;
--pw-space-2: 8px;
--pw-space-3: 12px;
--pw-space-4: 16px;
--pw-space-5: 20px;
--pw-space-6: 24px;
--pw-space-8: 32px;
--pw-space-10: 40px;
--pw-space-12: 48px;
--pw-space-16: 64px;
--pw-space-20: 80px;
--pw-space-24: 96px;
```

#### Layout Dimensions
```css
--pw-sidebar-width: 280px;
--pw-sidebar-collapsed: 80px;
--pw-player-height: 80px;
--pw-player-height-mobile: 56px;
--pw-header-height: 64px;
--pw-canvas-min: 600px;
--pw-container-max: 1440px;
```

---

### 1.4 Border Radius
```css
--pw-radius-sm: 4px;
--pw-radius-md: 8px;
--pw-radius-lg: 16px;
--pw-radius-xl: 24px;
--pw-radius-pill: 9999px;
```

---

### 1.5 Shadows (Neo-Brutalism)
```css
--pw-shadow-brutal: 4px 4px 0px 0px #000000;
--pw-shadow-brutal-hover: 6px 6px 0px 0px #000000;
--pw-shadow-brutal-active: 2px 2px 0px 0px #000000;
--pw-shadow-brutal-lg: 8px 8px 0px 0px #000000;
--pw-shadow-glass: 0 8px 32px 0px rgba(0, 0, 0, 0.1);
--pw-shadow-glow-cyan: 0 0 20px rgba(0, 240, 255, 0.4);
--pw-shadow-glow-pink: 0 0 20px rgba(255, 107, 157, 0.4);
--pw-shadow-glow-lime: 0 0 20px rgba(204, 255, 0, 0.4);
```

---

### 1.6 Z-Index Scale
```css
--pw-z-base: 0;
--pw-z-canvas-grid: 1;
--pw-z-canvas-pixel: 2;
--pw-z-canvas-cursor: 10;
--pw-z-canvas-ui: 20;
--pw-z-player: 100;
--pw-z-sidebar: 90;
--pw-z-modal: 200;
--pw-z-toast: 300;
--pw-z-tooltip: 400;
--pw-z-scanline: 999;
--pw-z-cursor-custom: 1000;
```

---

### 1.7 Transitions
```css
--pw-transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
--pw-transition-base: 200ms cubic-bezier(0.4, 0, 0.2, 1);
--pw-transition-spring: 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
--pw-transition-slow: 400ms cubic-bezier(0.4, 0, 0.2, 1);
--pw-transition-bounce: 500ms cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

---

## 2. LAYOUT SYSTEM

### 2.1 App Shell
```
┌─────────────────────────────────────────────────────────────┐
│  Sidebar (280px)  │  Main Content Area (fluid)              │
│                   │                                         │
│  [Fixed]          │  [Scrollable]                           │
│                   │                                         │
├───────────────────┴─────────────────────────────────────────┤
│  Player Bar (80px, fixed bottom, full width)               │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Canvas Layout
```
┌─────────────────────────────────────────────────────────────┐
│  Left Panel (320px)  │  Canvas Viewport  │  Right (240px)  │
│  [Tools/Chat]        │  [Grid]           │  [Activity]     │
│  [Collapsible]       │  [Zoom/Pan]       │  [Optional]     │
└─────────────────────────────────────────────────────────────┘
```

### 2.3 Grid System
- **CSS Grid / Flexbox** — không bắt buộc 12-col
- **Album grid:** auto-fill, minmax(180px, 1fr), gap 16px
- **Badge grid:** 6 columns on desktop, 4 on tablet, 3 on mobile
- **Stats row:** 4 columns desktop, 2 tablet, 1 mobile

---

## 3. COMPONENT PRIMITIVES

### 3.1 Button Variants

#### Primary
```css
background: var(--pw-hot-pink);
color: white;
border: 2px solid #000;
border-radius: var(--pw-radius-md);
box-shadow: var(--pw-shadow-brutal);
font-family: var(--pw-font-body);
font-weight: 600;
padding: 10px 20px;
transition: all var(--pw-transition-spring);

&:hover {
  transform: translate(-2px, -2px);
  box-shadow: var(--pw-shadow-brutal-hover);
}
&:active {
  transform: translate(2px, 2px);
  box-shadow: var(--pw-shadow-brutal-active);
}
```

#### Secondary
```css
background: var(--pw-surface-200);
color: var(--pw-deep-purple);
border: 2px solid #000;
box-shadow: var(--pw-shadow-brutal);
/* Same hover/active as Primary */
```

#### Ghost
```css
background: transparent;
color: var(--pw-deep-purple);
border: 2px solid var(--pw-deep-purple);
box-shadow: none;

&:hover {
  background: var(--pw-surface-200);
  box-shadow: var(--pw-shadow-brutal);
}
```

#### Glass
```css
background: var(--pw-gradient-glass);
backdrop-filter: blur(20px);
-webkit-backdrop-filter: blur(20px);
border: 1px solid var(--pw-glass-border);
color: var(--pw-deep-purple);
border-radius: var(--pw-radius-lg);
box-shadow: var(--pw-shadow-glass);
```

#### Retro (Pixel Font)
```css
background: var(--pw-neon-lime);
color: var(--pw-deep-purple);
border: 2px solid #000;
box-shadow: var(--pw-shadow-brutal);
font-family: var(--pw-font-retro);
font-size: var(--pw-text-retro);
padding: 12px 16px;
```

---

### 3.2 Card
```css
background: var(--pw-surface-100);
border: 2px solid #000;
border-radius: var(--pw-radius-lg);
box-shadow: var(--pw-shadow-brutal);
padding: var(--pw-space-4);
transition: all var(--pw-transition-spring);

&:hover {
  transform: translate(-2px, -2px);
  box-shadow: var(--pw-shadow-brutal-hover);
}
```

#### Card Variants
- **Fandom Card:** Border color = fandom color, shadow offset color = fandom dark variant
- **Stats Card:** Background = chrome gradient, no border, shadow = glow variant
- **Glass Card:** Background = glass gradient, backdrop-filter, thin border

---

### 3.3 Input / Form
```css
background: var(--pw-surface-100);
border: 2px solid #000;
border-radius: var(--pw-radius-md);
padding: 10px 14px;
font-family: var(--pw-font-body);
font-size: var(--pw-text-body);
color: var(--pw-deep-purple);
box-shadow: inset 2px 2px 0px rgba(0,0,0,0.05);

&:focus {
  outline: none;
  border-color: var(--pw-cyan-glow);
  box-shadow: inset 2px 2px 0px rgba(0,0,0,0.05), var(--pw-shadow-glow-cyan);
}
```

---

### 3.4 Avatar
```css
border-radius: var(--pw-radius-pill);
border: 3px solid white;
box-shadow: var(--pw-shadow-brutal);
object-fit: cover;

/* Sizes */
--pw-avatar-sm: 32px;
--pw-avatar-md: 48px;
--pw-avatar-lg: 64px;
--pw-avatar-xl: 96px;
--pw-avatar-fandom: 80px; /* Fandom page header */
```

#### Avatar Stack (Multiple)
```css
display: flex;
margin-left: -12px; /* Overlap */

&:first-child { margin-left: 0; }
/* Each avatar has border: 2px solid white; z-index incremental */
```

---

### 3.5 Badge / Pill
```css
/* Base */
display: inline-flex;
align-items: center;
gap: var(--pw-space-1);
padding: 4px 12px;
border-radius: var(--pw-radius-pill);
font-family: var(--pw-font-body);
font-size: var(--pw-text-caption);
font-weight: 600;

/* Level Badge */
background: var(--pw-cyan-glow);
color: var(--pw-deep-purple);

/* Streak Badge */
background: var(--pw-gradient-hot);
color: white;

/* Status Badge (Online) */
background: var(--pw-neon-lime);
color: var(--pw-deep-purple);
/* Dot indicator: 6px circle, same color darker, margin-right 4px */
```

---

### 3.6 Progress Bar
```css
height: 8px;
background: var(--pw-surface-300);
border-radius: var(--pw-radius-pill);
overflow: hidden;
border: 1px solid #000;

&-fill {
  height: 100%;
  background: var(--pw-gradient-hot);
  border-radius: var(--pw-radius-pill);
  transition: width var(--pw-transition-slow);
}
```

#### Variants
- **Music progress:** 4px height, thumb draggable 12px circle
- **Territory expansion:** 12px height, segmented
- **XP level:** 8px, chrome gradient fill

---

### 3.7 Tooltip
```css
background: var(--pw-deep-purple);
color: white;
padding: 6px 12px;
border-radius: var(--pw-radius-sm);
font-family: var(--pw-font-body);
font-size: var(--pw-text-caption);
box-shadow: var(--pw-shadow-brutal);
/* Arrow: 8px triangle, same background */
```

---

### 3.8 Modal / Dialog
```css
/* Overlay */
background: rgba(107, 45, 92, 0.4);
backdrop-filter: blur(8px);

/* Content */
background: var(--pw-surface-100);
border: 2px solid #000;
border-radius: var(--pw-radius-xl);
box-shadow: var(--pw-shadow-brutal-lg);
padding: var(--pw-space-6);
max-width: 520px;
width: 90%;

/* Animation: Scale 0.9→1 + fade in, spring */
```

---

### 3.9 Toast / Notification
```css
/* Position: Fixed, bottom 100px from player, center */
background: var(--pw-neon-lime);
color: var(--pw-deep-purple);
border: 2px solid #000;
border-radius: var(--pw-radius-pill);
padding: 12px 24px;
font-family: var(--pw-font-retro);
font-size: var(--pw-text-retro);
box-shadow: var(--pw-shadow-brutal);

/* Animation: translateY(20px)→0, opacity 0→1, 300ms spring */
/* Auto-dismiss: 3s, fade out 200ms */
```

---

## 4. ICONOGRAPHY RULES

### 4.1 Style
- **Stroke width:** 2px
- **Stroke linecap:** round
- **Stroke linejoin:** round
- **Size:** 24px default, 20px compact, 32px prominent
- **Color:** Inherit from parent (currentColor)

### 4.2 Icon Set (Required)
**Player:** play, pause, skip-forward, skip-back, repeat, repeat-once, shuffle, heart, heart-filled, volume-x, volume-low, volume-high  
**Canvas:** mouse-pointer, crosshair, shield, bomb, zoom-in, zoom-out, grid, move, undo  
**Social:** users, message-circle, share-2, flag, crown, sword, trophy  
**Status:** flame, star, lock, unlock, clock, activity, trending-up, trending-down  
**UI:** menu, x, check, chevron-down, chevron-up, search, bell, settings, log-out  
**Gamification:** zap, award, gem, target, radio, music, disc, mic  

### 4.3 Animated Icons
- **Loading:** 3-bar equalizer, each bar 4px wide, animate height 4px→16px staggered
- **Pixel earn:** Coin/pixel icon, rotate 360° + scale pulse
- **War active:** Sword icon, shake 5° left-right, 0.3s loop
- **Streak:** Flame icon, flicker opacity 0.7→1, 0.5s loop

---

## 5. ACCESSIBILITY

### 5.1 Contrast
- Tất cả text trên background phải đạt **WCAG AA** (4.5:1 cho normal, 3:1 cho large)
- Fandom colors phải được validate trước khi assign
- Glassmorphism areas phải có fallback solid background cho reduced-motion

### 5.2 Motion
- **prefers-reduced-motion:** Tắt tất cả animation ngoài opacity fade. Không dùng transform/scale.
- **Focus states:** Tất cả interactive elements có 2px outline --pw-cyan-glow, offset 2px
- **Keyboard navigation:** Tab order logical, canvas có keyboard shortcuts documented

### 5.3 Screen Reader
- Canvas: Aria-live region cho "Pixel placed at X,Y" announcements
- Player: Track change phải announce qua aria-live="polite"
- Badges: Mỗi badge có aria-label với tên và trạng thái (locked/unlocked)

---

## 6. DARK MODE (Future Phase)

```css
@media (prefers-color-scheme: dark) {
  --pw-surface-100: #0A0A12;
  --pw-surface-200: #141420;
  --pw-surface-300: #1E1E2E;
  --pw-deep-purple: #E8D5F2;
  --pw-glass: rgba(255, 255, 255, 0.05);
  --pw-glass-border: rgba(255, 255, 255, 0.1);
  --pw-shadow-brutal: 4px 4px 0px 0px #FFFFFF;
}
```

---

## 7. ASSET NAMING CONVENTION

```
assets/
├── icons/
│   ├── icon-[name].svg          # 24px base
│   ├── icon-[name]-20.svg       # Compact variant
│   └── icon-[name]-32.svg       # Prominent variant
├── illustrations/
│   ├── ill-empty-[context].svg  # Empty states
│   ├── ill-error-[context].svg  # Error states
│   └── ill-onboarding-[step].svg # Tutorial steps
├── brand/
│   ├── logo-wordmark.svg
│   ├── logo-icon.svg            # 1:1 ratio
│   └── logo-full.svg            # Wordmark + icon
└── textures/
    ├── texture-grain.png        # 256×256 tileable
    └── texture-scanline.png     # 4×4 repeating
```

---

## 8. IMPLEMENTATION CHECKLIST

- [ ] All CSS custom properties defined in `:root`
- [ ] Font imports in HTML `<head>` with `preconnect`
- [ ] Neo-brutalism shadow utility classes
- [ ] Glassmorphism fallback for browsers without backdrop-filter
- [ ] Spring transition timing function defined
- [ ] Z-index scale strictly followed (no arbitrary values)
- [ ] All interactive elements have focus styles
- [ ] Reduced-motion media query handled
- [ ] Custom cursor asset loaded (16×16 PNG/SVG)
- [ ] Scanline overlay implemented (fixed, pointer-events none, z-max)
