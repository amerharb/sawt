[![Version](https://img.shields.io/badge/version-0.30.0-blue.svg)](https://github.com/amerharb/sawt)
# Number

Small react project to pronounce numbers from zero to fifteen in several
languages.
Sister project of [Flag](../flag),
[Color](../color) and
[Week](https://github.com/amerharb/week).

## Languages supported
- Arabic
- English
- German
- Swedish
- French
- Turkish
- Persian
- Russian
- Finnish
- Spanish
- Hebrew
- Greek
- We are looking for more languages, see How to contribute

The interface is separately available in eight languages: English, Arabic,
German, Greek, Swedish, Thai, Turkish and Simplified Chinese.


## How it works
Pick a language from the dropdown in the top right, then click a number (0–15)
to hear it pronounced and see it spelled out in that language. Click the number
again (▶ while it plays) to stop.

- App bar, right to left: the toolbar (🕹️ game, 🔊 mute, language, ⚙️), then
  in a round the round actions, the display and the score — the actions sit
  beside the toolbar so the two things pressed during a round are together.
  Narrow screens stack the bar instead: toolbar, display, score, actions.
- Mute (🔊/🔇, right of 🕹️): silences everything — names, game prompts and
  feedback sounds — until clicked again.
- Settings (⚙️ top right): theme (system / light / dark, system is the default),
  a numbers checklist to choose which of 0–15 are on the board and a language
  checklist to show/hide languages (both with ✅/⬜ select-all/deselect-all
  buttons), a flight mode toggle (✈️), cache info (🔊 count and a 🗑️ clear
  button), and 🔗 to copy a share link to the current settings. Saved in
  localStorage and remembered between visits.
- Flight mode (✈️): downloads all visible sounds into the browser's cache
  (IndexedDB) so they play offline; anything newly shown while it is on is
  downloaded right away. Turning it off keeps the cached files (🗑️ clears them).
- Game (🕹️ in the top bar): start a guessing game — a random number is spoken in
  the selected language and you tap the matching button (👍 correct, 👎 wrong).
  The numbers stay in order (they are not shuffled). A wrong number is
  temporarily disabled with a 👎 marker until you find the correct one. Stuck?
  The give-up button (🤷‍♂️) reveals it and plays a give-up sound (tracked
  separately from mistakes). It runs through every number on the board, with your progress (played,
  mistakes, give-ups, time) shown live in the app bar next to the round
  buttons. The prompted name is also written in the display segment (even
  while muted), and the 👂 button plays it again. When every number has been played the round is over — the clock
  freezes and the score stays — but game mode stays on: ⏹️ stops a round that is
  running and ▶️ starts the next, and pressing 🕹️ again leaves game mode. Theme and flight mode stay changeable mid-game; the language list is locked,
  and the selected language can be changed only between rounds (after ⏹️ or
  when a round finishes). Needs at least one language visible. Prompt sounds are pre-loaded so
  gameplay never waits on the network.
- First visit: the interface language comes from your browser's language settings
  (English if we have no dictionary for it), and the spoken language starts on that
  same language when we have sounds for it. Every spoken language is visible —
  nothing starts hidden.

## URL parameters
For a shareable deep link. Every value is checked against what the app actually
has, and a parameter with nothing usable left in it is **ignored** rather than
applied — so a mistyped code cannot leave you with a blank screen.

- `i` — items: which numbers are on the board. Unlike the other apps this also takes a
  **range**, e.g. `?i=0-9` or `?i=10-12` — the numbers are one ordered run, so a range
  is usually what a link wants to say. A single number (`?i=7`) is a range of one, and
  both ends are inclusive. A comma anywhere makes it a plain list instead (`?i=0,1,5`),
  for a set no range can describe. A range whose ends are not both on the board
  (`?i=0-99`) is ignored.
- `l` — interface language, e.g. `?l=ar`
- `s` — sound: which spoken languages are shown, the **first** selected, e.g. `?s=en,ar`
- `t` — theme: `system`, `light` or `dark`

Example: `/?i=0-9&s=fr,en&l=tr` — the digits 0 to 9, French and English, Turkish interface.

List order does not affect the on-screen order.

Whatever `i` sets stays adjustable in the settings panel, so a link can never leave a
number permanently out of reach.

You do not have to build these links by hand: **🔗 in the settings panel copies a
link to what you are looking at now** — the number range, the spoken languages with
the selected one first, the interface language and the theme. A range is used when
the visible numbers are one unbroken run, and a plain list otherwise, so a
hand-picked set survives the round trip.

Two things are left out on purpose: `i` when nothing is hidden, because "everything"
is what the app shows anyway, and `t` for `system`, which means "follow the device"
rather than a choice worth pinning on someone else's screen.

## How to contribute
### Media files
All that is needed to support a new language is 17 sound files in AAC format: one
for the name of the language and sixteen for the numbers from 0 to 15. Audio files
live under `public/sound/lang/<lang>/<n>.aac` (for example
`public/sound/lang/en/7.aac` for "seven" in English, and
`public/sound/lang/en/en.aac` for the language name).
#### What is needed
- Creative Commons sound files to replace some of the current lower-quality ones
- New sound files for a new language to be supported

### Coding
Number is an open source project built on Vite, React 19, TypeScript v6.x and npm.
All the code is Frontend, no backend needed.

To add a language:
1. Add the code to the `Language` union in `src/digits/Digit.ts`.
2. Add the language's word for each number to the `name` map in every
   `src/digits/0.ts`…`15.ts`.
3. Add it to the `LANGUAGE_DEFS` array in `src/App.tsx`, with `display` set to the
   language's name in its own native script.
4. Drop the audio files at `public/sound/lang/<code>/`.

#### Setup environment
- Node 20.19 or above
- npm 9.x or above
- Install `npm install`
- Build: `npm run build` (output in `dist/`)
- Start dev server: `npm start`
- Preview production build: `npm run preview`

### What is needed
- Add Chinese 🇨🇳 and more languages
- CSS styling so the website aligns nicely on all platforms
- Better quality sound files

### Deploying
Once a PR is merged to the main branch it is automatically deployed using the
Vercel integration with GitHub.

## Credits
### For sound
- Arabic: Microsoft Edge neural text-to-speech (Hamed, Saudi — formal MSA, the
  same voice Flags uses), regenerated for the whole 0–15 run so the voice does
  not change part-way. Ten is synthesized from عَشَرَةَ rather than عشرة: a final
  ة is silent in pause position, so the plain spelling came out as the bare stem
  ʿashr. The screen still shows عشرة — see `tools/regen-audio.py`
- English: [https://archive.org/details/numbers0-100englishpronouciation/]()
- German: [Wiktionary DE](https://de.wiktionary.org/)
- Swedish: [Wikimedia Commons](https://commons.wikimedia.org/)
- French: [Wiktionary FR](https://fr.wiktionary.org/)
- Turkish: [www.ttsfree.com](https://ttsfree.com/text-to-speech/turkish-turkey)
- Persian: [www.narakeet.com](https://www.narakeet.com/app/text-to-audio)
- Finnish: [www.ttsfree.com](https://ttsfree.com/text-to-speech/finnish-finland#google_vignette)
- Russian: [Wiktionary RU](https://ru.wiktionary.org/)
- Spanish: [https://ttsfree.com/text-to-speech/spanish-spain]()
- Hebrew: Microsoft Edge neural text-to-speech (Hila)
- Greek: Microsoft Edge neural text-to-speech (Athina)

The numbers above ten were added later and use Microsoft Edge neural
text-to-speech throughout — English (Ava), Arabic (Amany), German (Katja),
Swedish (Sofie), French (Denise), Turkish (Emel), Persian (Dilara), Russian
(Svetlana), Finnish (Noora), Spanish (Elvira) and Hebrew (Hila) — so in the
six languages sourced from recordings above, the voice changes between twelve
and thirteen.

### For graphics
The favicon is an original SVG (a 1-2-3-4 keypad tile), inspired by the colors
of the [Twitter Twemoji](https://github.com/twitter/twemoji) 🔢 graphic that
served as the app's icon up to version 0.14.0.
