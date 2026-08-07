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
  | `?i=` | items visible — a list of codes, or a range where one fits |
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

  The range is a shorthand rather than a replacement — a comma anywhere makes the
  value a plain list, since the settings checklist can produce a hand-picked set
  like `0,1,5` that no range describes, and the copy-link button has to be able to
  write it. Ranges stay opt-in per app because Flags has a code with a hyphen in
  it, `gb-sct`, which must never be read as one.

  Numbers had no hideable items before this, so it also gains a `hiddenDigits`
  setting and a numbers checklist in the settings panel, beside the languages
  one. That checklist is the point rather than a bonus: without it a shared
  `?i=0-9` link would persist to localStorage on the next settings change and
  leave 10, 11 and 12 unreachable — the same trap the 0.20.0 validation fix
  closed for mistyped codes. Flight mode also now caches only the numbers still
  on the board, so narrowing the range no longer downloads all thirteen

- **🔗 in the settings panel copies a share link to what is on screen**, in all
  five apps. Deep links existed but had to be typed by hand, which meant knowing
  the parameter names and every item's code — so in practice nobody made one.

  `writeUrlParams` is the exact inverse of `readUrlParams`: whatever the button
  writes reads back as the same state, verified as a round trip over ranges,
  hand-picked sets, single items and full sets. Two things are left out on
  purpose — `i` when nothing is hidden, because listing all fifty-odd countries
  to say "everything" is worse than saying nothing, and `t` for `system`, which
  means "follow the device" rather than a choice worth pinning on someone else's
  screen. Each app contributes what it actually has: Week emits no `i` (its seven
  days are fixed), Numbers emits a range where one fits, and Anthem's `s` is a
  single rendering.

  The button reports what happened rather than assuming success: ✅ when the text
  is on the clipboard, ⚠️ when it is not. `navigator.clipboard` needs a secure
  context, so it is unavailable over plain HTTP — a phone opening these apps
  across the local network, which is a real way they get used — and it also
  rejects when the page is unfocused or permission is refused. Those fall back to
  the older select-and-copy path, and only a failure of both shows ⚠️

- **Thirteen, fourteen and fifteen in Numbers**, with their thirty-three
  recordings — the board goes 0–15, and `?i=13-15` works like any other range.

  Arabic keeps the masculine forms (ثلاثة عشر) and Hebrew the feminine
  (שלוש עשרה), each matching what eleven and twelve already had, so neither
  sequence changes gender part-way up. In the Arabic compounds the ten-part stays
  masculine while the unit-part carries the ة — عشر with ثلاثة — which is the
  pattern the whole 0–15 run already followed.

  Worth knowing for anyone adding more: the app's audio has never been from one
  source. English came from archive.org, German, French, Swedish and Russian from
  Wiktionary and Wikimedia, and Turkish, Finnish and Spanish from ttsfree, while
  eleven and twelve were added later with Edge voices — so in those languages the
  voice changes part-way up the run. Turkish and Finnish additionally still have
  0–10 at 44.1 kHz stereo against 24 kHz mono above. Arabic is now the one language
  free of this (see below); the rest are unchanged for now

- **Violet (`#8000FF`) in Colors**, with its six recordings. It differs from
  purple `#800080` only in the blue channel, which is exactly the relationship the
  two names describe. It first shipped as the three-digit `70f` (`#7700FF`, the
  closest shorthand could get) and became exact once the palette moved to
  six-digit codes, below

