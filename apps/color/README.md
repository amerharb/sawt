[![Version](https://img.shields.io/badge/version-0.25.0-blue.svg)](https://github.com/amerharb/sawt)
# Color

Small react project to show colors (as swatches) and display the color name in
the selected language. Sister project of
[Flag](../flag).

## Colors supported
| code | colour | | code | colour |
| --- | --- | --- | --- | --- |
| `f00` | Red `#FF0000` | | `f0f` | Magenta `#FF00FF` |
| `f80` | Orange `#FF8000` | | `f8c` | Pink `#FF80BF` |
| `ff0` | Yellow `#FFFF00` | | `840` | Brown `#804000` |
| `0f0` | Green `#00FF00` | | `000` | Black `#000000` |
| `088` | Teal `#008080` | | `888` | Gray `#808080` |
| `0ff` | Cyan `#00FFFF` | | `fff` | White `#FFFFFF` |
| `00f` | Blue `#0000FF` | | | |
| `80f` | Violet `#8000FF` | | | |
| `808` | Purple `#800080` | | | |

A code is three digits, one per channel, and each digit is a step on a five-level
ladder:

| digit | `0` | `4` | `8` | `c` | `f` |
| --- | --- | --- | --- | --- | --- |
| channel | `00` | `40` | `80` | `BF` | `FF` |
| | 0% | 25% | 50% | 75% | 100% |

This is deliberately **not** CSS's own three-digit shorthand, which repeats each
digit and so can only reach `00`, `44`, `88`, `CC`, `FF`. Half intensity would land
on `88` (136) rather than `80` (128) — grey would read warm rather than neutral,
and violet could not be the `#8000FF` it is meant to be. `cssColor` in
`src/colors/Color.ts` does the expansion, so the codes stay short and the colours
stay exact.

A note on the names, since they are not always a direct translation. Some
languages divide this range differently from English, and where a language has no
everyday word for a colour the loanword is used — `#00FFFF` is *Cyan* in German and
Swedish but *سماوي* ("sky-coloured") in Arabic and *Блакитний* in Ukrainian, which
are those languages' own basic terms for light blue rather than for cyan.

The purple end of the palette is where this matters most. English stretches
"purple" across a range that Arabic, Ukrainian and Hebrew divide in two, so those
three carry different words for `#8000FF` and `#800080`:

| | `#8000FF` violet | `#800080` purple | `#FF00FF` magenta |
| --- | --- | --- | --- |
| Arabic | بنفسجي | أرجواني | ماجنتا |
| Ukrainian | Фіолетовий | Пурпуровий | Маджента |
| Hebrew | סגול | ארגמן | מג'נטה |
| German | Violett | Lila | Magenta |
| Swedish | Violett | Lila | Magenta |

The distinction is spectral violet (`#8000FF`) against non-spectral purple
(`#800080`) — values the palette now hits exactly. German and Swedish keep *Lila*
for the purple rather than *Purpur*, which names a redder and more literary colour
than this swatch.

## Languages supported
Spoken (what you hear and guess):
- English
- Arabic
- German
- Swedish
- Ukrainian
- Hebrew

The interface is separately available in eight languages: English, Arabic,
German, Greek, Swedish, Thai, Turkish and Simplified Chinese.

## URL parameters
For a shareable deep link. Every value is checked against what the app actually
has, and a parameter with nothing usable left in it is **ignored** rather than
applied — so a mistyped code cannot leave you with a blank screen.

- `i` — items: which colours are shown, e.g. `?i=f00,0f0,00f`
- `l` — interface language, e.g. `?l=ar`
- `s` — sound: which spoken languages are shown, the **first** selected, e.g. `?s=en,ar`
- `t` — theme: `system`, `light` or `dark`

Example: `/?i=f00,0f0&s=de,en&l=de`

List order does not affect the on-screen order.

You do not have to build these links by hand: **🔗 in the settings panel copies a
link to what you are looking at now** — the visible colours, the spoken languages
with the selected one first, the interface language and the theme.

Two things are left out on purpose: `i` when nothing is hidden, because "everything"
is what the app shows anyway, and `t` for `system`, which means "follow the device"
rather than a choice worth pinning on someone else's screen.

## How it works
Pick a language from the dropdown in the top right, then click a color swatch to
hear its name spoken and see it written in that language. Click the swatch again
(▶ while it plays) to stop.

- Mute (🔊/🔇, right of 🕹️): silences everything — names, game prompts and
  feedback sounds — until clicked again.
- Settings (⚙️ top right): theme (system / light / dark, system is the default),
  a language checklist and a color grid to show/hide anything on the main screen
  (with ✅/⬜ select-all/deselect-all buttons), a flight mode toggle (✈️), and
  cache info (🔊 count and a 🗑️ clear button), and 🔗 to copy a share link to the
  current settings. Saved in localStorage, remembered between visits.
- Flight mode (✈️): downloads all visible sounds into the browser's Cache Storage
  so they play offline; anything newly shown while it is on is downloaded right
  away. Turning it off keeps the cached files (🗑️ clears them).
- Game (🕹️ in the top bar): start a guessing game — a random color name is spoken
  and you tap the matching swatch (👍 correct, 👎 wrong). Stuck? The give-up
  button (🤷‍♂️) reveals it (tracked separately from mistakes). It runs through
  every visible color, with your progress (played,
  mistakes, give-ups, time) shown live in the app bar next to the round
  buttons. The prompted name is also written in the display segment (even
  while muted), and the 👂 button plays it again. When every color has been played the round is over — the clock
  freezes and the score stays — but game mode stays on: ⏹️ stops a round that is
  running and ▶️ starts the next, and pressing 🕹️ again leaves game mode. Theme and flight mode stay
  changeable mid-game; the language and color lists are locked, and the selected
  language can be changed only between rounds (after ⏹️ or when a round
  finishes). Needs at least one language and one color visible.
- First visit: the interface language comes from your browser's language settings
  (English if we have no dictionary for it), and the spoken language starts on that
  same language when we have sounds for it. Every spoken language is visible —
  nothing starts hidden.

## How to contribute
### Media files
Each color has one sound file in AAC format per language, with the spoken color
name. Audio files live under `public/sound/lang/<lang>/<code>.aac`, for example
`public/sound/lang/en/f00.aac` for Red in English (the `<code>` is the color's
three-digit code, not its full hex).

### Coding
Color is an open source project built on Vite, React 19, TypeScript v6.x and
npm. All the code is Frontend, no backend needed.

To add a color:
1. Create `src/colors/<code>.ts` exporting a `Color` (`code`, `name`) with the
   name in every supported language.
2. Import it and add it to the `ALL_COLORS` array in `src/App.tsx`.
3. Drop the audio files at `public/sound/lang/<lang>/<code>.aac`.

To add a language:
1. Add its code to the `Language` type in `src/colors/Color.ts` — TypeScript will
   then point out every color file missing the new name.
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
Color name pronunciations synthesized with Microsoft Edge neural
text-to-speech voices: English (Ava), Arabic (Amany), German (Katja),
Swedish (Sofie), Ukrainian (Polina) and Hebrew (Hila), like the sister projects.
The game's correct/wrong feedback sounds are shared with the
[Flag](../flag) sister project.
