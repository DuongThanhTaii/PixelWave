# PIXELWAVE — Gamification System Specification

> **For:** Backend Engineers & Game Logic Agents  
> **Scope:** Pixel earning, levels, badges, streaks, fandom wars, leaderboards  
> **Source of Truth:** Concept Document Section 6

---

## 1. PIXEL ECONOMY

### 1.1 Earning Rules
```typescript
interface PixelEarningRule {
  event: string;
  basePixels: number;
  multiplier?: number;
  cooldown?: number; // ms
  maxPerPeriod?: number;
  conditions?: string[];
}

const EARNING_RULES: PixelEarningRule[] = [
  {
    event: 'track:half',
    basePixels: 1,
    description: 'Listen to 50% of a track'
  },
  {
    event: 'track:complete',
    basePixels: 1,
    description: 'Listen to 100% of a track (total 2 for full listen)'
  },
  {
    event: 'track:repeat',
    basePixels: 0.5,
    cooldown: 3600000, // 1 hour
    maxPerPeriod: 3,
    description: 'Repeat same track within 1 hour (diminishing returns)'
  },
  {
    event: 'fandom:stream',
    basePixels: 1.5,
    conditions: ['active_fandom_track', 'war_season_active'],
    description: '1.5x when streaming fandom artist during war'
  },
  {
    event: 'streak:bonus',
    basePixels: 2,
    conditions: ['streak_day_30'],
    description: '2x multiplier on day 30 streak'
  }
];
```

### 1.2 Anti-Farm Measures
```typescript
interface AntiFarmConfig {
  minTrackDuration: number;        // 30 seconds — tracks shorter don't count
  minListenPercent: number;        // 50% — must listen to at least half
  skipPenaltyWindow: number;       // 5000ms — skip within 5s of start = no pixel
  repeatTrackCooldown: number;     // 3600000ms — 1 hour
  maxRepeatsPerHour: number;       // 3 — after 3 repeats, 0 pixel
  maxPixelsPerHour: number;        // 120 — hard cap per hour
  maxPixelsPerDay: number;         // 500 — hard cap per day
  minTimeBetweenTracks: number;    // 30000ms — 30s minimum
  botDetection: {
    maxPlaysPerMinute: number;     // 5 — more than this = flag
    minHumanVariance: number;      // 2000ms — play times must vary by >2s
  };
}

// Validation flow:
// 1. Track starts → Record startTime, trackId
// 2. Track progresses → Update percentListened (ignore seeks forward >10s)
// 3. Track ends / skip → Validate:
//    a. duration >= minTrackDuration?
//    b. percentListened >= minListenPercent?
//    c. timeSinceLastTrack >= minTimeBetweenTracks?
//    d. trackId !== lastTrackId || timeSinceLastPlay >= repeatTrackCooldown?
//    e. hourlyCount < maxPixelsPerHour?
//    f. dailyCount < maxPixelsPerDay?
//    g. playPattern not bot-like?
// 4. If all pass → Calculate pixels → Add to balance → Emit event
// 5. If fail → Log reason, no pixel, optional warning
```

### 1.3 Pixel Spending
```typescript
interface PixelCost {
  action: string;
  cost: number;
  cooldown: number; // ms, 0 = no cooldown
  dailyLimit?: number;
}

const PIXEL_COSTS: PixelCost[] = [
  { action: 'pixel:place', cost: 1, cooldown: 5000 },
  { action: 'pixel:override', cost: 3, cooldown: 30000 },
  { action: 'pixel:shield', cost: 5, cooldown: 0 },
  { action: 'pixel:bomb', cost: 50, cooldown: 0, dailyLimit: 1 },
  { action: 'pixel:super', cost: 25, cooldown: 86400000, dailyLimit: 1 }, // 24h
  { action: 'territory:expand', cost: 1000, cooldown: 0 }, // Milestone-based
  { action: 'fandom:boost', cost: 100, cooldown: 3600000 } // 1h
];
```

---

## 2. LEVEL SYSTEM (Wave Level)

