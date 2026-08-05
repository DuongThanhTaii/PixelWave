# STITCH MASTER PROMPT — PIXELWAVE

## Project Identity
**Name:** Pixelwave  
**Tagline:** "Where every beat paints a pixel."  
**Vibe:** Modern Y2K meets Apple Music precision. Chrome gradients, glassmorphism, neo-brutalism borders, pastel futurism.  
**Mood:** Playful rebellion. Nostalgic but hyper-modern. Like an iMac G3 redesigned by Gen Z in 2026.

---

## Design Philosophy
- **Y2K Heritage + Modern Execution:** Không phải retro đơn thuần. Là Y2K được lọc qua lens của 2026.
- **Music-First:** UI phục vụ trải nghiệm nghe nhạc. Canvas là layer social, không cướp spotlight từ player.
- **Gamified but Elegant:** Gamification phải cảm thấy organic, không rối mắt. Mọi element đều có purpose.
- **Fandom as Identity:** User thuộc về 1 fandom. UI phải reflect điều đó qua color, badge, territory.

---

## Color System

### Primary Palette
| Token | Hex | Usage |
|-------|-----|-------|
| `--chrome-start` | `#E8D5F2` | Gradient start (lavender chrome) |
| `--chrome-end` | `#B8E6F0` | Gradient end (cyan chrome) |
| `--hot-pink` | `#FF6B9D` | CTAs, active states, fandom accent |
| `--cyan-glow` | `#00F0FF` | Highlights, pixel glow, hover effects |
| `--neon-lime` | `#CCFF00` | Success, streak active, notifications |
| `--deep-purple` | `#6B2D5C` | Text primary, dark mode base |

### Surface Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `--surface-100` | `#FAFAFF` | Main background (off-white with blue tint) |
| `--surface-200` | `#F0F0FA` | Card background |
| `--surface-300` | `#E6E6F5` | Elevated surfaces, modals |
| `--glass` | `rgba(255,255,255,0.25)` | Glassmorphism panels |
| `--glass-border` | `rgba(255,255,255,0.4)` | Glass borders |

### Semantic Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `--pixel-earned` | `#CCFF00` | Pixel notification, earned state |
| `--war-active` | `#FF0040` | Season war active, danger zone |
| `--territory-shield` | `#00F0FF` | Protected pixel territory |

### Gradients
```
--gradient-chrome: linear-gradient(135deg, #E8D5F2 0%, #B8E6F0 50%, #E8D5F2 100%);
--gradient-hot: linear-gradient(90deg, #FF6B9D 0%, #FF8E53 100%);
--gradient-cyber: linear-gradient(180deg, #00F0FF 0%, #6B2D5C 100%);
--gradient-glass: linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 100%);
```

---

## Typography

### Font Stack
- **Display / Headings:** `Space Grotesk` (Google Fonts) — Bold, geometric, slightly quirky
- **Body / UI:** `Plus Jakarta Sans` (Google Fonts) — Clean, modern, readable
- **Data / Numbers / Pixel Count:** `VT323` (Google Fonts) — Monospace pixel font cho số liệu, cooldown, coordinates
- **Accent / Retro Labels:** `Press Start 2P` (Google Fonts) — Dùng sparingly cho badge names, retro labels

### Scale
| Level | Font | Size | Weight | Line Height | Letter Spacing |
|-------|------|------|--------|-------------|----------------|
| Display | Space Grotesk | 48px | 700 | 1.1 | -0.02em |
| H1 | Space Grotesk | 32px | 700 | 1.2 | -0.01em |
| H2 | Space Grotesk | 24px | 600 | 1.3 | 0 |
| H3 | Plus Jakarta Sans | 18px | 600 | 1.4 | 0 |
| Body | Plus Jakarta Sans | 14px | 400 | 1.5 | 0.01em |
| Caption | Plus Jakarta Sans | 12px | 500 | 1.4 | 0.02em |
| Data | VT323 | 16px | 400 | 1.0 | 0.05em |
| Pixel Counter | VT323 | 24px | 400 | 1.0 | 0.08em |

---

## Spacing & Layout

### Grid
- **Base unit:** 4px
- **Container max-width:** 1440px
- **Sidebar width:** 280px (collapsible to 80px)
- **Player bar height:** 80px
- **Canvas viewport:** Fluid, minimum 600×600

