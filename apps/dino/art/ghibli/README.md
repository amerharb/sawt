# Source art — `ghibli/`

Ghibli-style pictures of the same ten dinosaurs, generated with ChatGPT, one
per animal: `<code>.png`, transparent background, the animal alone, **facing
right** — tail to the left, head to the right, like every other picture in
the app. `tools/make-art.py` turns whatever is here into
`public/picture/ghibli/<code>.webp`; a file facing the wrong way goes in the
tool's `MIRROR` set as `ghibli/<code>`.

These are **scenes, not cut-outs**: the animal in a painted landscape, sky
and all, which is the idiom of the style. The tool cannot key a painted
background and does not try; the card is the whole picture, letterboxed in
the square. It also makes them heavier — 66 KB for the first against 14–30
for the transparent restorations.

Until every animal has one, the style stays a beta option in 👁️ — visible
in development, absent in production — so a child never meets a blank card.

| File | Prompt / notes | Licence |
| --- | --- | --- |
| `pterodactyl.png` | supplied 2026-09-25; prompt not recorded. A Pteranodon in flight over a valley, beak to the right | generated with ChatGPT |

On licence: images generated with ChatGPT carry no third-party attribution
requirement, but the style is Studio Ghibli's and the name is theirs. Record
the prompt used for each file here, so the set can be regenerated or extended
in the same voice.
