# Source art

The paintings each card was built from, **one folder per style**. They are
**source material, not runtime assets** — the app ships only the WebP under
`public/picture/<style>/`, never these — and they are the same idea as
Anthem's `midi/`: keep the original, so a card can always be rebuilt or
checked against where it came from.

| folder | what it holds | ships as |
| --- | --- | --- |
| [`totaldino/`](totaldino) | palaeoart restorations from Wikimedia Commons — TotalDino's, plus one PaleoNeolitic | `public/picture/totaldino/` |
| [`ghibli/`](ghibli) | Ghibli-style pictures generated with ChatGPT | `public/picture/ghibli/` |

`tools/make-art.py` turns every folder here into cards. Each folder's README
records where its files came from and under which licence.

**The image files themselves are not committed** (see `.gitignore`). They are
2–4 MB each against the 14–30 KB they become, and the repository would grow by
a few megabytes per dinosaur for pictures nobody loads.

Every card faces right, tail to the left; a source that faces left is listed
in the tool's `MIRROR` set — keyed by `style/code`, since the same animal may
face either way in another set — and flipped on the way in.
