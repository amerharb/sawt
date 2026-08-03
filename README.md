# Sawt

صوت — *sound, voice*.

An npm workspace holding five audio-first learning apps and a landing page.
The five share one idea:
point at a thing, hear its name in the language you're learning, then play a
guessing game to recognise it by ear.

| app | teaches | deploys to |
| --- | --- | --- |
| [`apps/home`](apps/home) | *landing page* | www.sawt.info |
| [`apps/week`](apps/week) | the days of the week | week.sawt.info |
| [`apps/flags`](apps/flags) | country flags and names | flags.sawt.info |
| [`apps/colors`](apps/colors) | colours | colors.sawt.info |
| [`apps/arqaam`](apps/arqaam) | numbers 0–12 | arqaam.sawt.info |
| [`apps/anthem`](apps/anthem) | national anthems | anthem.sawt.info |

The five learning apps each began as their own repository —
[week](https://github.com/amerharb/week),
[flags](https://github.com/amerharb/flags),
[colors](https://github.com/amerharb/colors),
[arqaam](https://github.com/amerharb/arqaam),
[anthem](https://github.com/amerharb/anthem) — which hold the history up to the
move here.

Each app has its own README, CHANGELOG and version. All are Vite + React 19 +
TypeScript 6, frontend only, no backend.

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

Vercel needs **one Project per app** — six, all connected to this one repository.
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

Repeat for each app, `apps/home` included — six projects in total. Note the
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

One thing to keep true as this grows: when `packages/` appears, each app must
declare the shared packages it uses as real dependencies in its own
`package.json`. That dependency graph is how Vercel decides what a change
affects — a shared package imported but not declared would leave apps
un-rebuilt when it changes.

## Layout

```
sawt/
├─ apps/            one folder per deployable app
└─ package.json     workspace root
```

`apps/home` is the odd one out: a static landing page with no audio, no state and
no shared code. Everything below concerns the five learning apps.

`packages/` does not exist yet. The five apps still carry their own copies of
`useAudio`, `useGame`, `GameHud`, `audioCache`, `featureFlags` and `useFitText`.
Those copies have already drifted — `audioCache.ts` exists in four variants
differing only in a database-name constant, and `featureFlags.ts` in three
differing only in comments. Extracting them into `packages/` is the next step,
and the reason this workspace exists.
