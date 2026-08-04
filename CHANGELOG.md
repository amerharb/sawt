# Sawt Changelog

<!-- https://keepachangelog.com/en/1.0.0/ -->

One version covers the whole repository: the workspace and every app in
`apps/` share a version number and this changelog.

Each app also keeps its own `CHANGELOG.md`, covering the years it spent as a
separate repository up to 0.17.0. Those files are frozen — everything from
0.18.0 onwards is recorded here.

## [0.20.0] (unreleased)
<!-- Content: more items, more content languages, more interface languages. -->
### Added
- `packages/url-state` (`@sawt/url-state`) — one shared, unified set of
  deep-link parameters, replacing five separate implementations:

  | | |
  | --- | --- |
  | `?i=` | items visible — a list of codes, or a range in Numbers |
  | `?l=` | interface language |
  | `?s=` | sound: which spoken language, or which anthem rendering |
  | `?t=` | theme |

  "Sound" is the axis deciding which audio an item produces. In Anthem that is
  the rendering rather than a language, and it is a single choice with nothing to
  hide, so `?s=` takes one value there and a list elsewhere. Theme and interface
  language were previously unreachable from a URL

### Added
- Anthem can now sort its cards, like Flags and Colors: ⇵ by code (the default),
  by name, or a frozen random order. It is the app where a name sort earns its
  keep most — with 🔤 name display the cards are text, so alphabetical order
  actually helps you find a country, whereas Flags' cards are emoji and an
  alphabetical-by-spoken-name order is one you cannot see

- **Numbers now answers `?i=` too, as a range: `?i=0-9`, `?i=10-12`, or `?i=7`
  for a single number.** It is the one app whose items are a contiguous ordered
  run, so a range is what a link wants to say — `?i=0-9` rather than
  `?i=0,1,2,3,4,5,6,7,8,9`. Both ends are inclusive, reversed ends are accepted,
  and a range that runs off the board is ignored like any other unusable value.

  The ends are resolved by position in the board's own order rather than by
  comparing the codes, because these codes are strings: compared as text, `'10'`
  sorts before `'9'`, and `?i=10-12` would have come out empty.

  Numbers had no hideable items before this, so it also gains a `hiddenDigits`
  setting and a numbers checklist in the settings panel, beside the languages
  one. That checklist is the point rather than a bonus: without it a shared
  `?i=0-9` link would persist to localStorage on the next settings change and
  leave 10, 11 and 12 unreachable — the same trap the 0.20.0 validation fix
  closed for mistyped codes. Flight mode also now caches only the numbers still
  on the board, so narrowing the range no longer downloads all thirteen

### Changed
- **Renamed the sort modes to `code` / `name` / `random` everywhere.** Flags
  spelled by-code `iso` and Colors `code`, and both called the name sort `lang`.
  That last name was wrong in two ways: it says "language" when it means "the
  name the app displays", and that name comes from a different axis per app —
  Flags and Colors key their item names by *spoken* language, while Anthem keys
  them by *interface* language and has no per-sound names at all, since its sound
  is a rendering rather than a language. `name` is honest in all three, and each
  app binds it to whichever name it shows
- **Renamed and unified the URL parameters.** They were `f` for countries in both
  Flags and Anthem, `c` for colours, and `l` for the *content* language in four
  apps. `l` now means the *interface* language and `s` carries the sound, so an
  older `?l=en,ar` link sets the interface language instead of the spoken one
- Restructure the numbers app to match its siblings. It was transposed: one file
  per *language* (`src/lang/ar.ts` and so on) each holding a `numbers: string[]`,
  while the digits themselves had no files at all — they were a one-line `.map()`
  in `App.tsx`. Every other app has one file per *item* with the names keyed by
  language.

  There are now thirteen `src/digits/0.ts`…`12.ts`, each a `Digit` with
  `name: Record<Language, string>`, and the spoken languages live in a
  `LANGUAGE_DEFS` array in `App.tsx` exactly as they do in Week, Flags and
  Colors. `ALL_LANGUAGES` no longer means "the items on screen" here and "the
  language axis" everywhere else.

  All 143 words were moved by script and diffed against the originals, so none
  was retyped.

### Fixed
- **A mistyped share link could permanently blank an app.** `?f=typo` matched no
  country, so every country was hidden — an empty board with no explanation — and
  because the parameter was merged into the settings object, the next settings
  change wrote that state to localStorage. The app then stayed empty even with the
  parameter removed, until the visitor cleared their site data. Parameters are now
  validated, and one with nothing usable left is ignored
- `sortByCodeOrName` still tested `mode === 'lang'` after the rename. Because
  `mode` is a plain string — deliberately, since it comes from a stored setting —
  TypeScript could not catch it, and the name sort would have silently fallen back
  to code order in both apps. It now accepts `name`, and keeps `lang` as the
  pre-0.20.0 spelling so an existing saved preference is not quietly downgraded
- Move each app's selected-sound `useState` above the effect that reads the URL.
  It was declared below and set from inside, which `react-hooks/immutability`
  flags as accessing a variable before it is declared — three of those errors
  pre-dated this change

## [0.19.0] 2026-08-04
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
- The landing page shows the repository version in its footer
- `packages/game` (`@sawt/game`) — the game-mode state machine (`useGame`, 231
  lines) and the app-bar segments it drives (`GameScore`, `GameActions`, moved
  here from `@sawt/ui`, which now holds only the generic `useFitText`). `useGame`
  is generic over the prompt type: most apps prompt with a sound-file url, while
  Anthem prompts with a clip that may be a url, a start/end window into a longer
  recording, or a score synthesized live with no file at all. An optional
  `urlsOf` says which files a prompt needs cached, defaulting to the prompt
  itself when it is a url and letting Anthem return none for a score
- `packages/order` (`@sawt/order`) — board ordering: `shuffle` (three verbatim
  copies) and `sortByCodeOrName`, which replaces Flags' `sortCountries` and
  Colors' `sortColors`. Those two had identical fourteen-line bodies differing
  only in a type name. It takes the name through an accessor rather than a shared
  item shape, because each app's `name` is `Record<Language, string>` over its
  own language union and cannot satisfy a common constraint — and it treats the
  by-code mode as the default branch, since Flags spells it `iso` and Colors
  `code`

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
