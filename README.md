# LolLens

A **League of Legends in-game overlay for macOS** — a lightweight HUD that sits on top of the game window showing real-time player stats, gold tracking, and an augment tier list with Quick Pick search.

Built with **Tauri v2** (Rust backend + React frontend). Connects to Riot's Live Client Data API and displays game information without alt-tabbing.

## Features

### Stats Panel
Live player statistics pulled from the in-game API every second:
- KDA, CS, and level for all players
- Items, runes, and summoner spells
- Champion icons via Data Dragon CDN

### Gold Panel
Real-time gold economy tracking:
- Per-player gold with income rate calculations
- Team gold totals and gold difference bar
- Item inventory with cost breakdowns

### Augment Tier List
Community-sourced augment rankings for Arena, ARAM, and Mayhem modes:
- **~110 augments** ranked S / A / B / C from community tier data
- **Quick Pick mode** — search auto-focuses, results sorted by tier with a `PICK` badge on the best choice
- Augment icons and metadata from CommunityDragon CDN
- Tier filter buttons (S/A/B/C/All) with counts
- Rarity indicators (Silver / Gold / Prismatic)
- Works in **all game modes** — no mode restriction

### Overlay System
- **NSPanel** pinned at window level `25000` — stays above League's fullscreen window, invisible to screen capture
- **Global shortcut** `Cmd+Shift+A` to toggle visibility
- Auto-detects League foreground via `NSWorkspace` bundle identifier
- Click-through transparent overlay — doesn't interfere with gameplay

## Architecture

```
┌──────────────────────────────────────────────────────────┐
│                      DATA SOURCES                        │
│                                                          │
│   Riot Live Client API          CommunityDragon CDN      │
│   https://127.0.0.1:2999        raw.communitydragon.org  │
│   (game stats, items, events)   (augment icons & data)   │
└────────────┬─────────────────────────────┬───────────────┘
             │                             │
             ▼                             │
┌──────────────────────────────────────────────────────────┐
│                  RUST BACKEND (Tauri v2)                  │
│                                                          │
│  ┌────────────────┐  ┌────────────────────────────────┐  │
│  │   API Client   │  │        Game Poller             │  │
│  │   (reqwest)    │──│  async loop, 1s interval       │  │
│  │   SSL bypass   │  │  connection state events       │  │
│  └────────────────┘  └────────────────────────────────┘  │
│                                                          │
│  ┌────────────────┐  ┌────────────────────────────────┐  │
│  │  NSPanel       │  │  Global Shortcut               │  │
│  │  Overlay       │  │  Cmd+Shift+A toggle            │  │
│  │  level 25000   │  │  + League foreground detect    │  │
│  └────────────────┘  └────────────────────────────────┘  │
│                                                          │
│  Serde Models: AllGameData, Player, Item, Rune, Event    │
│  Custom deserializer for bot item edge cases             │
└──────────────────────┬───────────────────────────────────┘
                       │
                       │ Tauri Events (game-data, connection-state)
                       ▼
┌──────────────────────────────────────────────────────────┐
│                    REACT FRONTEND                         │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────┐  │
│  │  STATS Panel │  │  GOLD Panel  │  │  AUGS Panel    │  │
│  │              │  │              │  │                │  │
│  │  KDA, CS     │  │  Gold totals │  │  Tier list     │  │
│  │  Items       │  │  Income rate │  │  Quick Pick    │  │
│  │  Runes       │  │  Gold diff   │  │  Search + PICK │  │
│  │  Summoners   │  │  Item costs  │  │  badge         │  │
│  └──────────────┘  └──────────────┘  └────────────────┘  │
│                                                          │
│  State Management (Zustand):                             │
│    gameStore ─── settingsStore ─── augmentStore           │
│                                                          │
│  Hooks:                                                  │
│    useGameEvents ── useGoldCalculation ── useAugments     │
└──────────────────────────────────────────────────────────┘
```

## Project Structure

