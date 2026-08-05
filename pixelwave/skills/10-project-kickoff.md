# PIXELWAVE — PROJECT KICKOFF PROMPT

> **Role:** Senior Full-Stack Engineer + Pixel-Perfect Frontend Specialist  
> **Task:** Build the complete Pixelwave web application from design to deployment-ready code  
> **Framework:** Antigravity (adapt patterns to your syntax)  
> **Design Source:** Stitch-generated HTML + PNG mockups  
> **Specs Source:** `pixelwave-skills/` directory (10 skill files)

---

## 🎯 MISSION

You are building **Pixelwave** — a music streaming platform fused with r/place canvas mechanics, wrapped in a Modern Y2K aesthetic. Every pixel placed on the canvas is earned by listening to music. Fandoms battle for territory. Users level up, earn badges, and maintain streaks.

**Your output must be production-quality, pixel-perfect, and fully linked.**

---

## 📖 MANDATORY READING ORDER

Before writing a single line of code, you MUST read these files in this exact order:

```
1. pixelwave-skills/00-README.md              → Understand the suite
2. pixelwave-skills/01-stitch-master-prompt.md → Visual vision & vibe
3. pixelwave-skills/02-design-system.md       → Colors, fonts, spacing tokens
4. pixelwave-skills/03-component-library.md   → Component catalog & interfaces
5. pixelwave-skills/04-canvas-engine.md       → Canvas render logic
6. pixelwave-skills/05-gamification.md        → Game mechanics & calculations
7. pixelwave-skills/06-agent-rules.md         → Code patterns & constraints
8. pixelwave-skills/07-file-structure.md      → Where to place files
9. pixelwave-skills/08-api-contracts.md       → API & WebSocket contracts
10. pixelwave-skills/09-database-schema.md    → DB schema reference
```

**After reading all 10 files, acknowledge what you've learned before proceeding.**

---

## 🎨 DESIGN REFERENCE

You have access to Stitch-generated design files:

### Files to Reference
```
stitch-output/
├── design-system.html          → Colors, typography, component states
├── discover.html               → Home page mockup
├── canvas.html                 → Canvas page mockup
├── profile.html                → Profile page mockup
├── fandom.html                 → Fandom page mockup
├── mobile-discover.html        → Mobile adaptive
├── mobile-canvas.html          → Mobile adaptive
├── assets/
│   ├── logo-wordmark.png
│   ├── logo-icon.png
│   ├── icons/
│   │   ├── play.svg
│   │   ├── pause.svg
│   │   ├── pixel.svg
│   │   ├── shield.svg
│   │   ├── bomb.svg
│   │   └── ... (all 30+ icons)
│   └── illustrations/
│       ├── empty-state.png
│       ├── error-state.png
│       └── onboarding-1.png ... onboarding-3.png
```

### Design Compliance Rules
1. **Colors:** Use EXACT hex values from `02-design-system.md`. Do NOT approximate.
2. **Fonts:** Load all 4 Google Fonts. Use VT323 for ALL numbers, pixel counts, coordinates, countdowns.
3. **Spacing:** 4px base grid. Every margin/padding must be multiple of 4.
4. **Shadows:** Neo-brutalism `4px 4px 0px #000` for interactive elements. Glassmorphism for overlays.
5. **Border Radius:** Only use 4px, 8px, 16px, 24px, or 9999px (pill).
6. **Animations:** Spring physics (cubic-bezier 0.34, 1.56, 0.64, 1). Max 400ms for UI interactions.
7. **Icons:** 24px, stroke 2px, round caps. Use the Stitch-provided SVGs.
8. **Responsive:** Desktop (1440px+), Tablet (768px), Mobile (<768px with bottom nav).

---

## 🏗 IMPLEMENTATION PHASES

### Phase 0: Foundation (CRITICAL — Do First)
```
□ Read all 10 skill files
□ Set up project structure per 07-file-structure.md
□ Configure design tokens (CSS variables or Tailwind config)
□ Load Google Fonts (Space Grotesk, Plus Jakarta Sans, VT323, Press Start 2P)
□ Set up global styles (globals.css with CSS variables, scanline overlay, custom cursor)
□ Create utility functions (cn() merger, canvas coordinate math)
□ Set up state management (Zustand stores: player, canvas, user, war)
□ Set up API client (Axios) and WebSocket (Socket.io)
```

