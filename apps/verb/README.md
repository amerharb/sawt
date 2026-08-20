[![Version](https://img.shields.io/badge/version-0.27.0-blue.svg)](https://github.com/amerharb/sawt)
# Verb

Small React project to learn action words: a child performs each verb in a
short looping animation — tap it to hear the verb spoken in the selected
language. Sister project of [Face](../face), [Flag](../flag),
[Color](../color), [Week](../week), [Number](../number), [Anthem](../anthem)
and [Map](../map).

## The animations

Every verb is a hand-drawn SVG animation of the same child — the sawt kid —
doing the action, in `public/anim/<code>.svg`. No GIFs and no player library:
each file is a few kilobytes of CSS-animated SVG that loops in a plain
`<img>`, stays crisp at any size, and carries its own
`prefers-reduced-motion` stop, so on devices that ask for calm the animation
stands still on its first frame.

The animations ride the same cache as the recordings (the way Map caches its
`world.json`), so ✈️ flight mode makes the whole app work offline — pictures
and sounds both.

## Verbs supported

| code | animation | verb |
| --- | --- | --- |
| eat | the kid at the table, spoon from bowl to mouth | Eat |
| swim | the kid doing front crawl | Swim |

## Spoken languages
- Arabic (عربي)
- English
- German (Deutsch)
- Swedish (Svenska)

## Interface languages
- English
- Arabic (عربي)
- German (Deutsch)
- Greek (Ελληνικά)
- Swedish (Svenska)
- Thai (ไทย)
- Turkish (Türkçe)
- Simplified Chinese (简体中文)

## How it works
Pick the language from the dropdown in the top right, then tap an animation to
hear the verb. The name appears in the display while it plays.

### URL parameters
For a shareable deep link. Every value is checked against what the app
actually has, and a parameter with nothing usable left in it is **ignored**
rather than applied.

- `i` — items: which verbs are shown, e.g. `?i=swim`
- `s` — sounds: which languages are shown, first one selected, e.g. `?s=ar,en`
- `l` — interface language, e.g. `?l=ar`
- `t` — theme: `system`, `light` or `dark`

**🔗 in the settings panel copies a link to what you are looking at now.**

- App bar, right to left: the toolbar (🕹️ game, 🔊 mute, language, ⚙️), then
  in a round the round actions, the display and the score. Narrow screens
  stack the bar instead — toolbar, display, score, actions.
- Mute (🔊/🔇), settings (⚙️: theme, interface language, sort, language
  checklist, verb checklist, flight mode, cache, share link) — as in every
  sister app.
- Flight mode (✈️) downloads all visible sounds **and the animations**, so
  the app works offline end to end.
- Game (🕹️): a verb is spoken and shown — find its animation.
  👍 correct, 👎 wrong (the card locks until the round's verb is found),
  🤷‍♂️ reveals the answer.

## How to contribute
### Media files
Audio lives under `public/sound/` as AAC: `lang/<language>/<code>.aac` — the
verb spoken in that language — plus the shared game `fx/` sounds.
`tools/regen-audio.py` regenerates a language with edge-tts; what is spoken
(including Arabic tashkeel) lives in its `SPEAK` table. edge-tts is
non-deterministic, so the only meaningful verification is listening.

Animations live under `public/anim/` as CSS-animated SVG, drawn by hand in
this repo — original work, no external assets. A new verb's animation should
star the same child (hair `#5C4013`, skin `#F2C094`, red shirt `#E05A4E`) and
include the `prefers-reduced-motion` stop.

### Coding
Verb is an open source project built on Vite, React 19, TypeScript v6.x and
npm. All the code is Frontend, no backend needed.

To add a verb:
1. Create `src/verbs/<code>.ts` exporting a `Verb` (`code`, `emoji`, `name`
   in every spoken language).
2. Import it and add it to the `ALL_VERBS` array in `src/App.tsx`.
3. Draw its animation at `public/anim/<code>.svg`.
4. Add its word to the `SPEAK` table in `tools/regen-audio.py` and record it
   at `public/sound/lang/<language>/<code>.aac` for every spoken language.

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
