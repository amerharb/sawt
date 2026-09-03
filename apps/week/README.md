[![Version](https://img.shields.io/badge/version-0.32.0-blue.svg)](https://github.com/amerharb/week)
# Week

Small react project to show the days of the week (as numbered cards) and display
the day name in the selected language. Sister project of
[Flag](../flag) and
[Color](../color).

## Days supported
- Sunday `1`
- Monday `2`
- Tuesday `3`
- Wednesday `4`
- Thursday `5`
- Friday `6`
- Saturday `7`

Days are numbered 1–7 starting on Sunday; the number is the card face and the
sound file name.

## Languages supported
Spoken (what you hear and guess):
- English
- Arabic
- German
- Swedish
- Ukrainian
- Hebrew
- Greek
- Turkish

The interface is separately available in nine languages: English, Arabic,
German, Greek, Swedish, Thai, Turkish, Simplified Chinese and Hebrew. Arabic and
Hebrew lay the week out right-to-left, so the first day sits on the right.

## How it works
One dropdown in the top right picks the **sound language** — what is spoken when
you click a card (and what you guess in the game), plus the name written under
the cards on click.

The day names on the cards follow the **interface language** instead, chosen in
settings (👁️). So you can read the days in English while hearing and learning
them in German. Click a day card to hear its name and see it written below;
click the card again (▶ while it plays) to stop. If every sound language is
hidden, no sound plays.

When the interface language is right-to-left (Arabic), the day cards are laid
out right-to-left as well, so the week reads in that language's direction — the
first day of the week on the right.

- App bar, right to left: the toolbar (🕹️ game, 🔊 mute, language, ⚙️), then
  in a round the round actions, the display and the score — the actions sit
  beside the toolbar so the two things pressed during a round are together.
  Narrow screens stack the bar instead: toolbar, display, score, actions.
- Mute (🔊/🔇, right of 🕹️): silences everything — names, game prompts and
  feedback sounds — until clicked again.
- Settings (⚙️ top right): theme (system / light / dark, system is the default),
  a language checklist to show/hide languages (with ✅/⬜ select-all/deselect-all
  buttons), a "first day of the week" dropdown (📅) that rotates the cards to
  start on the chosen day, a flight mode toggle (✈️), and cache info (🔊 count
  and a 🗑️ clear button), and 🔗 to copy a share link to the current settings.
  Saved in localStorage, remembered between visits.
- Flight mode (✈️): downloads all visible sounds into the browser's cache
  (IndexedDB) so they play offline; anything newly shown while it is on is
  downloaded right away. Turning it off keeps the cached files (🗑️ clears them).
- Game (🕹️ in the top bar): start a guessing game — a random day name is spoken
  in the sound language and you tap the matching card (which shows the display
  language) — 👍 correct, 👎 wrong. The cards stay in week order (they are not
  shuffled). Stuck? The give-up button (🤷‍♂️) reveals it and
  plays a give-up sound (tracked separately from mistakes). It runs through every
  day, with your progress (played,
  mistakes, give-ups, time) shown live in the app bar next to the round
  buttons. The prompted name is also written in the display segment (even
  while muted), and the 👂 button plays it again. When every day has been played the round is over — the clock
  freezes and the score stays — but game mode stays on: ⏹️ stops a round that is
  running and ▶️ starts the next, and pressing 🕹️ again leaves game mode. Theme, first day and flight mode stay changeable
  mid-game; the language list is locked, and the selected languages can be
  changed only between rounds (after ⏹️ or when a round finishes). Needs at
  least one language visible.
- Play together (🏟️ **the courtyard**, inside game mode): the same round, on two
  devices at once. Press 🕹️ first — a courtyard is a way of playing, so it sits
  at the head of the round buttons rather than in the toolbar.
  One child opens a courtyard and gets **four animals** — 🐘🦆🦋🦌 — which the
  other taps on a keypad to come in; 🔗 copies a link that does the same thing
  from another house. Everyone picks an animal to be (no names, no typing, and
  nothing to type into). The host presses ▶️ and the same day is asked of
  everyone at once: **the first correct tap wins it**, a wrong tap greys that
  card for you for two seconds, and 🤷‍♂️ is a *vote* — a day is only revealed
  when most of the room agrees. A won card keeps 👍 in its top corner and **the
  winner's animal in the other**, so a finished week reads as a record of the
  race. A day the room gave up wears 🤷‍♂️ and nobody's animal. Whoever wins the
  most days gets 🏆; a tie is shared. If a tablet sleeps, its place and score
  are kept for a minute and it walks straight back in. The cards stay in week
  order in a courtyard too — the week is the one board here that means
  something in its own order.
  **Whose language?** By default everybody hears the day in **their own**
  selected language, so a child hearing Arabic and a child hearing Swedish can
  race the same round. The host can also hold the room to their own — 🔒
  *Everyone hears mine* — which turns the same seven cards into a different
  game: not "find Tuesday" in the language you know, but in the one you are
  learning. The panel always says which it is (🔓 or 🔒 with the language
  named), and so does the join screen, before you go in. While a room is held,
  the name on the display follows the language being spoken rather than yours —
  otherwise it would give the answer away. Nobody's settings are changed:
  leaving the courtyard leaves you hearing whatever you chose.
  Leaving game mode with 🕹️ leaves the courtyard too. A child who arrives on a
  friend's link is the one exception: the invitation brings its own 🏟️ to the
  toolbar, so they never have to know to press 🕹️ first.
  Multiplayer only appears when the build has a courtyard to connect to
  (`VITE_SAHA_ENABLED` and `VITE_SAHA_URL` in `.env`) and it answers; otherwise
  the app is exactly the single-player app it has always been.
- First visit: the interface language comes from your browser's language settings
  (English if we have no dictionary for it), and the spoken language starts on that
  same language when we have sounds for it. Every spoken language is visible —
  nothing starts hidden.

## URL parameters
For a shareable deep link. Every value is checked against what the app actually
has, and a parameter with nothing usable left in it is **ignored** rather than
applied — so a mistyped code cannot leave you with a blank screen.

- `l` — interface language, e.g. `?l=ar`
- `s` — sound: which spoken languages are shown, the **first** selected, e.g. `?s=en,ar`
- `t` — theme: `system`, `light` or `dark`
- `room` — a courtyard's four animals, written as letters, e.g. `?room=BKQF`.
  This is the link 🔗 copies inside 🏟️: opening it lands on the join keypad
  with those four already tapped in. It is cleared from the address bar once
  you are inside, so a reload never points at a room that is over.

Example: `/?s=de,en&l=ar&t=dark`

List order does not affect the on-screen order.

You do not have to build these links by hand: **🔗 in the settings panel copies a
link to what you are looking at now** — the spoken languages with the selected one
first, the interface language and the theme. Week has no `i`, since its seven days
are fixed.

Two things are left out on purpose: `i` when nothing is hidden, because "everything"
is what the app shows anyway, and `t` for `system`, which means "follow the device"
rather than a choice worth pinning on someone else's screen.

## How to contribute
### Media files
Each day has one sound file in AAC format per language, with the spoken day name.
Audio files live under `public/sound/lang/<lang>/<code>.aac`, for example
`public/sound/lang/en/1.aac` for Sunday in English (the `<code>` is the day's
number, 1–7).

### Coding
Week is an open source project built on Vite, React 19, TypeScript v6.x and npm.
All the code is Frontend, no backend needed.

To add a day (already all seven, but for reference):
1. Create `src/days/<code>.ts` exporting a `Day` (`code`, `name`) with the name
   in every supported language.
2. Import it and add it to the `ALL_DAYS` array in `src/App.tsx`.
3. Drop the audio files at `public/sound/lang/<lang>/<code>.aac`.

To add a language:
1. Add its code to the `Language` type in `src/days/Day.ts` — TypeScript will then
   point out every day file missing the new name.
2. Add it to the `LANGUAGE_DEFS` array in `src/App.tsx` and to `SPOKEN_LANGUAGES`
   in `src/settingsStore.ts`.
3. Drop the audio files at `public/sound/lang/<lang>/<code>.aac`.

#### Setup environment
- Node 20.19 or above
- npm 9.x or above
- Install `npm install`
- Build: `npm run build` (output in `dist/`)
- Start dev server: `npm start`
- Preview production build: `npm run preview`

## Credits
### For sound
Day name pronunciations synthesized with Microsoft Edge neural text-to-speech
voices: English (Ava), Arabic (Amany), German (Katja), Swedish (Sofie),
Ukrainian (Polina), Hebrew (Hila), Greek (Athina) and Turkish (Emel).
The game's correct/wrong/give-up feedback sounds are shared with the
[Color](../color) and
[Flag](../flag) sister projects.