### Phase 1: Layout Shell
```
□ AppShell component (sidebar + main + player bar)
□ Sidebar navigation with icons + labels
□ PlayerBar (fixed bottom, glassmorphism, neo-brutalism)
  - Album art (56×56, radius-lg, 2px black border, 4px shadow)
  - Track info (Space Grotesk bold, Plus Jakarta Sans caption)
  - Controls (Play/Pause 48px hot-pink circle, prev/next 36px)
  - Progress bar (4px height, hot gradient, draggable thumb)
  - Pixel counter (VT323, 24px, neon-lime, blinks on earn)
  - Volume control
□ BottomNav (mobile only, 4 tabs)
□ Scanline overlay (global, fixed, z-999, pointer-events-none)
□ Custom cursor (16×16 pixel art, hot-pink, 1px black outline)
```

### Phase 2: Discover Page (Home)
```
□ Hero carousel (400px, chrome gradient, floating album art)
□ "Your Fandom" section (FandomCard with territory preview)
□ "Season War" section (live banner + mini leaderboard)
□ "Recommended" grid (4-col, 200×240 TrackCards, neo-brutalism)
□ "Canvas Highlights" (3 featured territories, clickable)
□ All cards must have hover states (translate -2px, shadow increase)
□ Link "Canvas Highlights" → /canvas
□ Link "Your Fandom" → /fandom/[id]
□ Link TrackCard play button → starts player + navigates
```

### Phase 3: Canvas Page (The Core)
```
□ HTML5 Canvas Grid (NOT DOM elements)
  - 1000×1000 pixel grid
  - 1px gap between pixels
  - Grid lines at zoom >= 8px
  - Zoom: 0.25x to 4.0x (mouse wheel + buttons)
  - Pan: click-drag
  - Culling: only render visible pixels
  - Offscreen cache for grid lines and territory borders
□ Left Panel (320px, collapsible)
  - Fandom selector (dropdown with color indicator)
  - Territory info (size, members, online)
  - Tools: Place pixel, Shield (5px), Bomb (50px, 1/day)
  - Color picker (16-color palette + custom hex)
  - Minimap (150×150, clickable, viewport rect)
  - Fandom chat (200px, real-time)
□ Right Panel (240px, optional)
  - Activity feed ("User X placed pixel at (420, 69)")
  - Online members (avatar stack)
□ Coordinate display (VT323, bottom-left)
□ Pixel placement with optimistic updates
□ Live cursors (color-coded by fandom, throttled 30fps)
□ Link from Discover "Canvas Highlights" → here
□ Link back to Discover via logo/sidebar
```

### Phase 4: Profile Page
```
□ Profile header (200px, chrome gradient, 96px avatar, wave level badge)
□ Stats row (4-col: Streams | Pixels | Badges | Streak)
□ Tabs: Overview | Canvas | Badges | History
□ Overview: Recent tracks, fandom timeline
□ Canvas tab: Personal 64×64 canvas, contribution heatmap, top territories
□ Badges tab: 6-col grid, 64×64 cards, filter (All/Unlocked/Locked/Legendary)
  - Locked: grayscale, opacity 0.4, lock overlay
  - Legendary: animated rainbow border
  - Epic: pulsing glow
□ Link avatar in sidebar → /profile
□ Link user cards in social → /profile/[id]
```

### Phase 5: Fandom Page
```
□ Fandom header banner (200px, fandom color gradient, 80px icon)
□ Stats bar (Members | Pixels | Territory | Rank | Online)
□ Tabs: Territory | Leaderboard | War History | About
□ Territory tab: Live canvas focused on zone, expansion progress
□ Leaderboard tab: Member contribution ranking (weekly/monthly/all-time)
□ Link from Discover "Your Fandom" → /fandom/[id]
□ Link from TrackCard (if track has fandom) → /fandom/[id]
□ Link from Canvas (territory click) → /fandom/[id]
```

### Phase 6: Gamification Overlay
```
□ PixelCounter (VT323, 24px, fixed in sidebar + player bar)
□ PixelToast ("+2 PX", Press Start 2P, 12px, lime, pill, 3s auto-dismiss)
□ LevelBadge (cyan glow pill, Space Grotesk)
□ XPBar (8px, chrome gradient fill)
□ StreakFlame (animated flicker, flame icon)
□ SeasonWarBanner (gradient-hot, 48px, sticky top, countdown VT323)
□ CountdownTimer (VT323, 20px, updates every second)
□ Badge unlock animation (full-screen overlay, confetti pixel particles)
□ Level up animation (number count-up, screen flash)
```

