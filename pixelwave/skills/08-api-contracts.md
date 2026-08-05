# PIXELWAVE — API Contracts & WebSocket Protocol

> **For:** Backend Engineers & Frontend Agents  
> **Scope:** REST API endpoints, request/response schemas, WebSocket events  
> **Base URL:** `/api/v1`

---

## 1. AUTHENTICATION

### 1.1 Register
```http
POST /auth/register
Content-Type: application/json

{
  "username": "string (3-30 chars, alphanumeric + underscore)",
  "email": "string (valid email)",
  "password": "string (min 8 chars, 1 uppercase, 1 number)",
  "displayName": "string (optional, max 50 chars)"
}

Response 201:
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "username": "string",
      "displayName": "string",
      "avatar": "url | null",
      "waveLevel": 1,
      "xp": 0,
      "pixelBalance": 10, // Welcome bonus
      "createdAt": "ISO8601"
    },
    "token": "jwt_string",
    "refreshToken": "jwt_string"
  }
}
```

### 1.2 Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "string",
  "password": "string"
}

Response 200:
{
  "success": true,
  "data": {
    "user": { /* same as register */ },
    "token": "jwt_string",
    "refreshToken": "jwt_string"
  }
}
```

### 1.3 Refresh Token
```http
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "jwt_string"
}

Response 200:
{
  "success": true,
  "data": {
    "token": "jwt_string",
    "refreshToken": "jwt_string"
  }
}
```

### 1.4 Me (Current User)
```http
GET /auth/me
Authorization: Bearer <token>

Response 200:
{
  "success": true,
  "data": {
    "id": "uuid",
    "username": "string",
    "displayName": "string",
    "email": "string",
    "avatar": "url | null",
    "bio": "string | null",
    "waveLevel": 42,
    "xp": 15234,
    "pixelBalance": 128,
    "streak": 12,
    "streakLastDate": "2026-08-01",
    "activeFandomId": "uuid | null",
    "createdAt": "ISO8601",
    "stats": {
      "totalStreams": 1523,
      "totalStreamTimeMs": 43200000,
      "pixelsPlaced": 3420,
      "pixelsOverridden": 120,
      "territoryContributed": 5,
      "warsParticipated": 8,
      "warsWon": 3
    }
  }
}
```

---

## 2. TRACKS (Music)

### 2.1 List Tracks
```http
GET /tracks?page=1&limit=20&search=&genre=&sort=popular

Response 200:
{
  "success": true,
  "data": {
    "tracks": [
      {
        "id": "uuid",
        "title": "string",
        "artist": {
          "id": "uuid",
          "name": "string",
          "avatar": "url"
        },
        "album": {
          "id": "uuid",
          "title": "string",
          "artwork": "url"
        },
        "duration": 234000, // ms
        "genre": "string",
        "fandomId": "uuid | null",
        "source": "upload | youtube",
        "audioUrl": "url",
        "playCount": 15234,
        "createdAt": "ISO8601"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 1523,
      "totalPages": 77
    }
  }
}
```

### 2.2 Get Track
```http
GET /tracks/:id

Response 200:
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "string",
    "artist": { /* ... */ },
    "album": { /* ... */ },
    "duration": 234000,
    "audioUrl": "url",
    "lyrics": "string | null",
    "fandomId": "uuid | null",
    "isLiked": false,
    "playCount": 15234,
    "relatedTracks": [ /* 5 tracks */ ]
  }
}
```

### 2.3 Play Track (Start Session)
```http
POST /tracks/:id/play
Authorization: Bearer <token>

Response 200:
{
  "success": true,
  "data": {
    "sessionId": "uuid",
    "track": { /* track data */ },
    "streamToken": "string" // For YouTube proxy
  }
}
```

### 2.4 Report Progress
```http
POST /tracks/:id/progress
Authorization: Bearer <token>
Content-Type: application/json

{
  "sessionId": "uuid",
  "percentListened": 65, // 0-100
  "currentTimeMs": 152000,
  "isComplete": false
}

Response 200:
{
  "success": true,
  "data": {
    "pixelsEarned": 1, // 1 for 50%, will be 2 at 100%
    "xpEarned": 10,
    "newBalance": 129,
    "newXp": 15244,
    "leveledUp": false
  }
}
```

### 2.5 Complete Track
```http
POST /tracks/:id/complete
Authorization: Bearer <token>
Content-Type: application/json