### Border Radius
| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | 4px | Buttons, tags |
| `--radius-md` | 8px | Cards, inputs |
| `--radius-lg` | 16px | Modals, panels |
| `--radius-xl` | 24px | Main containers |
| `--radius-pill` | 9999px | Avatars, status badges |

### Neo-Brutalism Borders
- **Standard:** `2px solid #000000` với `box-shadow: 4px 4px 0px #000000`
- **Hover:** `box-shadow: 6px 6px 0px #000000; transform: translate(-2px, -2px)`
- **Active:** `box-shadow: 2px 2px 0px #000000; transform: translate(2px, 2px)`
- **Glass variant:** `border: 1px solid rgba(255,255,255,0.4); box-shadow: 0 8px 32px rgba(0,0,0,0.1)`

---

## Component Specifications

### 1. Music Player Bar (Fixed Bottom)
```
Height: 80px
Background: --glass with backdrop-filter: blur(20px)
Border-top: 1px solid --glass-border
Layout: [Track Info | Controls | Volume/Extras]

Track Info:
  - Album art: 56×56, radius-lg, neo-brutalism border
  - Track name: Body bold, --deep-purple
  - Artist: Caption, --deep-purple at 60% opacity

Controls:
  - Play/Pause: 48×48 circle, --hot-pink background, white icon, neo-brutalism shadow
  - Prev/Next: 36×36, --surface-300, neo-brutalism shadow
  - Progress bar: 4px height, --gradient-hot, thumb là 12px circle --hot-pink

Extras:
  - Pixel counter: VT323, --neon-lime, blinking animation when earning
  - "+2 PX" toast: Floats up from counter, fades after 2s
```

### 2. Canvas Grid (Main Viewport)
```
Background: #FFFFFF (grid lines 1px #E6E6F5)
Pixel size default: 12px (zoomable 4px-32px)
Grid overlay: Subtle dot pattern every 10 pixels

Pixel States:
  - Normal: Solid color, 1px gap between pixels (grid look)
  - Freshly placed: Scale 0→1 with bounce, glow effect 2s
  - Under attack: Pulsing red border, 0.5s interval
  - Shielded: Cyan border, subtle rotate animation
  - Super Pixel: 2×2 size, animated gradient border

Territory Borders:
  - Fandom zone: Dashed line 2px, fandom color, 8px dash 4px gap
  - Wild Zone: Solid 2px --war-active with animated gradient

Navigation:
  - Zoom: Mouse wheel or +/- buttons
  - Pan: Click-drag or minimap
  - Minimap: Bottom-right, 150×150, shows full canvas with viewport rect
```

### 3. Fandom Territory Card
```
Size: 280×160 (grid layout)
Background: --gradient-glass
Border: 2px solid fandom-color
Border-radius: --radius-lg
Box-shadow: 4px 4px 0px fandom-color-dark

Content:
  - Fandom icon: 48×48, radius-pill
  - Fandom name: H3, bold
  - Territory size: Data font, "45.2M px"
  - Member count: Caption with 👥 icon
  - "Join" button: Full width, --hot-pink, neo-brutalism
  - Mini canvas preview: 80×80 showing territory snapshot
```

### 4. Season War Banner
```
Position: Top of canvas area, sticky
Height: 48px
Background: --gradient-hot
Border: 2px solid #000
Border-radius: --radius-md
Box-shadow: 0 4px 0px #000

Content:
  - War icon: ⚔️ animated shake
  - "SEASON WAR: [Name]" in Press Start 2P, 12px, white
  - Countdown: VT323, 20px, white, monospace
  - Leaderboard preview: Top 3 fandoms with mini progress bars
```

### 5. Pixel Notification Toast
```
Position: Fixed, bottom 100px (above player), center
Background: --neon-lime
Color: --deep-purple
Border: 2px solid #000
Border-radius: --radius-pill
Padding: 12px 24px
Font: Press Start 2P, 12px
Box-shadow: 4px 4px 0px #000
Animation: Slide up + bounce, auto-dismiss 3s
Content: "🎵 +2 PIXELS EARNED!"
```

