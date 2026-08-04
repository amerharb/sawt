[![Version](https://img.shields.io/badge/version-0.20.0-blue.svg)](https://github.com/amerharb/anthem)
# Anthem

Small React project to play national anthems and guess the country. Pick an
anthem type (🎺 instrument, 🥁 intro, or the melody played live from notes), then
listen and recognise the country.
Sister project of [Flags](https://github.com/amerharb/flags),
[Colors](https://github.com/amerharb/colors),
[Week](https://github.com/amerharb/week) and
[Numbers](../numbers).

## Countries supported
- Albania 🇦🇱
- Austria 🇦🇹
- Belgium 🇧🇪
- Greece 🇬🇷
- Iraq 🇮🇶
- Lebanon 🇱🇧
- Oman 🇴🇲
- Sweden 🇸🇪
- Switzerland 🇨🇭
- Syria 🇸🇾
- Thailand 🇹🇭
- Turkey 🇹🇷
- United Arab Emirates 🇦🇪
- United States of America 🇺🇸
- Czech Republic 🇨🇿, Denmark 🇩🇰, Egypt 🇪🇬, France 🇫🇷, Germany 🇩🇪,
  Hungary 🇭🇺, Iran 🇮🇷, Italy 🇮🇹, Luxembourg 🇱🇺, Netherlands 🇳🇱,
  Norway 🇳🇴, Palestine 🇵🇸, Poland 🇵🇱, Portugal 🇵🇹, Spain 🇪🇸, Tunisia 🇹🇳,
  Ukraine 🇺🇦, United Kingdom 🇬🇧, Vatican City 🇻🇦
  (beta — visible in development, hidden from production for now)
- More to come, see How to contribute

## Anthem types
- 🎺 **Instrument** — the instrumental anthem (after the intro, when there is one)
- 🎤 **Solo vocal** — the anthem sung by a solo vocalist in its native
  language (choral and other kinds get their own types later)
- 🎼 **Notes (live)** — the melody synthesized in the browser from stored notes,
  a few hundred bytes of text instead of a recording
- 🥁 **Intro** — just the anthem's opening intro
- 🥁🎺 **Intro + Instrument** — the intro straight into the anthem

🥁 only applies to anthems that have a distinct intro, 🎤 to countries with a sung
recording, and 🎼 to those whose melody has been written out; a country without
the selected type is shown disabled rather than hidden.

## Interface languages
- English
- Arabic (عربي)
- German (Deutsch)
- Greek (Ελληνικά)
- Swedish (Svenska)
- Thai (ไทย)
- Turkish (Türkçe)
- Simplified Chinese (简体中文)

Every country's name is translated into all eight, so the cards read in
whichever one is selected. Any UI string missing from a translation falls back
to English.

## How it works
Pick the anthem type from the dropdown in the top right, then click a card to
hear that country's anthem. Each card shows either the country's **flag** or its
**name** — switch between them in settings.

### URL parameters
For a shareable deep link. Every value is checked against what the app actually
has, and a parameter with nothing usable left in it is **ignored** rather than
applied — so a mistyped code cannot leave you with a blank screen.

- `i` — items: which countries are shown, e.g. `?i=sy,iq`
- `l` — interface language, e.g. `?l=ar`
- `s` — sound: which anthem rendering plays — `instrument`, `intro`, `introInstrument`,
  `vocal` or `notes`. Anthem's sound is a single choice with nothing to hide, so
  this takes one value rather than a list
- `t` — theme: `system`, `light` or `dark`

Example: `/?i=sy,iq,se&s=introInstrument&l=ar`

List order does not affect the on-screen order.

You do not have to build these links by hand: **🔗 in the settings panel copies a
link to what you are looking at now** — the visible countries, the rendering, the
interface language and the theme.

Two things are left out on purpose: `i` when nothing is hidden, because "everything"
is what the app shows anyway, and `t` for `system`, which means "follow the device"
rather than a choice worth pinning on someone else's screen.

- Mute (🔊/🔇, right of 🕹️): silences everything — anthems, game prompts and
  feedback sounds — until clicked again.
- Settings (⚙️ top right): theme (system / light / dark, system is the default),
  interface language (👁️ English / عربي), how each card is shown (🏳️ flag or 🔤
  name), how the cards are ordered (⇵ 🌐 by code, 🔤 by name, 🎲 random), a country grid to show/hide countries (with ✅/⬜ select-all/deselect-all
  buttons), a flight mode toggle (✈️), cache info (🔊 count and a 🗑️ clear
  button), and 🔗 to copy a share link to the current settings. Saved in
  localStorage, remembered between visits.
- Flight mode (✈️): downloads all visible anthems to the cache; anything newly
  shown while it is on is downloaded right away. Turning it off keeps the cached
  files.
- Game (🕹️ in the top bar): start a guessing game — a random country's anthem is
  played and you tap the matching card (👍 correct, 👎 wrong). Stuck? The give-up
  button (🤷‍♂️) reveals it (tracked separately from mistakes). It runs through
  every visible country, with your progress (played, mistakes, give-ups, time)
  shown live in the app bar. ⏹️ stops a round that is running and ▶️ starts the next, and
  pressing 🕹️ again leaves game mode. Needs at least one country visible.
- First visit: the interface language comes from your browser's language settings
  (English if we have no dictionary for it). All countries are visible.

## How to contribute
### Media files
Audio lives under `public/sound/` as AAC, one file per recording:

- `anthem/<code>.aac` — the **whole** instrumental recording, intro included.
  The 🥁 / 🎺 / 🥁🎺 renderings are all windows into this single file, so there is
  nothing to split or trim: just set `anthem.intro` (seconds) in the country file
  and the app plays 0 → intro, intro → end, or the whole thing
- `vocal/<code>.aac` — the sung version (only for countries with `hasVocal: true`)

The anthem's words, where they are carried, live outside the bundle at
`public/lyrics/<code>/<language>.txt` — one file per language, listed in
`anthem.lyrics`. Only words old enough to be public domain are included; several
anthems here are still in copyright and `tools/fetch-lyrics.py` refuses those by
name. That script fetches from Wikisource and validates stanza counts before
writing, so a page holding a whole poem rather than the anthem is rejected.

### Coding
Anthem is an open source project built on Vite, React 19, TypeScript v6.x and
npm. All the code is Frontend, no backend needed.

To add a country:
1. Create `src/countries/<code>.ts` exporting a `Country` (`code`, `name`, `flag`,
   `nativeLanguage`, `anthem`) with the name in English and Arabic.
2. If its anthem has a distinct intro, set `anthem.intro` to the second it ends
   (e.g. `intro: 4.3`); leave it out when there is none.
3. Import it and add it to the `ALL_COUNTRIES` array in `src/App.tsx`.
4. Drop the audio at `public/sound/anthem/<code>.aac` (plus `vocal/<code>.aac`
   if a sung recording is available).
5. Optionally set `anthem.score` for the 🎼 melody, and `anthem.lyrics` with the
   languages whose words are on file. `midi/README.md` records where each
   melody was transcribed from and which sources are safe to redistribute.

#### Setup environment
- Node 20.19 or above
- npm 9.x or above
- Install `npm install`
- Build: `npm run build` (output in `dist/`)
- Start dev server: `npm start`
- Preview production build: `npm run preview`

### Deploying
Once a PR is merged to the main branch it is automatically deployed using the
Vercel integration tool with GitHub.

## Credits
### For sound
- National anthem recordings: [Wikimedia Commons](https://commons.wikimedia.org/)
  public-domain uploads, including performances by the United States Navy Band
- 🎼 live melodies: transcribed to notes from public-domain or freely available
  MIDI and published scores — see `midi/README.md` for the per-country sources