### 2.1 Level Tiers
```typescript
interface LevelTier {
  minLevel: number;
  maxLevel: number;
  title: string;
  unlocks: string[];
  pixelMultiplier: number;
}

const LEVEL_TIERS: LevelTier[] = [
  {
    minLevel: 1,
    maxLevel: 10,
    title: 'Listener',
    unlocks: ['basic_pixel_placing', 'join_fandom'],
    pixelMultiplier: 1.0
  },
  {
    minLevel: 11,
    maxLevel: 25,
    title: 'Enthusiast',
    unlocks: ['fandom_chat', 'wild_zone_access'],
    pixelMultiplier: 1.1
  },
  {
    minLevel: 26,
    maxLevel: 50,
    title: 'Soldier',
    unlocks: ['war_participation', 'territory_defense'],
    pixelMultiplier: 1.2
  },
  {
    minLevel: 51,
    maxLevel: 75,
    title: 'General',
    unlocks: ['waypoint_placement', 'strategy_flag'],
    pixelMultiplier: 1.3
  },
  {
    minLevel: 76,
    maxLevel: 99,
    title: 'Legend',
    unlocks: ['super_pixel_ability', 'priority_queue'],
    pixelMultiplier: 1.5
  },
  {
    minLevel: 100,
    maxLevel: 100,
    title: 'Icon',
    unlocks: ['immortal_pixel', 'hall_of_fame', 'custom_cursor'],
    pixelMultiplier: 2.0
  }
];
```

### 2.2 XP Formula
```typescript
// XP needed for level N:
function xpForLevel(level: number): number {
  if (level <= 1) return 0;
  return Math.floor(100 * Math.pow(level, 1.5));
}

// Total XP to reach level N:
function totalXpForLevel(level: number): number {
  let total = 0;
  for (let i = 2; i <= level; i++) {
    total += xpForLevel(i);
  }
  return total;
}

// Examples:
// Level 2: 100 XP
// Level 10: 3,162 XP total
// Level 25: 20,615 XP total
// Level 50: 58,579 XP total
// Level 100: 165,380 XP total
```

### 2.3 XP Sources
```typescript
interface XpSource {
  action: string;
  xp: number;
  cooldown?: number;
  maxPerDay?: number;
}

const XP_SOURCES: XpSource[] = [
  { action: 'track:complete', xp: 10 },
  { action: 'pixel:place', xp: 5 },
  { action: 'pixel:survive_24h', xp: 50, cooldown: 86400000 },
  { action: 'war:participate', xp: 100, cooldown: 86400000 }, // Daily
  { action: 'fandom:join', xp: 25 },
  { action: 'territory:contribute', xp: 200 }, // Significant contribution
  { action: 'social:follow', xp: 5, maxPerDay: 10 },
  { action: 'social:share', xp: 15, maxPerDay: 5 },
  { action: 'badge:unlock', xp: 50 },
  { action: 'streak:maintain', xp: 20, cooldown: 86400000 }
];
```

### 2.4 Level Up Event
```typescript
interface LevelUpEvent {
  userId: string;
  oldLevel: number;
  newLevel: number;
  newTitle: string;
  unlocks: string[];
  timestamp: number;
}

// On level up:
// 1. Full-screen overlay animation
// 2. Number count-up: oldLevel → newLevel
// 3. Confetti pixel particles (falling colored squares)
// 4. Show new unlocks list
// 5. Broadcast to fandom chat: "User X leveled up to Legend!"
// 6. Add to activity feed
```

---

## 3. BADGE SYSTEM

### 3.1 Badge Schema
```typescript
interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string; // Icon identifier
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  condition: BadgeCondition;
  category: 'listening' | 'pixel' | 'social' | 'war' | 'special';
}

interface BadgeCondition {
  type: 'count' | 'streak' | 'milestone' | 'event' | 'composite';
  target: number;
  metric: string;
  timeWindow?: number; // ms, 0 = all-time
}
```

