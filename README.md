# Behind the Show — Production Tracker

A React + Vite single-page app for tracking a 6-episode behind-the-scenes
documentary (Grace Bible Fellowship Church · USO Show, America's 250th).

Every page is editable in place, and all data persists to the browser's
`localStorage` — no server, accounts, or API keys. It's an installable PWA built
to be opened on a phone during filming, and works offline.

## Run it

```bash
npm install
npm run dev      # start the dev server (http://localhost:5173)
npm run build    # production build → dist/
npm run preview  # preview the production build
```

## Pages

- **Dashboard** — read-only, computed stats (footage captured, interviews done,
  open questions), an "Up Next" widget pulling the next unfinished schedule
  sessions, and the episode reel cards in cut order.
- **Episodes** — edit status (dropdown), toggle interview subjects, add/remove
  subjects, and jot free-text notes per episode.
- **Footage Log** — add clips, toggle captured ↔ needed, delete, and filter.
- **Interview Schedule** — edit sessions inline (people, tag, episode), mark
  done, add new sessions, and delete.
- **Team** — reference list with light inline editing (name, roles, episodes).
- **Open Questions** — add, toggle resolved, inline-edit, and delete.

## Data & persistence

Each collection is stored as a JSON-stringified array under its own
`localStorage` key: `episodes`, `footage`, `schedule`, `team`, `questions`.

On first run, each key falls back to seed data in `src/data/seed.js`. Every edit
writes back to `localStorage` immediately (see `src/hooks/useLocalStorage.js`),
and changes sync across tabs on the same device.

> **Caveat:** this data lives only in this browser on this device. Clearing
> browser data, switching browsers, or reinstalling wipes it. Use the **Export**
> button in the sidebar to download a JSON backup, and **Import** to restore it
> on another browser/device.

## Install as an app (PWA)

The app is a Progressive Web App: it ships a web manifest and a service worker
(via `vite-plugin-pwa`) that precaches the app shell, so it loads offline and
can be installed to a home screen.

- **iPhone/iPad (Safari):** Share → *Add to Home Screen*.
- **Android (Chrome):** menu → *Install app* / *Add to Home Screen*.
- **Desktop (Chrome/Edge):** install icon in the address bar.

The service worker is only active in a production build (`npm run build` →
`npm run preview` or a deployed host) and auto-updates when a new version is
deployed. Icons live in `public/` and are generated from `public/icon.svg`.

> Note: the service worker caches the app shell for offline use; your tracker
> data still lives in `localStorage` (see below), independent of the cache.

## Project structure

```
src/
  App.jsx                  app shell, navigation, localStorage wiring, backup
  theme.js                 colors + status metadata
  utils.js                 schedule date sorting, id generation
  data/seed.js             first-run seed data
  hooks/useLocalStorage.js persistence hook
  components/ui.jsx         shared UI primitives (badges, inputs, reel card)
  pages/                   one file per page
```