### Phase 7: Social Features
```
□ ActivityFeed (real-time, scrollable, avatar + message + timestamp)
□ UserCard (compact, avatar + name + level + follow button)
□ FollowButton (neo-brutalism, state: Follow/Following)
□ ShareButton (copy link + native share on mobile)
□ Link from ActivityFeed user names → /profile/[id]
```

### Phase 8: Auth & Onboarding
```
□ Login page (Y2K form, neo-brutalism inputs, chrome gradient background)
□ Register page
□ Onboarding flow (3 steps: Welcome → Pick Fandom → First Pixel)
□ Onboarding illustrations from Stitch assets
```

### Phase 9: Polish & Quality Gates
```
□ All internal links work (no broken navigation)
□ All pages have correct meta titles
□ Loading states (animated equalizer)
□ Empty states (retro computer illustration + message)
□ Error states (glitchy vinyl illustration + retry button)
□ Keyboard navigation (Tab order, Enter to activate, Escape to close modals)
□ Screen reader labels (aria-label, aria-live for pixel announcements)
□ Reduced motion support (prefers-reduced-motion)
□ Mobile: Bottom nav, touch gestures (pinch zoom, two-finger pan)
□ All interactive elements have focus styles (2px cyan outline, offset 2px)
```

---

## 🔗 LINKING REQUIREMENTS (CRITICAL)

Every page must be fully linked. No orphaned pages.

### Navigation Map
```
/layout
├── / (Discover) ←→ /canvas
│   ├── TrackCard play → starts PlayerBar
│   ├── "Canvas Highlights" → /canvas
│   ├── "Your Fandom" → /fandom/[id]
│   ├── "Season War" banner → expands war modal
│   └── TrackCard artist → /fandom/[id] (if has fandom)
│
├── /canvas ←→ /fandom/[id] (via territory click)
│   ├── Territory click → /fandom/[id]
│   ├── Fandom selector → switch active fandom
│   └── User cursor click → /profile/[id]
│
├── /profile/[id] ←→ /fandom/[id] (via fandom list)
│   ├── Fandom in list → /fandom/[id]
│   ├── Follower/Following → /profile/[id]
│   └── Badge click → badge detail modal
│
├── /fandom/[id] ←→ /canvas ("View on Canvas" button)
│   ├── Member click → /profile/[id]
│   └── "Join" → updates sidebar fandom switch
│
├── /charts (Leaderboards)
│   └── Row click → /fandom/[id] or /profile/[id]
│
├── /social (Activity Feed)
│   └── User/Track mention → respective page
│
└── /login, /register, /onboarding
    └── Post-auth redirect → / (Discover)
```

### Sidebar Navigation (Always Visible)
```
Logo → / (Discover)
Discover → /
Canvas → /canvas
Charts → /charts
Social → /social
Profile → /profile (current user)

Fandom Quick Switch (dropdown)
  → Switch active fandom
  → Navigate to /fandom/[id] on select
```

### Player Bar Links
```
Album art click → / (Discover) or track detail
Track name click → track detail modal
Artist name click → /fandom/[id] (if applicable)
```

---

## 🎨 VISUAL QUALITY GATES

Before marking ANY component as complete, verify:

### Color Accuracy
- [ ] All colors match `--pw-*` tokens exactly (use color picker on Stitch PNG if needed)
- [ ] Chrome gradient: `#E8D5F2` → `#B8E6F0` → `#E8D5F2` (135deg)
- [ ] Hot gradient: `#FF6B9D` → `#FF8E53` (90deg)
- [ ] Glassmorphism has `backdrop-filter: blur(20px)` with fallback

### Typography Accuracy
- [ ] Headings: Space Grotesk, bold, correct sizes
- [ ] Body: Plus Jakarta Sans, 14px, 1.5 line-height
- [ ] Numbers/Pixels/Coordinates: VT323, 16-24px, 0.05-0.08em letter-spacing
- [ ] Retro labels: Press Start 2P, 12px, used sparingly

### Spacing Accuracy
- [ ] Base unit: 4px. All values divisible by 4.
- [ ] Sidebar: 280px (80px collapsed)
- [ ] Player bar: 80px (56px mobile)
- [ ] Canvas min: 600×600

### Shadow Accuracy
- [ ] Interactive elements: `box-shadow: 4px 4px 0px #000`
- [ ] Hover: `6px 6px 0px #000` + `translate(-2px, -2px)`
- [ ] Active: `2px 2px 0px #000` + `translate(2px, 2px)`
- [ ] Glass panels: `0 8px 32px rgba(0,0,0,0.1)`

