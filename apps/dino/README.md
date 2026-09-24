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

Every dinosaur is drawn **twice**, and the two pictures are not the same
picture.

| | file | shown at | what it is |
| --- | --- | --- | --- |
| **card** | `public/dino/<code>.webp` | 118px, on the board | a painted restoration |
| **chip** | `public/dino/<code>.svg` | 40px, in the ⚙️ checklist | a flat silhouette |

The card is what the app is *for* — a child looking at an animal. The chip is
drawn at forty pixels, and at forty pixels a painting is mud while an outline
is still unmistakably a Stegosaurus. Shape survives being made small; detail
does not. So the checklist keeps the silhouettes.

Both are **static**. Nothing on this board moves: three animals all waving
their tails at once competes with the one thing the app asks you to do, which
is listen.

**Neither is my own work**, because an accurate Triceratops is a job for
someone who knows what a Triceratops looked like — see the [Credits](#credits),
where naming the artists is a licence condition rather than a courtesy. Both
sources were chosen the same way: one artist for all three animals, so the set
matches, and modern anatomy throughout — the Tyrannosaurus holds its spine
horizontal rather than standing up like a kangaroo, which is the giveaway of
older dinosaur art.

**WebP rather than PNG** for the cards. It is the same picture at roughly a
third of the bytes — 8–11 KB against 150–250 KB — which is the difference
between three animals and thirty. The originals they are built from live in
[`art/`](art), outside `public/`, the way Anthem keeps the MIDI a score came
from; `tools/make-art.py` turns them into cards.

**There is no emoji anywhere in this app, and that is deliberate.** Unicode has
🦖 for a theropod and 🦕 for a sauropod, and nothing at all for a triceratops —
so a card, or a settings chip, standing in with an emoji would have to name one
of these three animals wrongly.

Both pictures ride the same cache as the recordings (the way Verb caches its
animations), so ✈️ flight mode takes the whole app offline — and it downloads
the chips too, since ⚙️ is where ✈️ itself lives.

## Dinosaurs supported

| code | what to look for | name |
| --- | --- | --- |
| tyrannosaurus | walks on two legs, spine level, tiny arms, tail held out behind for balance | Tyrannosaurus (*T. rex*) |
| stegosaurus | four legs, plates standing along the back, four spikes at the end of the tail | Stegosaurus |
| triceratops | four legs, a bony frill behind the head, two long horns and one short one | Triceratops |
| velociraptor | small, feathered, runs on two legs, a long stiff tail and a big curved claw on each foot | Velociraptor |
| brontosaurus | a very long neck, a very long tail, and a small head — the biggest animal on the board | Brontosaurus |

All five are shown in side profile, facing the same way, so the shape is what
tells them apart — which is exactly what the 40px silhouette chip has to carry
on its own.

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

**Five cards is still a short round.** With every dinosaur shown, a game asks
all five and a courtyard deals all five — which is the whole board, so there
is nothing to find that is not already in front of you. It plays as a naming
drill rather than a search, and it gets more interesting with every animal
added.

## How to contribute
### Media files
Audio lives under `public/sound/` as AAC: `lang/<language>/<code>.aac` — the
name spoken in that language — plus the shared game `fx/` sounds.
`tools/regen-audio.py` regenerates a language with edge-tts; what is spoken
lives in its `SPEAK` table. edge-tts is non-deterministic, so the only
meaningful verification is listening.

Drawings live under `public/dino/` — a `.webp` card and a `.svg` chip per
animal. Unlike the sister apps' pictures these are **not** original work; see
the [Credits](#credits) and [`art/README.md`](art/README.md). A new animal
should come from the same two artists so the board stays one set, and **must
add its own rows to the Credits with each image's own licence**: they are not
all the same, and a blanket claim would already be wrong for four of the ten
files here.

### Coding
Dino is an open source project built on Vite, React 19, TypeScript v6.x and
npm. All the code is Frontend, no backend needed.

To add a dinosaur:
1. Create `src/dinos/<code>.ts` exporting a `Dino` (`code`, and `name` with a
   word per spoken language).
2. Import it and add it to the `ALL_DINOS` array in `src/App.tsx`.
3. Put its silhouette at `public/dino/<code>.svg`, in a 200×200 viewBox, and
   its source painting at `art/<code>.png`; `python3 tools/make-art.py` builds
   the card. Record where both came from in the Credits.
4. Add its words to the `SPEAK` table in `tools/regen-audio.py` and record
   them at `public/sound/lang/<language>/<code>.aac`.
5. Editing an existing drawing or recording **in place** needs a
   `cacheVersion` raise in `src/audioCache.ts`. Adding a file at a new path
   does not — a url nobody has cached is simply a miss.

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

**This section is a condition of shipping the app, not a courtesy** — the same
rule Anthem's one CC BY recording follows. Every picture is listed separately
because the licences are **not** all the same, and one blanket line would
already be wrong for four of the ten files.

Every one of them was **modified**: trimmed, resized and centred in a square
frame, and the silhouettes were also recoloured from black — black is
invisible on the dark-theme card. The artwork itself is otherwise unchanged.

### The cards — paintings by TotalDino

From [Wikimedia Commons](https://commons.wikimedia.org/wiki/User:TotalDino),
converted to WebP. Attribution: *TotalDino, via Wikimedia Commons*.

| Card | Original | Licence |
| --- | --- | --- |
| `tyrannosaurus.webp` | [Tyrannosaurus TD.png](https://commons.wikimedia.org/wiki/File:Tyrannosaurus_TD.png) | [**CC BY-SA 4.0**](https://creativecommons.org/licenses/by-sa/4.0/) |
| `stegosaurus.webp` | [Stegosaurus TD.png](https://commons.wikimedia.org/wiki/File:Stegosaurus_TD.png) | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) |
| `triceratops.webp` | [Triceratops TD.png](https://commons.wikimedia.org/wiki/File:Triceratops_TD.png) | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) |
| `velociraptor.webp` | [Velociraptor TD.png](https://commons.wikimedia.org/wiki/File:Velociraptor_TD.png) | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) |
| `brontosaurus.webp` | [Brontosaurus TD.png](https://commons.wikimedia.org/wiki/File:Brontosaurus_TD.png) | [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) |

**The Tyrannosaurus card is share-alike.** It is a resized, re-encoded crop of
a CC BY-SA 4.0 painting, which makes it an adaptation, so **that file is itself
offered under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)**
and anyone reusing it has to do the same. It binds **that image only**: the
other cards, the silhouettes, and all of this app's code are unaffected, and
the repository stays MIT. It was accepted rather than avoided because keeping
all three animals by one artist is what makes them read as one set — the
alternative, a Tyrannosaurus by a different hand, looked like it came from a
different app.

### The chips — silhouettes from PhyloPic

From [PhyloPic](https://www.phylopic.org/), three of them by **Matt Dempsey**
and one each by **Rebecca Groom** and **Jagged Fang Designs**. Each file
repeats its own credit in an SVG comment at the top, so a drawing separated
from this README still says where it came from.

| Chip | Original | Artist | Licence |
| --- | --- | --- | --- |
| `tyrannosaurus.svg` | [*Tyrannosaurus rex*](https://www.phylopic.org/images/5f7b3420-1156-400e-a91e-c8ae997f9bff) | Matt Dempsey | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) |
| `stegosaurus.svg` | [*Stegosaurus stenops*](https://www.phylopic.org/images/990677c8-0bfd-4935-a07d-405888bf7619) | Matt Dempsey | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) |
| `triceratops.svg` | [*Triceratops horridus*](https://www.phylopic.org/images/f2a8724b-4619-4dc2-a545-bea4412867f7) | Matt Dempsey | [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/) |
| `velociraptor.svg` | [*Velociraptor mongoliensis*](https://www.phylopic.org/images/cf3a5398-3946-4261-803c-1838d92eaeb9) | Rebecca Groom | [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/) |
| `brontosaurus.svg` | [*Apatosaurus louisae*](https://www.phylopic.org/images/845f10ca-0c90-4f65-b277-c7ae6faae1f7) | Jagged Fang Designs | [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) |

**The Brontosaurus chip is an Apatosaurus.** PhyloPic's only Brontosaurus
silhouette is NonCommercial, which rules it out. Brontosaurus and Apatosaurus
were one genus until 2015 and have the same outline, so a forty-pixel chip
cannot tell them apart and neither can anyone else. Documented here so nobody
later "corrects" it to a licence the app cannot ship.

### Not theirs

The favicon, the home-page tile and the recordings are original work and carry
no obligation.
