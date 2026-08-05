# PIXELWAVE — Database Schema Specification

> **For:** Backend Engineers & Database Architects  
> **Primary DB:** PostgreSQL 16+  
> **Cache/Real-time:** Redis 7+  
> **Analytics/Logs:** ClickHouse (optional, Phase 3)  
> **Search:** Elasticsearch (optional, Phase 3)  
> **Last Updated:** 2026-08-03

---

## 1. ARCHITECTURE OVERVIEW

```
┌─────────────────────────────────────────────────────────────┐
│  PostgreSQL (Primary)                                       │
│  ├── Users, Tracks, Artists, Albums                        │
│  ├── Fandoms, Territories, Pixels                          │
│  ├── Wars, Badges, Streaks, Sessions                       │
│  └── Notifications, Activities, Payments                   │
├─────────────────────────────────────────────────────────────┤
│  Redis (Cache + Real-time)                                  │
│  ├── Session tokens                                        │
│  ├── Pixel cache (hot zones)                               │
│  ├── Leaderboards (Sorted Sets)                            │
│  ├── Rate limiting (Sliding window)                        │
│  └── Real-time presence (Pub/Sub)                          │
├─────────────────────────────────────────────────────────────┤
│  ClickHouse (Analytics — Phase 3)                           │
│  ├── Stream events                                         │
│  ├── Pixel events                                          │
│  └── User behavior funnel                                  │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. POSTGRESQL SCHEMA

### 2.1 Extensions
```sql
-- Required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";      -- UUID generation
CREATE EXTENSION IF NOT EXISTS "pg_trgm";        -- Fuzzy text search
CREATE EXTENSION IF NOT EXISTS "btree_gin";      -- GIN index for arrays
CREATE EXTENSION IF NOT EXISTS "postgis";        -- Geospatial (territory bounds)
```

---

### 2.2 Users
```sql
CREATE TABLE users (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username            VARCHAR(30) NOT NULL,
    display_name        VARCHAR(50),
    email               VARCHAR(255) NOT NULL,
    password_hash       VARCHAR(255) NOT NULL,
    avatar_url          VARCHAR(500),
    bio                 TEXT,

    -- Gamification
    wave_level          INTEGER NOT NULL DEFAULT 1,
    xp                  BIGINT NOT NULL DEFAULT 0,
    pixel_balance       INTEGER NOT NULL DEFAULT 0,
    total_pixels_earned BIGINT NOT NULL DEFAULT 0,
    total_pixels_spent  BIGINT NOT NULL DEFAULT 0,

    -- Streak
    current_streak      INTEGER NOT NULL DEFAULT 0,
    longest_streak      INTEGER NOT NULL DEFAULT 0,
    streak_last_date    DATE,

    -- Fandom
    active_fandom_id    UUID,

    -- Subscription
    subscription_tier   VARCHAR(20) NOT NULL DEFAULT 'free',
    subscription_expires_at TIMESTAMPTZ,

    -- Status
    is_verified         BOOLEAN NOT NULL DEFAULT FALSE,
    is_artist           BOOLEAN NOT NULL DEFAULT FALSE,
    is_admin            BOOLEAN NOT NULL DEFAULT FALSE,
    is_banned           BOOLEAN NOT NULL DEFAULT FALSE,
    ban_reason          TEXT,
    ban_expires_at      TIMESTAMPTZ,

    -- Metadata
    last_login_at       TIMESTAMPTZ,
    last_active_at      TIMESTAMPTZ,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at          TIMESTAMPTZ,

    CONSTRAINT chk_username_format CHECK (username ~ '^[a-zA-Z0-9_]{3,30}$'),
    CONSTRAINT chk_email_format CHECK (email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT chk_wave_level_positive CHECK (wave_level > 0),
    CONSTRAINT chk_xp_non_negative CHECK (xp >= 0),
    CONSTRAINT chk_pixel_balance_non_negative CHECK (pixel_balance >= 0)
);

-- Indexes
CREATE UNIQUE INDEX idx_users_username ON users(username) WHERE deleted_at IS NULL;
CREATE UNIQUE INDEX idx_users_email ON users(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_active_fandom ON users(active_fandom_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_subscription ON users(subscription_tier, subscription_expires_at);
CREATE INDEX idx_users_level ON users(wave_level DESC);
CREATE INDEX idx_users_created ON users(created_at DESC);
CREATE INDEX idx_users_trgm ON users USING gin(username gin_trgm_ops);
```

---

### 2.3 Artists
```sql
CREATE TABLE artists (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name                VARCHAR(100) NOT NULL,
    slug                VARCHAR(100) NOT NULL,
    bio                 TEXT,
    avatar_url          VARCHAR(500),
    banner_url          VARCHAR(500),
    genre               VARCHAR(50),
    verified            BOOLEAN NOT NULL DEFAULT FALSE,
    verified_at         TIMESTAMPTZ,

    spotify_url         VARCHAR(500),
    youtube_url         VARCHAR(500),
    instagram_url       VARCHAR(500),
    twitter_url         VARCHAR(500),

    total_streams       BIGINT NOT NULL DEFAULT 0,
    total_plays         BIGINT NOT NULL DEFAULT 0,
    follower_count      INTEGER NOT NULL DEFAULT 0,

    fandom_id           UUID,

    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_artist_slug_format CHECK (slug ~ '^[a-z0-9-]+$')
);

CREATE UNIQUE INDEX idx_artists_slug ON artists(slug);
CREATE INDEX idx_artists_name ON artists(name);
CREATE INDEX idx_artists_genre ON artists(genre);
CREATE INDEX idx_artists_fandom ON artists(fandom_id);
CREATE INDEX idx_artists_trgm ON artists USING gin(name gin_trgm_ops);
```

---

### 2.4 Albums
```sql
CREATE TABLE albums (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title               VARCHAR(200) NOT NULL,
    slug                VARCHAR(200) NOT NULL,
    artist_id           UUID NOT NULL REFERENCES artists(id) ON DELETE RESTRICT,
    artwork_url         VARCHAR(500),
    release_date        DATE,
    genre               VARCHAR(50),
    description         TEXT,

    total_plays         BIGINT NOT NULL DEFAULT 0,
    track_count         INTEGER NOT NULL DEFAULT 0,

    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_album_slug_format CHECK (slug ~ '^[a-z0-9-]+$')
);

CREATE UNIQUE INDEX idx_albums_slug ON albums(slug);
CREATE INDEX idx_albums_artist ON albums(artist_id);
CREATE INDEX idx_albums_release ON albums(release_date DESC);
```

---

### 2.5 Tracks
```sql
CREATE TABLE tracks (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title               VARCHAR(200) NOT NULL,
    slug                VARCHAR(200) NOT NULL,
    artist_id           UUID NOT NULL REFERENCES artists(id) ON DELETE RESTRICT,
    album_id            UUID REFERENCES albums(id) ON DELETE SET NULL,

    audio_url           VARCHAR(500),
    youtube_video_id    VARCHAR(20),
    source              VARCHAR(20) NOT NULL,
    duration_ms         INTEGER NOT NULL,

    genre               VARCHAR(50),
    lyrics              TEXT,
    track_number        INTEGER,
    is_explicit         BOOLEAN NOT NULL DEFAULT FALSE,

    fandom_id           UUID,

    play_count          BIGINT NOT NULL DEFAULT 0,
    like_count          INTEGER NOT NULL DEFAULT 0,

    uploaded_by         UUID REFERENCES users(id) ON DELETE SET NULL,
    upload_status       VARCHAR(20) NOT NULL DEFAULT 'pending',

    content_id_claimed  BOOLEAN NOT NULL DEFAULT FALSE,

    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_track_slug_format CHECK (slug ~ '^[a-z0-9-]+$'),
    CONSTRAINT chk_track_duration_positive CHECK (duration_ms > 0)
);

CREATE UNIQUE INDEX idx_tracks_slug ON tracks(slug);
CREATE INDEX idx_tracks_artist ON tracks(artist_id);
CREATE INDEX idx_tracks_album ON tracks(album_id);
CREATE INDEX idx_tracks_fandom ON tracks(fandom_id);
CREATE INDEX idx_tracks_genre ON tracks(genre);
CREATE INDEX idx_tracks_source ON tracks(source, upload_status);
CREATE INDEX idx_tracks_plays ON tracks(play_count DESC);
CREATE INDEX idx_tracks_created ON tracks(created_at DESC);
CREATE INDEX idx_tracks_trgm ON tracks USING gin(title gin_trgm_ops);
```

---

### 2.6 Fandoms
```sql
CREATE TABLE fandoms (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name                VARCHAR(100) NOT NULL,
    slug                VARCHAR(100) NOT NULL,
    artist_id           UUID REFERENCES artists(id) ON DELETE SET NULL,
    description         TEXT,

    icon_url            VARCHAR(500),
    banner_url          VARCHAR(500),
    color               VARCHAR(7) NOT NULL,

    territory_bounds    BOX2D,
    territory_pixel_count INTEGER NOT NULL DEFAULT 0,
    territory_max_size  INTEGER NOT NULL DEFAULT 40000,

    member_count        INTEGER NOT NULL DEFAULT 0,
    total_pixels        BIGINT NOT NULL DEFAULT 0,
    total_streams       BIGINT NOT NULL DEFAULT 0,
    wars_won            INTEGER NOT NULL DEFAULT 0,
    wars_participated   INTEGER NOT NULL DEFAULT 0,

    leader_user_id      UUID REFERENCES users(id) ON DELETE SET NULL,

    is_public           BOOLEAN NOT NULL DEFAULT TRUE,
    join_requirement    VARCHAR(20) NOT NULL DEFAULT 'open',

    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_fandom_slug_format CHECK (slug ~ '^[a-z0-9-]+$'),
    CONSTRAINT chk_fandom_color_format CHECK (color ~ '^#[0-9A-Fa-f]{6}$')
);

CREATE UNIQUE INDEX idx_fandoms_slug ON fandoms(slug);
CREATE INDEX idx_fandoms_artist ON fandoms(artist_id);
CREATE INDEX idx_fandoms_color ON fandoms(color);
CREATE INDEX idx_fandoms_members ON fandoms(member_count DESC);
CREATE INDEX idx_fandoms_trgm ON fandoms USING gin(name gin_trgm_ops);
```

---

### 2.7 User Fandoms (Junction)
```sql
CREATE TABLE user_fandoms (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    fandom_id           UUID NOT NULL REFERENCES fandoms(id) ON DELETE CASCADE,

    role                VARCHAR(20) NOT NULL DEFAULT 'member',
    joined_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    pixels_contributed  BIGINT NOT NULL DEFAULT 0,
    pixels_overridden   BIGINT NOT NULL DEFAULT 0,
    streams_contributed BIGINT NOT NULL DEFAULT 0,
    wars_participated   INTEGER NOT NULL DEFAULT 0,
    wars_won            INTEGER NOT NULL DEFAULT 0,

    last_active_at      TIMESTAMPTZ,

    UNIQUE(user_id, fandom_id)
);

CREATE INDEX idx_user_fandoms_user ON user_fandoms(user_id);
CREATE INDEX idx_user_fandoms_fandom ON user_fandoms(fandom_id);
CREATE INDEX idx_user_fandoms_role ON user_fandoms(fandom_id, role);
CREATE INDEX idx_user_fandoms_contribution ON user_fandoms(fandom_id, pixels_contributed DESC);
```

---

### 2.8 Canvas Config
```sql
CREATE TABLE canvas_config (
    id                  INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    width               INTEGER NOT NULL DEFAULT 1000,
    height              INTEGER NOT NULL DEFAULT 1000,
    pixel_gap           INTEGER NOT NULL DEFAULT 1,
    default_pixel_size  INTEGER NOT NULL DEFAULT 12,
    min_zoom            DECIMAL(3,2) NOT NULL DEFAULT 0.25,
    max_zoom            DECIMAL(3,2) NOT NULL DEFAULT 4.00,
    grid_threshold      INTEGER NOT NULL DEFAULT 8,
    version             BIGINT NOT NULL DEFAULT 0,
    last_reset_at       TIMESTAMPTZ,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO canvas_config DEFAULT VALUES;
```

---

### 2.9 Pixels
```sql
CREATE TABLE pixels (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    x                   INTEGER NOT NULL,
    y                   INTEGER NOT NULL,
    color               VARCHAR(7) NOT NULL,
    fandom_id           UUID NOT NULL REFERENCES fandoms(id) ON DELETE CASCADE,
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    shielded            BOOLEAN NOT NULL DEFAULT FALSE,
    shield_expires_at   TIMESTAMPTZ,
    is_super            BOOLEAN NOT NULL DEFAULT FALSE,
    version             BIGINT NOT NULL DEFAULT 1,

    placed_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    overridden_at       TIMESTAMPTZ,
    overridden_by       UUID REFERENCES users(id) ON DELETE SET NULL,

    CONSTRAINT chk_pixel_color_format CHECK (color ~ '^#[0-9A-Fa-f]{6}$'),
    CONSTRAINT chk_pixel_coords CHECK (x >= 0 AND y >= 0),
    UNIQUE(x, y)
);

CREATE INDEX idx_pixels_coords ON pixels(x, y);
CREATE INDEX idx_pixels_fandom ON pixels(fandom_id);
CREATE INDEX idx_pixels_user ON pixels(user_id);
CREATE INDEX idx_pixels_shielded ON pixels(shielded, shield_expires_at) WHERE shielded = TRUE;
CREATE INDEX idx_pixels_placed ON pixels(placed_at DESC);
CREATE INDEX idx_pixels_version ON pixels(version DESC);
```

---

### 2.10 Pixel History (Audit)
```sql
CREATE TABLE pixel_history (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pixel_x             INTEGER NOT NULL,
    pixel_y             INTEGER NOT NULL,
    color               VARCHAR(7) NOT NULL,
    fandom_id           UUID NOT NULL,
    user_id             UUID NOT NULL,
    placed_at           TIMESTAMPTZ NOT NULL,
    overridden_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    overridden_by       UUID,
    override_reason     VARCHAR(20),

    CONSTRAINT chk_pixel_hist_color CHECK (color ~ '^#[0-9A-Fa-f]{6}$')
);

CREATE INDEX idx_pixel_history_coords ON pixel_history(pixel_x, pixel_y);
CREATE INDEX idx_pixel_history_fandom ON pixel_history(fandom_id);
CREATE INDEX idx_pixel_history_user ON pixel_history(user_id);
CREATE INDEX idx_pixel_history_overridden ON pixel_history(overridden_at DESC);
```

---

### 2.11 Territories
```sql
CREATE TABLE territories (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fandom_id           UUID NOT NULL REFERENCES fandoms(id) ON DELETE CASCADE,
    name                VARCHAR(100) NOT NULL,

    bounds_x            INTEGER NOT NULL,
    bounds_y            INTEGER NOT NULL,
    bounds_width        INTEGER NOT NULL,
    bounds_height       INTEGER NOT NULL,

    is_wild_zone        BOOLEAN NOT NULL DEFAULT FALSE,

    pixel_count         INTEGER NOT NULL DEFAULT 0,
    max_size            INTEGER NOT NULL,
    expansion_progress  INTEGER NOT NULL DEFAULT 0,

    is_locked           BOOLEAN NOT NULL DEFAULT FALSE,
    locked_until        TIMESTAMPTZ,

    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_territory_bounds_positive CHECK (bounds_width > 0 AND bounds_height > 0)
);

CREATE UNIQUE INDEX idx_territories_fandom ON territories(fandom_id);
CREATE INDEX idx_territories_wild ON territories(is_wild_zone) WHERE is_wild_zone = TRUE;
CREATE INDEX idx_territories_bounds ON territories(bounds_x, bounds_y, bounds_width, bounds_height);
```

---

### 2.12 Wars (Season Wars)
```sql
CREATE TABLE wars (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name                VARCHAR(200) NOT NULL,
    description         TEXT,

    objective_type      VARCHAR(30) NOT NULL,
    objective_target    INTEGER NOT NULL,
    objective_description TEXT,

    status              VARCHAR(20) NOT NULL DEFAULT 'upcoming',
    starts_at           TIMESTAMPTZ NOT NULL,
    ends_at             TIMESTAMPTZ NOT NULL,

    allow_overrides     BOOLEAN NOT NULL DEFAULT TRUE,
    allow_bombs         BOOLEAN NOT NULL DEFAULT TRUE,
    allow_shields       BOOLEAN NOT NULL DEFAULT TRUE,
    pixel_multiplier    DECIMAL(3,2) NOT NULL DEFAULT 1.50,
    territory_lock      BOOLEAN NOT NULL DEFAULT FALSE,

    winner_fandom_id    UUID REFERENCES fandoms(id) ON DELETE SET NULL,

    created_by          UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,

    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_wars_status ON wars(status);
CREATE INDEX idx_wars_dates ON wars(starts_at, ends_at);
CREATE INDEX idx_wars_active ON wars(status, ends_at) WHERE status = 'active';
```

---

### 2.13 War Participants
```sql
CREATE TABLE war_participants (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    war_id              UUID NOT NULL REFERENCES wars(id) ON DELETE CASCADE,
    fandom_id           UUID NOT NULL REFERENCES fandoms(id) ON DELETE CASCADE,

    territory_percent   DECIMAL(5,2) NOT NULL DEFAULT 0,
    pixels_placed       BIGINT NOT NULL DEFAULT 0,
    pixels_survived     BIGINT NOT NULL DEFAULT 0,
    pixels_overridden   BIGINT NOT NULL DEFAULT 0,
    member_contributors INTEGER NOT NULL DEFAULT 0,

    score               BIGINT NOT NULL DEFAULT 0,
    final_rank          INTEGER,

    joined_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE(war_id, fandom_id)
);

CREATE INDEX idx_war_participants_war ON war_participants(war_id);
CREATE INDEX idx_war_participants_fandom ON war_participants(fandom_id);
CREATE INDEX idx_war_participants_score ON war_participants(war_id, score DESC);
```

---

### 2.14 War Events
```sql
CREATE TABLE war_events (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    war_id              UUID NOT NULL REFERENCES wars(id) ON DELETE CASCADE,
    fandom_id           UUID REFERENCES fandoms(id) ON DELETE SET NULL,

    event_type          VARCHAR(30) NOT NULL,
    message             TEXT NOT NULL,
    metadata            JSONB,

    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_war_events_war ON war_events(war_id, created_at DESC);
CREATE INDEX idx_war_events_type ON war_events(event_type);
```

---

### 2.15 Badges
```sql
CREATE TABLE badges (
    id                  VARCHAR(50) PRIMARY KEY,
    name                VARCHAR(100) NOT NULL,
    description         TEXT NOT NULL,
    icon                VARCHAR(50) NOT NULL,
    rarity              VARCHAR(20) NOT NULL,
    category            VARCHAR(20) NOT NULL,

    condition_type      VARCHAR(20) NOT NULL,
    condition_metric    VARCHAR(50) NOT NULL,
    condition_target    BIGINT NOT NULL,
    condition_time_window_ms BIGINT,

    animation_type      VARCHAR(20),

    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_badges_rarity ON badges(rarity);
CREATE INDEX idx_badges_category ON badges(category);
```

---

### 2.16 User Badges
```sql
CREATE TABLE user_badges (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    badge_id            VARCHAR(50) NOT NULL REFERENCES badges(id) ON DELETE CASCADE,

    progress_current    BIGINT NOT NULL DEFAULT 0,
    progress_target     BIGINT NOT NULL,
    percent_complete    INTEGER NOT NULL DEFAULT 0,

    unlocked_at         TIMESTAMPTZ,

    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE(user_id, badge_id)
);

CREATE INDEX idx_user_badges_user ON user_badges(user_id);
CREATE INDEX idx_user_badges_unlocked ON user_badges(user_id, unlocked_at DESC) WHERE unlocked_at IS NOT NULL;
CREATE INDEX idx_user_badges_progress ON user_badges(user_id, percent_complete DESC) WHERE unlocked_at IS NULL;
```

---

### 2.17 XP Transactions
```sql
CREATE TABLE xp_transactions (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    amount              INTEGER NOT NULL,
    action              VARCHAR(50) NOT NULL,
    description         TEXT,

    reference_type      VARCHAR(30),
    reference_id        UUID,

    balance_after       BIGINT NOT NULL,

    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_xp_amount_nonzero CHECK (amount != 0)
);

CREATE INDEX idx_xp_user ON xp_transactions(user_id, created_at DESC);
CREATE INDEX idx_xp_action ON xp_transactions(action);
CREATE INDEX idx_xp_reference ON xp_transactions(reference_type, reference_id);
```

---

### 2.18 Pixel Transactions
```sql
CREATE TABLE pixel_transactions (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    amount              INTEGER NOT NULL,
    type                VARCHAR(20) NOT NULL,
    action              VARCHAR(50) NOT NULL,
    description         TEXT,

    reference_type      VARCHAR(30),
    reference_id        UUID,

    balance_after       INTEGER NOT NULL,

    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_pixel_amount_nonzero CHECK (amount != 0)
);

CREATE INDEX idx_pixel_tx_user ON pixel_transactions(user_id, created_at DESC);
CREATE INDEX idx_pixel_tx_type ON pixel_transactions(type, action);
CREATE INDEX idx_pixel_tx_reference ON pixel_transactions(reference_type, reference_id);
```

---

### 2.19 Listening Sessions
```sql
CREATE TABLE listening_sessions (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    track_id            UUID NOT NULL REFERENCES tracks(id) ON DELETE CASCADE,

    started_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ended_at            TIMESTAMPTZ,
    percent_listened    INTEGER NOT NULL DEFAULT 0,
    total_time_ms       INTEGER NOT NULL DEFAULT 0,

    status              VARCHAR(20) NOT NULL DEFAULT 'active',

    pixels_earned       INTEGER NOT NULL DEFAULT 0,
    xp_earned           INTEGER NOT NULL DEFAULT 0,

    ip_address          INET,
    user_agent          TEXT,
    is_flagged          BOOLEAN NOT NULL DEFAULT FALSE,
    flag_reason         TEXT,

    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sessions_user ON listening_sessions(user_id, created_at DESC);
CREATE INDEX idx_sessions_track ON listening_sessions(track_id);
CREATE INDEX idx_sessions_status ON listening_sessions(status);
CREATE INDEX idx_sessions_flagged ON listening_sessions(is_flagged) WHERE is_flagged = TRUE;
```

---

### 2.20 Streaks
```sql
CREATE TABLE streaks (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    streak_type         VARCHAR(20) NOT NULL,
    fandom_id           UUID REFERENCES fandoms(id) ON DELETE CASCADE,

    current_streak      INTEGER NOT NULL DEFAULT 0,
    longest_streak      INTEGER NOT NULL DEFAULT 0,
    last_date           DATE NOT NULL,

    freezes_used        INTEGER NOT NULL DEFAULT 0,
    freezes_available   INTEGER NOT NULL DEFAULT 1,

    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE(user_id, streak_type, fandom_id)
);

CREATE INDEX idx_streaks_user ON streaks(user_id);
CREATE INDEX idx_streaks_type ON streaks(streak_type, current_streak DESC);
```

---

### 2.21 User Likes
```sql
CREATE TABLE user_likes (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    track_id            UUID NOT NULL REFERENCES tracks(id) ON DELETE CASCADE,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE(user_id, track_id)
);

CREATE INDEX idx_likes_user ON user_likes(user_id, created_at DESC);
CREATE INDEX idx_likes_track ON user_likes(track_id);
```

---

### 2.22 Follows
```sql
CREATE TABLE follows (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    follower_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    following_id        UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE(follower_id, following_id),
    CONSTRAINT chk_no_self_follow CHECK (follower_id != following_id)
);

CREATE INDEX idx_follows_follower ON follows(follower_id, created_at DESC);
CREATE INDEX idx_follows_following ON follows(following_id, created_at DESC);
```

---

### 2.23 Activities
```sql
CREATE TABLE activities (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    activity_type       VARCHAR(30) NOT NULL,
    message             TEXT NOT NULL,

    reference_type      VARCHAR(30),
    reference_id        UUID,

    is_public           BOOLEAN NOT NULL DEFAULT TRUE,

    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_activities_user ON activities(user_id, created_at DESC);
CREATE INDEX idx_activities_type ON activities(activity_type);
CREATE INDEX idx_activities_public ON activities(is_public, created_at DESC) WHERE is_public = TRUE;
```

---

### 2.24 Notifications
```sql
CREATE TABLE notifications (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    type                VARCHAR(30) NOT NULL,
    title               VARCHAR(200) NOT NULL,
    message             TEXT NOT NULL,

    reference_type      VARCHAR(30),
    reference_id        UUID,

    read                BOOLEAN NOT NULL DEFAULT FALSE,
    read_at             TIMESTAMPTZ,

    in_app              BOOLEAN NOT NULL DEFAULT TRUE,
    push_sent           BOOLEAN NOT NULL DEFAULT FALSE,
    email_sent          BOOLEAN NOT NULL DEFAULT FALSE,

    priority            INTEGER NOT NULL DEFAULT 1,

    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at          TIMESTAMPTZ
);

CREATE INDEX idx_notifications_user ON notifications(user_id, created_at DESC);
CREATE INDEX idx_notifications_unread ON notifications(user_id, read) WHERE read = FALSE;
CREATE INDEX idx_notifications_type ON notifications(type);
```

---

### 2.25 Subscriptions
```sql
CREATE TABLE subscriptions (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    tier                VARCHAR(20) NOT NULL,
    status              VARCHAR(20) NOT NULL DEFAULT 'active',

    price_cents         INTEGER NOT NULL,
    currency            VARCHAR(3) NOT NULL DEFAULT 'USD',
    interval            VARCHAR(20) NOT NULL,

    started_at          TIMESTAMPTZ NOT NULL,
    current_period_start TIMESTAMPTZ NOT NULL,
    current_period_end  TIMESTAMPTZ NOT NULL,
    cancelled_at        TIMESTAMPTZ,
    expires_at          TIMESTAMPTZ,

    provider            VARCHAR(20) NOT NULL,
    provider_subscription_id VARCHAR(255),

    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_user ON subscriptions(user_id, created_at DESC);
CREATE INDEX idx_subscriptions_status ON subscriptions(status, current_period_end);
CREATE INDEX idx_subscriptions_provider ON subscriptions(provider, provider_subscription_id);
```

---

### 2.26 Payments
```sql
CREATE TABLE payments (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subscription_id     UUID REFERENCES subscriptions(id) ON DELETE SET NULL,

    amount_cents        INTEGER NOT NULL,
    currency            VARCHAR(3) NOT NULL DEFAULT 'USD',

    status              VARCHAR(20) NOT NULL DEFAULT 'pending',

    provider            VARCHAR(20) NOT NULL,
    provider_payment_id VARCHAR(255),

    receipt_url         VARCHAR(500),

    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_payments_user ON payments(user_id, created_at DESC);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_provider ON payments(provider, provider_payment_id);
```

---

### 2.27 Artist Verifications
```sql
CREATE TABLE artist_verifications (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    artist_id           UUID REFERENCES artists(id) ON DELETE SET NULL,

    status              VARCHAR(20) NOT NULL DEFAULT 'pending',
    submitted_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    reviewed_at         TIMESTAMPTZ,
    reviewed_by         UUID REFERENCES users(id) ON DELETE SET NULL,

    government_id_url   VARCHAR(500),
    proof_of_work_url   VARCHAR(500),

    requested_artist_name VARCHAR(100),
    requested_genre     VARCHAR(50),

    admin_notes         TEXT,
    rejection_reason    TEXT,

    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_verifications_status ON artist_verifications(status, submitted_at);
CREATE INDEX idx_verifications_user ON artist_verifications(user_id);
```

---

### 2.28 Admin Actions (Audit Log)
```sql
CREATE TABLE admin_actions (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id            UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    action_type         VARCHAR(50) NOT NULL,
    target_type         VARCHAR(30) NOT NULL,
    target_id           UUID,

    previous_value      JSONB,
    new_value           JSONB,
    reason              TEXT NOT NULL,

    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_admin_actions_admin ON admin_actions(admin_id, created_at DESC);
CREATE INDEX idx_admin_actions_type ON admin_actions(action_type);
CREATE INDEX idx_admin_actions_target ON admin_actions(target_type, target_id);
```

---

### 2.29 Promo Codes
```sql
CREATE TABLE promo_codes (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code                VARCHAR(50) NOT NULL UNIQUE,

    reward_type         VARCHAR(20) NOT NULL,
    reward_value        INTEGER NOT NULL,
    reward_metadata     JSONB,

    max_uses            INTEGER,
    used_count          INTEGER NOT NULL DEFAULT 0,
    max_uses_per_user   INTEGER NOT NULL DEFAULT 1,

    starts_at           TIMESTAMPTZ NOT NULL,
    expires_at          TIMESTAMPTZ,

    is_active           BOOLEAN NOT NULL DEFAULT TRUE,

    created_by          UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_promo_codes_code ON promo_codes(code);
CREATE INDEX idx_promo_codes_active ON promo_codes(is_active, expires_at) WHERE is_active = TRUE;
```

---

### 2.30 Promo Code Redemptions
```sql
CREATE TABLE promo_code_redemptions (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    promo_code_id       UUID NOT NULL REFERENCES promo_codes(id) ON DELETE CASCADE,
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    redeemed_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE(promo_code_id, user_id)
);

CREATE INDEX idx_redemptions_code ON promo_code_redemptions(promo_code_id);
CREATE INDEX idx_redemptions_user ON promo_code_redemptions(user_id);
```

---

## 3. ENTITY RELATIONSHIP DIAGRAM

```
users ||--o{ listening_sessions : "streams"
users ||--o{ pixels : "places"
users ||--o{ user_fandoms : "joins"
users ||--o{ follows : "follows"
users ||--o{ follows : "followed_by"
users ||--o{ user_badges : "earns"
users ||--o{ xp_transactions : "gains"
users ||--o{ pixel_transactions : "earns/spends"
users ||--o{ streaks : "maintains"
users ||--o{ activities : "generates"
users ||--o{ notifications : "receives"
users ||--o{ subscriptions : "has"
users ||--o{ payments : "makes"
users ||--o{ artist_verifications : "requests"
users ||--o{ promo_code_redemptions : "redeems"

artists ||--o{ albums : "releases"
artists ||--o{ tracks : "creates"
artists ||--|| fandoms : "has"
artists ||--o{ artist_verifications : "verified_by"

albums ||--o{ tracks : "contains"

tracks ||--o{ listening_sessions : "played_in"
tracks ||--o{ user_likes : "liked_by"

fandoms ||--o{ user_fandoms : "has_members"
fandoms ||--o{ pixels : "owns"
fandoms ||--o{ territories : "controls"
fandoms ||--o{ war_participants : "participates"
fandoms ||--o{ streaks : "maintains"

wars ||--o{ war_participants : "has"
wars ||--o{ war_events : "generates"

badges ||--o{ user_badges : "earned_by"

subscriptions ||--o{ payments : "billed_by"

promo_codes ||--o{ promo_code_redemptions : "redeemed_by"
```

---

## 4. REDIS SCHEMA

### 4.1 Session & Auth
```
auth:token:<jwt_id>       → { userId, expiresAt }  (TTL: token expiry)
auth:refresh:<token>      → { userId }             (TTL: 30 days)
auth:blacklist:<token>    → "1"                    (TTL: token remaining life)
```

### 4.2 User Cache
```
user:<userId>             → JSON (user profile, 5 min TTL)
user:stats:<userId>       → JSON (aggregated stats, 1 min TTL)
user:badges:<userId>      → JSON (badge list, 5 min TTL)
user:streak:<userId>      → JSON (streak data, 1 min TTL)
```

### 4.3 Canvas Cache
```
canvas:config             → JSON (canvas dimensions, version)
canvas:hot:<x>:<y>        → JSON (pixel data)  -- Hot zone cache
canvas:version            → INTEGER (global version counter)
canvas:territories        → JSON (territory list)
```

### 4.4 Pixel Economy
```
pixel:balance:<userId>    → INTEGER (real-time balance)
pixel:cooldown:<userId>   → TIMESTAMP (next allowed placement)
pixel:daily:<userId>:<date> → INTEGER (pixels earned today)
pixel:hourly:<userId>:<hour> → INTEGER (pixels earned this hour)
```

### 4.5 Leaderboards (Sorted Sets)
```
lb:fandom:overall         → ZSET { score: territorySize, member: fandomId }
lb:fandom:weekly          → ZSET { score: weeklyPixels, member: fandomId }
lb:fandom:war:<warId>     → ZSET { score: warScore, member: fandomId }
lb:user:pixel:weekly      → ZSET { score: pixelCount, member: userId }
lb:user:streaming:daily   → ZSET { score: streamTimeMs, member: userId }
lb:user:xp:alltime        → ZSET { score: xp, member: userId }
```

### 4.6 War Real-time
```
war:active                → JSON (current war config)
war:scores:<warId>        → HASH { fandomId: score }
war:participants:<warId>  → SET { fandomId }
war:events:<warId>        → LIST [event JSON] (trim to last 100)
```

### 4.7 Rate Limiting
```
rl:pixel:<userId>         → SLIDING_WINDOW (12/min)
rl:api:<userId>:<endpoint> → SLIDING_WINDOW (varies)
rl:ws:<userId>            → SLIDING_WINDOW (30/sec)
```

### 4.8 Presence
```
presence:<userId>         → STRING "online" (TTL: 2 min, refreshed by heartbeat)
presence:fandom:<fandomId> → SET { userId } (managed by presence service)
cursor:<userId>           → JSON { x, y, fandomId } (TTL: 30 sec)
```

### 4.9 Streak
```
streak:daily:<userId>     → JSON { current, longest, lastDate }
streak:fandom:<userId>:<fandomId> → JSON { current, longest, lastDate }
streak:freeze:<userId>    → INTEGER (freezes remaining this month)
```

### 4.10 Notifications
```
notif:unread:<userId>     → INTEGER (unread count)
notif:recent:<userId>     → LIST [notification JSON] (last 50)
notif:push:queue          → LIST [push job JSON] (worker consumes)
```

---

## 5. INDEXING STRATEGY

### 5.1 High-Frequency Queries
| Query | Table | Index | Type |
|-------|-------|-------|------|
| User login | users | (username), (email) | UNIQUE, B-tree |
| Track search | tracks | (title) gin_trgm_ops | GIN |
| Canvas render | pixels | (x, y) | B-tree, UNIQUE |
| Fandom members | user_fandoms | (fandom_id, pixels_contributed DESC) | B-tree |
| War scores | war_participants | (war_id, score DESC) | B-tree |
| Activity feed | activities | (user_id, created_at DESC) | B-tree |
| Notifications | notifications | (user_id, read, created_at DESC) | Partial B-tree |
| Sessions | listening_sessions | (user_id, created_at DESC) | B-tree |

### 5.2 Composite Indexes
```sql
-- For "my fandom's leaderboard"
CREATE INDEX idx_user_fandoms_contribution ON user_fandoms(fandom_id, pixels_contributed DESC);

-- For "war ranking with territory"
CREATE INDEX idx_war_participants_score ON war_participants(war_id, score DESC, territory_percent DESC);

-- For "unread notifications count"
CREATE INDEX idx_notifications_unread ON notifications(user_id) WHERE read = FALSE;

-- For "today's pixel earnings"
CREATE INDEX idx_pixel_tx_daily ON pixel_transactions(user_id, created_at DESC) 
    WHERE type = 'earned' AND created_at > CURRENT_DATE;
```

---

## 6. PARTITIONING STRATEGY

### 6.1 Time-Based Partitioning
```sql
-- pixel_history: Partition by month
CREATE TABLE pixel_history (
    ...
) PARTITION BY RANGE (overridden_at);

CREATE TABLE pixel_history_y2026m08 PARTITION OF pixel_history
    FOR VALUES FROM ('2026-08-01') TO ('2026-09-01');

-- listening_sessions: Partition by month
CREATE TABLE listening_sessions (
    ...
) PARTITION BY RANGE (created_at);

-- activities: Partition by month
CREATE TABLE activities (
    ...
) PARTITION BY RANGE (created_at);

-- xp_transactions: Partition by month
CREATE TABLE xp_transactions (
    ...
) PARTITION BY RANGE (created_at);

-- pixel_transactions: Partition by month
CREATE TABLE pixel_transactions (
    ...
) PARTITION BY RANGE (created_at);
```

### 6.2 Automated Partition Management
```sql
-- Cron job or pg_partman extension
-- Create new partition at start of each month
-- Archive partitions older than 12 months to cold storage (S3)
-- Drop partitions older than 24 months (with backup)
```

---

## 7. BACKUP & RECOVERY

### 7.1 Backup Schedule
| Data | Frequency | Retention | Method |
|------|-----------|-----------|--------|
| Full DB | Daily | 30 days | pg_dump |
| WAL | Continuous | 7 days | pg_basebackup |
| pixel_history | Monthly | 12 months | Partition dump to S3 |
| listening_sessions | Monthly | 6 months | Partition dump to S3 |

### 7.2 Point-in-Time Recovery
```
- WAL archiving enabled
- Recovery target: Any point within 7 days
- RTO: < 1 hour
- RPO: < 5 minutes
```

---

## 8. SCALING CONSIDERATIONS

### 8.1 Read Replicas
```
- 1 Primary (write)
- 2-3 Read Replicas (read queries)
- Route: Write → Primary, Read → Replica (round-robin)
- Lag tolerance: < 100ms for real-time data
```

### 8.2 Sharding (Future)
```
- User data: Shard by user_id (consistent hashing)
- Canvas data: Shard by coordinate range (spatial)
- Fandom data: Shard by fandom_id
- Cross-shard queries: Minimized by design
```

### 8.3 Connection Pooling
```
- PgBouncer: Transaction pooling mode
- Max connections: 100 per instance
- Pool size: 20 per app instance
```

---

## 9. MIGRATION STRATEGY

### 9.1 Migration Naming
```
YYYYMMDDHHMMSS_<description>.sql
Example: 20260803120000_create_users_table.sql
```

### 9.2 Migration Rules
1. **Never modify existing migration** — always create new
2. **Backward compatible changes only** — add column (nullable), create index (concurrently)
3. **Heavy migrations** → Run during low-traffic window
4. **Data migrations** → Separate from schema migrations
5. **Rollback plan** → Every migration must have down script

### 9.3 Sample Migration
```sql
-- 20260803120000_create_users_table.sql
-- Up
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ...
);
CREATE INDEX idx_users_username ON users(username);

-- Down
DROP INDEX IF EXISTS idx_users_username;
DROP TABLE IF EXISTS users;
```

---

## 10. MONITORING QUERIES

### 10.1 Health Checks
```sql
-- Active users (last 5 min)
SELECT COUNT(DISTINCT user_id) FROM listening_sessions 
WHERE created_at > NOW() - INTERVAL '5 minutes';

-- Canvas pixel count
SELECT COUNT(*) FROM pixels;

-- War participation
SELECT war_id, COUNT(DISTINCT fandom_id) FROM war_participants GROUP BY war_id;

-- Streak at risk
SELECT user_id, current_streak FROM streaks 
WHERE streak_type = 'daily_stream' 
AND last_date < CURRENT_DATE - INTERVAL '1 day';
```

### 10.2 Performance Queries
```sql
-- Slow queries (pg_stat_statements)
SELECT query, mean_exec_time, calls 
FROM pg_stat_statements 
ORDER BY mean_exec_time DESC 
LIMIT 10;

-- Table bloat
SELECT schemaname, tablename, n_tup_ins, n_tup_upd, n_tup_del
FROM pg_stat_user_tables 
ORDER BY n_tup_upd DESC;

-- Index usage
SELECT schemaname, tablename, indexname, idx_scan, idx_tup_read
FROM pg_stat_user_indexes 
ORDER BY idx_scan DESC;
```
