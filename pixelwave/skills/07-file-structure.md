# PIXELWAVE — Project File Structure

> **For:** All Engineers & Agents  
> **Scope:** Complete project directory tree with file purposes

---

## Root Structure

```
pixelwave/
├── .github/
│   └── workflows/
│       └── ci.yml                    # CI/CD pipeline
├── public/
│   ├── fonts/                        # Self-hosted font fallbacks
│   ├── icons/                        # SVG icon assets
│   ├── illustrations/                # Empty state, error, onboarding
│   ├── textures/
│   │   ├── grain.png                 # 256×256 noise tile
│   │   └── scanline.png              # 4×4 scanline tile
│   └── favicon.ico
├── src/
│   ├── app/                          # Next.js App Router (or pages/)
│   │   ├── layout.tsx                # Root layout with providers
│   │   ├── page.tsx                  # Discover (Home)
│   │   ├── canvas/
│   │   │   └── page.tsx              # Canvas view
│   │   ├── profile/
│   │   │   └── page.tsx              # User profile
│   │   ├── fandom/
│   │   │   └── [id]/
│   │   │       └── page.tsx          # Fandom detail page
│   │   ├── charts/
│   │   │   └── page.tsx              # Leaderboards
│   │   ├── social/
│   │   │   └── page.tsx              # Social feed
│   │   └── login/
│   │       └── page.tsx              # Auth page
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppShell.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── SidebarNav.tsx
│   │   │   ├── PlayerBar.tsx
│   │   │   ├── PlayerControls.tsx
│   │   │   ├── PlayerProgress.tsx
│   │   │   ├── VolumeControl.tsx
│   │   │   ├── CanvasLayout.tsx
│   │   │   └── BottomNav.tsx         # Mobile only
│   │   ├── music/
│   │   │   ├── TrackCard.tsx
│   │   │   ├── TrackListItem.tsx
│   │   │   ├── AlbumGrid.tsx
│   │   │   ├── NowPlaying.tsx
│   │   │   ├── QueuePanel.tsx
│   │   │   ├── TrackMetadata.tsx
│   │   │   └── LikeButton.tsx
│   │   ├── canvas/
│   │   │   ├── CanvasGrid.tsx        # Main HTML5 Canvas
│   │   │   ├── CanvasRenderer.ts     # Render engine class
│   │   │   ├── Pixel.ts              # Pixel data model
│   │   │   ├── Minimap.tsx
│   │   │   ├── CanvasTools.tsx
│   │   │   ├── ColorPicker.tsx
│   │   │   ├── CoordinateDisplay.tsx
│   │   │   ├── TerritoryOverlay.ts   # Territory border renderer
│   │   │   ├── LiveCursor.tsx
│   │   │   ├── CanvasChat.tsx
│   │   │   ├── ChatMessage.tsx
│   │   │   └── ZoomControls.tsx
│   │   ├── fandom/
│   │   │   ├── FandomCard.tsx
│   │   │   ├── FandomHeader.tsx
│   │   │   ├── FandomSelector.tsx
│   │   │   ├── FandomStats.tsx
│   │   │   ├── JoinButton.tsx
│   │   │   ├── TerritoryMap.tsx
│   │   │   ├── FandomMemberList.tsx
│   │   │   └── FandomChat.tsx
│   │   ├── gamification/
│   │   │   ├── PixelCounter.tsx
│   │   │   ├── PixelToast.tsx
│   │   │   ├── PixelToastContainer.tsx
│   │   │   ├── LevelBadge.tsx
│   │   │   ├── XPBar.tsx
│   │   │   ├── StreakFlame.tsx
│   │   │   ├── BadgeCard.tsx
│   │   │   ├── BadgeGrid.tsx
│   │   │   ├── BadgeDetailModal.tsx
│   │   │   ├── LeaderboardRow.tsx
│   │   │   ├── LeaderboardTable.tsx
│   │   │   ├── SeasonWarBanner.tsx
│   │   │   ├── CountdownTimer.tsx
│   │   │   ├── DailyReward.tsx
│   │   │   └── WarReport.tsx
│   │   ├── social/
│   │   │   ├── UserProfile.tsx
│   │   │   ├── UserProfileHeader.tsx
│   │   │   ├── Avatar.tsx
│   │   │   ├── AvatarStack.tsx
│   │   │   ├── ActivityFeed.tsx
│   │   │   ├── ActivityItem.tsx
│   │   │   ├── UserCard.tsx
│   │   │   ├── FollowButton.tsx
│   │   │   └── ShareButton.tsx
│   │   ├── navigation/
│   │   │   ├── NavItem.tsx
│   │   │   ├── TabGroup.tsx
│   │   │   ├── Breadcrumb.tsx
│   │   │   └── Pagination.tsx
│   │   ├── feedback/
│   │   │   ├── Button.tsx
│   │   │   ├── ButtonGroup.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── ModalHeader.tsx
│   │   │   ├── ModalBody.tsx
│   │   │   ├── ModalFooter.tsx
│   │   │   ├── Toast.tsx
│   │   │   ├── ToastProvider.tsx
│   │   │   ├── Tooltip.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   ├── ErrorState.tsx
│   │   │   ├── LoadingState.tsx
│   │   │   └── Skeleton.tsx
│   │   └── overlays/
│   │       ├── ScanlineOverlay.tsx
│   │       ├── GrainOverlay.tsx
│   │       └── CustomCursor.tsx
│   ├── hooks/
│   │   ├── usePixelwave.ts         # Global app context
│   │   ├── usePlayer.ts            # Music player logic
│   │   ├── useCanvas.ts            # Canvas interaction
│   │   ├── useViewport.ts          # Viewport state
│   │   ├── usePixelBalance.ts      # Pixel economy
│   │   ├── useStreak.ts            # Streak tracking
│   │   ├── useWar.ts               # War participation
│   │   ├── useWebSocket.ts         # Socket connection
│   │   ├── useAuth.ts              # Authentication
│   │   ├── useFandom.ts            # Fandom data
│   │   ├── useLeaderboard.ts       # Leaderboard data
│   │   ├── useBadgeProgress.ts     # Badge tracking
│   │   ├── useLocalStorage.ts      # Persist state
│   │   ├── useMediaQuery.ts        # Responsive
│   │   ├── useReducedMotion.ts     # Accessibility
│   │   └── useThrottle.ts          # Performance
│   ├── stores/
│   │   ├── playerStore.ts          # Zustand: player state
│   │   ├── canvasStore.ts          # Zustand: canvas state
│   │   ├── userStore.ts            # Zustand: user state
│   │   ├── warStore.ts             # Zustand: war state
│   │   └── notificationStore.ts    # Zustand: notifications
│   ├── lib/
│   │   ├── utils.ts                # cn(), formatters, helpers
│   │   ├── canvasMath.ts           # Coordinate conversion
│   │   ├── pixelEngine.ts          # Canvas render loop
│   │   ├── antiFarm.ts             # Anti-cheat logic
│   │   ├── gamification.ts         # XP, level, badge calc
│   │   ├── pixelCosts.ts           # Cost validation
│   │   ├── territoryMath.ts        # Territory calculations
│   │   └── constants.ts            # App-wide constants
│   ├── api/
│   │   ├── client.ts               # Axios instance
│   │   ├── socket.ts               # Socket.io client
│   │   ├── tracks.ts               # Track endpoints
│   │   ├── pixels.ts               # Pixel endpoints
│   │   ├── fandoms.ts              # Fandom endpoints
│   │   ├── wars.ts                 # War endpoints
│   │   ├── users.ts                # User endpoints
│   │   ├── auth.ts                 # Auth endpoints
│   │   └── leaderboard.ts          # Leaderboard endpoints
│   ├── types/
│   │   ├── index.ts                # All shared interfaces
│   │   ├── canvas.ts               # Canvas-specific types
│   │   ├── gamification.ts         # Game-specific types
│   │   └── api.ts                  # API request/response types
│   ├── styles/
│   │   ├── globals.css             # Global styles, CSS variables
│   │   ├── animations.css          # Keyframe animations
│   │   └── canvas.css              # Canvas-specific styles
│   ├── providers/
│   │   ├── AppProviders.tsx        # Combine all providers
│   │   ├── AuthProvider.tsx        # Auth context
│   │   ├── ToastProvider.tsx       # Toast context
│   │   ├── SocketProvider.tsx      # Socket context
│   │   └── ThemeProvider.tsx       # Theme context
│   └── __tests__/
│       ├── components/             # Component tests
│       ├── hooks/                  # Hook tests
│       ├── lib/                    # Utility tests
│       └── integration/            # E2E tests
├── skills/                         # <-- THIS FOLDER (Agent instructions)
│   ├── 01-stitch-master-prompt.md
│   ├── 02-design-system.md
│   ├── 03-component-library.md
│   ├── 04-canvas-engine.md
│   ├── 05-gamification.md
│   ├── 06-agent-rules.md
│   ├── 07-file-structure.md
│   └── 08-api-contracts.md
├── tests/
│   ├── e2e/
│   │   ├── canvas.spec.ts          # Canvas interactions
│   │   ├── player.spec.ts          # Music player
│   │   └── auth.spec.ts            # Authentication
│   └── fixtures/
│       ├── tracks.json
│       ├── pixels.json
│       ├── fandoms.json
│       └── users.json
├── docs/
│   ├── architecture.md             # System architecture
│   ├── database-schema.md          # DB design
│   ├── deployment.md               # Deploy guide
│   └── onboarding.md               # New dev guide
├── .env.example
├── .eslintrc.js
├── .prettierrc
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── package.json
└── README.md
```

