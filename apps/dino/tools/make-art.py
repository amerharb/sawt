#!/usr/bin/env python3
"""
Build the painted cards each dinosaur is drawn with.

    python3 tools/make-art.py            # rebuild every card from art/
    python3 tools/make-art.py --check    # report what exists, write nothing

A dinosaur is drawn more than once. The **cards** are the paintings the board
shows at 236 px — one per *style*, each a folder: `totaldino/` for the
Commons restorations, `ghibli/` for the ChatGPT ones. The **chip** is the
PhyloPic silhouette the settings checklist shows at 40 px, where a painting
would be mud and an outline is still unmistakably a Stegosaurus.

Only the cards are built here. The chips are SVG and are edited by hand — they
are text, they diff, and there is nothing to compile.

Source art lives in `art/<style>/`, **not** in `public/`: it is the original
download, kept the way Anthem keeps the MIDI files a score came from, so a
card can always be rebuilt or checked against what it came from. Whatever
ships is under `public/picture/<style>/`, beside `public/picture/silhouette/`.

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
	from PIL import Image, ImageOps
except ImportError:
	sys.exit('Pillow is needed: python3 -m pip install Pillow')

ROOT = Path(__file__).resolve().parent.parent
ART = ROOT / 'art'
PICTURE = ROOT / 'public' / 'picture'
CHIPS = PICTURE / 'silhouette'

# 800 covers a 236 px card on a 3x screen with a little to spare; quality 82
# is where the difference from lossless stops being visible at that size.
CARD = 800
QUALITY = 82
MARGIN = 0.04       # share of the frame left empty around the animal
SOURCES = ('.png', '.webp', '.jpg', '.jpeg')

# Every animal faces right — tail to the left, head to the right — on the
# card and on the chip alike, so a child never sees one turn round between
# the two. TotalDino paints facing right; a source that does not is flipped
# on the way in. Mirroring is a modification the licence requires declaring:
# the README's Credits says so for each.
#
# Judge by the *beak*, not the crest. A Pteranodon's crest sweeps backward,
# so its head end is the one the crest points away from — the painting was
# already facing right, and was once wrongly flipped here for a day.
# Keyed by style/code: the same animal may face either way in another set.
MIRROR = {'totaldino/gallimimus'}


def source_for(style: str, code: str) -> Path | None:
	return next((p for e in SOURCES if (p := ART / style / f'{code}{e}').exists()), None)


def build(style: str, src: Path, dst: Path) -> str:
	im = Image.open(src).convert('RGBA')
	if f'{style}/{src.stem}' in MIRROR:
		im = ImageOps.mirror(im)
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

	# every style is a folder under art/; the chips are the one thing every
	# style shares, so an animal with a chip and no painting in some style is
	# a gap in that style, and a painting with no chip is a gap in the chips
	styles = sorted(p.name for p in ART.iterdir() if p.is_dir())
	chips = {p.stem for p in CHIPS.glob('*.svg')}
	if not styles:
		sys.exit(f'no style folders under {ART.relative_to(ROOT)}')

	problems = []
	for style in styles:
		sources = {p.stem for p in (ART / style).glob('*') if p.suffix.lower() in SOURCES}
		out = PICTURE / style
		if not args.check:
			out.mkdir(parents=True, exist_ok=True)
		print(f'{style}/')
		if not sources:
			print('  (no source art yet)')
			continue
		for code in sorted(sources | chips):
			src = source_for(style, code)
			note = '' if code in chips else '   (no chip)'
			if not src:
				print(f'  {code:<16} no source — card not built{note}')
				continue
			if args.check:
				print(f'  {code:<16} {src.name}{note}')
				continue
			built = build(style, src, out / f'{code}.webp')
			print(f'  {code:<16} {built}' + ('  mirrored' if f'{style}/{code}' in MIRROR else '') + note)
		missing = sorted(chips - sources)
		if missing and sources:
			problems.append(f'{style}/: no source art for {", ".join(missing)}')
		no_chip = sorted(sources - chips)
		if no_chip:
			problems.append(f'{style}/: no chip silhouette for {", ".join(no_chip)}')

	# a gap is a blank square on the board or a blank entry in ⚙️: say so,
	# loudly, after building the rest. A style with no art at all is not a
	# gap — it is a folder waiting for its first picture
	if problems and not args.check:
		sys.exit('\n' + '\n'.join(problems))


if __name__ == '__main__':
	main()
