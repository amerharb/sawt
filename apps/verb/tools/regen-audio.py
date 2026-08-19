#!/usr/bin/env python3
"""
Regenerate one language's verb recordings into public/sound/lang/<lang>/.

    python3 tools/regen-audio.py ar          # write the files
    python3 tools/regen-audio.py ar --dry    # print the plan, write nothing

The voices are the same ones the sister apps use, so the family sounds like
itself across apps. What is spoken comes from SPEAK below, not from the app's
source: the display names carry no tashkeel, but Arabic TTS needs it to read
correctly.

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
	'ar': 'ar-SA-HamedNeural',
	'de': 'de-DE-KatjaNeural',
	'sv': 'sv-SE-SofieNeural',
}

# code -> what to say, per language. Arabic uses the present tense (يَسْبَح, not
# the dictionary past سَبَحَ) — the form children's picture books use.
SPEAK = {
	'en': {
		'swim': 'swim',
		'eat': 'eat',
	},
	'ar': {
		'swim': 'يَسْبَح',
		'eat': 'يَأْكُل',
	},
	'de': {
		'swim': 'schwimmen',
		'eat': 'essen',
	},
	'sv': {
		'swim': 'simma',
		'eat': 'äta',
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
		print(f'  {code:<10} "{spoken}"')
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
