# Sawt Changelog

<!-- https://keepachangelog.com/en/1.0.0/ -->

One version covers the whole repository: the workspace and every app in
`apps/` share a version number and this changelog.

Each app also keeps its own `CHANGELOG.md`, covering the years it spent as a
separate repository up to 0.17.0. Those files are frozen — everything from
0.18.0 onwards is recorded here.

## [0.19.0] (unreleased)
### Added
- `packages/audio-cache` (`@sawt/audio-cache`) — the first shared package. The
  IndexedDB sound cache existed as five near-identical copies of the same 107
  lines; it is now one module, and each app holds a 17-line file naming its own
  database. 535 lines of duplication become 207
- `packages/feature-flags` (`@sawt/feature-flags`) — the `beta: true` gate that
  hides unfinished items from production builds. Three copies whose code was
  byte-identical; only the comment differed, naming a colour, a country or a
  language depending on which app it had been pasted into
- `packages/ui` (`@sawt/ui`) — the game HUD (`GameScore`, `GameActions`) and the
  shrink-to-fit `useFitText` hook, both byte-identical across all five apps

  Each app keeps a two- or three-line re-export at the old path, so every
  existing `from './GameHud'` / `'./featureFlags'` / `'./useFitText'` import is
  untouched. `index.tsx` is deliberately **not** shared: it imports `./App` and
  `./index.css`, and is the entry point named in each `index.html`

### Fixed
- **Anthem was writing its cached sounds to a database called `flags-audio`.**
  Its `audioCache.ts` was copied from Flags and the name never changed, so
  during development — where every app runs on localhost and therefore shares an
  origin — Anthem and Flags shared one cache: the 🔊 count showed the other
  app's files and 🗑️ cleared them. In production the apps sit on separate
  subdomains, so they were separate origins and never actually collided. Anthem
  now uses `anthem-audio`, which means its visitors re-download their cached
  anthems once

### Changed
- Lint and typecheck now cover `packages/` as well as `apps/`, and the root
  `build` script skips workspaces with nothing to build (packages ship
  TypeScript source, which Vite transpiles — there is no build step)

## [0.18.0] 2026-08-03
### Added
- **Bring the five learning apps together in one npm workspace.** Week, Flags,
  Colors, Numbers and Anthem each lived in their own repository; they now sit
  side by side in `apps/`, sharing one install and one toolchain. A single
  `node_modules` at the root serves every app: ~63 MB, against ~325 MB when the
  five were separate checkouts
- A landing page (`apps/home`) for www.sawt.info, with a button per app linking
  to its subdomain. Each button carries that app's own favicon, so the mark on
  the button matches the browser tab after you arrive
- ESLint at the workspace root — one flat config for every app, with
  `npm run lint` and `npm run lint:fix`. It enforces the existing house style
  (tabs, single quotes, no semicolons) rather than imposing a new one, and adds
  `react-hooks` correctness checks on top of `typescript-eslint`

### Changed
- **One version for the whole repository.** The apps previously versioned
  independently, which made sense as five repositories and stopped making sense
  as one. Everything moved to a shared number, including the landing page and
  the workspace root
- Rename Arqaam to Numbers, matching the sister projects' plain English names:
  the folder is `apps/numbers`, the package is `numbers`, and it deploys to
  numbers.sawt.info. The localStorage key (`numbers:settings`) and the IndexedDB
  cache (`numbers-audio`) are renamed with it, so a visitor's saved settings and
  cached sounds start fresh — no migration needed, since the new subdomain is a
  different origin anyway

### Fixed
- `useGame` read a ref and called `Date.now()` during render
  (`elapsedMs: (endedAt ?? Date.now()) - roundStart.current`), which React 19
  flags as unsafe: a render that reads a ref produces a value React does not
  know to re-render for. The second-tick `useState` that already existed as a
  dummy counter now holds the clock value itself, so `elapsedMs` is a pure read
  of state. Fixed in all five apps
- Delete a stale 2.8 MB Create React App build that had been sitting in the
  numbers app since before its move to Vite. It was gitignored where it came
  from, so it never reached a commit — but it accounted for 832 of the 1109
  problems the first ESLint run reported
- Correct the root `.gitignore`: `/build` is anchored to the repository root and
  would not have caught an app-level `build/`
- Convert the last Create React App leftovers to the house style. Every
  `index.tsx`, every `reportWebVitals.ts` and the numbers app's `src/lang/*.ts`
  were still on two-space indentation with semicolons
- Correct each app's README, which had drifted from the code over the previous
  cycle:
  - all five described ✋ stop and 🔄 restart as separate buttons; they were
    merged into one ⏹️/▶️ control in 0.17.0
  - week described two language dropdowns (👁️ display and 🗣️ sound); there is
    one sound dropdown, and the card faces follow the interface language
  - flags listed 30 countries against 45, still documented the removed 🎺 anthem
    option, and credited the Arabic voice as Amany after the set was re-recorded
    with Hamed
  - numbers said "zero to ten" when it goes to twelve, and its version badge
    pointed at the old 0.16.0 branch
  - colors was missing Ukrainian and Hebrew from its language list
  - anthem listed 10 countries against 14 live plus 19 beta, called 🎤 "Vocal"
    rather than "Solo vocal", and named six interface languages instead of eight

### Removed
- The five original repositories are archived and read-only. They keep the
  history up to the move; each carries a notice pointing here
