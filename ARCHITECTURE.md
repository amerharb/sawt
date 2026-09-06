# How a sawt app is built

The [README](README.md) covers the workspace: what the apps are, how to run
them, how each one deploys. This file covers the part that is the same in all
of them — the shape every learning app has, the code they share, and the
conventions that make a new one a day's work rather than a rewrite.

**Colour is the example throughout.** It is the smallest complete app: fifteen
colours, six spoken languages, no maps and no anthems. Everything here is true
of the others; where an app differs, it says so.

---

## 1. What every app is

Point at a thing, hear its name in the language you are learning, then find it
by ear. That is the whole product, and it has three modes.

**Learn** — the default. The board is a grid of cards; tapping one plays its
name and writes it in the display. Nothing is scored, nothing is hidden.

**Game** (🕹️) — the same board, but a name is spoken and you tap the card it
belongs to. 👍 correct, 👎 wrong, 🤷‍♂️ gives up and reveals. A round ends when
it has asked its targets; game mode stays on so ▶️ can deal another.

**Courtyard** (🏟️, inside game mode) — the same round, on two devices at once,
against a friend. The board and every verdict come from
[saha](#11-the-courtyard-userace-and-saha); the first correct tap wins the card.

The app bar carries four segments, right to left: the **toolbar** (🕹️, 🔊,
the sound picker, ⚙️), the **display** (what was just spoken), and — in game
mode only — the **score** and the **round actions**. Narrow screens stack them
top to bottom in the same order, so the buttons pressed during a round end up
nearest the board.

---

## 2. An app, file by file

```
apps/color/
├─ public/
│  ├─ sound/lang/<language>/<code>.aac    the words
│  ├─ sound/fx/*.aac                      correct, wrong, giveup, complete, stopped, taken
│  ├─ favicon.svg · manifest.json · robots.txt
├─ src/
│  ├─ App.tsx            the whole app: state, wiring, board
│  ├─ App.css            the board's own layout
│  ├─ index.css          everything else, including the shared 🏟️ styles
│  ├─ colors/            the content: Color.ts + one file per colour
│  ├─ i18n/              en.json … zh.json + index.ts (translator)
│  ├─ settingsStore.ts   the Settings type, defaults, localStorage, theme
│  ├─ SettingsPanel.tsx  ⚙️ — every choice the app offers
│  ├─ GameHud.tsx        a two-line re-export of the shared HUD
│  ├─ useAudio.ts        one <audio> element, mute, the fx sounds
│  ├─ audioCache.ts      this app's IndexedDB database
│  └─ index.tsx          mount
├─ vite.config.ts        port 3000, __APP_VERSION__ from package.json
├─ vercel.json           framework + output dir (and any host redirect)
└─ README.md             what this app teaches, and its own history
```

`App.tsx` is deliberately one file. It holds the settings state, the content
lists, the two hooks (`useGame`, `useRace`) and the board, in that order, so a
reader follows the data downwards without jumping between files. Colour's is
~540 lines; Flag's is ~760, most of it a list of two hundred imports.

**Why some things are shared and some are not.** `useAudio`, `settingsStore`
and `SettingsPanel` read as near-copies across the apps, and they stay
per-app: each has diverged enough — Anthem plays clips with start/end windows,
Verb has a moment switch, Map has zoom-to-fit — that merging them would mean a
parameter for every difference. `audioCache.ts` is per-app for a harder
reason: each app owns its own IndexedDB database, so one app's 🗑️ must not
clear another's sounds while they share `localhost` in development.

---

## 3. Content: an item

Every app teaches a list of items, and an item is always the same shape:

```ts
// apps/color/src/colors/f00.ts
export const red: Color = {
	code: 'f00',
	name: { en: 'Red', ar: 'أحمر', de: 'Rot', sv: 'Röd', uk: 'Червоний', he: 'אדום' },
}
```

The **code** is the item's identity everywhere: the sound file's name
(`/sound/lang/en/f00.aac`), the value in a share link (`?i=f00,0f0`), what
travels to sada and saha. Codes are lowercase letters, digits and hyphens —
that is not style, it is what the two servers accept.

The **name** is a record keyed by *sound* language. It is what the display
shows and what `sortMode: 'name'` sorts by.

`beta?: true` keeps an item out of production builds — see
[§8](#8-beta-what-is-not-ready-yet).

One file per item, one item per file, named for the code. Colour's codes are
three channel digits (`f00` is red, `808` purple); Flag and Map use ISO 3166
alpha-2; Week uses `1`–`7`; Number `0`–`15`; Verb the verb itself (`eat`).

---

## 4. Sound

Every spoken word is one AAC file at a path built from the code:

```
public/sound/lang/<sound language>/<code>.aac      red in Swedish → lang/sv/f00.aac
public/sound/fx/<name>.aac                         correct · wrong · giveup · complete · stopped · taken
```

Apps that have more than one *kind* of sound extend the path rather than the
convention: Verb inserts the moment (`lang/en/did/eat.aac`), Anthem drops the
language entirely (`sound/anthem/<code>.aac`, plus `vocal/` and `choral/`)
because an anthem is a rendering, not a translation.

Recordings are made with edge-tts (`tools/regen-audio.py` in the apps that
have one). It is **non-deterministic**: the same script run twice gives
different bytes, so a checksum proves nothing and the only real verification
is listening.

**The cache.** `audioCache.ts` calls `createAudioCache(dbName, cacheVersion)`
from `@sawt/audio-cache`, which stores blobs in IndexedDB — playback reads
from there and falls back to the network, which is also what makes the app
work in Safari's Lockdown Mode. Two rules:

- **Flight mode** (✈️ in ⚙️) downloads everything currently visible, and
  anything that becomes visible while it is on.
- **`cacheVersion`** is the only way to replace a file that already exists at
  the same path. Re-record `f00.aac` and every cached copy is stale; raising
  the number retires the old database. One raise per version, not per edit.

---

## 5. The shared packages

`packages/` ships TypeScript source rather than a build — Vite transpiles it
with the app that imports it, so there is no build step to keep in sync. Apps
import them directly (`from '@sawt/game'`), never through a local re-export.

| package | what it is |
| --- | --- |
| `@sawt/audio-cache` | `createAudioCache(db, version)` → the IndexedDB store |
| `@sawt/feature-flags` | `isVisible`, `SHOW_BETA`, the `VITE_SHOW_BETA` gate |
| `@sawt/game` | `useGame`, `useRace`, the HUDs, and the sada + saha clients |
| `@sawt/order` | `shuffle`, `sortByCodeOrName` |
| `@sawt/ui` | `useFitText`, `useCopyLink` + `COPY_ICON` |
| `@sawt/url-state` | `readUrlParams`, `writeUrlParams`, `hiddenFrom` |
| `@sawt/world` | six continents, nineteen regions, and the grouping helpers |

Every app must declare the packages it uses as real dependencies in its own
`package.json`. That graph is how Vercel decides which projects a commit
affects — a package imported but not declared would leave apps un-rebuilt when
it changes.

---

## 6. Settings, storage and links

`settingsStore.ts` owns one type and one localStorage key:

```ts
export type Settings = {
	theme: Theme,                 // system · light · dark
	uiLanguage: UiLanguage,       // the interface, independent of the sound
	hiddenLanguages: Language[],  // empty means show everything…
	hiddenColors: string[],       // …so new content is visible by default
	flightMode: boolean,
	sortMode: SortMode,           // code · name · random
	randomOrder: string[],        // frozen, and covers hidden items too
}
```

Everything is stored as **one JSON blob** under a single key
(`color:settings`), so a new setting never needs a new storage key or a
migration. Hidden-by-exception is deliberate: a newly added colour appears for
everyone who has ever used the app, rather than staying invisible because
their saved settings predate it.

**URL parameters** are the shareable form of the same state, read by
`@sawt/url-state` and validated against what the app actually has — anything
unusable is *ignored*, never applied, so a mistyped code cannot leave a child
with a blank screen:

| | |
| --- | --- |
| `i` | items shown — `?i=f00,0f0,00f` |
| `s` | sound languages, **first one selected** — `?s=de,en` |
| `l` | interface language — `?l=ar` |
| `t` | theme — `system` · `light` · `dark` |
| `room` | a courtyard's six digits — `?room=350895` |

🔗 in ⚙️ writes one of these for what is on screen right now. Two things are
left out on purpose: `i` when nothing is hidden, and `t` for `system` —
"follow the device" is not a choice worth pinning on someone else's screen.

---

## 7. Two languages, always

Every app separates the **interface language** (button labels, ⚙️, tooltips)
from the **sound language** (what the item is called). A child can read the
app in Arabic while learning colours in Swedish.

The interface lives in `src/i18n/*.json` — flat `"key": "text"` dictionaries,
one per language, plus `index.ts` with `translator(lang)`. The lookup falls
back twice: the chosen language, then English, then the key itself. That last
step is load-bearing — `errorText` in the courtyard uses "did the translator
hand the key back?" to tell a message it knows from one it does not.

`languageName(t, code, native)` names a *content* language in the interface
language ("Arabic" / "Arabisch"), falling back to its own native spelling.

Colour ships eight interface languages (en ar de el sv th tr zh) and six sound
languages; Week has a ninth interface dictionary (Hebrew). Adding a key means
adding it to every dictionary in that app — `en.json` is the full key set.

---

## 8. Beta: what is not ready yet

```ts
export const flagOfNowhere = { code: 'xx', name: {…}, beta: true }
```

`isVisible(item)` from `@sawt/feature-flags` filters those out of production
builds and keeps them in dev ones. `SHOW_BETA` is true when
`import.meta.env.DEV` or the build was made with `VITE_SHOW_BETA=true`, so a
preview deploy can show everything.

It applies to anything with the field: an item, a language, an anthem type, a
home-page tile. The rule is that an unfinished thing is *visible while
developing and absent in production* — never half-drawn in front of a child.

---

## 9. The game: `useGame`

The app hands `useGame` the pieces only it knows, and gets back the round.

```ts
const game = useGame<Color>({
	canPlay: LANGUAGES.length > 0 && COLORS.length > 0,
	buildBoard: () => shuffle(COLORS),          // the board for a new round
	promptUrl: c => colorUrl(c.code),           // what to play for an item
	preload: async urls => { await ensureCached(urls) },
	audio,                                      // play, stop, fx, unlock
	mode: lang,                                 // labels the round in its result
	app: 'color',                               // the collector's slug
	roundSize: settings.roundLength,            // 0 or absent = the whole board
	enterOnMount: Boolean(INVITED_TO),          // a ?room= link opens game mode
	onRoundStart: () => setName(''),
})
```

Back: `gameOn`, `board`, `target`, `solved`, `wrongGuesses`, `gaveUpCodes`,
`mistakes`, `giveUps`, `total`, `elapsedMs`, `preparing`, `feedback`,
`results`, and the verbs — `enterGame`, `startRound`, `stopRound`,
`exitGame`, `toggleRound`, `guess`, `giveUp`, `replay`, `sweepSolved`.

Three details that are easy to get wrong:

- **🕹️ enters game mode without starting a round.** The board shows and the
  clock reads 0; ▶️ deals the first round. That pause is where pre-round
  settings live.
- **`preparing`** is true while the round's sounds are being cached. The
  toggle shows ⏳ and the whole thing is guarded by `try/finally`, because a
  hung IndexedDB request once left an app on ⏳ until reload.
- **`total`** is the score's denominator: `min(roundSize, board length)`,
  frozen when the round starts so a mid-round settings change cannot bend a
  running round.

A second prompt type is supported for apps whose prompt is not a URL: Anthem
passes `useGame<Country, Clip>` plus `urlsOf`, because a clip can be a window
into a shared recording, or a synthesized score with no file at all.

---

## 10. The board

The board renders from one array and four booleans per card. Colour:

```tsx
{board.map(c => {
	const isGivenUp = !racing && game.gameOn && game.gaveUpCodes.includes(c.code)
	const isSolved  = (racing || game.gameOn) && solved.includes(c.code) && !isGivenUp
	const isWrong   = (racing || game.gameOn) && wrongs.includes(c.code)
	…
})}
```

`solved` / `wrongs` are the *merged* view — the solo game's when playing
alone, the room's when racing — which is what keeps one board serving all
three modes. A settled card wears 👍 (or 🤷‍♂️), and in a courtyard the winner's
animal in the opposite corner.

---

## 11. The courtyard: `useRace` and saha

`useRace` is `useGame` turned inside out. Where `useGame` *is* a state
machine, `useRace` **receives** one: the server owns the board, the order and
every verdict, and this hook holds a socket and speaks each target aloud in
whatever language this child chose. That asymmetry is the only way two
children hearing different languages can play the very same round.

```ts
const race = useRace({
	app: 'color',
	playable: () => COLORS.map(c => c.code),  // what this child can hear
	promptUrl: colorUrl,                      // (code, sound?) — honour the room's
	preload, audio,
	mode: lang,                               // posted as `race:<mode>`
	sound: lang,                              // what a host may hold the room to
	roundSize: settings.roundLength,          // Flag and Anthem pass theirs
})
```

Rules worth knowing before touching it:

- **The wire carries only item codes.** The server has no idea whether `f00`
  is a colour, a flag or a verb.
- **A room can be held to one sound** — the *host's own*, never a nominated
  one, so the board can never be dealt for a sound nobody has. When held, the
  audio *and* the name on the display follow the room: a race heard in Arabic
  whose display read "Blå" would hand the answer to whoever can read.
- **A sound id is lowercase, digits and hyphens.** Anthem's renderings travel
  kebab-cased (`introInstrument` → `intro-instrument`), Verb sends a pair
  (`en-did`). Every id is read back through the app's own list, so one no
  build knows names nothing rather than putting a stranger's word on screen.
- **A wrong tap locks the player for two seconds on the server**, while the
  client greys only the card that was tapped.
- **Nothing appears unless it is configured and answering.** `VITE_SAHA_ENABLED`
  and `VITE_SAHA_URL` in the app's committed `.env`, a `/health` probe cached
  ten minutes, and a version floor — an older server leaves 🏟️ simply absent.

Kid-safety is a property of the design, not a setting: no accounts, no names,
no free text between children. A room is six digits; a player is an emoji
chosen by *index* from a palette the server owns.

---

## 12. The collector: sada

`packages/game/src/sada.ts` posts finished rounds and language switches to
[sada](https://github.com/amerharb/sada), gated exactly like saha:
`VITE_SADA_ENABLED` + `VITE_SADA_URL`, `/health` probed at most every ten
minutes, every send fire-and-forget with `keepalive`. Two endpoints:
`POST /v1/rounds` and `POST /v1/settings`. A courtyard round posts like any
other, labelled `race:<mode>` so it can be told apart from a child playing
alone. Nothing in sawt ever *reads* from sada.

---

## 13. The three repos

| repo | what it is |
| --- | --- |
| **sawt** (صوت, the voice) | this one — the apps, frontend only |
| **sada** (صدى, the echo) | rounds and language pings; Rust/Axum on Fly.io + Postgres, and its own dashboard |
| **saha** (ساحة, the courtyard) | the multiplayer rooms; Rust/Axum, no database, one machine |

saha must run on **exactly one** Fly machine (`fly scale count 1`,
`auto_stop_machines = 'off'`): rooms live in one process's memory, so a second
machine or a scale-to-zero sleep loses games.

---

## 14. Adding things

**An item** — one file in the content folder, one line in the app's
`ALL_*` list, one sound file per language, and a row in the app's README
table. It appears for everyone the moment it ships, because hiding is by
exception.

**A sound language** — add the code to the app's `Language` union
(TypeScript then points at every gap), add it to `LANGUAGE_DEFS` with its
native name, record every item, and add `language.<code>` to the i18n
dictionaries so it can be named in the interface.

**An interface language** — a new `src/i18n/<code>.json` with the full key
set from `en.json`, plus its entry in `UI_LANGUAGES` and the `UiLanguage`
union.

**A whole app** — copy the closest existing one, then:

1. `apps/<name>/package.json` with a unique `name` and the shared packages it
   actually imports, declared as dependencies.
2. `.env` with the sada (and, if it has a courtyard, saha) switch and URL.
3. `vercel.json`, a README with a version badge, and a tile in
   `apps/home/src/apps.ts` (`beta: true` until its subdomain answers).
4. A Vercel project — Root Directory, install command, domain. See the
   [README](README.md#deploying-one-vercel-project-per-app-one-repo).

---

## 15. Version, changelog, CI

**One version covers the repository.** All seventeen `package.json` files,
the lockfile and the nine README badges carry the same number, and
[CHANGELOG.md](CHANGELOG.md) has one section per version.

The section for the version being worked on is `## [X.Y.Z] (unreleased)` with
its body inside an HTML comment — working notes, deployment pendings, and a
carried ledger of content state, traps and dead ends. Publishing turns that
comment into prose: a dated header, an intro, `### Added` / `### Changed` /
`### Fixed`, and visible deployment notes. The ledger **moves** to the next
version's unreleased section rather than being copied, so there is exactly one
copy of it in the file at any time.

**Every gate CI runs, in order** ([ci.yml](.github/workflows/ci.yml), Node 24):

```bash
npm ci                              # lockfile-strict
npm run typecheck                   # tsc --noEmit across every workspace
npx eslint . --max-warnings 24      # the ratchet: one more finding fails
npm test                            # vitest in packages/game and packages/world
npm run build                       # all nine apps
```

The **24** is today's accepted `react-hooks/set-state-in-effect` debt, kept
visible as warnings; fixing some means lowering the cap so they cannot creep
back. House style is enforced rather than agreed: tabs, single quotes, no
semicolons, trailing commas in multiline.

One trap worth carrying: a test that touches browser globals must declare
`// @vitest-environment jsdom`. Node 26 ships `sessionStorage` and CI's Node 24
does not, so the default node environment passes locally and fails there —
`NODE_OPTIONS=--no-experimental-webstorage` reproduces CI.