{
  "sessionId": "uuid",
  "percentListened": 100,
  "totalTimeMs": 234000
}

Response 200:
{
  "success": true,
  "data": {
    "pixelsEarned": 2, // Total 2 (1 from 50% + 1 from 100%)
    "xpEarned": 10,
    "newBalance": 130,
    "newXp": 15254,
    "leveledUp": false,
    "streakUpdated": true,
    "streak": 13
  }
}
```

### 2.6 Like/Unlike Track
```http
POST /tracks/:id/like
DELETE /tracks/:id/like
Authorization: Bearer <token>

Response 200:
{
  "success": true,
  "data": { "isLiked": true }
}
```

### 2.7 Upload Track (Artist Only)
```http
POST /tracks/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "title": "string",
  "audio": File,
  "artwork": File (optional),
  "albumId": "uuid | null",
  "genre": "string",
  "lyrics": "string (optional)"
}

Response 201:
{
  "success": true,
  "data": { "track": { /* ... */ } }
}
```

---

## 3. CANVAS & PIXELS

### 3.1 Get Canvas State
```http
GET /canvas?x=0&y=0&width=100&height=100&sinceVersion=0

Response 200:
{
  "success": true,
  "data": {
    "config": {
      "width": 1000,
      "height": 1000,
      "pixelGap": 1,
      "defaultPixelSize": 12
    },
    "version": 15234, // Increment on every pixel change
    "pixels": [
      {
        "x": 420,
        "y": 69,
        "color": "#FF6B9D",
        "fandomId": "uuid",
        "userId": "uuid",
        "placedAt": 1690876800000,
        "shielded": false,
        "isSuper": false,
        "version": 15234
      }
    ],
    "territories": [
      {
        "id": "uuid",
        "fandomId": "uuid",
        "name": "Swifties",
        "bounds": { "x": 0, "y": 0, "width": 200, "height": 200 },
        "color": "#FF6B9D",
        "pixelCount": 45200,
        "maxSize": 400,
        "isWildZone": false
      }
    ]
  }
}
```

### 3.2 Place Pixel
```http
POST /pixels/place
Authorization: Bearer <token>
Content-Type: application/json

{
  "x": 420,
  "y": 69,
  "color": "#FF6B9D",
  "fandomId": "uuid",
  "tool": "place" // "place" | "shield" | "bomb" | "super"
}

Response 200:
{
  "success": true,
  "data": {
    "pixel": {
      "x": 420,
      "y": 69,
      "color": "#FF6B9D",
      "fandomId": "uuid",
      "userId": "uuid",
      "placedAt": 1690876800000,
      "version": 15235
    },
    "cost": 1,
    "newBalance": 129,
    "xpEarned": 5,
    "cooldownEndsAt": 1690876805000 // +5 seconds
  }
}

Response 400 (Error):
{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_PIXELS",
    "message": "You need 3 more pixels for this action",
    "required": 3,
    "current": 0
  }
}
```

### 3.3 Get Pixel History
```http
GET /pixels/:x/:y/history

Response 200:
{
  "success": true,
  "data": {
    "history": [
      {
        "color": "#FF6B9D",
        "fandomId": "uuid",
        "userId": "uuid",
        "username": "string",
        "placedAt": 1690876800000,
        "overriddenAt": 1690876900000
      }
    ]
  }
}
```

---

## 4. FANDOMS

### 4.1 List Fandoms
```http
GET /fandoms?page=1&limit=20&sort=members

Response 200:
{
  "success": true,
  "data": {
    "fandoms": [
      {
        "id": "uuid",
        "name": "Swifties",
        "artistName": "Taylor Swift",
        "icon": "url",
        "color": "#FF6B9D",
        "memberCount": 45200,
        "territorySize": 40000,
        "pixelCount": 1205000,
        "rank": 1,
        "isJoined": false
      }
    ],
    "pagination": { /* ... */ }
  }
}
```

### 4.2 Get Fandom
```http
GET /fandoms/:id

