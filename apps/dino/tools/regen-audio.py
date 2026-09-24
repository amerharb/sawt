#!/usr/bin/env python3
"""
Regenerate one language's dinosaur recordings into public/sound/lang/<lang>/.

    python3 tools/regen-audio.py en          # write every file
    python3 tools/regen-audio.py en --dry    # print the plan, write nothing

The voices are the ones the rest of the family uses, so sawt sounds like
itself across apps.

All three names are spelled the same in English and German — they are Latin
either way — so SPEAK below carries the same word twice. What differs is how
the voice says it, and that difference is the whole point of offering both:
the child hears one card named two ways.

edge-tts is non-deterministic — the same text gives a different file every run,
so checksums and durations prove nothing about content. The only verification
that means anything is listening.
"""
import argparse
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SOUND = ROOT / 'public' / 'sound' / 'lang'

VOICES = {
	'en': 'en-US-AvaNeural',
	'de': 'de-DE-KatjaNeural',
}

# code -> what to say, per language
SPEAK = {
	'en': {
		'tyrannosaurus': 'Tyrannosaurus',
		'stegosaurus': 'Stegosaurus',
		'triceratops': 'Triceratops',
		'velociraptor': 'Velociraptor',
		'brontosaurus': 'Brontosaurus',
	},
	'de': {
		'tyrannosaurus': 'Tyrannosaurus',
		'stegosaurus': 'Stegosaurus',
		'triceratops': 'Triceratops',
		'velociraptor': 'Velociraptor',
		'brontosaurus': 'Brontosaurus',
	},
}


def main() -> None:
	ap = argparse.ArgumentParser()
	ap.add_argument('lang', choices=sorted(VOICES))
	ap.add_argument('--dry', action='store_true')
	args = ap.parse_args()

	voice = VOICES[args.lang]
	plan = sorted(SPEAK[args.lang].items())

	print(f'{args.lang} — {voice}')
	for code, spoken in plan:
		print(f'  {code:<16} "{spoken}"')
	if args.dry:
		return

	out = SOUND / args.lang
	out.mkdir(parents=True, exist_ok=True)
	tmp = out / '_tmp.mp3'
	for code, spoken in plan:
		subprocess.run(['python3', '-m', 'edge_tts', '-v', voice, '-t', spoken,
		                '--write-media', str(tmp)], check=True, capture_output=True)
		if tmp.stat().st_size < 2000:
			sys.exit(f'{code}: synthesis came back empty')
		# match the rest of the library: mono, 24 kHz, 64 kbps AAC
		subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', str(tmp),
		                '-ac', '1', '-ar', '24000', '-c:a', 'aac', '-b:a', '64k',
		                str(out / f'{code}.aac')], check=True)
	tmp.unlink(missing_ok=True)
	print(f'wrote {len(plan)} files to {out.relative_to(ROOT)}')


if __name__ == '__main__':
	main()
