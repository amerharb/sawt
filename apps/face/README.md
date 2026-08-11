[![Version](https://img.shields.io/badge/version-0.22.0-blue.svg)](https://github.com/amerharb/sawt)
# Face

Small React project to show faces and speak the feeling each one wears, in the
selected language. Sister project of [Color](../color), [Flag](../flag),
[Week](../week), [Number](../number) and [Anthem](../anthem).

The faces are emoji characters, rendered for now by the platform's own emoji
font — which means they differ between systems, and one device's "confused" can
read as another's "unamused". The planned fix is the one Flags already uses: a
custom webfont carrying the six faces, scoped to the face spots only, so every
platform sees the same drawing. Until it exists the platform font is the
fallback and the truth.

## Faces supported
| code | face | feeling |
| --- | --- | --- |
| `angry` | 😠 | Angry |
| `confused` | 😕 | Confused |
| `happy` | 😀 | Happy |
| `sad` | 😢 | Sad |
| `scared` | 😨 | Scared |
| `surprised` | 😮 | Surprised |

The code is the feeling's English slug — it doubles as the sound file name and
the `?i=` value.

## Spoken languages
- English
- Arabic (عربي)
- German (Deutsch)
- Swedish (Svenska)

A note on the names: they are adjectives, and several of these languages
inflect adjectives for gender. The forms carried here are the citation
(masculine singular) forms — سعيد rather than سعيدة, glücklich uninflected —
which is how the words appear in a dictionary and how they are taught first.

## Interface languages
- English
- Arabic (عربي)
- German (Deutsch)
- Greek (Ελληνικά)
- Swedish (Svenska)
- Thai (ไทย)
- Turkish (Türkçe)
- Simplified Chinese (简体中文)

Any UI string missing from a translation falls back to English.

## How it works
Pick the language from the dropdown in the top right, then click a face to hear
its feeling spoken and see it written.

### URL parameters
For a shareable deep link. Every value is checked against what the app actually
has, and a parameter with nothing usable left in it is **ignored** rather than
applied — so a mistyped code cannot leave you with a blank screen.

- `i` — items: which faces are shown, e.g. `?i=happy,sad`
- `s` — sounds: which languages are shown, first one selected, e.g. `?s=ar,en`
- `l` — interface language, e.g. `?l=ar`
- `t` — theme: `system`, `light` or `dark`

Example: `/?i=happy,sad,angry&s=ar&l=ar`

List order does not affect the on-screen order.

You do not have to build these links by hand: **🔗 in the settings panel copies
a link to what you are looking at now** — the visible faces, the languages, the
interface language and the theme.

- Mute (🔊/🔇, right of 🕹️): silences everything — names, game prompts and
  feedback sounds — until clicked again.
- Settings (⚙️ top right): theme (system / light / dark, system is the default),
  interface language (👁️), how the faces are ordered (⇵ 🙂 by code, 🔤 by name,
  🎲 random), a language checklist and a face grid to show/hide content (with
  ✅/⬜ select-all/deselect-all buttons), a flight mode toggle (✈️), cache info
  (🔊 count and a 🗑️ clear button), and 🔗 to copy a share link to the current
  settings. Saved in localStorage, remembered between visits.
- Flight mode (✈️): downloads all visible sounds to the cache; anything newly
  shown while it is on is downloaded right away. Turning it off keeps the cached
  files.
- Game (🕹️ in the top bar): a feeling is spoken and you tap the matching face
  (👍 correct, 👎 wrong). Stuck? The give-up button (🤷‍♂️) reveals it (tracked
  separately from mistakes). It runs through every visible face, with your
  progress (played, mistakes, give-ups, time) shown live in the app bar. ⏹️
  stops a round that is running and ▶️ starts the next, and pressing 🕹️ again
  leaves game mode. Needs at least one language and one face visible.
- First visit: the interface language comes from your browser's language
  settings (English if we have no dictionary for it). All faces and languages
  are visible.

## How to contribute
### Media files
Audio lives under `public/sound/` as AAC:

- `lang/<language>/<code>.aac` — the feeling's name spoken in that language,
  e.g. `lang/ar/happy.aac`
- `fx/` — the short game feedback sounds, shared across the sister apps

### Coding
Face is an open source project built on Vite, React 19, TypeScript v6.x and
npm. All the code is Frontend, no backend needed.

To add a feeling:
1. Create `src/emotions/<code>.ts` exporting an `Emotion` (`code`, `emoji`,
   `name` in every spoken language).
2. Import it and add it to the `ALL_EMOTIONS` array in `src/App.tsx`.
3. Record its name at `public/sound/lang/<language>/<code>.aac` for every
   spoken language.

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