### 3.2 Badge Catalog
```typescript
const BADGES: Badge[] = [
  // LISTENING
  {
    id: 'badge_early_adopter',
    name: 'Early Adopter',
    description: 'Joined Pixelwave in the first month',
    icon: 'rocket',
    rarity: 'legendary',
    condition: { type: 'event', target: 1, metric: 'join_date' },
    category: 'special'
  },
  {
    id: 'badge_diamond_ears',
    name: 'Diamond Ears',
    description: 'Listened to 1,000 different tracks',
    icon: 'headphones',
    rarity: 'legendary',
    condition: { type: 'count', target: 1000, metric: 'unique_tracks' },
    category: 'listening'
  },
  {
    id: 'badge_marathon_listener',
    name: 'Marathon Listener',
    description: 'Streamed for 24 hours total',
    icon: 'clock',
    rarity: 'epic',
    condition: { type: 'count', target: 86400000, metric: 'total_stream_time_ms' },
    category: 'listening'
  },

  // PIXEL
  {
    id: 'badge_pixel_picasso',
    name: 'Pixel Picasso',
    description: 'Placed 10,000 pixels on the canvas',
    icon: 'palette',
    rarity: 'epic',
    condition: { type: 'count', target: 10000, metric: 'pixels_placed' },
    category: 'pixel'
  },
  {
    id: 'badge_territory_keeper',
    name: 'Territory Keeper',
    description: 'Kept a pixel alive for 7 days',
    icon: 'shield',
    rarity: 'rare',
    condition: { type: 'streak', target: 7, metric: 'pixel_survival_days' },
    category: 'pixel'
  },
  {
    id: 'badge_canvas_vandal',
    name: 'Canvas Vandal',
    description: 'Overrode 1,000 enemy pixels',
    icon: 'spray-can',
    rarity: 'rare',
    condition: { type: 'count', target: 1000, metric: 'pixels_overridden' },
    category: 'pixel'
  },

  // WAR
  {
    id: 'badge_war_hero',
    name: 'War Hero',
    description: 'Top 10 contributor in a Season War',
    icon: 'medal',
    rarity: 'rare',
    condition: { type: 'event', target: 1, metric: 'war_top_10' },
    category: 'war'
  },
  {
    id: 'badge_conqueror',
    name: 'Conqueror',
    description: 'Won 5 Season Wars',
    icon: 'crown',
    rarity: 'epic',
    condition: { type: 'count', target: 5, metric: 'wars_won' },
    category: 'war'
  },

  // SOCIAL
  {
    id: 'badge_social_butterfly',
    name: 'Social Butterfly',
    description: 'Followed 100 users',
    icon: 'users',
    rarity: 'common',
    condition: { type: 'count', target: 100, metric: 'following_count' },
    category: 'social'
  },
  {
    id: 'badge_trendsetter',
    name: 'Trendsetter',
    description: 'Shared 50 tracks that got 100+ plays',
    icon: 'share-2',
    rarity: 'epic',
    condition: { type: 'composite', target: 50, metric: 'viral_shares' },
    category: 'social'
  },

  // STREAK
  {
    id: 'badge_stream_streak_7',
    name: 'Week Warrior',
    description: '7-day stream streak',
    icon: 'flame',
    rarity: 'common',
    condition: { type: 'streak', target: 7, metric: 'daily_stream_streak' },
    category: 'listening'
  },
  {
    id: 'badge_stream_streak_30',
    name: 'Month Master',
    description: '30-day stream streak',
    icon: 'flame',
    rarity: 'epic',
    condition: { type: 'streak', target: 30, metric: 'daily_stream_streak' },
    category: 'listening'
  },
  {
    id: 'badge_stream_streak_365',
    name: 'Yearly Devotee',
    description: '365-day stream streak',
    icon: 'flame',
    rarity: 'legendary',
    condition: { type: 'streak', target: 365, metric: 'daily_stream_streak' },
    category: 'listening'
  }
];
```

### 3.3 Badge Progress Tracking
```typescript
interface BadgeProgress {
  badgeId: string;
  userId: string;
  current: number;
  target: number;
  percent: number;
  unlockedAt?: number;
}

// Check on every relevant event:
// - After track complete → Check listening badges
// - After pixel place → Check pixel badges
// - After war end → Check war badges
// - Daily at midnight → Check streak badges

function checkBadgeUnlock(userId: string, event: string, value: number) {
  const relevantBadges = BADGES.filter(b => b.condition.metric === event);

  for (const badge of relevantBadges) {
    const progress = getBadgeProgress(userId, badge.id);
    if (progress.unlockedAt) continue;

    progress.current += value;

    if (progress.current >= badge.condition.target) {
      progress.unlockedAt = Date.now();
      emitBadgeUnlock(userId, badge);
    }
  }
}
```

---

