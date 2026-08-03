# Sawt

صوت — *sound, voice*.

An npm workspace holding five audio-first learning apps. They share one idea:
point at a thing, hear its name in the language you're learning, then play a
guessing game to recognise it by ear.

| app | teaches | live |
| --- | --- | --- |
| [`apps/week`](apps/week) | the days of the week | [week](https://github.com/amerharb/week) |
| [`apps/flags`](apps/flags) | country flags and names | [flags](https://github.com/amerharb/flags) |
| [`apps/colors`](apps/colors) | colours | [colors](https://github.com/amerharb/colors) |
| [`apps/arqaam`](apps/arqaam) | numbers 0–12 | [arqaam](https://github.com/amerharb/arqaam) |
| [`apps/anthem`](apps/anthem) | national anthems | [anthem](https://github.com/amerharb/anthem) |

Each app has its own README, CHANGELOG and version. All five are Vite + React 19
+ TypeScript 6, frontend only, no backend.

## Getting started

```bash
npm install            # once, at the root — installs for every app
npm run build          # build all five
npm run typecheck      # tsc --noEmit across all five
npm run dev -w week    # dev server for one app
npm run preview -w anthem
```

One `node_modules` at the root serves every app (~63 MB, against ~325 MB when
the five were separate checkouts). Do not run `npm install` inside an app — it
will create a nested `node_modules` and defeat the hoisting.

## Deploying: five Vercel projects, one repo

Vercel needs **five separate Projects** all connected to this one repository.
`vercel.json` cannot create them, and it cannot set the Root Directory — those
are per-project dashboard settings. For each app:

1. **New Project** → import this repository.
2. **Root Directory** → `apps/<app>`, e.g. `apps/week`.
3. **Include source files outside of the Root Directory** → **on**. Required:
   the app's dependencies are hoisted to the workspace root, so a build confined
   to `apps/<app>` cannot resolve them.
4. Leave Framework and Build Command alone — `apps/<app>/vercel.json` sets
   `framework: vite` and `outputDirectory: dist`.
5. Assign that project's domain.

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

`packages/` does not exist yet. The five apps still carry their own copies of
`useAudio`, `useGame`, `GameHud`, `audioCache`, `featureFlags` and `useFitText`.
Those copies have already drifted — `audioCache.ts` exists in four variants
differing only in a database-name constant, and `featureFlags.ts` in three
differing only in comments. Extracting them into `packages/` is the next step,
and the reason this workspace exists.