- **Magenta (`#FF00FF`) in Colors**, with its six recordings. It was the only missing
  corner of the RGB cube — the palette had the other seven — and the partner of a
  cyan that was already there, leaving a visible hole between pink `#FF80BF` and
  purple `#800080`.

  Named with the loanword in Arabic, Ukrainian and Hebrew (ماجنتا, Маджента,
  מג'נטה), as Cyan already is in German, Swedish and Hebrew: none of the three has
  an everyday native term for `#FF00FF`. أرجواني looks like the Arabic word for it
  but is not — Arabic separates spectral violet بنفسجي (`#8000FF`) from
  non-spectral purple أرجواني (`#800080`) from ماجنتا, and `#800080` is the purple
  swatch itself. Ukrainian likewise treats Пурпуровий as the whole
  purple sector, with Маджента the narrowed part of it

- **🇨🇿 Czechia leaves beta, and 🎤 finally splits into solo and choir.** Its
  official recording is the National Theatre's 2008 session under Jiří
  Bělohlávek, and Commons carries three public-domain takes from it. Calling the
  chorus a "solo vocal" would have been wrong, so the split noted when the type
  was renamed happened here: 🎤 is one singer, **👥 is a choir**. Czechia has
  both — Adam Plachetka's solo take on 🎤, the chorus on 👥 — and is so far the
  only country with 👥, joining the United States and Switzerland on 🎤.

  A new rendering costs little: the sound path is already `/sound/<type>/<code>`,
  so `choral` brought its own folder, an `anthem.hasChoral` flag beside
  `hasVocal`, and a label in the eight interface languages.

  The 🎼 melody comes from the [public-domain MIDI on Wikimedia
  Commons](https://commons.wikimedia.org/wiki/File:Kde_domov_m%C5%AFj.mid), whose
  melody track holds two interleaved voices — the score is the top note at each
  onset, transposed E → E♭ to match the recording, 65.5 beats over the sixteen
  bars the anthem is written in. No intro: the recording opens on the melody.

  Škroup died 1862 and Tyl 1856, so the words are public domain, and Czechia is
  the third country to carry them. Only the first of the song's two stanzas —
  § 7 of the act adopting the anthem says the anthem *is* that stanza.

  `tools/fetch-lyrics.py` is back, rebuilt around an allowlist instead of the
  blocklist the README had been describing to a script that was no longer in the
  repo. A country it has not been told about is refused, and adding one means
  recording the author's death year, so the reasoning is in the file rather than
  in someone's memory. It also checks the stanza count, which is what catches a
  source page holding a whole poem where the anthem is one verse

- **Greek in Numbers**, 0–15 with its seventeen recordings — sixteen digits plus
  the language-name sound played when you switch to it. Unlike Week, the words
  had to be written: Numbers keys its names by *spoken* language, so nothing was
  there to reuse.

  The neuter forms, which is what Greek counts aloud with — ένα, τρία, τέσσερα
  rather than ένας, τρεις, τέσσερις — and the standard spellings for seven, eight
  and nine (επτά, οκτώ, εννέα) over the colloquial εφτά, οχτώ, εννιά

- **Greek and Turkish are spoken in Week**, taking it from six sound languages
  to eight. Neither needed a translation: Week keys its day names by *interface*
  language, and both have been interface languages all along, so Κυριακή and
  Pazar were already written for every day — only the fourteen recordings were
  missing. Athina and Emel, the voices the sister apps already use.

  That leaves Thai and Simplified Chinese in the same position: names written,
  no audio

- **Hebrew is Week's ninth interface language**, and the week reads
  right-to-left in it. Hebrew was already a *sound* language with a name for
  every day, but could not be selected as the interface, so its `rtl` flag had
  nothing to act on.

  Direction follows the interface language rather than the sound language,
  because the cards are written in the interface language — flipping the board
  for a Hebrew *sound* while the cards still read "Sunday" would lay English
  text out right-to-left. So `?l=he` gives an RTL week with יום ראשון on the
  right, while `?l=en&s=he` stays left-to-right and merely speaks Hebrew.

  This also removes a dead `rtl` field from Week's `LANGUAGE_DEFS`: it was set on
  Arabic and read by nothing, since the only consumer looks at `UI_LANGUAGES`.
  Hebrew missing it there looked like an oversight and was really a symptom

### Fixed
- **On a narrow screen the display clipped its own text, top and bottom.** Once
  the app bar stacked, the spelled-out name lost its ascenders and descenders —
  most visibly in Greek, where δεκατρία has both.

  The stacking rule that gives the display its own full-width row was written
  correctly but placed *before* the `.display` rule it overrides. Equal
  specificity, so source order decided and the base `flex: 1 1 0` won. In a
  column flex container that basis of zero left the display whatever height the
  toolbar had not taken — thirteen pixels for thirty-eight pixels of text,
  centred, so it was cut symmetrically at both ends.

  Moving the media query after the rule fixes it in all five apps, with a comment
  saying why it has to stay there. Verified across the breakpoint at 320, 375,
  480, 700, 759, 761, 900 and 1200 px, in both learn and game mode

### Changed
- **Colors' codes now name a step on a ladder rather than a CSS shorthand.** A
  code is still three digits, one per channel, but each digit is expanded by
  `cssColor` instead of by the browser:

  | digit | `0` | `4` | `8` | `c` | `f` |
  | --- | --- | --- | --- | --- | --- |
  | channel | `00` | `40` | `80` | `BF` | `FF` |

  CSS's own shorthand repeats each digit, so it can only reach `00`, `44`, `88`,
  `CC`, `FF`. Half intensity came out as `77` (119) rather than `80` (128), which
  is why grey was `#777777` and read faintly warm, and why violet could only
  approximate the `#8000FF` it was asked for. The palette now hits violet and
  purple exactly, and lands teal and grey on the CSS-named `#008080` and
  `#808080`.

  Seven codes change to say the same thing on the new ladder — `077`→`088`,
  `707`→`808`, `70f`→`80f`, `730`→`840`, `777`→`888`, `f70`→`f80`, `f7b`→`f8c` —
  and the other eight are untouched, being made only of `0` and `f`. The colours
  themselves shift by 9 to 13 out of 255 where a `7` or `3` was involved, which is
  not visible side by side.

  Those seven codes are the URL value, the sound file name and the settings key at
  once, so a link naming one of them stops matching. Because an unusable parameter
  is ignored rather than applied, `?i=707` opens the full palette rather than a
  broken one, and saved hidden-colour and random-order entries fall back to
  defaults the same way

- **Apps import the shared packages directly, and import blocks are grouped.**
  Extracting `packages/` in 0.19.0 left a one-line re-export at each old path so
  that existing `from './useGame'` imports kept working. That was scaffolding for
  the move, and it outlived the move: fifteen files — `featureFlags.ts`,
  `useGame.ts` and `useFitText.ts`, byte-identical across all five apps — whose
  only content was a re-export. Both routes to the same code were in use, so
  reading an import no longer told you whether it led to app code or shared code.
  They are gone; imports now name the package.

  `audioCache.ts` stays, because it is not a re-export: it passes a per-app
  database name, so one app's 🗑️ cannot clear another's sounds on localhost.

  Import blocks are now ordered stylesheet, external, `@sawt/*`, local, with a
  blank line between groups — previously the workspace packages sat interleaved
  among the local imports in every app

- **Arabic numbers are one voice again, and ten finally says ʿasharah.** The whole
  0–15 run is regenerated with Edge's Hamed — Saudi, formal MSA, the voice Flags
  already uses for country names — replacing the ttsfree recordings for 0–10 and
  the Syrian voice used for 11–12, so the speaker no longer changes part-way
  through counting.

  Ten needed more than a new voice. A final ة is silent in Arabic pause position,
  so عشرة was read as its bare stem ʿashr — masculine to the ear, in the one place
  the number's gender is the whole point. It is now synthesized from عَشَرَةَ while
  the screen still shows عشرة, the same label-versus-pronunciation split Flags uses
  for جَبَل طَارِق. `tools/regen-audio.py` records the voice and that override, and
  reads the words from `src/digits/` so the audio cannot drift from the labels.

  Do not try to verify these files with a checksum: Edge is not deterministic and
  returns a different recording for the same text on every call

- **Colors' purple swatch was named after violet in three languages, and is not violet.**
  It held بنفسجي, Фіолетовий and סגול — each of which names `#8000FF`, a
  blue-leaning spectral violet the palette did not contain until violet was added.
  This swatch is `#800080`, non-spectral purple, so it now reads أرجواني, Пурпуровий and ארגמן,
  and the violet words moved to the swatch they describe. The five affected
  recordings were redone, since a label that disagrees with its sound would break
  the guessing game in exactly those languages.

  German and Swedish were already right and are unchanged: *Lila* is what anyone
  calls `#800080`, while *Purpur* is redder and more literary, and *Violett* was
  free for violet without moving anything. English "purple" simply spans both, which is
  why the mismatch went unnoticed — it is only visible from the other five
  languages. Found while checking what to call magenta, which is a third colour
  again

- **The browser's languages now decide the interface language only, and nothing
  starts hidden.** Week, Numbers, Flags and Colors used to read
  `navigator.languages` and hide every spoken language not in it. A visitor whose
  browser said `en-US` opened Numbers with ten of its eleven languages hidden —
  the app arriving mostly switched off, with no hint that there was more behind
  the settings panel. That is exactly backwards: a browser language list says
  which languages someone *reads*, which is a fair guess for the interface and a
  poor one for what they came to hear. Someone learning Arabic keeps their
  browser in Swedish.

  So the browser is matched against the interface languages only — its primary
  language, then the rest of its list, then English — and every spoken language is
  visible from the first visit. The selected sound follows the interface language
  when we have sounds for it (Swedish interface, Swedish sound) and falls back to
  English otherwise, so a Thai or Greek interface starts on English rather than
  something arbitrary. `preferredLanguage` is renamed `preferredSound` to say what
  it now picks.

  Anthem needed no change and is why the shape was already known to work: its
  sound is a *rendering* (🎺 instrument, 🎤 vocal, 🎼 notes, 🥁 intro), not a
  language, so it never had a spoken-language list for the browser to filter. It
  also lacked a fourth fallback step the other four carried, in which
  `preferredUiLanguage` consulted the *sound* list before settling on English —
  now removed, since it would otherwise have recursed through the new
  `preferredSound`

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
