[![Version](https://img.shields.io/badge/version-0.32.0-blue.svg)](https://github.com/amerharb/anthem)
# Anthem

Small React project to play national anthems and guess the country. Pick an
anthem type (🎺 instrument, 🥁 intro, or the melody played live from notes), then
listen and recognise the country.
Sister project of [Flag](../flag),
[Color](../color),
[Week](https://github.com/amerharb/week) and
[Number](../number).

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
- 🎤 **Solo vocal** — the anthem sung by one singer in its native language
- 👥 **Choir** — the anthem sung by a chorus
- 🎼 **Notes (live)** — the melody synthesized in the browser from stored notes,
  a few hundred bytes of text instead of a recording
- 🥁 **Intro** — just the anthem's opening intro
- 🥁🎺 **Intro + Instrument** — the intro straight into the anthem

🥁 only applies to anthems that have a distinct intro, 🎤 and 👥 to countries with
that kind of sung recording, and 🎼 to those whose melody has been written out; a
country without the selected type is shown disabled rather than hidden.

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
  `vocal`, `choral` or `notes`. Anthem's sound is a single choice with nothing to hide, so
  this takes one value rather than a list
- `t` — theme: `system`, `light` or `dark`
- `room` — a courtyard's four animals, written as letters, e.g. `?room=BKQF`.
  This is the link 🔗 copies inside 🏟️: opening it lands on the join keypad
  with those four already tapped in. It is cleared from the address bar once
  you are inside, so a reload never points at a room that is over.

Example: `/?i=sy,iq,se&s=introInstrument&l=ar`

List order does not affect the on-screen order.

You do not have to build these links by hand: **🔗 in the settings panel copies a
link to what you are looking at now** — the visible countries, the rendering, the
interface language and the theme.

Two things are left out on purpose: `i` when nothing is hidden, because "everything"
is what the app shows anyway, and `t` for `system`, which means "follow the device"
rather than a choice worth pinning on someone else's screen.

- App bar, right to left: the toolbar (🕹️ game, 🔊 mute, language, ⚙️), then
  in a round the round actions, the display and the score — the actions sit
  beside the toolbar so the two things pressed during a round are together.
  Narrow screens stack the bar instead: toolbar, display, score, actions.
- Mute (🔊/🔇, right of 🕹️): silences everything — anthems, game prompts and
  feedback sounds — until clicked again.
- Settings (⚙️ top right): theme (system / light / dark, system is the default),
  interface language (👁️ English / عربي), how each card is shown (🏳️ flag or 🔤
  name), how the cards are ordered (⇵ 🌐 by code, 🔤 by name, 🎲 random),
  **round length** (🏁 10 · 20 · 50 · ∞), a country grid to show/hide countries
  (with ✅/⬜ select-all/deselect-all buttons and ➕/➖ menus that add or remove a
  whole group at once), a flight mode toggle (✈️), cache info (🔊 count and a 🗑️
  clear button), and 🔗 to copy a share link to the current settings. Saved in
  localStorage, remembered between visits.
- Round length (🏁): how many anthems one round asks before it ends — 20 by
  default, ∞ for the whole board. A round deals a hand of that size; the
  number can be changed in game mode between rounds, but not while one is
  running.
- Groups (➕/➖ beside the country grid): add or remove a whole set of countries
  in one tap — the six continents, or one of nineteen regions. The regions
  overlap on purpose and do not cover the world; they are a way of choosing,
  not a taxonomy.
- Flight mode (✈️): downloads all visible anthems to the cache; anything newly
  shown while it is on is downloaded right away. Turning it off keeps the cached
  files.
- Game (🕹️ in the top bar): start a guessing game — a random country's anthem is
  played and you tap the matching card (👍 correct, 👎 wrong). Stuck? The give-up
  button (🤷‍♂️) reveals it (tracked separately from mistakes). It runs through
  every visible country, with your progress (played, mistakes, give-ups, time)
  shown live in the app bar. ⏹️ stops a round that is running and ▶️ starts the next, and
  pressing 🕹️ again leaves game mode. Needs at least one country visible.
- Play together (🏟️ **the courtyard**, inside game mode): the same round, on two
  devices at once. Press 🕹️ first — a courtyard is a way of playing, so it sits
  at the head of the round buttons rather than in the toolbar.
  One child opens a courtyard and gets **four animals** — 🐘🦆🦋🦌 — which the
  other taps on a keypad to come in; 🔗 copies a link that does the same thing
  from another house. Everyone picks an animal to be (no names, no typing, and
  nothing to type into). The host presses ▶️ and the same anthem plays for
  everyone at once: **the first correct tap wins it**, a wrong tap greys that
  card for you for two seconds, and 🤷‍♂️ is a *vote* — a country is only
  revealed when most of the room agrees. A won card keeps 👍 in its top corner
  and **the winner's animal in the other**. A country the room gave up wears 🤷‍♂️
  and nobody's animal. Whoever wins the most gets 🏆; a tie is shared. If a
  tablet sleeps, its place and score are kept for a minute and it walks
  straight back in. The board is dealt from the countries everyone in the room
  can actually play, and it is as long as the **host's** round length — the
  room keeps that number for every rematch, which is why the 🏁 buttons rest
  while you are in one.
  **Whose rendering?** By default everybody hears the anthem in **their own**
  selected rendering, so one child can be learning it from 🎺 the recording
  while another hears 🎼 the written melody. The host can also hold the room to
  their own — 🔒 *Everyone hears mine* — and the panel always says which it is
  (🔓 or 🔒 with the rendering named), on the join screen too, before you go in.
  Nothing on screen has to follow it here: a card is a flag or a name either
  way, and the display stays blank during a round so the anthem never gives the
  country away. Nobody's settings are changed: leaving the courtyard leaves you
  hearing whatever you chose.
  Leaving game mode with 🕹️ leaves the courtyard too. A child who arrives on a
  friend's link is the one exception: the invitation brings its own 🏟️ to the
  toolbar, so they never have to know to press 🕹️ first.
  Multiplayer only appears when the build has a courtyard to connect to
  (`VITE_SAHA_ENABLED` and `VITE_SAHA_URL` in `.env`) and it answers; otherwise
  the app is exactly the single-player app it has always been.
- First visit: the interface language comes from your browser's language settings
  (English if we have no dictionary for it). All countries are visible.

## Bringing a country out of beta

A country added in bulk arrives with a recording and its names, and nothing else —
`beta: true` keeps it out of production until it has been worked through. Seven
steps, in this order, because each one settles a question the next depends on:

1. **A reference recording** — Wikipedia and the Commons category for the anthem,
   so there is something authoritative to compare against.
2. **Listen to what the app already plays.** Length, where the music starts and
   ends, any internal silences.
3. **Find the intro.** `silencedetect` finds a gap if there is one, but a gap is
   not proof: several of these turned out to be strain boundaries inside the
   melody. Cut candidates and decide by ear.
4. **Find a melody source, and check its licence.** A monophonic MIDI is worth far
   more than a good-sounding arrangement — see `midi/README.md`. Public-domain
   files are committed; anything else stays local and gitignored, with only the
   transcribed notes shipping.
5. **Write the score.** Get the key from the *recording*, measured from
   fundamentals rather than a chroma histogram, which has misread one already.
   Transpose the source to match, set the tempo against the recording's length,
   and listen before accepting.
6. **Look for a sung recording.** 🎤 for one singer, 👥 for a choir. Public domain
   only.
7. **Fetch the lyrics** with `tools/fetch-lyrics.py`, if the words are out of
   copyright. Do this last: it is independent of everything above, and the
   copyright question is about the *poet*, not the recording.

Then drop `beta: true`.

## How to contribute
### Media files
Audio lives under `public/sound/` as AAC, one file per recording:

- `anthem/<code>.aac` — the **whole** instrumental recording, intro included.
  The 🥁 / 🎺 / 🥁🎺 renderings are all windows into this single file, so there is
  nothing to split or trim: just set `anthem.intro` (seconds) in the country file
  and the app plays 0 → intro, intro → end, or the whole thing
- `vocal/<code>.aac` — sung by one singer (countries with `hasVocal: true`)
- `choral/<code>.aac` — sung by a chorus (countries with `hasChoral: true`)

The anthem's words, where they are carried, live outside the bundle at
`public/lyrics/<code>/<language>.txt` — one file per language, listed in
`anthem.lyrics`. Only words old enough to be public domain are included, and
several anthems here are still in copyright.

`tools/fetch-lyrics.py` fetches them from Wikisource. It works from an allowlist
rather than a blocklist: a country it has never been told about is refused, and
adding one means recording the author and their death year. A blocklist would
fail open — a country nobody thought about would sail through — whereas this way
adding a country forces someone to look the term up.

It also checks the stanza count. Several of these pages carry a whole poem when
the anthem is only its first stanza, which is exactly what the Czech act says of
*Kde domov můj*, so a page that comes back the wrong shape is rejected rather
than written.

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

Everything above is public domain and needs no attribution. These recordings are
freely licensed but **not** public domain, so the credit below is a condition of
using them and has to travel with the app:

- 👥 United Kingdom —
  ["God Save The King (Royal Exchange 2022)"](https://commons.wikimedia.org/wiki/File:God_Save_The_King_(Royal_Exchange_2022).wav)
  by Alison Pope, [CC BY 2.0](https://creativecommons.org/licenses/by/2.0/)
