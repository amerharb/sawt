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

Every dinosaur is one **static** SVG in `public/dino/<code>.svg` — four to
eleven kilobytes of a single traced outline that stays crisp at any size in a
plain `<img>`. No raster art, and nothing that moves: a board of three animals
all waving their tails at once is a distraction from the one thing this app
asks you to do, which is listen.

They are **PhyloPic silhouettes by Matt Dempsey** rather than drawings of my
own, because an accurate Triceratops is a job for someone who knows what a
Triceratops looked like. PhyloPic is a library of scientifically-informed
organism silhouettes, and taking three from one artist means the set matches:
the same side profile, the same walking pose, all three facing the same way,
and modern proportions throughout — the Tyrannosaurus carries its spine
horizontal rather than standing up like a kangaroo, which is the giveaway of
older dinosaur art. See the [Credits](#credits): the licence makes naming him
a condition of shipping them.

**Two things were changed, and the licence requires saying so.** Each was
cropped from its wide original frame into a square, and each was **recoloured
from black** to the animal's own colour — a black silhouette is invisible on a
dark-theme card, and colour is also what tells the three apart at the 40px size
the settings checklist uses. The outlines themselves are untouched.

**There is no emoji anywhere in this app, and that is deliberate.** Unicode has
🦖 for a theropod and 🦕 for a sauropod, and nothing at all for a triceratops —
so a card, or a settings chip, standing in with an emoji would have to name one
of these three animals wrongly. The settings checklist shows the same drawing,
shrunk.

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

Drawings live under `public/dino/` as SVG. Unlike the sister apps' pictures
these are **not** original work — see the [Credits](#credits). A new one
should come from the same PhyloPic artist where he has the animal, keep the
square frame with its soft ground shadow, be recoloured from black, stay
static, and **add its own row to the Credits with that image's own licence**:
they are not all the same, and a blanket claim would be wrong for at least
one of them.

### Coding
Dino is an open source project built on Vite, React 19, TypeScript v6.x and
npm. All the code is Frontend, no backend needed.

To add a dinosaur:
1. Create `src/dinos/<code>.ts` exporting a `Dino` (`code`, and `name` with a
   word per spoken language).
2. Import it and add it to the `ALL_DINOS` array in `src/App.tsx`.
3. Put its silhouette at `public/dino/<code>.svg`, in a 200×200 viewBox, and
   record where it came from in the Credits.
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

## Credits

The three dinosaur silhouettes come from [PhyloPic](https://www.phylopic.org/),
are by **Matt Dempsey**, and were **modified**: cropped to a square frame,
resized, and recoloured from black. The outlines are unchanged.

Their licences are attribution-only but **not identical**, so they are listed
one by one rather than as a group:

| Drawing | Image | Licence |
| --- | --- | --- |
| `tyrannosaurus.svg` | [*Tyrannosaurus rex*](https://www.phylopic.org/images/5f7b3420-1156-400e-a91e-c8ae997f9bff) | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) |
| `stegosaurus.svg` | [*Stegosaurus stenops*](https://www.phylopic.org/images/990677c8-0bfd-4935-a07d-405888bf7619) | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) |
| `triceratops.svg` | [*Triceratops horridus*](https://www.phylopic.org/images/f2a8724b-4619-4dc2-a545-bea4412867f7) | [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/) |

**This credit is a condition of using them and has to travel with the app** —
the same rule Anthem's one CC BY recording follows. Each file also carries the
same provenance in an SVG comment at the top, so a drawing separated from this
README still says where it came from.

The favicon and the home-page tile are not Matt Dempsey's; they are original
and carry no obligation.