Response 200:
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Swifties",
    "artistName": "Taylor Swift",
    "description": "string",
    "icon": "url",
    "banner": "url",
    "color": "#FF6B9D",
    "memberCount": 45200,
    "territory": {
      "bounds": { "x": 0, "y": 0, "width": 200, "height": 200 },
      "pixelCount": 40000,
      "maxSize": 400,
      "expansionProgress": 65 // percent to next expansion
    },
    "stats": {
      "totalStreams": 15234000,
      "totalPixels": 1205000,
      "warsWon": 12,
      "warsParticipated": 20,
      "onlineNow": 342
    },
    "isJoined": false,
    "leaderboard": [
      { "rank": 1, "userId": "uuid", "username": "string", "contribution": 15200 }
    ]
  }
}
```

### 4.3 Join Fandom
```http
POST /fandoms/:id/join
Authorization: Bearer <token>

Response 200:
{
  "success": true,
  "data": {
    "isJoined": true,
    "memberCount": 45201,
    "xpEarned": 25
  }
}
```

### 4.4 Leave Fandom
```http
POST /fandoms/:id/leave
Authorization: Bearer <token>

Response 200:
{
  "success": true,
  "data": { "isJoined": false }
}
```

### 4.5 Get Fandom Members
```http
GET /fandoms/:id/members?page=1&limit=50

Response 200:
{
  "success": true,
  "data": {
    "members": [
      {
        "userId": "uuid",
        "username": "string",
        "avatar": "url",
        "waveLevel": 42,
        "contribution": 15200,
        "role": "member" // "member" | "general" | "leader"
      }
    ]
  }
}
```

---

## 5. WARS

### 5.1 Get Active War
```http
GET /wars/active

Response 200:
{
  "success": true,
  "data": {
    "war": {
      "id": "uuid",
      "name": "Summer Clash 2026",
      "description": "string",
      "objective": {
        "type": "territory_dominance",
        "target": 60,
        "description": "Control 60% of the Wild Zone"
      },
      "status": "active",
      "startsAt": "ISO8601",
      "endsAt": "ISO8601",
      "participatingFandoms": ["uuid", "uuid"],
      "rules": {
        "allowOverrides": true,
        "allowBombs": true,
        "allowShields": true,
        "pixelMultiplier": 1.5,
        "territoryLock": false
      }
    },
    "scores": [
      {
        "fandomId": "uuid",
        "fandomName": "Swifties",
        "fandomColor": "#FF6B9D",
        "territoryPercent": 42.5,
        "pixelsPlaced": 152000,
        "pixelsSurvived": 120000,
        "memberContributors": 3400,
        "score": 42500
      }
    ],
    "events": [
      {
        "type": "territory_change",
        "fandomId": "uuid",
        "message": "Swifties overtook ARMY in Wild Zone!",
        "timestamp": "ISO8601"
      }
    ]
  }
}

Response 204: // No active war
```

### 5.2 Get War History
```http
GET /wars/history?page=1&limit=10

Response 200:
{
  "success": true,
  "data": {
    "wars": [
      {
        "id": "uuid",
        "name": "Spring Battle 2026",
        "objective": { /* ... */ },
        "startsAt": "ISO8601",
        "endsAt": "ISO8601",
        "winnerFandomId": "uuid",
        "winnerFandomName": "Swifties",
        "participants": 15,
        "totalPixelsPlaced": 2500000
      }
    ]
  }
}
```

### 5.3 Get War Report
```http
GET /wars/:id/report

Response 200:
{
  "success": true,
  "data": {
    "war": { /* ... */ },
    "winner": { /* fandom */ },
    "finalScores": [ /* ... */ ],
    "timeline": [
      { "time": "ISO8601", "event": "War started" },
      { "time": "ISO8601", "event": "Swifties took lead" },
      { "time": "ISO8601", "event": "ARMY counter-attack" },
      { "time": "ISO8601", "event": "Swifties won" }
    ],
    "topContributors": [
      { "userId": "uuid", "username": "string", "pixels": 5200, "fandomId": "uuid" }
    ],
    "territoryBeforeAfter": {
      "before": { /* territory stats */ },
      "after": { /* territory stats */ }
    }
  }
}
```

---

## 6. LEADERBOARDS

### 6.1 Get Leaderboard
```http
GET /leaderboards/:type?period=weekly&page=1&limit=50
# type: fandom_overall | fandom_streaming | user_pixel | user_streaming | user_xp