### 6. User Profile Header
```
Background: --gradient-chrome
Height: 200px
Border-radius: 0 0 --radius-xl --radius-xl

Avatar: 96×96, radius-pill, 4px border white, neo-brutalism shadow
Username: Display font, --deep-purple
Wave Level: Badge pill, --cyan-glow background, --deep-purple text
Stats row: 3 columns — Streams | Pixels | Badges
  Each: Icon + VT323 number + caption label
```

### 7. Badge Showcase
```
Size: 64×64 each, grid gap 12px
Background: --surface-200
Border: 2px solid #000
Border-radius: --radius-md
Box-shadow: 3px 3px 0px #000

States:
  - Locked: Grayscale 100%, opacity 0.4, 🔒 icon overlay
  - Unlocked: Full color, subtle float animation on hover
  - Legendary: Animated rainbow border, 3s loop
  - Epic: Pulsing glow, fandom color
  - Rare: Static glow
```

### 8. Leaderboard Row
```
Height: 56px
Layout: [Rank | Fandom Icon | Name | Score | Trend]

Rank 1: 🥇 gold background tint
Rank 2: 🥈 silver background tint  
Rank 3: 🥉 bronze background tint
Others: --surface-100

Score: VT323, 18px, --deep-purple
Trend: ▲/▼ arrow + number, --neon-lime or --war-active
```

---

## Animation & Motion

### Principles
- **Bouncy, not linear:** Spring physics cho tất cả UI transitions
- **Purposeful motion:** Mọi animation đều feedback cho user action
- **Retro glitch accents:** Occasional chromatic aberration, scanline overlay (subtle)

### Key Animations
| Animation | Trigger | Spec |
|-----------|---------|------|
| Pixel Place | Click canvas | Scale 0→1.2→1, 300ms, spring(1, 80, 10) |
| Pixel Earned | 50%/100% track | Counter tick up, toast slide up, player bar flash green |
| Territory Expand | Milestone reach | Border ripple outward, color wave |
| War Start | Admin trigger | Banner drop from top with shake, canvas tint red pulse |
| Level Up | XP threshold | Full-screen overlay, number count up, confetti pixel particles |
| Streak Active | Daily check | Flame icon ignite, border gradient animate |

### Global Effects
- **Scanline overlay:** 2px lines, opacity 0.03, fixed to viewport, pointer-events none
- **Grain texture:** Subtle noise, opacity 0.02, blend-mode overlay
- **Cursor:** Custom 16×16 pixel cursor, --hot-pink, 1px black outline

---

## Screen Specifications

### Screen 1: Discover (Home)
```
Layout: Sidebar (280px) | Main Content (fluid)

Main Content:
  - Hero: "Now Trending" carousel, 400px height, chrome gradient background, album art float
  - "Your Fandom" section: Territory status card + quick actions
  - "Season War" section: Live banner + mini leaderboard
  - "Recommended" grid: 4-col album cards, 200×240, neo-brutalism
  - "Canvas Highlights": 3 featured territories, clickable

Sidebar:
  - Logo: Pixelwave wordmark, Space Grotesk Bold, chrome gradient text
  - Nav: Discover, Canvas, Charts, Social, Profile
  - Fandom quick switch: Avatar + name, dropdown
  - Mini pixel counter: VT323, "You have: 42 px"
```

### Screen 2: Canvas (r/place)
```
Layout: Full viewport minus player bar

Left Panel (320px, collapsible):
  - Fandom selector: Dropdown with color indicator
  - Territory info: Size, members, online now
  - Tools: Place pixel, Shield, Bomb (with pixel cost)
  - Color picker: 16-color palette + custom hex
  - Minimap: 150×150, clickable to navigate
  - Chat: Fandom chat, 200px height

Center: Canvas viewport
  - Zoom controls: +/-, fit-to-screen
  - Coordinate display: VT323, bottom-left
  - Grid toggle: Button
  - Live cursors: Other users' cursors, color-coded by fandom

Right Panel (240px, optional):
  - Activity feed: "User X placed pixel at (420, 69)"
  - Online members: Avatar stack, max 5 shown
```

### Screen 3: Profile
```
Layout: Header (200px) | Tabs | Content

Tabs: Overview | Canvas | Badges | History

Overview:
  - Stats cards: 4-col grid, neo-brutalism
  - Recent tracks: List view with play count
  - Fandom history: Timeline of joined fandoms

Canvas Tab:
  - Personal 64×64 canvas (editable)
  - Contribution heatmap to main canvas (GitHub-style)
  - Top territories contributed

Badges Tab:
  - Grid 6-col, 64×64 badges
  - Filter: All | Unlocked | Locked | Legendary
  - Badge detail modal: Name, description, unlock condition, date earned
```

