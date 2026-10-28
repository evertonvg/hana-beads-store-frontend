# Pixel Perfect Artesanato

Online store frontend (Next.js 16, App Router, Tailwind 4) with a mock data layer.
Spec and design references live in `docs/`; project rules in `CLAUDE.md`.

## Setup

```bash
npm install
cp .env.example .env.local   # then adjust values
npx playwright install chromium
```

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server on http://localhost:3000 |
| `npm run build` / `npm start` | Production build / server |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Vitest unit tests |
| `npm run e2e` | Playwright (desktop + mobile projects); builds and serves on port 3100 |
| `npm run check` | lint + typecheck + unit tests |

`SESSION_SECRET` must have 32+ characters. Visual baselines (`VISUAL=1`) run only in Docker.