## 4. STREAK SYSTEM

### 4.1 Daily Stream Streak
```typescript
interface StreakConfig {
  minTracksPerDay: number;     // 3 tracks
  minListenPercentPerTrack: number; // 50%
  gracePeriodHours: number;    // 24 hours (next day until same time)
  timezone: string;            // User's local timezone
}

// Streak logic:
// 1. User must listen to >= minTracksPerDay tracks (each >= 50%)
// 2. "Day" defined by user's timezone (midnight to midnight)
// 3. If missed: Streak resets to 0
// 4. If maintained: Streak += 1

// Streak milestones:
const STREAK_MILESTONES = [
  { day: 3, multiplier: 1.2, reward: '2x pixel day' },
  { day: 7, multiplier: 1.5, reward: 'Streak Shield (1 day)' },
  { day: 14, multiplier: 1.5, reward: 'Exclusive badge progress' },
  { day: 30, multiplier: 2.0, reward: 'Month Master badge + Streak Shield (3 days)' },
  { day: 100, multiplier: 2.0, reward: 'Century badge + Custom profile theme' },
  { day: 365, multiplier: 3.0, reward: 'Yearly Devotee badge + Immortal pixel' }
];
```

### 4.2 Fandom Streak
```typescript
// If ENTIRE fandom maintains daily stream streak (defined by % of active members):
// - 50% active members stream → "Fandom Warm"
// - 75% active members stream → "Fandom Hot" (1.2x pixel)
// - 90% active members stream → "Fandom Fever" (1.5x pixel, 24h)

interface FandomStreak {
  fandomId: string;
  currentStreakDays: number;
  activeMemberPercent: number;
  status: 'normal' | 'warm' | 'hot' | 'fever';
  multiplier: number;
}
```

### 4.3 Streak Recovery (Monetization)
```typescript
// If streak broken:
// - Offer "Streak Freeze" (1 use per month for free users)
// - Pixel+ subscribers: 3 freezes per month
// - Can buy additional freeze: 100 pixels or $0.99

// Streak Freeze: Maintains streak count, no multiplier bonus for that day
```

---

## 5. SEASON WAR SYSTEM

### 5.1 War Lifecycle
```typescript
interface SeasonWar {
  id: string;
  name: string;
  description: string;
  objective: WarObjective;
  status: 'upcoming' | 'active' | 'ended';
  startsAt: number;
  endsAt: number;
  createdBy: string; // Admin ID
  participatingFandoms: string[]; // Empty = all fandoms
  rules: WarRules;
  rewards: WarReward[];
}

interface WarObjective {
  type: 'territory_dominance' | 'art_challenge' | 'survival' | 'pixel_race';
  target: number; // Percentage, time, or count
  description: string;
}

interface WarRules {
  allowOverrides: boolean;
  allowBombs: boolean;
  allowShields: boolean;
  pixelMultiplier: number; // Usually 1.5 during war
  territoryLock: boolean; // Lock territory sizes during war
}

interface WarReward {
  type: 'territory_glow' | 'badge' | 'feature' | 'pixel_bonus';
  target: 'winner' | 'top_3' | 'top_10' | 'all_participants';
  value: string | number;
  duration?: number; // ms
}
```

### 5.2 Objective Types
```typescript
// 1. TERRITORY_DOMINANCE
// Target: >60% of Wild Zone
// Measurement: Count pixels by fandom in Wild Zone bounds
// Winner: Fandom with highest percentage at end time

// 2. ART_CHALLENGE
// Target: Create specific art (e.g., "Album cover of [Artist]")
// Measurement: Community vote + admin judgment
// Winner: Best art + most community votes

// 3. SURVIVAL
// Target: Maintain territory without losing >20% pixels
// Measurement: Territory pixel count at start vs end
// Winner: Fandom with highest retention percentage

// 4. PIXEL_RACE
// Target: First to place N pixels in Wild Zone
// Measurement: Real-time count
// Winner: First fandom to reach target
```

