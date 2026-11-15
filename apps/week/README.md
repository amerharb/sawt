[![Version](https://img.shields.io/badge/version-0.57.0-blue.svg)](https://github.com/amerharb/week)
# Week

Small react project that draws the year as one line — the seasons, the months,
the weeks and the days — and says the name of whatever is tapped in the
selected language. Sister project of
[Flag](../flag) and
[Color](../color).

## What it shows
One picture of the current year, laid out like a timeline:

- **The seasons** along the base, by meteorology: whole months, winter from
  December to February in the north. Four markers on them show the days the
  sun turns — the longest day, the shortest day and the two when day and
  night are equal — worked out for the year and dated where you are.
- **The months** on the seasons, January to December, each as wide as its
  days, so February is the short one.
- **The weeks of the year**, numbered, above the months. A year is 52 weeks
  and a day or two, so the first and last week are cut short by New Year and
  shared with the year beside it (drawn dashed).
- **One week**, drawn out of its place through a funnel into its seven days,
  each with its date — about a quarter of a month.
- **A small globe** at the side: tap its northern or southern half and the
  seasons, and which day is the longest, swap.

An arrow under the seasons goes back to the start: the year begins again.
Today is outlined in every row — its day, week, month and season.

Everything with a name has a code, which is also its sound file's name:

- days `1`–`7`, Sunday = `1`
- months `m1`–`m12`, January = `m1`
- seasons `winter`, `spring`, `summer`, `autumn` — a season is the same
  season in the south, drawn over other months

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
Hebrew lay the whole timeline out right to left: January on the right, the
week's days running leftwards, the globe on the right. Arabic names the months
the Levant's way, كانون الثاني to كانون الأول, on screen and in the voice.

## How it works
One dropdown in the top right picks the **sound language** — what is spoken when
you tap a day, a month or a season (and what you guess in the game), plus the
name written in the display.

The names on the timeline follow the **interface language** instead, chosen in
settings (👁️). So you can read the months in English while hearing and learning
them in German. Tap anything with a name to hear it and see it written in the
display; tap it again while it plays to stop. Tap a week, or use ‹ and ›, to
draw that week out into its days. If every sound language is hidden, no sound
plays.

The line is laid out for the width it has, so its writing stays one size on a
phone and a laptop and only *what* is written thins out: on a phone the
months keep their numbers and lose their names, and the days their dates.

- App bar, right to left: the toolbar (🕹️ game, 🔊 mute, language, ⚙️), then
  in a round the round actions, the display and the score — the actions sit
  beside the toolbar so the two things pressed during a round are together.
  Narrow screens stack the bar instead: toolbar, display, score, actions.
- Mute (🔊/🔇, right of 🕹️): silences everything — names, game prompts and
  feedback sounds — until clicked again.
- Settings (⚙️ top right): theme (system / light / dark, system is the default),
  a language checklist to show/hide languages (with ✅/⬜ select-all/deselect-all
  buttons), a "first day of the week" dropdown (📅) that cuts the year into
  weeks beginning on that day, a flight mode toggle (✈️), and cache info (🔊 count
  and a 🗑️ clear button), and under 👤 the account, 🔗 to copy a share link to
  the current settings and 💬 for feedback. Saved in localStorage, remembered
  between visits — and, signed in, kept by baab as well, so they follow the
  player to another device, the courtyard animal with them. The globe's
  hemisphere is kept the same way. Flight mode stays with the device: it is
  about this device's downloads.
- Week numbers: a week that starts on Monday is numbered by ISO 8601, the way
  Sweden and most of Europe count their weeks — 2026 has 53 of them. A week
  that starts on any other day is numbered the way the countries that start it
  on Sunday or Saturday count: week 1 is the week holding 1 January.
- Flight mode (✈️): downloads all visible sounds into the browser's cache
  (IndexedDB) so they play offline; anything newly shown while it is on is
  downloaded right away. Turning it off keeps the cached files (🗑️ clears them).
- Game (🕹️ in the top bar): start a guessing game — a random name is spoken
  in the sound language, a day, a month or a season, and you tap it on the
  timeline (which is written in the interface language) — 👍 correct, 👎
  wrong. A day can be found in whichever week is drawn out. The timeline stays
  as it is (nothing is shuffled). Stuck? The give-up button (🤷‍♂️) reveals it and
  plays a give-up sound (tracked separately from mistakes). It runs through all
  23 names — seven days, twelve months, four seasons — with your progress (played,
  mistakes, give-ups, time) shown live in the app bar next to the round
  buttons. The prompted name is also written in the display segment (even
  while muted), and the 👂 button plays it again. When every name has been played the round is over — the clock
  freezes and the score stays — but game mode stays on: ⏹️ stops a round that is
  running and ▶️ starts the next, and pressing 🕹️ again leaves game mode. Theme, first day and flight mode stay changeable
  mid-game; the language list and the selected languages are locked while a
  round is on and open between rounds (after ⏹️ or when a round finishes). Needs at
  least one language visible.
- Play together (🏟️ **the courtyard**, inside game mode): the same round, on two
  devices at once. Press 🕹️ first — a courtyard is a way of playing, so its two
  doors sit at the head of the round buttons rather than in the toolbar: 🏟️
  opens a room on the spot, 🔢 brings the keypad to type a friend's number
  into. Once you are in, they give way to 🚪 to leave and 🏟️ to bring the
  room's own sheet back — the digits, 🔗, the QR code, the hold switch and who
  is here — which also shows itself when a round ends.
  One child opens a courtyard and gets **six digits** — `004271` — which the
  other types in to come in; 🔗 copies a link that does the same thing from
  another house. The number is read out, so it is six digits rather than four:
  five hundred rooms in a million codes means guessing your way into somebody
  else's game takes about half an hour of solid trying, where four digits would
  take seconds. Type it on the keypad, on a keyboard, or on the number pad your
  phone raises by itself — and the Arabic-Indic digits (`٠٠٤٢٧١`) count as the
  same code, so it can be typed on the keyboard a child actually has. Everyone
  then picks an animal to be (no names, and the only thing anyone types is a
  number they were told). The host presses ▶️ and the same name is asked of
  everyone at once: **the first correct tap wins it**, a wrong tap greys that
  one for you for two seconds, and 🤷‍♂️ is a *vote* — a name is only revealed
  when most of the room agrees. A won item keeps 👍 at its end and **the
  winner's animal at its start**, so a finished year reads as a record of the
  race. One the room gave up wears 🤷‍♂️ and nobody's animal. Whoever wins the
  most gets 🏆; a tie is shared. If a tablet sleeps, its place and score
  are kept for a minute and it walks straight back in. The timeline stays as
  it is in a courtyard too — the one board here that means something in its
  own order. A room with a Week from before the timeline in it, which knows
  only the days, plays the days, and the months and seasons sit dimmed.
  **Whose language?** By default everybody hears the day in **their own**
  selected language, so a child hearing Arabic and a child hearing Swedish can
  race the same round. The host can also hold the room to their own — 🔒
  *Everyone hears mine* — which turns the same timeline into a different
  game: not "find March" in the language you know, but in the one you are
  learning. The panel always says which it is (🔓 or 🔒 with the language
  named), and so does the join screen, before you go in. While a room is held,
  the name on the display follows the language being spoken rather than yours —
  otherwise it would give the answer away. Nobody's settings are changed:
  leaving the courtyard leaves you hearing whatever you chose.
  Leaving game mode with 🕹️ leaves the courtyard too, and so does 🚪. A child
  who arrives on a friend's link is put straight into game mode with the
  keypad already filled in, so they never have to know to press 🕹️ first.
  Multiplayer only appears when the build has a courtyard to connect to
  (`VITE_SAHA_ENABLED` and `VITE_SAHA_URL` in `.env`) and it answers; otherwise
  the app is exactly the single-player app it has always been.
- First visit: the interface language comes from your browser's language settings
  (English if we have no dictionary for it), and the spoken language starts on that
  same language when we have sounds for it. Every spoken language is visible —
  nothing starts hidden.

## Feedback

💬 beside the share link in ⚙️ opens a sheet for telling the developer
something. A dropdown at the top says what kind of thing it is, and the
fields follow from that: **something is wrong** or **something to add** want
a title, and can carry a description, which interface language and which
sound it concerns (or all, or none in particular), which days, months or
seasons, and — for
an addition — a link to a file; **something else** is a message. An email
is optional throughout, for when an answer is wanted. The app adds its own
version and the languages it is set to, so nobody has to type those.

The sheet is its own view — ✕, Escape, or a click anywhere outside closes it
— and it appears only when the app has a collector to send to
(`VITE_SADA_ENABLED` and `VITE_SADA_URL`). What it sends goes to
[sada](https://github.com/amerharb/sada)'s `POST /v1/feedback`,
fire-and-forget like every other post there: "sent" means handed to the
browser, and the note under the thanks says so.

## URL parameters
For a shareable deep link. Every value is checked against what the app actually
has, and a parameter with nothing usable left in it is **ignored** rather than
applied — so a mistyped code cannot leave you with a blank screen.

- `l` — interface language, e.g. `?l=ar`
- `s` — sound: which spoken languages are shown, the **first** selected, e.g. `?s=en,ar`
- `t` — theme: `system`, `light` or `dark`
- `room` — a courtyard's six digits, e.g. `?room=004271`. This is the link 🔗
  copies inside 🏟️: opening it lands on the join screen with the number already
  filled in. It is cleared from the address bar once you are inside, so a reload
  never points at a room that is over. The leading zeros are part of the code,
  so `?room=4271` is not the same room — it is not a room at all.

Example: `/?s=de,en&l=ar&t=dark`

List order does not affect the on-screen order.

You do not have to build these links by hand: **🔗 in the settings panel copies a
link to what you are looking at now** — the spoken languages with the selected one
first, the interface language and the theme. Week has no `i`, since nothing on its
timeline can be hidden.

Two things are left out on purpose: `i` when nothing is hidden, because "everything"
is what the app shows anyway, and `t` for `system`, which means "follow the device"
rather than a choice worth pinning on someone else's screen.

## How to contribute
### Media files
Each day, month and season has one sound file in AAC format per language, with
its spoken name. Audio files live under `public/sound/lang/<lang>/<code>.aac`,
for example `public/sound/lang/en/1.aac` for Sunday in English and
`public/sound/lang/ar/m1.aac` for كانون الثاني in Arabic.

They are recorded by `tools/regen-audio.py`, which reads the words out of the
item files, so a sound cannot drift from the name on screen:

```bash
python3 tools/regen-audio.py sv --only m1-m12,winter   # those, in Swedish
python3 tools/regen-audio.py sv --dry                  # what it would say
```

Record only what is new: Edge does not say the same word the same way twice,
so rerunning a whole language re-rolls recordings that were fine.

### Coding
Week is an open source project built on Vite, React 19, TypeScript v6.x and npm.
All the code is Frontend, no backend needed.

The days (`src/days/`), months (`src/months/`) and seasons (`src/seasons/`)
are one file each, named for the code, with the name in every interface and
every spoken language. The year itself — its weeks, week numbers, seasons and
the sun's four days — is worked out in `src/calendar.ts`, which
`src/calendar.test.ts` pins down (`npm test -w week`).

To add a language:
1. Add its code to the `Language` type in `src/item.ts` — TypeScript will then
   point out every day, month and season missing the new name.
2. Add it to the `LANGUAGE_DEFS` array in `src/App.tsx` and to `SPOKEN_LANGUAGES`
   in `src/settingsStore.ts`, and give it a voice in `tools/regen-audio.py`.
3. Record it: `python3 tools/regen-audio.py <lang>`.

#### Setup environment
- Node 24 or above
- npm 9.x or above
- Install `npm install`
- Build: `npm run build` (output in `dist/`)
- Start dev server: `npm start`
- Preview production build: `npm run preview`

## Credits
### For sound
The names of the days, months and seasons are synthesized with Microsoft Edge
neural text-to-speech voices: English (Ava), Arabic (Fatima, from the
Emirates), German (Katja), Swedish (Sofie), Ukrainian (Polina), Hebrew (Hila),
Greek (Athina) and Turkish (Emel).
The game's correct/wrong/give-up feedback sounds are shared with the
[Color](../color) and
[Flag](../flag) sister projects.
