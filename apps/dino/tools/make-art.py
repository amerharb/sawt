#!/usr/bin/env python3
"""
Build the two pictures each dinosaur is drawn with.

    python3 tools/make-art.py            # rebuild every card from art/
    python3 tools/make-art.py --check    # report what exists, write nothing

A dinosaur is drawn twice. The **card** is the painted restoration the board
shows at 118 px; the **chip** is the PhyloPic silhouette the settings checklist
shows at 40 px, where a painting would be mud and an outline is still
unmistakably a Stegosaurus.

Only the card is built here. The chips are SVG and are edited by hand — they
are text, they diff, and there is nothing to compile.

Source art lives in `art/`, **not** in `public/`: it is the original download,
kept the way Anthem keeps the MIDI files a score came from, so a card can
always be rebuilt or checked against what it came from. Whatever ships is
under `public/dino/`.

The card is written as WebP at CARD px square, transparent, trimmed to the
animal and centred. WebP rather than PNG because it is the same picture at
roughly a third of the bytes, which is the difference between three animals
and thirty.
"""
from __future__ import annotations

import argparse
import sys
from pathlib import Path

try:
	from PIL import Image
except ImportError:
	sys.exit('Pillow is needed: python3 -m pip install Pillow')

ROOT = Path(__file__).resolve().parent.parent
ART = ROOT / 'art'
OUT = ROOT / 'public' / 'dino'

# 400 covers a 118 px card on a 3x screen with nothing to spare and nothing
# wasted; quality 82 is where the difference from lossless stops being visible
# at that size.
CARD = 400
QUALITY = 82
MARGIN = 0.04       # share of the frame left empty around the animal
SOURCES = ('.png', '.webp', '.jpg', '.jpeg')


def source_for(code: str) -> Path | None:
	return next((p for e in SOURCES if (p := ART / f'{code}{e}').exists()), None)


def build(src: Path, dst: Path) -> str:
	im = Image.open(src).convert('RGBA')
	# trim to what is actually drawn: source art is usually padded, and padding
	# is what makes one animal look smaller than the next on the board
	box = im.getbbox()
	if box:
		im = im.crop(box)

	avail = int(CARD * (1 - 2 * MARGIN))
	scale = min(avail / im.width, avail / im.height)
	im = im.resize((max(1, round(im.width * scale)), max(1, round(im.height * scale))),
	               Image.LANCZOS)

	canvas = Image.new('RGBA', (CARD, CARD), (0, 0, 0, 0))
	canvas.paste(im, ((CARD - im.width) // 2, (CARD - im.height) // 2), im)
	canvas.save(dst, 'WEBP', quality=QUALITY, method=6)
	return f'{im.width}x{im.height} in {CARD}x{CARD}, {dst.stat().st_size / 1024:.0f} KB'


def main() -> None:
	ap = argparse.ArgumentParser()
	ap.add_argument('--check', action='store_true')
	args = ap.parse_args()

	# every animal either side knows about: a source painting, or a chip
	# silhouette. Keying off one alone hid the other's absence — a painting
	# with no chip was silently never built.
	codes = sorted({p.stem for p in ART.glob('*') if p.suffix.lower() in SOURCES}
	               | {p.stem for p in OUT.glob('*.svg')})
	if not codes:
		sys.exit(f'nothing in {ART.relative_to(ROOT)} or {OUT.relative_to(ROOT)} to build from')

	no_source, no_chip = [], []
	for code in codes:
		src = source_for(code)
		chip = OUT / f'{code}.svg'
		if not chip.exists():
			no_chip.append(code)
		if not src:
			no_source.append(code)
			print(f'  {code:<16} no source in art/ — card not built')
			continue
		if args.check:
			print(f'  {code:<16} {src.name}' + ('' if chip.exists() else '   (no chip)'))
			continue
		print(f'  {code:<16} {build(src, OUT / f"{code}.webp")}' + ('' if chip.exists() else '   (no chip)'))

	# either gap is a broken board: no source is a blank card, no chip is a
	# blank entry in the ⚙️ checklist. Say so, loudly, after building the rest
	problems = []
	if no_source: problems.append(f'{len(no_source)} without source art: {", ".join(no_source)}')
	if no_chip: problems.append(f'{len(no_chip)} without a chip silhouette: {", ".join(no_chip)}')
	if problems and not args.check:
		sys.exit('\n' + '\n'.join(problems))


if __name__ == '__main__':
	main()