Response 200:
{
  "success": true,
  "data": {
    "type": "fandom_overall",
    "period": "weekly",
    "entries": [
      {
        "rank": 1,
        "entityId": "uuid",
        "entityName": "Swifties",
        "entityAvatar": "url",
        "score": 1250000,
        "trend": 2, // +2 ranks from last period
        "previousRank": 3,
        "metadata": {
          "memberCount": 45200,
          "territorySize": 40000
        }
      }
    ],
    "userRank": { // If applicable
      "rank": 15,
      "score": 5200,
      "entityId": "uuid"
    },
    "pagination": { /* ... */ }
  }
}
```

---

## 7. USERS

### 7.1 Get User Profile
```http
GET /users/:id

Response 200:
{
  "success": true,
  "data": {
    "id": "uuid",
    "username": "string",
    "displayName": "string",
    "avatar": "url",
    "bio": "string",
    "waveLevel": 42,
    "xp": 15234,
    "pixelBalance": 128,
    "streak": 12,
    "badges": [
      {
        "id": "badge_pixel_picasso",
        "name": "Pixel Picasso",
        "icon": "palette",
        "rarity": "epic",
        "unlockedAt": "ISO8601"
      }
    ],
    "fandoms": [
      { "id": "uuid", "name": "Swifties", "color": "#FF6B9D", "role": "member" }
    ],
    "stats": {
      "totalStreams": 1523,
      "totalStreamTimeMs": 43200000,
      "pixelsPlaced": 3420,
      "pixelsOverridden": 120,
      "warsParticipated": 8,
      "warsWon": 3
    },
    "isFollowing": false,
    "followersCount": 234,
    "followingCount": 156
  }
}
```

### 7.2 Get User Canvas
```http
GET /users/:id/canvas

Response 200:
{
  "success": true,
  "data": {
    "personalCanvas": "data_url_64x64", // Base64 PNG
    "contributions": [
      { "x": 420, "y": 69, "color": "#FF6B9D", "placedAt": "ISO8601" }
    ],
    "heatmap": [
      // GitHub-style contribution grid
      { "date": "2026-07-01", "count": 12 },
      { "date": "2026-07-02", "count": 34 }
    ],
    "topTerritories": [
      { "fandomId": "uuid", "fandomName": "Swifties", "pixels": 1200 }
    ]
  }
}
```

### 7.3 Follow/Unfollow User
```http
POST /users/:id/follow
DELETE /users/:id/follow
Authorization: Bearer <token>

Response 200:
{
  "success": true,
  "data": { "isFollowing": true, "followersCount": 235 }
}
```

### 7.4 Get User Activity
```http
GET /users/:id/activity?page=1&limit=20

Response 200:
{
  "success": true,
  "data": {
    "activities": [
      {
        "id": "uuid",
        "type": "pixel_placed",
        "message": "Placed a pixel at (420, 69) in Swifties territory",
        "data": { "x": 420, "y": 69, "color": "#FF6B9D" },
        "createdAt": "ISO8601"
      }
    ]
  }
}
```

---

## 8. WEBSOCKET PROTOCOL

### 8.1 Connection
```javascript
// Client connects to ws://api.pixelwave.app/socket
// Authenticates with JWT token

socket.emit('auth', { token: 'jwt_string' });

// Server responds
socket.on('auth:success', (data) => {
  { userId: 'uuid', fandomId: 'uuid | null' }
});