### 5.3 Scoring
```typescript
interface WarScore {
  fandomId: string;
  warId: string;
  territoryPercent: number;     // For territory dominance
  pixelsPlaced: number;         // Total during war
  pixelsSurvived: number;       // Still alive at end
  pixelsOverridden: number;     // Enemy pixels taken
  memberContributors: number;   // Unique members who placed pixels
  score: number;                // Composite score
}

// Composite scoring (Territory Dominance example):
function calculateScore(s: WarScore): number {
  return (
    s.territoryPercent * 1000 +
    s.pixelsPlaced * 0.1 +
    s.pixelsSurvived * 0.5 -
    s.pixelsOverridden * 0.2 +
    s.memberContributors * 10
  );
}
```

### 5.4 War Events
```typescript
// During war, real-time events:
interface WarEvent {
  type: 'territory_change' | 'milestone_reached' | 'fandom_overtake' | 'war_ending_soon';
  warId: string;
  fandomId?: string;
  message: string;
  timestamp: number;
}

// Examples:
// - "Swifties just overtook ARMY in Wild Zone!"
// - "Fandom Fever activated for Swifties! 1.5x pixel boost!"
// - "War ends in 1 hour! Current leader: Swifties (42%)"
```

### 5.5 Post-War
```typescript
// 1. Calculate final scores
// 2. Determine winner
// 3. Distribute rewards
// 4. Generate war report:
//    - Total pixels placed
//    - Most active member
//    - Territory before/after
//    - Key moments timeline
// 5. Archive war data
// 6. Announce next war schedule
```

---

## 6. LEADERBOARD SYSTEM

### 6.1 Leaderboard Types
```typescript
type LeaderboardType = 
  | 'fandom_overall'      // By total territory + pixels
  | 'fandom_war'          // Current/last war scores
  | 'fandom_streaming'    // By total stream hours
  | 'user_pixel'          // By pixels placed
  | 'user_streaming'      // By stream time
  | 'user_contribution'   // By fandom contribution
  | 'user_xp';            // By Wave Level

type LeaderboardPeriod = 'daily' | 'weekly' | 'monthly' | 'all_time';
```

### 6.2 Ranking Algorithm
```typescript
// Real-time for small datasets (< 1000)
// Cached + batch update for large datasets

interface LeaderboardEntry {
  rank: number;
  entityId: string; // userId or fandomId
  entityName: string;
  entityAvatar: string;
  score: number;
  trend: number; // Change from previous period
  previousRank: number;
  metadata: Record<string, any>;
}

// Update strategy:
// - Real-time: In-memory sorted set (Redis ZSET)
// - Batch: Every 5 minutes for "all_time", every 1 minute for "daily"
// - On query: Read from cache, stale-while-revalidate
```

### 6.3 Redis Schema
```redis
# Fandom overall leaderboard (all time)
ZADD lb:fandom:overall <score> <fandomId>

# User pixel leaderboard (weekly)
ZADD lb:user:pixel:weekly <pixelCount> <userId>

# War leaderboard
ZADD lb:war:<warId> <score> <fandomId>

# Get top 100:
ZREVRANGE lb:fandom:overall 0 99 WITHSCORES

# Get user rank:
ZREVRANK lb:fandom:overall <fandomId>
```

---

## 7. NOTIFICATION SYSTEM

### 7.1 Notification Types
```typescript
interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data: Record<string, any>;
  read: boolean;
  createdAt: number;
}

type NotificationType =
  | 'pixel_earned'
  | 'level_up'
  | 'badge_unlocked'
  | 'streak_milestone'
  | 'war_started'
  | 'war_ended'
  | 'war_event'
  | 'territory_attacked'
  | 'fandom_invite'
  | 'follow'
  | 'mention'
  | 'system';
```

### 7.2 Delivery Channels
- **In-app:** Bell icon with badge count, dropdown panel
- **Toast:** Immediate for pixel earned, level up, badge
- **Push:** War start/end, territory attacked, streak at risk
- **Email:** Weekly summary, war results, milestone achievements

### 7.3 Priority
```typescript
const NOTIFICATION_PRIORITY = {
  'pixel_earned': 1,      // Toast only
  'level_up': 2,          // Toast + in-app
  'badge_unlocked': 2,    // Toast + in-app
  'war_started': 3,       // Toast + in-app + push
  'territory_attacked': 3, // Toast + in-app + push
  'streak_at_risk': 4,    // Toast + in-app + push + email
};
```

---

## 8. RETENTION MECHANICS

