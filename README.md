# Tiempo

A lightweight web app for managing multiple personal clocks at once. Add as many clocks as you need — each one has its own **countdown timer** and **stopwatch** with independent state, so you can track several sessions in parallel (study blocks, workouts, game sessions, etc.).

## Features

- **Multiple clocks on one screen.** Add clocks from built-in presets or create your own with a custom title and duration. Remove any clock at will; each `<Clock />` owns its own timer and stopwatch state, which persists while switching tabs.
- **Countdown timer**
  - Animated circular progress ring (SVG).
  - Start / pause / resume / reset.
  - Tap the time to edit it — accepts `M:SS` or `H:MM:SS` with validation.
  - `+5 min` / `+10 min` chips that extend a timer even while it's running.
  - Audible alarm (Web Audio API) when the time runs out, plus a "Time's up" label.
- **Stopwatch**
  - Centisecond precision (`M:SS.CS`).
  - Lap recording with per-lap split times (newest first).
  - Start / pause / resume / reset.

## Getting started

```bash
npm install
npm run dev       # start the dev server
```

### Scripts

| Script            | Description                          |
| ----------------- | ---------------------------------- |
| `npm run dev`     | Run the Vite dev server with HMR   |
| `npm run build`   | Type-check and build for production into `dist/` |
| `npm run preview` | Preview the production build       |
| `npm run lint`    | Lint with ESLint                   |

## Tech stack

- [React 19](https://react.dev) (with React Compiler enabled via `babel-plugin-react-compiler`)
- [TypeScript](https://www.typescriptlang.org)
- [Vite](https://vitejs.dev)
- [ESLint](https://eslint.org)

No router, no state library — just React hooks and local component state.

## Project structure

```
src/
├── App.tsx                    # Clock list, presets, add/remove logic
├── main.tsx                   # Entry point
├── index.css                  # All styling (CSS custom properties)
├── components/
│   ├── Clock.tsx              # One card: title + Timer/Stopwatch tabs
│   ├── Timer.tsx              # Countdown UI with progress ring
│   ├── Stopwatch.tsx          # Elapsed time, lap list, controls
│   ├── AddClockMenu.tsx       # Floating "+" menu (presets + custom)
│   └── icons.tsx              # Play/pause/reset SVG icons
└── hooks/
    ├── useTimer.ts            # Countdown state machine, time parsing, alarm
    └── useStopwatch.ts        # Elapsed-time tracking and laps
```

## Customizing presets

The quick-add presets live in `src/App.tsx`:

```tsx
const PRESETS: ClockPreset[] = [
  { title: 'yugi', minutes: 50 },
  { title: 'rift', minutes: 50 },
  { title: 'gundam', minutes: 35 },
  { title: 'OP', minutes: 35 },
  { title: 'poke', minutes: 45 },
]
```

Edit this list (or remove it entirely) to match your own routine. You can always create ad-hoc clocks from the "New…" option in the add menu.