### Animation Accuracy
- [ ] Pixel place: scale 0→1.2→1, 300ms, spring
- [ ] Pixel earned: counter tick + toast slide up + player bar flash green
- [ ] Card hover: translate -2px, shadow increase, 200ms spring
- [ ] Button hover: translate -2px, shadow 6px, 200ms spring
- [ ] Button active: translate 2px, shadow 2px, 150ms
- [ ] Modal: scale 0.9→1 + fade, 300ms spring
- [ ] Toast: slide up + bounce, 300ms spring, auto-dismiss 3s
- [ ] Scanline: fixed, opacity 0.03, z-999, pointer-events-none

---

## 🧪 TESTING REQUIREMENTS

### Per Component
```typescript
// Every component MUST have these tests:
1. Render test (renders without crash)
2. Props test (renders correctly with all prop combinations)
3. Interaction test (click, hover, focus work)
4. Accessibility test (keyboard navigable, has aria labels)
```

### Per Page
```
1. Render test (page loads without error)
2. Navigation test (all links work, no 404s)
3. Responsive test (desktop, tablet, mobile breakpoints)
4. Integration test (data flows correctly from API/mock)
```

### Canvas Specific
```
1. Coordinate conversion round-trip (screen→canvas→screen)
2. Zoom clamp (min 0.25, max 4.0)
3. Pan clamp (cannot pan outside canvas)
4. Pixel placement validation (bounds, cooldown, cost)
5. 60fps render loop (no frame drops at 1000×1000)
```

---

## 📋 DELIVERABLE CHECKLIST

### Code
- [ ] All 10 skill files read and understood
- [ ] All Stitch design files referenced and matched
- [ ] All pages implemented per Phase list
- [ ] All links working (zero broken navigation)
- [ ] All colors exact to design system
- [ ] All fonts loaded and used correctly
- [ ] All animations implemented with spring physics
- [ ] All responsive breakpoints working
- [ ] All accessibility requirements met
- [ ] All components have tests

### Files
- [ ] `src/app/layout.tsx` — Root with providers, fonts, overlays
- [ ] `src/app/page.tsx` — Discover page
- [ ] `src/app/canvas/page.tsx` — Canvas page
- [ ] `src/app/profile/page.tsx` — Current user profile
- [ ] `src/app/profile/[id]/page.tsx` — Other user profile
- [ ] `src/app/fandom/[id]/page.tsx` — Fandom page
- [ ] `src/app/charts/page.tsx` — Leaderboards
- [ ] `src/app/social/page.tsx` — Activity feed
- [ ] `src/app/login/page.tsx` — Login
- [ ] `src/app/register/page.tsx` — Register
- [ ] `src/app/onboarding/page.tsx` — Onboarding flow
- [ ] All components in `src/components/*` per file structure
- [ ] All hooks in `src/hooks/*`
- [ ] All stores in `src/stores/*`
- [ ] All API files in `src/api/*`
- [ ] All types in `src/types/*`
- [ ] Global styles in `src/styles/*`

### Assets
- [ ] All Stitch icons imported to `public/icons/`
- [ ] All Stitch illustrations imported to `public/illustrations/`
- [ ] Logo files in `public/brand/`
- [ ] Grain texture in `public/textures/`
- [ ] Custom cursor asset loaded

---

## ⚠️ COMMON MISTAKES TO AVOID

1. **DO NOT** use `position: absolute` for layout — use CSS Grid/Flexbox
2. **DO NOT** hardcode colors — always use CSS variables
3. **DO NOT** use `!important` in CSS
4. **DO NOT** use inline styles for component styling
5. **DO NOT** forget `key` prop in list renders
6. **DO NOT** use `any` type in TypeScript
7. **DO NOT** forget cleanup in `useEffect`
8. **DO NOT** use `setState` in canvas render loop
9. **DO NOT** skip loading/error/empty states
10. **DO NOT** forget accessibility
11. **DO NOT** leave broken links between pages
12. **DO NOT** approximate colors — match Stitch PNGs exactly
13. **DO NOT** use generic fonts — load all 4 specified fonts
14. **DO NOT** skip mobile responsive
15. **DO NOT** skip reduced-motion support

---

## 🚀 START COMMAND

```
"I have read all 10 skill files and the Stitch design output. 
I understand the Modern Y2K aesthetic, the pixel economy, 
the canvas engine, and the gamification system. 
I will now implement Pixelwave starting with Phase 0: Foundation, 
then proceed through all 9 phases. 
I will ensure every page is linked, every color is exact, 
and every animation follows the spring physics specification."
```

**Begin with Phase 0 now.**