### 8.1 Daily Login Rewards
```typescript
interface DailyReward {
  day: number; // 1-7
  reward: 'pixels' | 'xp' | 'shield' | 'badge_progress';
  amount: number;
}

const DAILY_REWARDS: DailyReward[] = [
  { day: 1, reward: 'pixels', amount: 5 },
  { day: 2, reward: 'pixels', amount: 10 },
  { day: 3, reward: 'xp', amount: 50 },
  { day: 4, reward: 'pixels', amount: 15 },
  { day: 5, reward: 'shield', amount: 1 },
  { day: 6, reward: 'pixels', amount: 20 },
  { day: 7, reward: 'pixels', amount: 50 } // Weekly bonus
];

// Reset every 7 days. Missing a day doesn't reset, just skips that reward.
```

### 8.2 Push Notification Triggers
```typescript
const PUSH_TRIGGERS = [
  { trigger: 'streak_at_risk', timing: '20:00 local time if no streams today', message: 'Your streak is at risk! Listen to 3 tracks to keep it alive 🔥' },
  { trigger: 'war_starting_soon', timing: '1 hour before war', message: 'Season War starts in 1 hour! Rally your fandom! ⚔️' },
  { trigger: 'territory_under_attack', timing: 'Real-time', message: 'Your fandom territory is under attack! Defend now! 🛡️' },
  { trigger: 'pixel_milestone', timing: 'When reaching 100, 500, 1000 pixels', message: 'You earned 100 pixels! Place them on the canvas! 🎨' },
  { trigger: 'fandom_fever', timing: 'When activated', message: 'Fandom Fever! Your fandom is on fire! 1.5x pixels for 24h! 🔥' },
  { trigger: 'weekly_summary', timing: 'Every Monday 9:00', message: 'Your weekly Pixelwave recap is ready! 📊' }
];
```

### 8.3 Re-engagement Flow
```typescript
// User inactive 1 day:
// → Push: "Your fandom needs you! [Fandom name] is losing territory!"

// User inactive 3 days:
// → Email: Weekly recap + "We miss you" + streak status
// → Push: "Come back and get 2x pixels today!"

// User inactive 7 days:
// → Email: "Your territory is shrinking!" + war highlights
// → In-app: "Welcome back" bonus (50 pixels)

// User inactive 30 days:
// → Email: "What's new in Pixelwave" + feature highlights
// → Offer: "Streak recovery free" if they had high streak
```

---

## 9. ADMIN CONTROLS

### 9.1 War Management
```typescript
interface AdminWarControls {
  createWar: (config: SeasonWar) => void;
  startWar: (warId: string) => void;
  endWar: (warId: string) => void;
  extendWar: (warId: string, hours: number) => void;
  pauseWar: (warId: string) => void;
  setObjective: (warId: string, objective: WarObjective) => void;
  broadcastMessage: (warId: string, message: string) => void;
}
```

### 9.2 Canvas Management
```typescript
interface AdminCanvasControls {
  resetCanvas: () => void; // Wipe all pixels (new season)
  resetZone: (territoryId: string) => void;
  expandTerritory: (fandomId: string, size: number) => void;
  setPixel: (x: number, y: number, color: string) => void; // Admin pixel (free)
  banUserFromCanvas: (userId: string, duration: number) => void;
  setWarZone: (bounds: Bounds) => void;
}
```

### 9.3 Economy Controls
```typescript
interface AdminEconomyControls {
  grantPixels: (userId: string, amount: number, reason: string) => void;
  setGlobalMultiplier: (multiplier: number, duration: number) => void;
  adjustEarningRules: (rules: PixelEarningRule[]) => void;
  createPromoCode: (code: string, reward: Reward) => void;
}
```

---

## 10. ANALYTICS EVENTS

```typescript
// Track these events for analytics:
const ANALYTICS_EVENTS = [
  'track:play',
  'track:complete',
  'track:skip',
  'pixel:place',
  'pixel:override',
  'pixel:shield',
  'pixel:bomb',
  'fandom:join',
  'fandom:leave',
  'war:join',
  'war:contribute',
  'level:up',
  'badge:unlock',
  'streak:broken',
  'streak:milestone',
  'subscription:purchase',
  'share:track',
  'share:territory',
  'session:start',
  'session:end',
  'retention:return_after_7d'
];
```
