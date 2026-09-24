# Source art

The paintings each card was built from. They are **source material, not runtime
assets** — the app ships only the WebP under `public/dino/`, never these — and
they are the same idea as Anthem's `midi/`: keep the original, so a card can
always be rebuilt or checked against where it came from.

`tools/make-art.py` turns everything here into cards. Every card faces right,
tail to the left; a source that faces left is listed in the tool's `MIRROR`
set and flipped on the way in.

**The files themselves are not committed** (see `.gitignore`). They are 2–4 MB
each against the 8–11 KB they become, and the repository would grow by a few
megabytes per dinosaur for pictures nobody loads. What is committed is this
table, which is enough to fetch them again exactly.

| File | Download | Artist | Licence |
| --- | --- | --- | --- |
| `tyrannosaurus.png` | [Tyrannosaurus TD.png](https://commons.wikimedia.org/wiki/File:Tyrannosaurus_TD.png) | TotalDino | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) |
| `stegosaurus.png` | [Stegosaurus TD.png](https://commons.wikimedia.org/wiki/File:Stegosaurus_TD.png) | TotalDino | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) |
| `triceratops.png` | [Triceratops TD.png](https://commons.wikimedia.org/wiki/File:Triceratops_TD.png) | TotalDino | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) |
| `velociraptor.png` | [Velociraptor TD.png](https://commons.wikimedia.org/wiki/File:Velociraptor_TD.png) | TotalDino | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) |
| `brontosaurus.png` | [Brontosaurus TD.png](https://commons.wikimedia.org/wiki/File:Brontosaurus_TD.png) | TotalDino | [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) |
| `gallimimus.png` | [Gallimimus Restoration.png](https://commons.wikimedia.org/wiki/File:Gallimimus_Restoration.png) — **keyed here**: the download is opaque white, and the local copy has that background made transparent before `make-art.py` sees it. Faces left; mirrored by the tool | PaleoNeolitic | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) |
| `parasaurolophus.png` | [Parasaurolophus TD.png](https://commons.wikimedia.org/wiki/File:Parasaurolophus_TD.png) | TotalDino | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) |
| `brachiosaurus.png` | [Brachiosaurus TD.png](https://commons.wikimedia.org/wiki/File:Brachiosaurus_TD.png) | TotalDino | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) |
| `pterodactyl.png` | [Pteranodon TD.png](https://commons.wikimedia.org/wiki/File:Pteranodon_TD.png) — a Pteranodon; "pterodactyl" is the everyday word. Faces left in the source; mirrored by the tool | TotalDino | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) |
| `spinosaurus.png` | [Spinosaurus TD.png](https://commons.wikimedia.org/wiki/File:Spinosaurus_TD.png) | TotalDino | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) |

To refetch, ask Commons for the original rather than guessing the upload path,
which is a hash of the filename:

```bash
curl -H 'User-Agent: <you>' \
  "https://commons.wikimedia.org/w/api.php?action=query&titles=File:Tyrannosaurus%20TD.png&prop=imageinfo&iiprop=url&format=json"
```

## Why TotalDino

Commons has bigger palaeoart sets — Nobu Tamura's is a thousand files — but
almost all of them are **opaque white JPEG**, and a white rectangle on a
dark-theme card is not something a cutout can fix: the animals carry soft grey
cast shadows that survive keying as a dirty blob.

TotalDino is ~320 files, **all PNG with real transparency**, all one artist,
all strict side profile facing the same way, and modern throughout — the
Tyrannosaurus holds its spine horizontal rather than standing up like a
kangaroo, which is the giveaway of older dinosaur art. About a hundred more
arrive each year. That is what makes it a library this app can keep drawing
from rather than three lucky files.

**Check the licence of each new one.** They are not uniform: most are CC BY
4.0, but a meaningful share — the Tyrannosaurus among them — are CC BY-SA 4.0,
and resizing one into a card is an adaptation, so that card inherits
share-alike. Add the row to the app README's Credits table before shipping it.