---

## Key File Purposes

### Entry Points
| File | Purpose |
|------|---------|
| `src/app/layout.tsx` | Root layout: fonts, providers, global overlays (scanline, cursor) |
| `src/app/page.tsx` | Discover page: hero, recommendations, fandom card, war banner |
| `src/app/canvas/page.tsx` | Canvas page: full canvas viewport with tools |
| `src/components/layout/AppShell.tsx` | App shell: sidebar + main + player bar |

### Core Engine
| File | Purpose |
|------|---------|
| `src/components/canvas/CanvasGrid.tsx` | React wrapper for HTML5 canvas |
| `src/lib/pixelEngine.ts` | Render loop, pixel drawing, culling |
| `src/lib/canvasMath.ts` | Screen↔Canvas coordinate conversion |
| `src/components/canvas/CanvasRenderer.ts` | Canvas 2D context management |

### State
| File | Purpose |
|------|---------|
| `src/stores/playerStore.ts` | Current track, play state, queue, volume |
| `src/stores/canvasStore.ts` | Pixels, viewport, tools, colors, cursors |
| `src/stores/userStore.ts` | User data, balance, level, badges, streak |
| `src/stores/warStore.ts` | Active war, scores, events |

### API
| File | Purpose |
|------|---------|
| `src/api/client.ts` | Axios instance with interceptors |
| `src/api/socket.ts` | Socket.io connection, event handlers |
| `src/api/tracks.ts` | GET /tracks, POST /tracks/play, etc. |
| `src/api/pixels.ts` | GET /canvas, POST /pixel/place, etc. |

### Gamification
| File | Purpose |
|------|---------|
| `src/lib/gamification.ts` | XP formula, level calculation, badge checks |
| `src/lib/antiFarm.ts` | Bot detection, validation rules |
| `src/lib/pixelCosts.ts` | Cost validation for all actions |
| `src/hooks/usePixelBalance.ts` | Balance updates, earning logic |
| `src/hooks/useStreak.ts` | Streak tracking, milestone detection |

---

## Environment Variables

```bash
# .env.example
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:3001
NEXT_PUBLIC_APP_NAME=Pixelwave
NEXT_PUBLIC_CANVAS_WIDTH=1000
NEXT_PUBLIC_CANVAS_HEIGHT=1000

# Optional
NEXT_PUBLIC_GA_ID=             # Google Analytics
NEXT_PUBLIC_SENTRY_DSN=        # Error tracking
```
