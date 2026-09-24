[![Version](https://img.shields.io/badge/version-0.42.0-blue.svg)](https://github.com/amerharb/sawt)
# Dino

Small React project to learn the names of dinosaurs: each animal is a drawing
— tap it to hear its name spoken in the selected language. Sister project of
[Verb](../verb), [Face](../face), [Flag](../flag), [Color](../color),
[Week](../week), [Number](../number), [Anthem](../anthem) and [Map](../map).

## The same word, said two ways

English and German spell nearly every name alike — they are Latin either way,
so *Triceratops* is *Triceratops* in both. That makes this app the one place
in sawt where switching the language changes **only the sound**: the drawing
stays, the written name stays, and what moves is the mouth. A child hears that
the same animal answers to two different noises, which is most of what a
second language is.

It is also why the recordings matter more here than the spellings, and why
`tools/regen-audio.py` carries the same word twice rather than pretending the
two columns differ. **One exception**: *Pterodactyl* is an everyday word, not
a genus, and German has its own — *Pterodaktylus*. The card is a Pteranodon,
which is the animal the word means.

## The drawings

Every dinosaur is drawn **twice**, and the two pictures are not the same
picture.

| | file | shown at | what it is |
| --- | --- | --- | --- |
| **card** | `public/dino/<code>.webp` | 236px, on the board | a painted restoration |
| **chip** | `public/dino/<code>.svg` | 40px, in the ⚙️ checklist | a flat silhouette |

The card is what the app is *for* — a child looking at an animal, and it is
twice the size of the sister apps' cards for that reason. 👁️ in ⚙️ can put the
**silhouette on the cards instead** (🖼️ / ✏️), for a child who finds the
outline easier to tell apart, or a parent who wants the shapes learned before
the colours — every dinosaur has both pictures either way. The chip is drawn at
forty pixels, and at forty pixels a painting is mud while an outline
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
third of the bytes — 14–30 KB against 300–500 KB — which is the difference
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
| gallimimus | built like an ostrich: long legs, long neck, small head, runs on two legs | Gallimimus |
| parasaurolophus | a long curved crest sweeping back from the head, walks on two or four legs | Parasaurolophus |
| brachiosaurus | a long neck held *up*, front legs longer than the back, a nostril bump on the head | Brachiosaurus |
| pterodactyl | not a dinosaur: a flying reptile with huge wings and a crest at the back of the head | Pterodactyl (*Pteranodon*) |
| spinosaurus | a tall sail along the back, a long crocodile-like snout | Spinosaurus |

All ten are shown in side profile, facing the same way, so the shape is what
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
- Mute (🔊/🔇), settings (⚙️: theme, interface language, sort, **painting or
  silhouette on the cards**, language checklist, dinosaur checklist, flight
  mode, cache, share link) — as in every sister app, plus the one choice only
  this app has two pictures to offer.
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

**Ten cards is a real round now.** With every dinosaur shown, a game asks all
ten and a courtyard deals all ten; the app has no round-length setting yet, so
the board is the round. It plays well at ten, and better with every animal
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
all the same, and a blanket claim would already be wrong for most of the
twenty files here.

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
already be wrong for most of the twenty files.

Every one of them was **modified**: trimmed, resized and centred in a square
frame. **Every animal faces right** — tail to the left, head to the right —
on the card and the chip alike, so a child switching between the two sees the
same animal looking the same way. The silhouettes were all **mirrored** for
that (PhyloPic draws facing left) and recoloured from black, which is
invisible on the dark-theme card; one painting was mirrored too, the
Gallimimus, whose source faces left. The artwork itself is otherwise
unchanged.

### The cards — paintings, nine by TotalDino

From [Wikimedia Commons](https://commons.wikimedia.org/wiki/User:TotalDino),
converted to WebP. Attribution: *TotalDino, via Wikimedia Commons* — except the
Gallimimus, which TotalDino has not drawn: that one is **PaleoNeolitic**'s,
also from Commons, and was **keyed** as well as resized (its white background
made transparent), which is a further modification the licence requires
declaring.

| Card | Original | Licence |
| --- | --- | --- |
| `tyrannosaurus.webp` | [Tyrannosaurus TD.png](https://commons.wikimedia.org/wiki/File:Tyrannosaurus_TD.png) | [**CC BY-SA 4.0**](https://creativecommons.org/licenses/by-sa/4.0/) |
| `stegosaurus.webp` | [Stegosaurus TD.png](https://commons.wikimedia.org/wiki/File:Stegosaurus_TD.png) | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) |
| `triceratops.webp` | [Triceratops TD.png](https://commons.wikimedia.org/wiki/File:Triceratops_TD.png) | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) |
| `velociraptor.webp` | [Velociraptor TD.png](https://commons.wikimedia.org/wiki/File:Velociraptor_TD.png) | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) |
| `brontosaurus.webp` | [Brontosaurus TD.png](https://commons.wikimedia.org/wiki/File:Brontosaurus_TD.png) | [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) |
| `gallimimus.webp` | [Gallimimus Restoration.png](https://commons.wikimedia.org/wiki/File:Gallimimus_Restoration.png) — **PaleoNeolitic**, keyed and mirrored | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) |
| `parasaurolophus.webp` | [Parasaurolophus TD.png](https://commons.wikimedia.org/wiki/File:Parasaurolophus_TD.png) | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) |
| `brachiosaurus.webp` | [Brachiosaurus TD.png](https://commons.wikimedia.org/wiki/File:Brachiosaurus_TD.png) | [**CC BY-SA 4.0**](https://creativecommons.org/licenses/by-sa/4.0/) |
| `pterodactyl.webp` | [Pteranodon TD.png](https://commons.wikimedia.org/wiki/File:Pteranodon_TD.png) | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) |
| `spinosaurus.webp` | [Spinosaurus TD.png](https://commons.wikimedia.org/wiki/File:Spinosaurus_TD.png) | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) |

**The Tyrannosaurus and Brachiosaurus cards are share-alike.** Each is a
resized, re-encoded crop of a CC BY-SA 4.0 painting, which makes it an
adaptation, so **those two files are themselves offered under
[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)** and anyone
reusing them has to do the same. It binds **those images only**: the other
cards, the silhouettes, and all of this app's code are unaffected, and the
repository stays MIT. Accepted rather than avoided because keeping the animals
by one artist is what makes them read as one set — a Tyrannosaurus by a
different hand looked like it came from a different app.

### The chips — silhouettes from PhyloPic

From [PhyloPic](https://www.phylopic.org/), by eight artists. Each file
repeats its own credit in an SVG comment at the top, so a drawing separated
from this README still says where it came from.

| Chip | Original | Artist | Licence |
| --- | --- | --- | --- |
| `tyrannosaurus.svg` | [*Tyrannosaurus rex*](https://www.phylopic.org/images/5f7b3420-1156-400e-a91e-c8ae997f9bff) | Matt Dempsey | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) |
| `stegosaurus.svg` | [*Stegosaurus stenops*](https://www.phylopic.org/images/990677c8-0bfd-4935-a07d-405888bf7619) | Matt Dempsey | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) |
| `triceratops.svg` | [*Triceratops horridus*](https://www.phylopic.org/images/f2a8724b-4619-4dc2-a545-bea4412867f7) | Matt Dempsey | [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/) |
| `velociraptor.svg` | [*Velociraptor mongoliensis*](https://www.phylopic.org/images/cf3a5398-3946-4261-803c-1838d92eaeb9) | Rebecca Groom | [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/) |
| `brontosaurus.svg` | [*Apatosaurus louisae*](https://www.phylopic.org/images/845f10ca-0c90-4f65-b277-c7ae6faae1f7) | Jagged Fang Designs | [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) |
| `gallimimus.svg` | [*Struthiomimus altus*](https://www.phylopic.org/images/72d740f3-17f2-460f-b04b-fa9bb6b3e00f) | Craig Dylke | [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) |
| `parasaurolophus.svg` | [*Parasaurolophus*](https://www.phylopic.org/images/76779b00-0150-406a-a443-23c534ec80fe) | Scott Hartman, vectorised by T. Michael Keesey | [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/) |
| `brachiosaurus.svg` | [*Brachiosaurus altithorax*](https://www.phylopic.org/images/2431b273-7b21-482e-b971-70377686335d) | Michael P. Taylor | [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) |
| `pterodactyl.svg` | [*Pteranodon longiceps*](https://www.phylopic.org/images/071babce-127c-4e5d-8472-62e17ad1e7e1) | Matt Dempsey | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) |
| `spinosaurus.svg` | [*Spinosaurus aegyptiacus*](https://www.phylopic.org/images/a6bedf44-cf1c-4a92-b90c-2a16bd7ca6b2) | Tasman Dixon | [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) |

**Two chips are stand-ins, on purpose.** The Brontosaurus chip is an
*Apatosaurus*: PhyloPic's only Brontosaurus is NonCommercial, which rules it
out, and the two were one genus until 2015 with the same outline. The
Gallimimus chip is a *Struthiomimus*: PhyloPic has no Gallimimus at all, and
the two are the same family of ostrich dinosaurs with the same outline. A
forty-pixel chip cannot tell either pair apart and neither can anyone else.
Documented here so nobody later "corrects" them to a licence the app cannot
ship. The Parasaurolophus was the only whole-body one — PhyloPic's CC0
Parasaurolophus silhouettes are the crested skull alone.

### Not theirs

The favicon, the home-page tile and the recordings are original work and carry
no obligation.
