# Sawt

صوت — *sound, voice*.

An npm workspace holding seven audio-first learning apps and a landing page.
The seven share one idea:
point at a thing, hear its name in the language you're learning, then play a
guessing game to recognise it by ear.

| app | teaches | deploys to |
| --- | --- | --- |
| [`apps/home`](apps/home) | *landing page* | www.sawt.info |
| [`apps/week`](apps/week) | the days of the week | week.sawt.info |
| [`apps/flag`](apps/flag) | country flags and names | flag.sawt.info |
| [`apps/color`](apps/color) | colours | color.sawt.info |
| [`apps/number`](apps/number) | numbers 0–15 | number.sawt.info |
| [`apps/anthem`](apps/anthem) | national anthems | anthem.sawt.info |
| [`apps/face`](apps/face) | feelings, from faces | face.sawt.info |
| [`apps/map`](apps/map) | where countries are | map.sawt.info |

Each learning app began as its own repository —
[week](https://github.com/amerharb/week),
[flags](https://github.com/amerharb/flags),
[colors](https://github.com/amerharb/colors),
[arqaam](https://github.com/amerharb/arqaam) (renamed `numbers` here) and
[anthem](https://github.com/amerharb/anthem). Those five are now **archived and
read-only**; they hold the history up to the move, and everything after it
happens here.

One version covers the whole repository — the workspace and every app share a
version number and [one changelog](CHANGELOG.md). The countries still missing
from Flag and Map are listed in [TODO.md](TODO.md). 0.18.0 was the move here;
everything since is recorded at the root. The landing page shows that version in
its footer. Each app keeps its own README, and its
own frozen changelog for the years it spent as a separate repository, up to
0.17.0.
All are Vite + React 19 + TypeScript 6, frontend only, no backend.

## Getting started

```bash
npm install            # once, at the root — installs for every app
npm run build          # build them all
npm run typecheck      # tsc --noEmit across them all
npm run dev -w week    # dev server for one app
npm run preview -w anthem
```

One `node_modules` at the root serves every app (~63 MB, against ~325 MB when
the five were separate checkouts). Do not run `npm install` inside an app — it
will create a nested `node_modules` and defeat the hoisting.

## Deploying: one Vercel project per app, one repo

Vercel needs **one Project per app** — eight, all connected to this one repository.
`vercel.json` cannot create them, and it cannot set the Root Directory — those
are per-project dashboard settings. For each app:

1. **New Project** → import this repository.
2. **Root Directory** → `apps/<app>`, e.g. `apps/week`.
3. Under Root Directory, enable **Skip deployment** so this project only builds
   when the commit affects it.
4. **Install Command** → override to
   `npm ci --include-workspace-root --workspace=<app>`.
   Vercel sets the install path from the Root Directory, and `apps/<app>` has no
   lockfile of its own — the single `package-lock.json` lives at the repo root.
   Without this the install resolves fresh versions instead of the locked ones,
   so a build could pick up dependencies your local install never saw.
5. Leave Framework, Build Command and Output Directory alone —
   `apps/<app>/vercel.json` sets `framework: vite` and `outputDirectory: dist`.
6. Assign that project's domain.

When an app is renamed, its **old subdomain should be attached to the project
too** — flag, color and number each carry a host-conditional redirect in their
`vercel.json` (the same pattern home uses for the apex) that 308s the old
plural host to the new one, path and query intact. The redirect can only fire
on requests that reach the project, so it does nothing until the old domain is
attached alongside the new one.

Repeat for each app, `apps/home` included — eight projects in total. Note the
number of Projects allowed against one repository
[depends on your plan](https://vercel.com/docs/limits#general-limits).

### Only the changed app redeploys

Nothing to configure — Vercel skips unaffected projects automatically, and this
workspace already meets its
[requirements](https://vercel.com/docs/monorepos#requirements): npm workspaces
declared in the root `package.json`, a unique `name` in every app, a lockfile at
the repo root, and a GitHub remote.

Do **not** reach for an `ignoreCommand` / Ignored Build Step here. Builds it
cancels still count against deployment and concurrent-build limits, whereas the
built-in skipping does not consume a build slot at all.

One thing to keep true as this grows: each app must declare the shared packages
it uses as real dependencies in its own `package.json`. That dependency graph is
how Vercel decides what a change affects — a shared package imported but not
declared would leave apps un-rebuilt when it changes.

## Layout

```
sawt/
├─ apps/            one folder per deployable app
├─ packages/        code shared between them
└─ package.json     workspace root
```

`apps/home` is the odd one out: a static landing page with no audio, no state and
no shared code. Everything below concerns the five learning apps.

`packages/` holds what the apps genuinely share. Each ships TypeScript source
rather than a build — Vite transpiles them along with the app that imports them,
so there is no build step to keep in sync:

| | |
| --- | --- |
| `@sawt/audio-cache` | IndexedDB store for the sound files |
| `@sawt/feature-flags` | `isVisible`, and the `VITE_SHOW_BETA` gate |
| `@sawt/game` | the round state machine, `useGame` |
| `@sawt/order` | `shuffle` and the board sort |
| `@sawt/ui` | `useFitText`, `useCopyLink` |
| `@sawt/url-state` | reading and writing the deep-link parameters |

Apps import these directly — `from '@sawt/game'`, not through a local re-export.
The extraction originally left a one-line shim at each old path so that existing
`from './useGame'` imports kept working; those are gone, since two ways to reach
the same code is one more than a reader needs.

What stays per-app is what actually differs. `audioCache.ts` wraps
`@sawt/audio-cache` because each app owns its own IndexedDB database — one app's
🗑️ must not clear another's sounds while they share `localhost` in development.
`useAudio`, `settingsStore` and `SettingsPanel` are also per-app: they read as
near-copies, but each has diverged enough that merging them would mean a
parameter for every difference.