```
lollens/
├── src-tauri/                    # Rust backend
│   └── src/
│       ├── lib.rs                # Tauri setup, NSPanel, shortcuts
│       ├── api/
│       │   └── live_client.rs    # HTTP client (SSL bypass)
│       ├── models/
│       │   └── game_data.rs      # Serde structs for game data
│       └── polling/
│           └── game_poller.rs    # Async polling loop
│
├── src/                          # React frontend
│   ├── components/
│   │   ├── augments/             # Augment tier system
│   │   │   ├── AugmentCard.tsx   # Single augment display
│   │   │   ├── AugmentSearch.tsx # Auto-focus search input
│   │   │   ├── AugmentsPanel.tsx # Main panel + Quick Pick
│   │   │   └── TierFilter.tsx    # S/A/B/C filter buttons
│   │   ├── gold/                 # Gold tracking
│   │   │   ├── GoldPanel.tsx
│   │   │   ├── GoldDiffBar.tsx
│   │   │   ├── PlayerRow.tsx
│   │   │   ├── TeamColumn.tsx
│   │   │   └── TeamGoldHeader.tsx
│   │   ├── overlay/              # Shell + navigation
│   │   │   ├── OverlayShell.tsx
│   │   │   ├── TabBar.tsx
│   │   │   └── ConnectionStatus.tsx
│   │   └── stats/                # Live player stats
│   │       ├── StatsPanel.tsx
│   │       ├── ChampionStats.tsx
│   │       ├── KDADisplay.tsx
│   │       └── StatCard.tsx
│   ├── data/
│   │   └── augment-tiers.json    # ~110 augments ranked S/A/B/C
│   ├── hooks/
│   │   ├── useAugments.ts        # Filtering, Quick Pick sorting
│   │   ├── useGameEvents.ts      # Tauri event listener
│   │   └── useGoldCalculation.ts # Gold rate math
│   ├── stores/
│   │   ├── augmentStore.ts       # CDN fetch + tier merge
│   │   ├── gameStore.ts          # Live game data
│   │   └── settingsStore.ts      # Tab state (persisted)
│   ├── types/
│   │   ├── augments.ts           # Augment type definitions
│   │   └── game.ts               # Game data interfaces
│   └── lib/
│       ├── constants.ts          # API URLs, CDN helpers
│       ├── formatters.ts         # Number/time formatting
│       └── utils.ts              # cn() utility
│
├── package.json
├── tsconfig.app.json
├── tailwind.config.ts
└── vite.config.ts
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Tauri v2](https://v2.tauri.app) |
| Backend | Rust — tokio, reqwest, serde, cocoa, objc |
| Frontend | React 19 + TypeScript |
| Styling | Tailwind CSS v4 (custom dark HUD theme) |
| State | Zustand with persist middleware |
| Overlay | macOS NSPanel via [tauri-nspanel](https://github.com/nicepkg/tauri-nspanel) |
| Data Sources | [Riot Live Client API](https://developer.riotgames.com/docs/lol) + [CommunityDragon](https://communitydragon.org) |

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [Rust](https://rustup.rs/) (stable)
- macOS (NSPanel overlay is Mac-only)
- Xcode Command Line Tools (`xcode-select --install`)

### Install & Run

```bash
# Install dependencies
npm install

# Run in dev mode (launches both Vite + Tauri)
npx @tauri-apps/cli dev
```

### Usage
1. Start a League of Legends game (any mode)
2. The overlay appears automatically when League is in the foreground
3. Press **`Cmd+Shift+A`** to toggle the overlay
4. Switch between **STATS**, **GOLD**, and **AUGS** tabs
5. In the AUGS tab, type an augment name for instant tier recommendations

> The augment tier list works without a live game — use it as a reference before queuing up.

## API Limitations

- **Riot's Live Client Data API** does not expose augment selection choices during gameplay. The tier list is a static reference, not a live tracker.
- Riot restricts displaying win rates for Arena augments ([policy](https://developer.riotgames.com/policies/general)). LolLens shows community-sourced tier rankings only.
- The overlay connects to `https://127.0.0.1:2999` which is only available while a game is running.

## License

MIT
