[![Version](https://img.shields.io/badge/version-0.32.0-blue.svg)](https://github.com/amerharb/sawt)
# Verb

Small React project to learn action words: a child performs each verb in a
short animation — tap it to hear the verb spoken in the selected language, at
the selected **moment** in time (❗ ⏳ ⏪ ⌛). Sister project of
[Face](../face), [Flag](../flag), [Color](../color), [Week](../week),
[Number](../number), [Anthem](../anthem) and [Map](../map).

## The moments

Verbs change with time, but grammatical tenses never map one-to-one between
languages — so the app models **moments** instead: language-neutral points in
time, each filled by every language with its own natural form. The switch in
the app bar flips every card's animation and word at once:

| | moment | the animation | ar | en | de | sv |
| --- | --- | --- | --- | --- | --- | --- |
| ❗ | do! | loops anticipation — the action never starts | كُلْ | Eat! | Iss! | Ät! |
| ⏳ | doing | loops the action forever | يأكل | Eating | Isst | Äter |
| ⏪ | did | plays the event **once** before your eyes, then rests | — | Ate | Aß | Åt |
| ⌛ | done | never shows the action — only the result it left | أكل | Has eaten | Hat gegessen | Har ätit |

The animation behavior *is* the grammar: looping = ongoing, played-once =
completed, aftermath-only = the present state a past act left behind (tap a
⏪ card to run its event again). Two deliberate language choices: **Arabic
shows three moments** — قد أكل adds nothing a child would hear, so its ماضي
speaks over the aftermath scene, the one picture that is unambiguously past
at every instant; and **German's ⏪ is Präteritum** (aß / schwamm) with the
spoken Perfekt living at ⌛ — where swimming takes *sein*: ist geschwommen.
The app never names any of this; the scene carries the meaning.

## The animations

Every verb is four hand-drawn SVG animations of the same child — the sawt
kid — one per moment, in `public/anim/<code>.<scene>.svg`. No GIFs and no
player library:
each file is a few kilobytes of CSS-animated SVG that loops in a plain
`<img>`, stays crisp at any size, and carries its own
`prefers-reduced-motion` stop, so on devices that ask for calm the animation
stands still on its first frame.

The animations ride the same cache as the recordings (the way Map caches its
`world.json`), so ✈️ flight mode makes the whole app work offline — pictures
and sounds both.

## Verbs supported

| code | the four scenes | verb |
| --- | --- | --- |
| cut | scissors poised over the paper · snipping along · one full cut, halves apart · pieces and a paper star | Cut |
| eat | eager at the full bowl · spoon from bowl to mouth · eats it empty once · patting belly, bowl aside | Eat |
| listen | the teacher raises a finger · speech dots drift, the kid nods · she says her piece once · book down, lightbulb on | Listen |
| paint | brush hovers over a blank canvas · a stroke paints itself · sun, house and grass appear once · the picture hangs finished | Paint |
| raisehand | her question waits, the hand hesitates · arm straight up, waving · picked! a star pops · pointed-at and proud | Raise the hand |
| share | eyeing the apple · holding it out · it splits, half travels once · a half each, a heart between | Share |
| swim | bouncing at the deck edge · front crawl · one length and out · wrapped in a towel, dripping | Swim |

Five of these are classroom scenes co-starring **die sawt Lehrerin** — bun,
glasses, teal dress — the app's second recurring character.

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
- `m` — moment: `do`, `doing`, `did` or `done`, e.g. `?m=done` (a moment the
  selected language does not have falls to its nearest neighbour)
- `s` — sounds: which languages are shown, first one selected, e.g. `?s=ar,en`
- `l` — interface language, e.g. `?l=ar`
- `t` — theme: `system`, `light` or `dark`
- `room` — a courtyard's four animals, written as letters, e.g. `?room=BKQF`.
  This is the link 🔗 copies inside 🏟️: opening it lands on the join keypad
  with those four already tapped in. It is cleared from the address bar once
  you are inside, so a reload never points at a room that is over.

**🔗 in the settings panel copies a link to what you are looking at now.**

- App bar, right to left: the toolbar (🕹️ game, 🔊 mute, the moment switch,
  language, ⚙️), then
  in a round the round actions, the display and the score. Narrow screens
  stack the bar instead — toolbar, display, score, actions.
- Mute (🔊/🔇), settings (⚙️: theme, interface language, sort, language
  checklist, verb checklist, flight mode, cache, share link) — as in every
  sister app.
- Flight mode (✈️) downloads all visible sounds **and the animations**, so
  the app works offline end to end.
- Game (🕹️): a verb is spoken and shown — find its animation. The round
  plays in the selected moment (the switch locks while a round is on, like
  the language). 👍 correct, 👎 wrong (the card locks until the round's verb
  is found), 🤷‍♂️ reveals the answer.
- Play together (🏟️ **the courtyard**, inside game mode): the same round, on two
  devices at once. Press 🕹️ first — a courtyard is a way of playing, so it sits
  at the head of the round buttons rather than in the toolbar.
  One child opens a courtyard and gets **four animals** — 🐘🦆🦋🦌 — which the
  other taps on a keypad to come in; 🔗 copies a link that does the same thing
  from another house. Everyone picks an animal to be (no names, no typing, and
  nothing to type into). The host presses ▶️ and the same verb is spoken to
  everyone at once: **the first correct tap wins it**, a wrong tap greys that
  card for you for two seconds, and 🤷‍♂️ is a *vote* — a verb is only revealed
  when most of the room agrees. A won card keeps 👍 in its top corner and **the
  winner's animal in the other**. A verb the room gave up wears 🤷‍♂️ and nobody's
  animal. Whoever wins the most gets 🏆; a tie is shared. If a tablet sleeps,
  its place and score are kept for a minute and it walks straight back in.
  **Whose language — and whose moment?** This app's sound is a pair, so a
  courtyard holds both. By default everybody hears the verb in **their own**
  language at **their own** moment, and the switch and the language dropdown
  both rest while you are in a room. The host can hold the room to theirs — 🔒
  *Everyone hears mine* — and then the pictures follow it as well as the
  words: a room held to ⌛ done is playing the done game, and a child hearing
  "has eaten" over an anticipation animation would be somewhere else entirely.
  The panel names what a room is held to as the language and the very icon from
  the switch above (English ⏪), on the join screen too, before you go in.
  Nobody's settings are changed: leaving the courtyard leaves you hearing
  whatever you chose.
  Leaving game mode with 🕹️ leaves the courtyard too. A child who arrives on a
  friend's link is the one exception: the invitation brings its own 🏟️ to the
  toolbar, so they never have to know to press 🕹️ first.
  Multiplayer only appears when the build has a courtyard to connect to
  (`VITE_SAHA_ENABLED` and `VITE_SAHA_URL` in `.env`) and it answers; otherwise
  the app is exactly the single-player app it has always been.

## How to contribute
### Media files
Audio lives under `public/sound/` as AAC:
`lang/<language>/<scene>/<code>.aac` — the verb spoken in that language at
that moment — plus the shared game `fx/` sounds. `tools/regen-audio.py`
regenerates a language with edge-tts; what is spoken (including Arabic
tashkeel and the imperatives' `!`) lives in its `SPEAK` table. edge-tts is
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
   with a word per moment per spoken language — see `src/moments.ts` for
   which moments each language has).
2. Import it and add it to the `ALL_VERBS` array in `src/App.tsx`.
3. Draw its four scenes at `public/anim/<code>.<scene>.svg` (do, doing, did,
   done — anticipation loop, action loop, play-once, aftermath).
4. Add its words to the `SPEAK` table in `tools/regen-audio.py` and record
   them at `public/sound/lang/<language>/<scene>/<code>.aac`.
5. Editing an existing animation or recording in place needs a `cacheVersion`
   raise in `src/audioCache.ts`.

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
