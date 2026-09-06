# Nebula Strike

Nebula Strike is a browser-based space shooter built with Next.js, React, Tailwind CSS, and the HTML Canvas API. Players create a local pilot profile, choose a space playground, clear progressively harder missions, unlock new levels, and compete on a leaderboard stored in the browser.

The project is fully client-side for gameplay data. Profiles, progress, game records, selected playgrounds, and leaderboard rankings are saved with `localStorage`, so no backend or external database is required.

## Features

- Canvas-powered arcade shooter with smooth animation and particle effects
- Ten escalating levels with increasing enemy speed, spawn rate, health, accuracy, and score targets
- Boss mission on level 10
- Five selectable playground themes:
  - Deep Space
  - Mars Orbit
  - Alien Nebula
  - Asteroid Belt
  - Dark Galaxy
- Local pilot profiles with saved progress per username
- Level unlocking based on completed missions
- Local leaderboard ranked by best score, highest completed level, and total wins
- Desktop keyboard, mouse, pointer, and mobile touch controls
- In-game HUD with score, health, level progress, pause, restart, exit, and sound toggle
- Responsive UI built with Tailwind CSS and Lucide icons

## Tech Stack

- **Framework:** Next.js 16
- **UI:** React 19
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Game Rendering:** HTML Canvas
- **Storage:** Browser `localStorage`
- **Linting:** ESLint

## Getting Started

### Prerequisites

Install Node.js and npm before running the project.

### Installation

```bash
npm install
```

### Run the Development Server

```bash
npm run dev
```

Open the local URL shown in the terminal, usually:

```text
http://localhost:3000
```

### Build for Production

```bash
npm run build
npm run start
```

### Lint the Project

```bash
npm run lint
```

## How to Play

1. Open the app and select **Play**.
2. Enter a pilot name and username.
3. Choose a playground theme.
4. Select an unlocked level.
5. Destroy enemies to earn points.
6. Win by reaching the level target score or defeating the boss.
7. Completing a level unlocks the next level.

## Controls

### Desktop

| Action | Controls |
| --- | --- |
| Move | Arrow keys or `W`, `A`, `S`, `D` |
| Shoot | `Space`, `F`, or hold left mouse button |
| Pointer movement | Move the mouse over the game canvas |
| Pause | `P` or the HUD pause button |

### Mobile

| Action | Controls |
| --- | --- |
| Move | Drag on the game screen or use the on-screen direction buttons |
| Shoot | Press the ship or use the on-screen shoot button |
| Pause | On-screen pause button |

## App Routes

| Route | Purpose |
| --- | --- |
| `/` | Home page and main navigation |
| `/play` | Create or switch pilot profile |
| `/playground` | Choose the active playground theme |
| `/levels` | View and select unlocked levels |
| `/game?level=1` | Play a specific level |
| `/rules` | Gameplay rules and ranking details |
| `/leaderboard` | Local leaderboard for this browser |
| `/settings` | Update pilot name or switch username |

## Project Structure

```text
.
├── app/                  # Next.js App Router pages
├── components/           # Shared UI components
├── game/                 # Canvas game engine, controls, sound, and collision logic
├── lib/                  # Levels, playground config, leaderboard, and storage helpers
├── styles/               # Global styles
├── package.json          # Scripts and dependencies
└── tailwind.config.js    # Tailwind CSS configuration
```

## Game Data

Nebula Strike stores data under this browser storage key:

```text
spaceShooterGame:v1
```

Saved data includes:

- Current pilot username
- Pilot profiles
- Unlocked and completed levels
- Match records
- Best scores
- Selected playground
- Generated leaderboard

Because this data lives in `localStorage`, it is specific to the browser and device. Clearing browser site data will reset progress and leaderboard records.

## Level Progression

Level 1 is unlocked by default. Each completed level unlocks the next one until level 10. Difficulty increases through:

- Faster enemy movement
- Shorter enemy spawn intervals
- Higher enemy health
- More active enemy planes
- Better enemy shooting accuracy
- Higher score targets

Level 10 includes a boss encounter that can also complete the mission when defeated.

## Development Notes

- Gameplay is handled by `SpaceShooterEngine` in `game/gameEngine.js`.
- Keyboard input is managed in `game/controls.js`.
- User progress and leaderboard persistence are handled in `lib/storage.js`.
- Level tuning lives in `lib/levels.js`.
- Playground theme configuration lives in `lib/gameConfig.js`.

## License

No license file is currently included. Add a license before publishing or distributing this project publicly.
