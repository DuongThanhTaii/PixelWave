# PIXELWAVE — Skill Files Navigation

> **Project:** Pixelwave — Music Streaming × r/place × Y2K  
> **Purpose:** Complete specification suite for AI agents (Stitch, Cursor, Copilot, etc.)  
> **Language:** Vietnamese concept, English specs  
> **Last Updated:** 2026-08-01

---

## 📁 File Index

| # | File | Purpose | For |
|---|------|---------|-----|
| 01 | `01-stitch-master-prompt.md` | **Master prompt cho Stitch** — Yêu cầu thiết kế UI/UX đầy đủ với Y2K aesthetic, component specs, screen mockups, animation, responsive | **Stitch / Design AI** |
| 02 | `02-design-system.md` | **Design System** — Colors, typography, spacing, shadows, gradients, tokens đầy đủ để implement | **Frontend Engineers** |
| 03 | `03-component-library.md` | **Component Catalog** — Tất cả components với props interface, state management, composition patterns, performance rules | **Frontend Engineers** |
| 04 | `04-canvas-engine.md` | **Canvas Engine Spec** — HTML5 Canvas API, pixel mechanics, coordinate math, real-time sync, WebSocket protocol, performance optimization | **Frontend + Backend Engineers** |
| 05 | `05-gamification.md` | **Gamification System** — Pixel economy, level/XP, badges, streaks, Season War, leaderboards, retention mechanics, admin controls | **Backend Engineers** |
| 06 | `06-agent-rules.md` | **Agent Implementation Rules** — Code patterns, component template, Tailwind config, state management, API integration, testing rules, common mistakes | **AI Coding Agents** |
| 07 | `07-file-structure.md` | **Project Structure** — Complete directory tree, file purposes, environment variables | **All Engineers** |
| 08 | `08-api-contracts.md` | **API + WebSocket Contracts** — REST endpoints, request/response schemas, error codes, rate limiting, WebSocket events | **Backend + Frontend Engineers** |

---

## 🚀 Quick Start for Agents

### If you are STITCH (Design AI):
1. Đọc `01-stitch-master-prompt.md` — Đây là prompt chính để bạn tạo design
2. Tham khảo `02-design-system.md` để lấy tokens chính xác
3. Output: Design system file + Component library + 4 screen mockups + Mobile adaptive

### If you are a CODING AGENT (Cursor, Copilot, Claude Code, etc.):
1. **LUÔN ĐỌC TRƯỚC:** `06-agent-rules.md` — Hiểu code patterns và constraints
2. **Design Reference:** `02-design-system.md` — Lấy tokens, colors, fonts
3. **Component Specs:** `03-component-library.md` — Hiểu props và behavior
4. **Canvas Logic:** `04-canvas-engine.md` — Implement canvas engine
5. **Game Logic:** `05-gamification.md` — Business logic calculations
6. **API Reference:** `08-api-contracts.md` — Integrate with backend
7. **Project Structure:** `07-file-structure.md` — Place files correctly

---

## 🎨 Design Principles (Tóm tắt)

- **Y2K + Modern:** Chrome gradients, glassmorphism, neo-brutalism borders, pastel futurism
- **Music First:** Player bar luôn visible, là anchor point của app
- **Gamified but Elegant:** Mọi game element đều có purpose, không rối mắt
- **Fandom Identity:** User thuộc về 1 fandom, UI reflect qua color và territory
- **Performance:** 60fps canvas, optimistic updates, delta sync

---

## 🔑 Key Constraints

1. **Colors:** Chỉ dùng `--pw-*` tokens, không hardcode
2. **Fonts:** 4 fonts duy nhất — Space Grotesk, Plus Jakarta Sans, VT323, Press Start 2P
3. **Shadows:** Neo-brutalism cho interactive, glass cho overlays
4. **Animations:** Max 400ms cho UI interactions, spring physics
5. **Canvas:** HTML5 Canvas API (không DOM grid), culling, offscreen cache
6. **Accessibility:** WCAG AA, reduced-motion, keyboard navigation, screen reader

---

## 📋 Implementation Phases

```
Phase 1: Foundation (Tokens, Layout, Player, Buttons, Cards)
Phase 2: Music (Track cards, Player bar, Progress, Queue)
Phase 3: Canvas (Grid, Minimap, Tools, Territory, Real-time sync)
Phase 4: Gamification (Counter, Badges, Levels, Streak, War banner)
Phase 5: Social (Profile, Activity, Fandom pages, Chat)
Phase 6: Polish (Overlays, Cursor, Animations, Responsive, Tests)
```

---

## 🛠 Tech Stack (Recommended)

- **Frontend:** Next.js 14 + TypeScript + Tailwind CSS
- **State:** Zustand (lightweight, no boilerplate)
- **Canvas:** HTML5 Canvas 2D API (custom render engine)
- **Real-time:** Socket.io (WebSocket with fallbacks)
- **Animation:** Framer Motion (React) + CSS keyframes (Canvas)
- **Fonts:** Google Fonts (Space Grotesk, Plus Jakarta Sans, VT323, Press Start 2P)
- **Icons:** Lucide React (24px, stroke 2px, round caps)

---

## 📝 Notes

- Các file này được thiết kế để **framework-agnostic** nhiều nhất có thể
- Nếu team dùng framework khác (Vue, Svelte, Angular), adapt patterns accordingly
- "Antigravity" là tên framework nội bộ — các spec vẫn áp dụng, chỉ cần adjust syntax
- Mọi thay đổi design/system PHẢI update cả 8 files để đồng bộ

---

**Happy building! 🎧✨🎨**