### Screen 4: Fandom Page
```
Layout: Header banner | Stats bar | Tabs

Header:
  - Fandom banner: 100% width, 200px, fandom color gradient
  - Fandom icon: 80×80, overlapped bottom
  - Name + tagline
  - "Join/Leave" button (prominent)

Stats Bar:
  - Members | Total Pixels | Territory Size | Rank | Online Now
  - All in VT323, card layout

Tabs: Territory | Leaderboard | War History | About

Territory Tab:
  - Live canvas view (focused on fandom zone)
  - Territory expansion progress bar
  - "Defend" / "Expand" action buttons

Leaderboard Tab:
  - Member contribution ranking
  - Weekly / Monthly / All-time filters
```

---

## Responsive Behavior

### Desktop (1440px+)
- Full 3-panel layout (sidebar + canvas + right panel)
- Canvas 1000×1000+ visible
- All features accessible

### Tablet (768px-1439px)
- Sidebar collapses to icons (80px)
- Right panel becomes bottom sheet
- Canvas takes remaining space
- Touch: Two-finger pan, pinch zoom

### Mobile (<768px)
- Bottom tab navigation (Discover, Canvas, Social, Profile)
- Player bar becomes mini (56px) with expand gesture
- Canvas: Full-screen modal when active
- Pixel placement: Tap to place, long-press for tools
- Simplified territory view (list instead of grid)

---

## Assets Needed

### Icons (24px, stroke 2px, rounded caps)
- Play, Pause, Skip, Repeat, Shuffle, Heart, Share
- Pixel, Shield, Bomb, Cursor, ZoomIn, ZoomOut, Grid
- Trophy, Flame, Star, Lock, Unlock, Crown, Sword
- Music, Disc, Mic, Radio, Chart, Users, Message

### Illustrations
- Empty state: Retro computer with "No pixels placed yet"
- Error state: Glitchy vinyl record
- Loading: Animated equalizer bars in Y2K colors
- Onboarding: 3-step pixel art tutorial

### Brand
- Logo: Wordmark "PIXELWAVE" in Space Grotesk Bold, chrome gradient, optional pixel wave icon
- Favicon: 16×16 pixel art wave
- App icon: 1024×1024, chrome gradient circle with pixel wave

---

## Design Constraints for Stitch
1. **Không dùng gradient quá 3 màu** trong 1 element. Giữ chrome gradient làm signature.
2. **Neo-brutalism shadow chỉ dùng cho interactive elements.** Không dùng cho static text.
3. **VT323 chỉ dùng cho số liệu và retro labels.** Không dùng cho body text.
4. **Glassmorphism phải có backdrop-filter.** Không dùng solid opacity làm glass.
5. **Mọi màu fandom phải pass WCAG AA** khi kết hợp với white text.
6. **Canvas pixel gap phải là 1px.** Không gapless, không quá 2px.
7. **Animation duration tối đa 400ms** cho UI interactions. Chỉ loop animation mới được >1s.

---

## Output Expectations
Stitch sẽ tạo:
1. **Design System File:** Colors, typography, spacing tokens
2. **Component Library:** Tất cả 8 components trên ở 3 states (default, hover, active)
3. **4 Screen Mockups:** Desktop 1440px cho Discover, Canvas, Profile, Fandom
4. **Mobile Adaptations:** 375px cho Canvas và Discover
5. **Interactive Prototype:** Flow chính: Discover → Play → Earn Pixel → Place Pixel → View Territory
6. **Asset Export:** Icons, logo concepts, empty state illustrations

---

## Notes for Designer
- Hãy nghĩ đến **"Apple Music nếu được thiết kế bởi KidPix và The Matrix"**
- Canvas area phải cảm giác **"sống"** — pixels có thể thấy mới được đặt, territory borders có thể thấy đang giãn nở
- Player bar phải **luôn visible** và là anchor point của toàn bộ app
- Y2K không có nghĩa là messy. Là **organized chaos** — mỗi element có vẻ playful nhưng vị trí precise
