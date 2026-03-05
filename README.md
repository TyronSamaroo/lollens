# LolLens

A League of Legends overlay for Mac that sits on top of your game and shows you stats, gold tracking, and which augments to pick — all without alt-tabbing.

## What is this?

I got tired of tabbing out mid-game to check augment tier lists or figure out gold leads. So I built an overlay that just... sits there on top of League and gives you everything you need.

It hooks into Riot's Live Client API (the same localhost thing that runs when you're in a game) and pulls live data every second. For augments, it grabs community tier rankings so when that augment selection screen pops up, you can quickly look up which one's the best pick.

## What it does

**Stats** — Live KDA, CS, level, items, runes, and summoner spells for everyone in the game. Updates every second.

**Gold** — Team gold totals, per-player gold, income rates, and a gold diff bar so you can see who's ahead at a glance.

**Augments** — This is the main thing I use it for. ~110 augments ranked S/A/B/C from community data. When augments pop up in game, switch to the AUGS tab, start typing the name, and it tells you which one to pick with a big "PICK" badge. Works in Arena, ARAM, Mayhem — any mode with augments.

## How to run it

You need a Mac, Node.js, and Rust installed.

```bash
# clone it
git clone https://github.com/TyronSamaroo/lollens.git
cd lollens

# install deps
npm install

# run it
npx @tauri-apps/cli dev
```

First time building will take a minute because Rust has to compile everything. After that it's fast.

## How to use it

1. Open LolLens, then start a League game
2. **Press `Cmd+Shift+A`** to show/hide the overlay
3. Use the tabs at the top to switch between STATS, GOLD, and AUGS
4. For augments: just start typing the name — search auto-focuses and results are sorted best-to-worst

The augment tier list works even without a game running, so you can browse it in queue or champ select.

## Known issues / limitations

- **Only works in Borderless Windowed mode**, not fullscreen. This is a macOS thing — the overlay can't draw on top of a true fullscreen app. Go to League settings > Video > Window Mode > Borderless. Honestly most people play borderless anyway.

- **Can't auto-detect your augment choices.** Riot's API doesn't expose which augments are being offered to you. So you gotta manually type the name to look it up. It's fast though — type a few letters and you'll see the tier instantly.

- **Riot doesn't let apps show augment win rates.** So the tier rankings are based on community consensus (tier lists), not raw data. Still useful, just don't expect exact percentages.

- **Mac only.** The overlay uses macOS-specific stuff (NSPanel) to stay on top of League. No Windows support right now.

- **Stats only show while in a game.** The Live Client API (`localhost:2999`) only runs during an active game. Before/after game, you'll see a "Waiting for game" status. The augment tier list still works though.

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

## Project structure

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
│   │   ├── gold/                 # Gold tracking
│   │   ├── overlay/              # Shell + navigation
│   │   └── stats/                # Live player stats
│   ├── data/
│   │   └── augment-tiers.json    # ~110 augments ranked S/A/B/C
│   ├── hooks/                    # useGameEvents, useGoldCalculation, useAugments
│   ├── stores/                   # gameStore, settingsStore, augmentStore
│   ├── types/                    # TypeScript interfaces
│   └── lib/                      # Constants, formatters, utils
```

## Tech stack

| What | Tech |
|------|------|
| App framework | [Tauri v2](https://v2.tauri.app) |
| Backend | Rust (tokio, reqwest, serde, cocoa, objc) |
| Frontend | React 19 + TypeScript |
| Styling | Tailwind CSS v4 |
| State management | Zustand |
| Overlay | macOS NSPanel via [tauri-nspanel](https://github.com/nicepkg/tauri-nspanel) |
| Game data | [Riot Live Client API](https://developer.riotgames.com/docs/lol) |
| Augment data | [CommunityDragon](https://communitydragon.org) |

## License

MIT