socket.on('auth:error', (data) => {
  { message: 'Invalid token' }
});
```

### 8.2 Client → Server Events

#### Place Pixel
```javascript
socket.emit('pixel:place', {
  x: 420,
  y: 69,
  color: '#FF6B9D',
  fandomId: 'uuid'
});
```

#### Move Cursor
```javascript
// Throttled to 30fps on client
socket.volatile.emit('cursor:move', {
  x: 420,
  y: 69
});
```

#### Update Viewport
```javascript
socket.volatile.emit('viewport:update', {
  x: 0,
  y: 0,
  zoom: 1.0
});
```

#### Chat Message
```javascript
socket.emit('chat:message', {
  fandomId: 'uuid',
  message: 'Let's attack the northeast corner!'
});
```

#### Join Canvas Room
```javascript
socket.emit('canvas:join', {
  x: 0,
  y: 0,
  width: 100,
  height: 100
});
// Server will only send pixel updates within this viewport
```

### 8.3 Server → Client Events

#### Pixel Placed
```javascript
socket.on('pixel:placed', (pixel) => {
  {
    x: 420,
    y: 69,
    color: '#FF6B9D',
    fandomId: 'uuid',
    userId: 'uuid',
    placedAt: 1690876800000,
    version: 15235
  }
});
```

#### Pixel Deleted (Bomb / Override)
```javascript
socket.on('pixel:deleted', (data) => {
  { x: 420, y: 69, reason: 'bomb' }
});
```

#### Pixel Shielded
```javascript
socket.on('pixel:shielded', (data) => {
  { x: 420, y: 69, expiresAt: 1690880400000 }
});
```

#### Batch Update (Initial Load / Reconnect)
```javascript
socket.on('batch:update', (data) => {
  {
    sinceVersion: 15230,
    currentVersion: 15235,
    added: [ /* pixels */ ],
    modified: [ /* pixels */ ],
    deleted: [ { x, y } ]
  }
});
```

#### Cursor Updates
```javascript
socket.on('cursor:update', (cursors) => {
  [
    {
      userId: 'uuid',
      username: 'string',
      fandomId: 'uuid',
      fandomColor: '#FF6B9D',
      x: 420,
      y: 69,
      lastUpdate: 1690876800000
    }
  ]
});
```

#### Chat Message
```javascript
socket.on('chat:message', (message) => {
  {
    id: 'uuid',
    userId: 'uuid',
    username: 'string',
    fandomId: 'uuid',
    fandomColor: '#FF6B9D',
    message: 'string',
    timestamp: 1690876800000
  }
});
```

#### War Events
```javascript
socket.on('war:started', (war) => { /* SeasonWar object */ });
socket.on('war:ended', (data) => { { warId: 'uuid', winnerFandomId: 'uuid' } });
socket.on('war:event', (event) => {
  {
    type: 'territory_change',
    warId: 'uuid',
    fandomId: 'uuid',
    message: 'Swifties overtook ARMY!',
    timestamp: 1690876800000
  }
});
```

#### Pixel Earned (Real-time)
```javascript
socket.on('pixel:earned', (data) => {
  {
    amount: 2,
    reason: 'track:complete',
    newBalance: 130,
    trackId: 'uuid'
  }
});
```

#### Territory Update
```javascript
socket.on('territory:update', (territory) => { /* Territory object */ });
```

### 8.4 Error Events
```javascript
socket.on('error', (data) => {
  {
    code: 'INSUFFICIENT_PIXELS',
    message: 'You need 3 more pixels',
    action: 'pixel:place'
  }
});
```

---

## 9. ERROR RESPONSE FORMAT

```http
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": { /* optional extra data */ },
    "requestId": "uuid" // For server-side tracing
  }
}
```

### Error Codes
| Code | HTTP | Meaning |
|------|------|---------|
| `UNAUTHORIZED` | 401 | Invalid or missing token |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Invalid request data |
| `INSUFFICIENT_PIXELS` | 400 | Not enough pixels |
| `COOLDOWN_ACTIVE` | 400 | Action on cooldown |
| `TERRITORY_LOCKED` | 400 | Cannot modify territory |
| `SHIELDED_PIXEL` | 400 | Cannot override shielded pixel |
| `RATE_LIMITED` | 429 | Too many requests |
| `CANVAS_FULL` | 400 | No space available |
| `WAR_NOT_ACTIVE` | 400 | No active war for action |
| `ALREADY_JOINED` | 400 | Already in fandom/war |

---

## 10. RATE LIMITING

| Endpoint | Limit |
|----------|-------|
| `POST /auth/*` | 5 requests / minute |
| `GET /tracks/*` | 100 requests / minute |
| `POST /tracks/*/progress` | 60 requests / minute |
| `POST /pixels/place` | 12 requests / minute |
| `POST /pixels/*` | 20 requests / minute |
| `GET /canvas` | 30 requests / minute |
| `GET /leaderboards/*` | 60 requests / minute |
| WebSocket events | 30 events / second |

---

## 11. PAGINATION STANDARD

```typescript
interface PaginationResponse {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Query params: ?page=1&limit=20
// Default: page=1, limit=20
// Max limit: 100
```
