[![Version](https://img.shields.io/badge/version-0.42.0-blue.svg)](https://github.com/amerharb/sawt)
# Dino

Small React project to learn the names of dinosaurs: each animal is a drawing
— tap it to hear its name spoken in the selected language. Sister project of
[Verb](../verb), [Face](../face), [Flag](../flag), [Color](../color),
[Week](../week), [Number](../number), [Anthem](../anthem) and [Map](../map).

## The same word, said two ways

English and German spell all three names alike — they are Latin either way, so
*Triceratops* is *Triceratops* in both. That makes this app the one place in
sawt where switching the language changes **only the sound**: the drawing
stays, the written name stays, and what moves is the mouth. A child hears that
the same animal answers to two different noises, which is most of what a
second language is.

It is also why the recordings matter more here than the spellings, and why
`tools/regen-audio.py` carries the same word twice rather than pretending the
two columns differ.

## The drawings

Every dinosaur is one hand-drawn SVG in `public/dino/<code>.svg` — a few
kilobytes of flat shapes that stay crisp at any size in a plain `<img>`. No
raster art, no icon pack, no external assets.

**There is no emoji anywhere in this app, and that is deliberate.** Unicode has
🦖 for a theropod and 🦕 for a sauropod, and nothing at all for a triceratops —
so a card, or a settings chip, standing in with an emoji would have to name one
of these three animals wrongly. The settings checklist shows the same drawing,
shrunk.

Each carries a slow idle motion — a tail swinging, a head dipping, an eye
blinking — behind a `prefers-reduced-motion` stop, so on a device that asks for
calm they stand still.

The drawings ride the same cache as the recordings (the way Verb caches its
animations), so ✈️ flight mode takes the whole app offline, pictures and sounds
both.

## Dinosaurs supported

| code | the drawing | name |
| --- | --- | --- |
| tyrannosaurus | upright, jaws open, one small arm, tail out behind | Tyrannosaurus (*T. rex*) |
| stegosaurus | back arched high over the hips, two rows of plates, four tail spikes | Stegosaurus |
| triceratops | the frill fanned back, two brow horns and one on the nose, parrot beak | Triceratops |

## Spoken languages
- English
- German (Deutsch)

## Interface languages
- English
- Arabic (عربي)
- German (Deutsch)

## How it works
Pick the language from the dropdown in the top right, then tap a dinosaur to
hear its name. The name appears in the display while it plays.

### URL parameters
For a shareable deep link. Every value is checked against what the app
actually has, and a parameter with nothing usable left in it is **ignored**
rather than applied.

- `i` — items: which dinosaurs are shown, e.g. `?i=triceratops`
- `s` — sounds: which languages are shown, first one selected, e.g. `?s=de,en`
- `l` — interface language, e.g. `?l=ar`
- `t` — theme: `system`, `light` or `dark`
- `room` — a courtyard's six digits, e.g. `?room=004271`. This is the link 🔗
  copies inside 🏟️: opening it lands on the join screen with the number already
  filled in. It is cleared from the address bar once you are inside, so a reload
  never points at a room that is over. The leading zeros are part of the code,
  so `?room=4271` is not the same room — it is not a room at all.

**🔗 in the settings panel copies a link to what you are looking at now.**

- App bar, right to left: the toolbar (🕹️ game, 🔊 mute, language, ⚙️), then
  in a round the round actions, the display and the score. Narrow screens
  stack the bar instead — toolbar, display, score, actions.
- Mute (🔊/🔇), settings (⚙️: theme, interface language, sort, language
  checklist, dinosaur checklist, flight mode, cache, share link) — as in every
  sister app.
- Flight mode (✈️) downloads all visible sounds **and the drawings**, so the
  app works offline end to end.
- Game (🕹️): a name is spoken — find the dinosaur it belongs to. 👍 correct,
  👎 wrong (the card locks until the round's dinosaur is found), 🤷‍♂️ reveals
  the answer.
- Play together (🏟️ **the courtyard**, inside game mode): the same round, on two
  devices at once. Press 🕹️ first — a courtyard is a way of playing, so its two
  doors sit at the head of the round buttons rather than in the toolbar: 🏟️
  opens a room on the spot, 🔢 brings the keypad to type a friend's number
  into. One child opens a courtyard and gets **six digits** — `004271` — which
  the other types in to come in; 🔗 copies a link that does the same thing from
  another house. Everyone picks an animal to be, the host presses ▶️, and the
  same name is spoken to everyone at once: **the first correct tap wins the
  card**. A won card keeps 👍 in its top corner and the winner's animal in the
  other. By default everybody hears their own language; the host can hold the
  room to theirs.
  Multiplayer only appears when the build has a courtyard to connect to
  (`VITE_SAHA_ENABLED` and `VITE_SAHA_URL` in `.env`) and it answers; otherwise
  the app is exactly the single-player app it has always been.

**Three cards is a short round.** With every dinosaur shown, a game asks all
three and a courtyard deals all three — which is the whole board, so there is
nothing to find that is not already in front of you. It plays as a naming
drill rather than a search, and it gets more interesting with every animal
added.

## How to contribute
### Media files
Audio lives under `public/sound/` as AAC: `lang/<language>/<code>.aac` — the
name spoken in that language — plus the shared game `fx/` sounds.
`tools/regen-audio.py` regenerates a language with edge-tts; what is spoken
lives in its `SPEAK` table. edge-tts is non-deterministic, so the only
meaningful verification is listening.

Drawings live under `public/dino/` as SVG, drawn by hand in this repo —
original work, no external assets. A new one should sit on the same ground
line with the same soft shadow, keep the flat two-tone body (a darker shade
for the limbs on the far side), and carry the `prefers-reduced-motion` stop.

### Coding
Dino is an open source project built on Vite, React 19, TypeScript v6.x and
npm. All the code is Frontend, no backend needed.

To add a dinosaur:
1. Create `src/dinos/<code>.ts` exporting a `Dino` (`code`, and `name` with a
   word per spoken language).
2. Import it and add it to the `ALL_DINOS` array in `src/App.tsx`.
3. Draw it at `public/dino/<code>.svg`, 200×200.
4. Add its words to the `SPEAK` table in `tools/regen-audio.py` and record
   them at `public/sound/lang/<language>/<code>.aac`.
5. Editing an existing drawing or recording in place needs a `cacheVersion`
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
